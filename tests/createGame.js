const Blooket = require('../index');

const client = new Blooket();

(async () => {
    const login = await client.login('myemail@gmail.com', 'mypasssowrd123');
    const authToken = login.token;

    const account = await client.getAccountData(authToken);

    const hostName = account.name;
    const isPlus = account.plus == "Starter" ? false : true;
    const gameSetId = "600b1491d42a140004d5215a"; //https://www.blooket.com/set/600b1491d42a140004d5215a

    client.createGame(hostName, isPlus, gameSetId, 'Time', 'Gold', authToken);

    client.on('gameCreated', data => {
        console.log('Game created: ' + data.gamePin);
    });
})();
