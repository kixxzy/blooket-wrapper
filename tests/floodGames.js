const Blooket = require('../index')

const client = new Blooket();

client.floodGames('972506', 100);

client.on('flood', data => {
    console.log('Joined game with name: ' + data.player);
});