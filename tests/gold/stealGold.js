const Blooket = require('../../index');

const client = new Blooket();

client.stealGold('773710', 'glixzzy');

client.on('goldStolen', data => {
    console.log('Gold stolen from player: ' + data.player);
});