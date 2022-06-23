const axios = require('axios');

const utils = require('../assets/links');

async function getGameData(gamePin, botName) {
    const response = await axios.put(utils.links.join, {
        id: gamePin,
        name: botName,
    }, {
        headers: {
            Referer: 'https://www.blooket.com/',
        }
    });

    return response.data
};

module.exports = getGameData