const Blooket = require('../../index');

const client = new Blooket();

client.endGame('861432');

client.on('gameEnded', data => {
    console.log('Ended game: ' + data.pin);
});