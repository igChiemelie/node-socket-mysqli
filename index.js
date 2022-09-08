const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require("body-parser");
// require the socket.io module
const socket = require("socket.io");
const cors = require("cors");
app.use(bodyParser.json());

//integrating socketio
io = socket(http);
//require mysqli
// const connection = require("/connection");
const connection = require('./demo_create_db');

//require body-parseer
//users Array
var users = [];

app.use(cors());
app.use(express.urlencoded({extended: false}));



//create Api for to return messages
app.post('/get_messages', (req, res)=> {
    //get all message from database
        console.log('yes lord');
        console.log(req.body.sender);
        console.log(req.body.receiver);

        // let sql = "SELECT * FROM messages";
        let sql = "SELECT * FROM messages WHERE (sender = '"+req.body.sender+"' AND receiver = '"+req.body.receiver+"') OR (sender = '"+req.body.receiver+"' AND receiver = '"+req.body.sender+"')";
        connection.query(sql, (err, messages) => {
            if (err) throw err;
            // console.log(messages);
            res.end(JSON.stringify(messages));
            // let userRow = JSON.parse(JSON.stringify(messages));
    
        });

      
    
});

// Socket Operations
io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    //attach incoming listerner for new user
    socket.on('user_connected', (username) => {
        //save in array
        users[username] = socket.id;

        //socket ID will be used to send message

        //notify all connected clients
        io.emit("user_connected", username);
    });

    socket.on('send_message', (data)=>{
        // console.log(data);

        //send event to receiver
        var socketId = users[data.receiver];
        io.to(socketId).emit("new_message", data);

        //save to database
        let value = [
                        [data.sender, data.receiver, data.message]
                    ];
        let sql = "INSERT INTO messages (sender, receiver, message) VALUES ?";
        connection.query(sql, [value], (err, result) =>{
            if (err) throw err;
            // console.log(result);
        });

    });

});

const port = 4000;

http.listen(port, () => {
    console.log('Running on port: '+port);
});
