const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = await client.login('email', 'passwod');
    const authToken = login.token;

    const account = await client.getAccountData(authToken);

    const author = account.name;
    const desc = 'created from nodejs';
    const isPrivate = false;
    const title = 'created from nodejs';

    const set = await client.createSet(author, desc, isPrivate, title, authToken);

    console.log(set);    
})();