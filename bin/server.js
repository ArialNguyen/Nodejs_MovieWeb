const connectDB = require("../db/connect");
var http = require("http");
var app = require("../app");
var server = http.createServer(app);
var io = require("socket.io")(server);
io.on("connection", async function (socket) {
    socket.on("USER_SEND_CMT", function(data){
        socket.broadcast.emit("SERVER_SEND_COMMENT", {content: data.content, username: data.username})
    })
}) 

const start = async () => {
    try { 
      const port = 5000;
      await connectDB(process.env.MONGO_URI);
      server.listen(process.env.PORT || port);
    } catch (error) {
      console.log(error);
    }
  };
start();