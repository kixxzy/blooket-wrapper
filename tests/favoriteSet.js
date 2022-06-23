const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = await client.login('email', 'password');
    const authToken = login.token;

    const account = await client.getAccountData(authToken);
    
    const name = account.name;

    const setId = "619ffa8f76a076b181439489";
    
    const favorite = await client.favoriteSet(setId, name, authToken);
    
    console.log(favorite);
})();