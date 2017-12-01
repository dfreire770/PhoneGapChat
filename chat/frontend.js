// frontend.js

var myColor = false;
    // my name sent to the server
var myName = false;
var connection;

var connect = function(){
    "use strict";
	
    // for better performance - to avoid searching in DOM
	var ip = document.getElementById("direction").value;
    var content = $('#content');
    var input = $('#input');
	var status = $('#status');
	
	
	
	console.log(ip);
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
	//var connection = new WebSocket('ws://192.168.104:1337');
	 connection = new WebSocket('ws://'+ip+":1337");

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.</p>' } ));
    };
	connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'color') { // first response from the server with user's color
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disabled').focus();
            // from now user can start sending messages
        } else if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (var i=0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                           json.data[i].color, new Date(json.data[i].time));
            }

        } else if (json.type === 'message') { // it's a single message
            input.removeAttr('disabled'); // let the user write another message
            addMessage(json.data.author, json.data.text,
                       json.data.color, new Date(json.data.time));

        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };
	function addMessage(author, message, color, datetime) {
        
			var mydiv = document.getElementById("content");
			var newcontent = document.createElement('div');
			newcontent.innerHTML = '<p><span style="color:' + color + '">' + author + '</span> @ ' +
                      + (datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()) + ':'
                      + (datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes())
                      + ': ' + message + '</p>';

			while (newcontent.firstChild) {
				mydiv.appendChild(newcontent.firstChild);
			}
			
	}
	
	


    
}
var set_name = function(){
	
	var msg = document.getElementById("user").value;
	
    myName = msg;
	console.log(myName);
	connection.send(msg);
	msg="";
       
}

var send_msg = function(){
	
	
	
	var msg = document.getElementById("msg").value;
	
    myName = msg;
	console.log(myName);
	connection.send(msg);
	msg="";
	document.getElementById("msg").value="";
	
}



