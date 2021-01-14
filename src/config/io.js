const {redisAd} = require("./index");
const connectionsLogic = require("../controller/connections")

let io;
function createIoConnection (server){
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
        }
    });

    io.adapter(redisAd);

    io.on('connection', async connection => {
        await connectionsLogic.addConnection(connection)
        connection.on('disconnect', async () => await connectionsLogic.removeConnection(connection.id));
    });
}

getIoInstance = () => io

module.exports = {
    createIoConnection,
    getIoInstance
}
