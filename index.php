<form onsubmit="return enterName();">
    <input id="name" placeholder="Enter name">
    <input type="submit">
</form>

<ul id="users"></ul>
<ul id="messages"></ul>

<form onsubmit="return sendMessage();">
    <input id="message" placeholder="Input chat">
    <input type="submit">
</form>

<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/socket.io.js"></script>
<script>
    //create instance
    appURL ="http://localhost:4000";
    let socket = io.connect(appURL, { transports : ['websocket'] });
    // var io = io("http://localhost:4000");  //error to throw
    var receiver = "";
    var sender = "";

    function enterName() {
        //get username
        var name = $('#name').val();
        // console.log(name);

        //send it to server
        socket.emit('user_connected', name);
        //save name to global variable
        sender = name;

        //prevent the form from submitting
        return false;
        
    }

    //listen from server
    socket.on('user_connected', (username) => {
        // console.log(username);
        var html = "";
        html += "<li><button onclick='onUserSelected(this.innerHTML);'>" + username + "</button></li>";
        $('#users').append(html);
        // document.getElementById('users').innerHTML += html;
        

    });

    function onUserSelected(username) {
        //save selected user to global variable
        console.log(username);

        receiver =  username;
        let data = {sender:sender, receiver:receiver};
        console.log(data);

        $.ajax({
            url:"http://localhost:4000/get_messages",
            method: "POST",
            data: data,
            success:(response)=>{
                console.log(response);
                var messages = JSON.parse(response);
                var html = "";
                
                for (let a = 0; a < messages.length; a++) {
                    console.log(messages.length);
                    html += "<li>" + messages[a].sender + " says:" + messages[a].message + "</li>";
                    //append to list
                   document.getElementById('messages').innerHTML = html;



                }
            },
            error:(err)=>{
              console.log(err);
            }
        });


    }

    function sendMessage() {
        //get message
        var message = $('#message').val();
        // console.log(message);

        //send message to server
        socket.emit("send_message", {
            sender:sender,
            receiver:receiver,
            message:message,
        });
      
        var html = "";
        html += "<li> You said:" + message + "</li>";
        // $('#users').html(messages);
        document.getElementById('messages').innerHTML += html;


      
        //prevent the form from submitting
         return false;

    }
    $('#message').val('');

    //listen from server
    socket.on("new_message", (data)=> {
        // console.log(data);
        var html = "";
        html += "<li>" + data.sender + " says:" + data.message + "</li>";
        // $('#users').html(messages);
        document.getElementById('messages').innerHTML += html;

        
    });
   
</script>