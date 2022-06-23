const Blooket = require('../../index');

const client = new Blooket();

client.giveGold('189789', 'glizzy');

client.on('goldGiven', data => {
    console.log('Gold given to player: ' + data.player);
});
