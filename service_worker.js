let mainWindowId;
let subWindowId = null;

chrome.windows.getAll({"populate" : true}, getMainWindow);

function getMainWindow(windows){
  if(windows.length==1){
    mainWindowId = windows[0].id;
    return;
  } 

  mainWindowId = windows[0].id;
  subWindowId = windows[0].id;

  let maxTabCount = -1;
  for (let i = 0; i < 2 /* windows.length */; i++) {
    const win = windows[i];

    const numTabs = win.tabs.length;
    if(numTabs > maxTabCount){
        maxTabCount = numTabs;
        mainWindowId = win.id;
    }else{
        subWindowId = win.id;
    }
  }

  chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => {
        if(tab.windowId==subWindowId) return;

        if(tab.url.startsWith("https://www.youtube.com/") || tab.url.startsWith("https://www.nicovideo.jp/")){
            chrome.tabs.move(tab.id,
                {"windowId": subWindowId, "index": -1}
                );
        }
    }
  )
}

