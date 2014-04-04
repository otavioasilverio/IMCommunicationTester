
var BOSH_SERVICE = '';
var connection = null;


var user = '';
var password = '';
var contact = ''

function log(msg) {
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function rawInput(data) {
    //log('RECV: ' + data);
}

function rawOutput(data) {
    // log('SENT: ' + data);
}

function onConnect(status) {
    if (status == Strophe.Status.CONNECTING) {
        log('Strophe is connecting.');
    }
    else if (status == Strophe.Status.CONNFAIL) {
        log('Strophe failed to connect.');
        $('#connect').get(0).value = 'Connect';
    }
    else if (status == Strophe.Status.DISCONNECTING) {
        log('Strophe is disconnecting.');
    }
    else if (status == Strophe.Status.DISCONNECTED) {
        log('Strophe is disconnected.');
        $('#connect').get(0).value = 'Connect';
        connection.send($pres({ type: "unavailable" }));
    }
    else if (status == Strophe.Status.CONNECTED) {
        log('Strophe is connected.');
        // connection.addHandler(on_presence, null, "presence");		
        connection.addHandler(onMessage, null, 'message', null, null, null);
        connection.send($pres());
    }
}

$(document).ready(function () {
   

    $('#connect').bind('click', connectButton_Click);
});

function connectButton_Click() {
    var button = $('#connect').get(0);
    if (button.value == 'Connect') {
        var BOSH_SERVICE = 'http://' + $('#ip').get(0).value + ':7070/http-bind/';
        connection = new Strophe.Connection(BOSH_SERVICE);
        connection.rawInput = rawInput;
        connection.rawOutput = rawOutput;
        button.value = 'Disconnect';

        jid = $('#jid').get(0).value;
        password = $('#password').get(0).value;
        connection.connect(jid, password, onConnect);
    }
    else {
        button.value = 'Connect';
        connection.disconnect();
    }
}
function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
        var body = elems[0];
        showMessagem(from, Strophe.getText(body))
    }
    return true;
}



function sendMessage(elemid) {
    contact = $('#contact').get(0).value;

    if (connection.connected && connection.authenticated) {
        var text = $('#' + elemid).get(0).value;
        if (text.length > 0) {
            var from = Strophe.getNodeFromJid(connection.jid);
            var to = contact;
            var reply = $msg({ to: contact, from: connection.jid, type: "chat" }).c("body").t(text);
            connection.send(reply.tree());
            showMessagem(connection.jid, text)
            $('#' + elemid).get(0).value = "";
        }
    }
    else {
        log("You have to log in!");
        log(connection.connected);

    }
}

function showMessagem(userName, message) {
    $('#MSG').append('<div></div>').append(document.createTextNode('<' + userName + '>' + message));

}



//function on_presence(presence) {

//     var presence_type = $(presence).attr('type'); 
//     var from = $(presence).attr('from'); 

//     if (presence_type != 'error')
//     {
//     if (presence_type === 'unavailable')
//     {
//     alert('offline');
//     }
//     else
//     {

//     var show = $(presence).find("show").text(); // this is what gives away, dnd, etc.
//     if (show === 'chat' || show === '')
//     {
//     alert('');
//     }
//     else
//     {
//     alert('etc');
//     }
//     }
//     }  

//     return true;
//}
