const processMsg = (conn, ch, work) => (msg) =>{
    work(msg, function(ok) {
        try {
            if (ok)
                ch.ack(msg);
            else
                ch.reject(msg, true);
        } catch (e) {
            closeOnErr(e, conn);
        }
    });
}

function closeOnErr(err, conn) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    conn.close();
    return true;
}

module.exports = {
    processMsg,
    closeOnErr
}
