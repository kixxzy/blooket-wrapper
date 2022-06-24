module.exports = {
    joinMessage: (gamePin, botName, blook) => {
        return JSON.stringify({ "t": "d", "d": { "r": 2, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": blook } } } });
    },

    authorize: (authToken) => {
        return JSON.stringify({ "t": "d", "d": { "r": 1, "a": "auth", "b": { "cred": authToken } } })
    },

    gold: {
        joinMessage: (gamePin, botName, blook) => {
            return JSON.stringify({ "t": "d", "d": { "r": 6, "a": "p", "b": { "p": `/` + gamePin + `/c/` + botName, "d": { "b": blook, "g": 999999 } } } })
        },

        steal: (gamePin, botName, randomBlook, victimName) => {
            return JSON.stringify({ "t": "d", "d": { "r": 18, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": randomBlook, "g": 0, "tat": victimName + ":999999" } } } })
        },

        give: (gamePin, botName, randomBlook, victimName) => {
            return JSON.stringify({ "t": "d", "d": { "r": 18, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": randomBlook, "g": 0, "tat": victimName + ":swap:999999" } } } })
        },
    },

    racing: {
        endGame: (gamePin, botName, goalAmount) => {
            return JSON.stringify({ "t": "d", "d": { "r": 12, "a": "p", "b": { "p": "/" + gamePin + "/c/" + botName, "d": { "b": "Dog", "pr": goalAmount } } } })
        },
    },
};
