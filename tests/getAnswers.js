const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const gamePin = "198804";

    const game = await client.getGameData(gamePin)

    const set = game.host.set;

    const answers = await client.getAnswers(set);
    
    answers.forEach(answer => {
        console.log(answer);
    });
})();