let pubChannel = null;
let offlinePubQueue = [];

function startPublisher(conn) {
    conn.createConfirmChannel(function(err, ch) {
        if (closeOnErr(err, conn)) return;
        ch.on("error", function(err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function() {
            console.log("[AMQP] channel closed");
        });

        pubChannel = ch;
        while (offlinePubQueue.length) {
                let [exchange, routingKey, content] = offlinePubQueue.shift();
                publish(exchange, routingKey, content);
        }
    });
}

function publish(exchange, routingKey, content) {
    try {
        pubChannel.publish(exchange, routingKey, content, { persistent: true },
            function(err, ok) {
                if (err) {
                    console.error("[AMQP] publish", err);
                    offlinePubQueue.push([exchange, routingKey, content]);
                    pubChannel.connection.close();
                }
            });
    } catch (e) {
        console.error("[AMQP] publish ", e.message);
        offlinePubQueue.push([exchange, routingKey, content]);
    }
}

function closeOnErr(err, conn) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    conn.close();
    return true;
}

module.exports = {
    startPublisher,
    publish
}
