function updatePresence(tabId, changeInfo, tab) {
  if (tab.active === true && !(tab.url == undefined)) {
    var url = new URL(tab.url);

    if (url.hostname != 'everybodyedits.com')
      return;

    var roomname_url = "games/";
    var ee_roomid = 'Lobby';
    var ee_roomname = 'Not currently in a world.';

    if (url.href.lastIndexOf(roomname_url) > -1) {
      ee_roomid = unescape(url.href.substring(url.href.lastIndexOf(roomname_url) + roomname_url.length));
      ee_roomname = tab.title.substring(0, tab.title.length - ' | Everybody Edits'.length)
    }

    var data = {
      url: tab.url,
      details: ee_roomname,
      state: ee_roomid,
      smallText: 'ST01',
      largeText: 'Everybody Edits'
    };

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:3000/",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "processData": false,
      "data": JSON.stringify(data)
    };

    $.ajax(settings);
  }
}

chrome.tabs.onUpdated.addListener(updatePresence);