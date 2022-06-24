const Blooket = require('../index')

const client = new Blooket();

(async () => {
    const login = await client.login('myemail@gmail.com', 'MyPassword123');

    console.log(login.token);
})();
