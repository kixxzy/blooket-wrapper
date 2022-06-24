const axios = require('axios');

async function isGameAlive(gamePin) {
    const response = await axios('https://api.blooket.com/api/firebase/id?id=' + gamePin);

    return response.data
};

module.exports = isGameAlive
