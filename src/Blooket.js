const axios = require('axios');
const WebSocket = require('ws');
const EventEmitter = require('events');
const crypto = require('crypto');

const messages = require('./assets/messages');
const utils = require('./assets/links');

const APIResponseMessages = require('./errors/APIResponseErrors');

const { checkPinType } = require('./errors/typeofs');

const findSocketUri = require('./modules/findSocket');
const verifyToken = require('./modules/verifyToken');

const checkGamePin = require('./utils/checkGamePin');
const serverCodes = require('./utils/serverCodes');
const getGameData = require('./utils/getGameData');
const isFavorited = require('./utils/isFavorited');
const getRandomBlook = require('./utils/getRandomBlook');

class Blooket extends EventEmitter {
    constructor() {
        super();
    };

    /* Global */

    async joinGame(gamePin, botName, blook) {
        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

        const data = {
            blook: blook,
            name: botName,
            gameSet: game.host.set,
            gameMode: game.host.s.t
        };

        const ranges = serverCodes();

        ranges.forEach(async range => {
            const socketUrl = await findSocketUri(range.code);

            const ws = new WebSocket(socketUrl);

            ws.on('open', () => {
                ws.send(messages.authorize(socketAuthToken))
                ws.send(messages.joinMessage(gamePin, botName, blook))
            });
        });

        this.emit('Joined', data);
    };

