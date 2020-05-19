chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.getSelected(null, function(tab) {
        // ★現在選択中のtab.idが必要なので、getSelectedメソッドの中にsendRequestを記述する。
        chrome.tabs.sendRequest(tab.id, {greeting: "hello"}, function(response) {
            // ここに受信側からレスポンスが返ってきた時にする処理を記述する。
            console.log("Set target: " + response.farewell);
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getTarget"){
        sendResponse({target_info: localStorage["target-info"]});
    } else if (request.method == "postTarget"){
        localStorage["target_info"] = request.target_info;
        // console.log(request.target_info);
        sendResponse({responce: "set finish!"});
    }
});