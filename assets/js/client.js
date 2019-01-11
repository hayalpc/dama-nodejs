$(function() {
    reloadLoginButtons();

    $(".tables").on("click",".joinTable",(event)=>{
        let tableId = $( event.target ).attr('data-tableId');
        Functions['joinTable'](tableId)
    });

});

function reloadLoginButtons() {
    const isLoginedUsername = getCookie('username');
    if(isLoginedUsername === "" || isLoginedUsername === undefined){
        $(".login").show();
        $(".logout").hide();
        $(".table").hide();
    }else{
        $(".login").hide();
        $(".logout").show();
        $(".table").show();
    }
}

function checkIsLogined(){
    const isLoginedUsername = getCookie('username');
    if(isLoginedUsername === "" || isLoginedUsername === undefined) {
        window.location = "/";
    }else{
        return true;
    }
}


function Logout(){
    setCookie('username','',-1);
    reloadLoginButtons();
}

function Login(){
    checkCookie();
    reloadLoginButtons();
}

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let username = getCookie("username");
    if (username !== "") {
        window.location = "/masalar.html";
    } else {
        let id = (Math.random() * 100).toFixed();
        username = prompt("Lütfen kullanıcı adı giriniz:", "ekaraman" + id);
        if (username !== "" && username !== null) {
            setCookie("username", username, 365);
            window.location = "/masalar.html";
        }
    }
}

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}