const LibraryAuth = require("library.io-libs/dist/authorization")
const redisAdapter = require('socket.io-redis');
const redis = require("redis");
const redisClient = redis.createClient({ host: process.env.CONNECTIONS_URL, port: process.env.CONNECTIONS_PORT });
const amqp = require('amqplib/callback_api');
const {channelConsume} = require("../queue/rabbit/consumers");

function createRabbitConnection (){
    amqp.connect(process.env.RABBIT_URL + "?heartbeat=60", async (err, conn) => {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(createRabbitConnection, 1500 + (Math.random() * 3000));
        }
        conn.on("error", (err) => {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", () => {
            console.error("[AMQP] reconnecting");
            return setTimeout(createRabbitConnection, 1500 + (Math.random() * 3000));
        });
        console.log("[AMQP] connected");
        await channelConsume(conn)
    });
}

const redisAd = redisAdapter({ host: process.env.CONNECTIONS_URL, port: process.env.CONNECTIONS_PORT })
const libraryAuth = new LibraryAuth(process.env.TOKEN_PRIVATE_KEY)

module.exports = {
    redisAd,
    redisClient,
    createRabbitConnection,
    libraryAuth
}
