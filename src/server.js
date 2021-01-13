require('dotenv').config("./env");
const axios = require("axios")

const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors')
const connectionsLogic = require("./controller/connections")
const {redisAd} = require("./config");
const {createRabbitConnection} = require("./config/index")

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});
io.adapter(redisAd);

app.use(cors())

io.on('connection', async connection => {
    await connectionsLogic.addConnection(connection)
    connection.on('disconnect', async () => await connectionsLogic.removeConnection(connection.id));
});


app.get('/ping/:id', function (req, res) {
    io.to(req.params.id).emit("chat_message", {name: req.params.id})
    res.status(200).json({msg: req.params.id})
})

app.get('/sockets/', function (req, res) {
    console.log(io.sockets.adapter.rooms)
    res.status(200).json({msg: "ping"})
})

server.listen(30008, function () {
    createRabbitConnection()
    console.log('listening on *:30008');
});

module.exports = {
    redisIo: {b:2, sa: io}
}
