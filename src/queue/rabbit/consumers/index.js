const {closeOnErr, processMsg} = require("./utils")

async function channelConsume(conn){
    conn.createChannel(function(err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function(err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function() {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(10);
        createAuthorQueue(conn, ch)
    });
}

function createAuthorQueue (conn, ch){
    ch.assertQueue(process.env.SEND_CLIENT_MESSAGE, { durable: true }, function(err, _ok) {
        if (closeOnErr(err)) return;
        ch.consume(process.env.SEND_CLIENT_MESSAGE, processMsg(conn, ch, notifyMessegeWorker), { noAck: false });
        console.log("Worker is started");
    });

}

function notifyMessegeWorker(msg, cb) {
    require("../../../controller/connections").notifyMessage(JSON.parse(msg.content.toString())).then(()=>{
        cb(true);
    })
}

module.exports ={
    channelConsume
}
