const axios = require('axios');

const APIResponseMessage = require('../errors/APIResponseErrors');
const { checkPinType, checkNameType } = require('../errors/typeofs');

const utils = require('../assets/links');
const isGameAlive = require('../utils/checkGamePin');

async function verifyToken(gamePin, botName) {
    checkPinType(gamePin);
    checkNameType(botName);

    const checkGamePin = await isGameAlive(gamePin);

    if (checkGamePin.success == true) {
            const joinResponse = await axios.put(utils.links.join, {
                id: gamePin,
                name: botName,
            }, {
                headers: {
                    Referer: 'https://www.blooket.com/',
                },
            });

            if (joinResponse.data.msg == APIResponseMessage.join.MSG_TAKEN) {
                throw new Error(botName + ' Is taken already!');
            } else if (joinResponse.data.msg == APIResponseMessage.join.MSG_INVALID) {
                throw new TypeError(botName + ' Is an invalid name!');
            } else if (joinResponse.data.msg == APIResponseMessage.join.MSG_BLOCKED) {
                throw new Error('Blocked from joining the game, try to change your name!');
            };

            const verifyResponse = await axios.post(utils.links.verify, {
                returnSecureToken: true,
                token: joinResponse.data.fbToken,
            });

            return verifyResponse.data.idToken
    } else if (checkGamePin.msg == APIResponseMessage.checkGamePinId.MSG_GAME) {
        throw new Error('Game doesn\'t exist!');
    };
};

module.exports = verifyToken;
