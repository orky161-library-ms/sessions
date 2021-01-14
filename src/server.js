require('dotenv').config("./env");
require("express-async-errors")

const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors')
const {createIoConnection} = require("./config/io");
const {createRabbitConnection} = require("./config/index")
const { checkConnection } = require("./dal/connections");

app.use(cors())

app.get('/ping', (req, res) => {
    res.status(200).json({msg: "ping"})
})

app.get('/health', async (req, res) => {
    await checkConnection()
    res.status(200).json({msg: "health"})
})

server.listen(30008, function () {
    createRabbitConnection()
    createIoConnection(server)
    console.log('listening on *:30008');
});
