const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = await client.login('email', 'password');
    const authToken = login.token;

    const account = await client.getAccountData(authToken);
    
    const setId = "619ffd8626263900c33b3db8";
    const name = account.name;


    client.spamPlayGame(setId, name, authToken, 100);

    client.on('spamPlays', data => {
        console.log('Played game: ' + data.setId);
    });
})();
