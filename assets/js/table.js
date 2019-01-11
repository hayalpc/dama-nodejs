let Functions = {};

function tableLine(data,returnHtml){
    html =  "<div class='tablee "+ data.id +"' data-tableId='"+ data.id +"'>" +
        data.name +"<br>" +
        "<small>"+ data.creater + (data.oppenent !== undefined ? " - " +data.oppenent : '')+ "</small>" +
        (data.status === 0 ? "<br><button class='joinTable' "+(data.creater == getCookie('username') ? 'disabled' : '')+" data-tableId='" + data.id + "'>Katıl</button>" : '<br>Devam ediyor...')+
        "</div>";
    if(returnHtml === true){
        return html;
    }else{
        $(".tables").append(html);
    }
}


Functions['refreshCounts'] = (data) =>{
    $(".onlineCount").html(data.user);
    $(".tableCount").html(data.table);
    $(".onlineUsers").html("");
    for(user in data.userNames){
        if($(".online-"+user).length === 0) {
            $(".onlineUsers").append("<span class='online-" + user + "'>" + user + "</span> ");
        }
    }
};
Functions['initTable'] = (data) =>{
    for(table in data){
        if($("."+data[table].id).length === 0){
            tableLine(data[table]);
        }
    }
};

Functions['createTable'] = (data) =>{
    if($("."+ data.id).length === 0){
        tableLine(data);
    }
    $(".tableCount").html(data.count);
};

Functions['refreshTable'] = (data) =>{
    if($("."+ data.id).length !== 0){
        console.log(tableLine(data,true));
        $("."+data.id).after(tableLine(data,true)).remove();
    }
};

Functions['removeTable'] = (data) =>{
    if($("." + data.tableId) !== undefined){
        $("."+data.tableId).remove();
    }
};

Functions['removeOnlineUser'] = (data) =>{
    if($("." + data.tableId) !== undefined){
        $(".online-"+data.username).remove();
    }
};

Functions['message'] = (data) =>{
    alert(data.message);
};

Functions['joinTable'] = (tableId) =>{
    let data = {
        tableId:tableId,
        apponent:getCookie('username'),
    };
    sendMessage('joinTable',data);
};

Functions['startGame'] = (data)=>{
  window.location = "/oyun.html?tableId=" + data.tableId;
};