    async floodGames(gamePin, amount) {

        if (amount > 100) /* only change this if statement if you know what you're doing but strongly suggested not to change. */ {
            throw new Error('Maximum bot allowed is 100 to avoid ratelimits.');
        };

        for (let i = 0; i < amount; i++) {
            const botName = crypto.randomBytes(10).toString('hex');

            const socketAuthToken = await verifyToken(gamePin, botName);

            const ranges = serverCodes();

            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(socketAuthToken))
                    ws.send(messages.joinMessage(gamePin, botName, getRandomBlook()))
                });
            });

            this.emit('flood', { player: botName });
        };
    };

    async createGame(hostName, isPlus, qSetId, t_a /* t_a = Time or Amount*/, gameMode, authToken) {
        const newDateISOString = new Date().toISOString();

        const createGameResponse = await axios.post(utils.links.live, {
            hoster: hostName,
            plus: isPlus,
            qSetId: qSetId,
            settings: {
                d: newDateISOString,
                la: true,
                m: t_a,
                t: gameMode,
            },
        }, {
            headers: {
                Authorization: authToken,
                Referer: 'https://www.blooket.com/',
            },
        });

        const verifyTokenReponse = await axios.post(utils.links.verify, {
            returnSecureToken: true,
            token: createGameResponse.data.fbToken
        });

        const ranges = serverCodes();

        ranges.forEach(async range => {
            const socketUrl = await findSocketUri(range.code);

            const ws = new WebSocket(socketUrl);

            ws.on('open', () => {
                ws.send(messages.authorize(verifyTokenReponse.data.idToken));
                ws.send(JSON.stringify({ "t": "d", "d": { "r": 3, "a": "p", "b": { "p": "/" + createGameResponse.data.id, "d": { "ho": hostName, "p": isPlus, "s": { "d": newDateISOString, "la": true, "m": t_a, "t": gameMode }, "set": qSetId, "stg": "join" } } } }))
            });
        });

        const data = { gamePin: createGameResponse.data.id };

        this.emit('gameCreated', data);
    };

    async getAccountData(authToken) {
        const modifiedAuthToken = authToken.split('JWT ')[1];

        const response = await axios(utils.links.verifyAcc + modifiedAuthToken);

        return response.data
    };

    async getGameData(gamePin) {
        checkPinType(gamePin);

        const botName = Math.floor(100000 + Math.random() * 900000).toString();

        const isGameAlive = await checkGamePin(gamePin);

        if (isGameAlive.success == true) {
            const response = await axios.put(utils.links.join, {
                id: gamePin,
                name: botName,
            }, {
                headers: {
                    Referer: 'https://www.blooket.com/',
                }
            });

            return response.data
        } else {
            throw new Error('Invalid Game Pin provided');
        };
    };

    async getAnswers(setId) {
        const response = await axios(utils.links.gameQuery + setId, {}, {
            headers: {
                Referer: 'https://www.blooket.com/',
            },
        });

        const data = [];

        response.data.questions.forEach(quetsion => {
            data.push("Question: " + quetsion.question + " | Answer: " + quetsion.correctAnswers)
        });

        return data
    };

    async spamPlayGame(setId, name, authToken, amount) {
        for (let i = 0; i < amount; i++) {
            try {
                await axios.post(utils.links.history, {
                    "standings": [{}],
                    "settings": {},
                    "set": "",
                    "setId": setId,
                    "name": name,
                }, {
                    headers: {
                        authorization: authToken
                    },
                });

                this.emit('spamPlays', { setId: setId });
            } catch (e) {
                if (e.response.data == APIResponseMessages.historyAPI.MSG) {
                    console.log(APIResponseMessages.historyAPI.MSG);
                    break;
                };
            };
        };
    };

    async favoriteSet(setId, name, authToken) {
        const checkIfFavorited = await isFavorited(setId, authToken);

        if (checkIfFavorited == false) {
            const response = await axios.put(utils.links.favorite, {
                id: setId,
                isUnfavoriting: false,
                name: name,
            }, {
                headers: {
                    authorization: authToken,
                },
            });

            return response.data
        } else {
            throw new Error('You already have this game favorited!');
        };
    };

    async createSet(author, description, isPrivate, title, authToken) {
        const response = await axios.post(utils.links.games, {
            author: author,
            coverImage: {},
            desc: description,
            private: isPrivate,
            title: title,
        }, {
            headers: {
                authorization: authToken,
            },
        });

        return response.data
    };

    async addTokens(tokenAmount, xpAmount, name, authToken) {
        const response = await axios.put(utils.links.rewards, {
            addedTokens: tokenAmount,
            addedXp: xpAmount,
            name: name,
        }, {
            headers: {
                authorization: authToken,
            }
        });

        return response.data
    };

    async login(email, password) {
        const response = await axios.post(utils.links.login, {
            name: email,
            password: password,
        }, {
            headers: {
                Referer: 'https://www.blooket.com/',
            },
        });

        if (response.data.errType == APIResponseMessages.login.errType.MSG_EMAIL) {
            throw new Error(APIResponseMessages.login.MSG_E);
        } else if (response.data.errType == APIResponseMessages.login.errType.MSG_PASSWORD) {
            throw new Error(APIResponseMessages.login.MSG);
        };

        return response.data
    };

    /* Global End */

    /* Gold Quest */

    async stealGold(gamePin, victimName) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

        const ranges = serverCodes();

        if (game.host.s.t != "Gold") {
            throw new Error('This function only works in a gold quest game mode!');
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(socketAuthToken))
                    ws.send(messages.gold.joinMessage(gamePin, botName, randomBlook))
                    ws.send(messages.gold.steal(gamePin, botName, randomBlook, victimName))
                });
            });
        };


        this.emit('goldStolen', { player: victimName });
    };

    async giveGold(gamePin, victimName) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

        const ranges = serverCodes();

        if (game.host.s.t != "Gold") {
            throw new Error('This function only works in a gold quest game mode!');
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(socketAuthToken))
                    ws.send(messages.gold.joinMessage(gamePin, botName, randomBlook));
                    ws.send(messages.gold.give(gamePin, botName, randomBlook, victimName))
                });
            });
        };

        this.emit('goldGiven', { player: victimName });
    };

    /* Gold Quest End */

    /* Racing */

    async endGame(gamePin) {
        const botName = "hecker" + Math.floor(100 + Math.random() * 900).toString();
        const randomBlook = getRandomBlook();

        const socketAuthToken = await verifyToken(gamePin, botName);
        const game = await getGameData(gamePin, botName);

        const goalAmount = game.host.s.a

        const ranges = serverCodes();

        if (game.host.s.t != "Racing") {
            throw new Error("This function is only supposed to be used in racing game mode!");
        } else {
            ranges.forEach(async range => {
                const socketUrl = await findSocketUri(range.code);

                const ws = new WebSocket(socketUrl);

                ws.on('open', () => {
                    ws.send(messages.authorize(socketAuthToken))
                    ws.send(messages.joinMessage(gamePin, botName, "Dog"))
                    ws.send(messages.racing.endGame(gamePin, botName, goalAmount))
                });
            });
        };

        this.emit('gameEnded', { pin: gamePin });
    };

    /* Racing End */



};

module.exports = Blooket


// crypto hack - nothing to add
// fishing frenzy - nothing to add
// tower defense - nothing to add
// cafe - nothing to add
// battle royale - nothing to add
// factory - nothing to add