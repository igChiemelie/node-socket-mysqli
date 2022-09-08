//require mysqli
// let Mysqli = require('mysqli');

//create connection
// let connection = new Mysqli({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: 'dreamschat'
// });

// .then(
    // console.log("Connected to database")
// );

//if connection error
// connection.on('error', function(err) {
//   console.log("[mysql error]", err);
// });

let mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'dreamschat'
});
//if connection error
connection.on('error', function(err) {
  console.log("[mysql error]", err);
});

//export connection
module.exports = connection;

