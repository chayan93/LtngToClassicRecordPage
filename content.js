//Listens to the message sent by background.js, checks the url and then sends back the developer console url to background.js
//this is because, background.js can't get to the current page url and content.js can't open a new tab
//therefore had to play a message passing game between the two js.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            var currentTabId = request.currentTabId, url = location.href, isEdit = false;
            var lightningBaseURL, switcherURL, classicRecordURL, id, classicBaseURL;

            if(
                url && (url.indexOf('/view') > 0 || url.indexOf('/edit') > 0) &&
                url.indexOf('lightning.force.com') > 0
            ){
                if(url.indexOf('/view') > 0){
                    url = url.substring(0, url.indexOf('/view'));
                }
                else{
                    url = url.substring(0, url.indexOf('/edit'));
                    isEdit = true;
                }

                if(url.includes('/')){
                    id = url.substring(url.lastIndexOf('/') + 1, url.length);
                    if(id && id.length != 15 && id.length != 18){
                        id = undefined;
                    }
                }
            }

            if(id){
                lightningBaseURL = url.substring(0, url.indexOf('/lightning/r'));
                switcherURL = lightningBaseURL + '/ltng/switcher?destination=classic';
                classicBaseURL = lightningBaseURL.replace('lightning.force.com', 'my.salesforce.com');
                classicRecordURL = classicBaseURL + '/' + id + (isEdit ? '/e' : '');

                // This line is new!
                chrome.runtime.sendMessage({
                    "message": "open_classic_record_page",
                    "switcherURL": switcherURL,
                    "classicRecordURL": classicRecordURL,
                    "currentTabId": currentTabId
                });
            }
        }
    }
);