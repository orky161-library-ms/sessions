const {redisClient} = require("../config/index")
const { promisify } = require("util");

const getAsync = promisify(redisClient.hget).bind(redisClient);
const setAsync = promisify(redisClient.hset).bind(redisClient);
const removeAsync = promisify(redisClient.del).bind(redisClient);

async function addConnection(user, conn) {
    await setAsync("connections", user, conn)
}

async function getConnectionByUser(user) {
    return getAsync("connections", user)
}

async function removeConnection(user) {
    await removeAsync("connections", user)
}
function checkConnection() {
    return redisClient.connected
}

module.exports ={
    addConnection,
    getConnectionByUser,
    removeConnection,
    checkConnection
}
