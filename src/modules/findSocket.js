const WebSocket = require('ws');

function findSocket(serverCode) {
    return new Promise(function (resolve, reject) {
        const socket = new WebSocket("wss://s-usc1c-nss-200.firebaseio.com/.ws?v=5&ns=blooket-" + serverCode);
        socket.onmessage = message => {
            const data = JSON.parse(message.data);
            data.d.t == 'r'
                ? resolve(`wss://${data.d.d}/.ws?v=5&ns=blooket-${serverCode}`)
                : resolve(`wss://s-usc1c-nss-200.firebaseio.com/.ws?v=5&ns=blooket-${serverCode}`);
        }
    });
};

module.exports = findSocket
