const Blooket = require('../index')

const client = new Blooket();

client.joinGame('342865', 'twst', 'Dog')

client.on('Joined', data => {
    console.log(`Joined game with name: ${data.name} \nJoined game with blook: ${data.blook}`)
});
