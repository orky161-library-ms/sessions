const connectionDal = require('../dal/connections')
const {libraryAuth} = require("../config/index")

async function addConnection(connection) {
    const token = await libraryAuth.verifyToken(connection.handshake.query.token)
    await connectionDal.addConnection(token.id, connection.id)
}

async function removeConnection(connectionId) {
    await connectionDal.removeConnection(connectionId)
}

function getConnection(user) {
    return connectionDal.getConnectionByUser(user)
}

async function notifyMessage ({user, message}){
    const conn = await getConnection(user)
    require("../config/io").getIoInstance().to(conn).emit("chat_message", {message})
}

module.exports = {
    addConnection,
    removeConnection,
    getConnection,
    notifyMessage
}
