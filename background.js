// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab){
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(
        activeTab.id, {
            "message": "clicked_browser_action",
            "currentTabId": activeTab.id
        }
    );
    });
});

// Listens to the message generated from content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "open_classic_record_page" ) {
            chrome.tabs.update(
                request.currentTabId, {url: request.switcherURL}
            );
            setTimeout(function(){
                chrome.tabs.update(
                    request.currentTabId, {url: request.classicRecordURL}
                );
            }, 500);
        }
    }
);