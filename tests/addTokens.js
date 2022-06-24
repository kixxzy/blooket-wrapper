const Blooket = require('../index');

const client = new Blooket();

(async () => {
    const login = await client.login('myEmail@gmail.com', 'myPassword123');
    const authToken = login.token;

    const account = await client.getAccountData(authToken);
    const name = account.name;

    const tokenAmount = 500;
    const xpAmount = 300;

    const addTokens = await client.addTokens(tokenAmount, xpAmount, name, authToken);

    console.log(addTokens);
    console.log('Added ' + tokenAmount + ' tokens and ' + xpAmount + ' XP to your account.');
})();
