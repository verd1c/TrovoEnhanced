const emotes = new Map();

function CreateEmojiNode(emojiName, dataId){
    var emoteNode = document.createElement('img');
    emoteNode.className = 'emoji';
    emoteNode.src = emotes.get(emojiName);
    emoteNode.alt = emojiName;
    emoteNode.setAttribute(String(dataId), '');
    return emoteNode;
}

function CreateEmoteRegEx(){
    var re = '';

    emotes.forEach(function(_value, key){
        re += '(' + key + ')|';
    });

    re = re.substring(0, re.length - 1);
    return new RegExp(re);
}

fetch('https://verd1c.github.io/EnhancedTrovo.json').then(r => r.text()).then(result => {
    var res = JSON.parse(result);

    for(var i = 0; i < res.length; i++){
        emotes.set(res[i].name, res[i].src);
    }

    document.getElementsByClassName('chat-list-box snap-scroller-content')[0].addEventListener('DOMNodeInserted', function(event){
        if(event.target.children != undefined && event.target.children.length > 0){
            var textNode = event.target.children[0].children[3];
            var newMessage = [];
            if(textNode == undefined)
                return;
    
            var id = event.target.children[0].children[3].attributes[0].name;
    
            for(var i = 0; i < textNode.children.length; i++){
                var node = textNode.children[i];
                var text = "";
                
                switch(node.className){
                    case 'text':
                        text = node.innerText;
                        break;
                    default:
                        newMessage.push(node.cloneNode(true));
                        break;
                }
    
                var splitText = text.split(CreateEmoteRegEx());
                splitText = splitText.filter(x => x !== undefined);
    
                splitText.forEach(function(word){
                    var newNode;
                    if(Array.from(emotes.keys()).includes(word)){
                        newNode = CreateEmojiNode(word, id);
                    }else{
                        newNode = textNode.cloneNode(true);
                        newNode.innerText = word;
                    }
                    newMessage.push(newNode);
                });
            }
    
            textNode.innerHTML = "";
            newMessage.forEach(function(node){
                textNode.appendChild(node);
            });
        }
    });
});