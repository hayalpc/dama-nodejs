$(function() {
    let wait = 10;
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        alert('Sorry, but your browser doesn\'t support WebSockets.');
        return;
    }

});

function initializeSocket(callback){
    onLoad();
    callback();
}

async function onLoad(onOpenType) {
    const wsUri = "ws://dama.education.local:3000/dama";
    websocket = new WebSocket(wsUri);
    if(onOpenType == 'game'){
        websocket.onopen = function(evt) { onOpenGame(evt) };
    }else{
        websocket.onopen = function(evt) { onOpen(evt) };
    }
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };


}

function onOpen(evt) {
    console.log("Connected to server");
    sendMessage('login',{username:getCookie('username')});
    sendMessage('initializeTable',{});
    checkConnection();
}

function onOpenGame(evt) {
    console.log("Connected to server");
    let data = {username:getCookie('username')};
    sendMessage('login',data);

    let params = getSearchParameters();
    data['tableId'] = params.tableId;
    sendMessage('startGame',data);

    checkConnection();
}

function onClose(evt) {
    checkConnection();
    console.log('Connection fail!');
}

function checkConnection(){
    if (websocket.readyState === 1) {
        $(".status").removeClass('disconnected');
        $(".status").addClass('connected');
    }else{
        $(".status").addClass('disconnected');
        $(".status").removeClass('connected');
    }
}

function onMessage(evt) {
    let message = JSON.parse(evt.data);
    console.log(message);
    if(Functions[message.action] !== undefined){
        Functions[message.action](message.data);
    }
}

function onError(evt) {
    console.log("Communication error");
}

function disConnect(retry=false) {
    if (retry){
        reConnect();
    }else{
        websocket.close();
        checkConnection();
    }
}

function reConnect() {
    if (websocket.readyState === 3) {
        setTimeout(function() {
            onLoad();
        }, 3 * 1000 );
    }
}

function sendMessage(action,message) {
    if (websocket.readyState === 1) {
        data = {action, data: message};
        websocket.send(JSON.stringify(data));
    }
}

function createTable() {
    let tableName = prompt('Lütfen masa adı giriniz:');
    if(tableName !== null && tableName !== ""){
        // let cip = prompt('Lütfen masa tutarı giriniz:');
        let data = {
            tableName
        };
        sendMessage('createTable',data);
    }
}