let iex_target = null;
let iex_save_text = "";

let variableTextArea = (element) => {
    let lineHeight = parseInt(element.css('lineHeight'));
    let lines = (element.val() + '\n').match(/\n/g).length+1;
    if (lines < 5) {
        element.height(lineHeight * 5);
    } else {
        element.height(lineHeight * lines);
    }
}

let iexClear = () => {
    $("#iex-content").remove();
    $("#iex-overlay").remove();
}

$(document).on("click", (event) => {
    let is_iex = !!$('#iex-content').length;
    if (!is_iex) {
        if (event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA") {
            iex_target = $(event.target);
        } else {
            iex_target = null;
    }
    }
});

chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
    let is_iex = !!$('#iex-content').length;
    let is_iex_target = !!iex_target;
    let iex_textarea_val;

    if (is_iex) {
        iexClear();
    } else {
        if (is_iex_target) {
            iex_textarea_val = iex_target.val()
        } else {
            iex_textarea_val = iex_save_text;
        }
        
        let iex_modal = "";
        iex_modal += "<div id='iex-content'>";
        iex_modal += "<modal id='iex-modal'>";
        iex_modal += "<div id='iex-title'>Input EX</div>";
        iex_modal += "<label id='iex-snippets-label'>Snippets:</label>";
        iex_modal += "<div id='iex-snippets'>";
        iex_modal += "<button class='iex-snippet' value='Hello, Snippet!!'>Hello, Snippet!!</button>";
        iex_modal += "<button id='iex-add-snippet'>＋</button>";
        iex_modal += "</div>";
        iex_modal += "<label id='iex-text-label'>Text:</label>";
        iex_modal += "<textarea id='iex-textarea'>" + iex_textarea_val + "</textarea>";
        iex_modal += "</modal>";
        if (is_iex_target) {
            iex_modal += "<div id='iex-command-label'>Shift+Enterで更新</div>";
        }
        iex_modal += "</div>";
        iex_modal += "<div id='iex-overlay'></div>"
        
        console.log(iex_modal);
        $("body").append(iex_modal);
        
        // スニペット追加
        $(".iex-snippet").on("click", function(e) {
            iex_textarea.val(iex_textarea.val() + $(this).val());
            iex_textarea.focus();
        });
        
        // テキストを表示し、カーソルを末尾に
        let iex_textarea = $("#iex-textarea");
        iex_textarea.focus();
        let iex_tmp = iex_textarea.val();
        iex_textarea.val("");
        iex_textarea.val(iex_tmp);
        
        //Shift+エンターで更新
        if (is_iex_target) {
            iex_textarea.keydown(function(e){
                if(event.shiftKey){
                    if(e.keyCode === 13){
                        iex_target.val(iex_textarea.val());
                        iexClear();
                        iex_target.focus();
                        return false;
                    }
                }
            });
        }
        
        // 常にテキストエリアの縦幅調整
        variableTextArea(iex_textarea);
        iex_textarea.on('input', function(e) {
            variableTextArea($(this));
            iex_save_text = $(this).val();
        });
    }

    if (request.greeting == "hello")
        sendResponse({farewell: "OK"});
    else
        //★ここ重要★ レスポンスがない場合でも、必ず空のオブジェクトを返す。
        sendResponse({}); // snub them.
    }
);

// target.css("background-color","#ff6300");

// if (target_tag_name == "INPUT" || target_tag_name == "TEXTAREA"){
//     chrome.runtime.sendMessage({method: "postTarget", target_info: JSON.stringify([{target: target, target_tag_name: target_tag_name, target_val:target_val}])}, function(response) {
//         if(response.responce){
//             console.log("target_set: ", response.responce);
//         }
//     });
// }


// chrome.runtime.sendMessage({method: "getTarget"},function(response) {
//     if(response.responce){
//         console.log("target_get: ", response.responce);
//     }
//     let target_tag_name = response.target_tag_name;
//     let target_val = response.target_val;
// });