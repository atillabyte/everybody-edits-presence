var current_room_id = '';
var current_room_name = '';
var last_joined_world = 0;
var last_update = new Date().getTime();

function updatePresence(tabId, changeInfo, tab) {
  chrome.tabs.query({}, function (tabs) {
    var everybodyEditsInstances = tabs.some(function (tab) { return new URL(tab.url).hostname == 'everybodyedits.com' });

    new URL('')
    if (!everybodyEditsInstances) {
      if (current_room_id != 'Offline')
        setCurrentRoom('Not currently in a world.', 'Offline');
    }
  });

  if (tab.active === true && !(tab.url == undefined)) {
    var url = new URL(tab.url);

    if (url.hostname != 'everybodyedits.com')
      return;

    var timestamp = performance.timing.navigationStart;

    var room_name_uri = "games/";
    var room_id;
    var room_name;

    if (url.href.lastIndexOf(room_name_uri) > -1) {
      room_id = unescape(url.href.substring(url.href.lastIndexOf(room_name_uri) + room_name_uri.length));
      room_name = tab.title.substring(0, tab.title.length - ' | Everybody Edits'.length);

      last_joined_world = Date.now();
    }

    if (!room_id) {
      room_id = 'Lobby';
      room_name = 'Not currently in a world.';
    }

    var force_update = room_id != 'Lobby' && room_id != 'Offline' && (new Date().getTime() - last_update >= 5000);

    if (room_id != current_room_id || room_name != current_room_name || force_update)
      setCurrentRoom(room_name, room_id, timestamp + (last_joined_world - timestamp));
  }
}

function setCurrentRoom(room_name, room_id, tab_start_timestamp = -1) {
  current_room_id = room_id;
  current_room_name = room_name;
  last_update = new Date().getTime();

  if (room_id == 'Lobby' || room_id == 'Offline')
    tab_start_timestamp = -1;

  $.ajax({
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:3000/",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "drp-start-timestamp": tab_start_timestamp.toString()
    },
    "processData": false,
    "data": JSON.stringify({
      url: 'https://everybodyedits.com/games/' + room_id,
      details: room_name,
      state: room_id,
      smallText: 'Everybody Edits',
      largeText: 'Everybody Edits'
    })
  });
}

chrome.tabs.onUpdated.addListener(updatePresence);