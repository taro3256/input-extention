
$(document).click(function(event){
    let target = $(event.target);;
    let target_tag_name = target[0].tagName;
    let target_val = target.val();

    // target.css("background-color","#ff6300");

    if (target_tag_name == "INPUT" || target_tag_name == "TEXTAREA"){
        chrome.runtime.sendMessage({method: "postTarget", target_info: JSON.stringify([{target: target, target_tag_name: target_tag_name, target_val:target_val}])}, function(response) {
            if(response.responce){
                console.log("target_set: ", response.responce);
            }
        });
    }
});

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        chrome.runtime.sendMessage({method: "getTarget"},function(response) {
            if(response.responce){
                console.log("target_get: ", response.responce);
            }
            let target_tag_name = response.target_tag_name;
            let target_val = response.target_val;
            // TODO : 次はここから
            console.log(target_tag_name);
        });
    
        if (request.greeting == "hello")
            sendResponse({farewell: "OK"});
        else
            //★ここ重要★ レスポンスがない場合でも、必ず空のオブジェクトを返す。
            sendResponse({}); // snub them.
    }
);