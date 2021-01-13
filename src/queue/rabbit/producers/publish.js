const {publish} = require("./index")

function sendEmail(email, msg) {
    publish("", process.env.NOTIFY_QUEUE, Buffer.from(JSON.stringify({email, msg})))
}

module.exports = {
    sendEmail,
}
