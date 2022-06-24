# blooket-wrapper

A node.js wrapper for the Blooket API

The documentation can be found [here](https://github.com/glixxzzy/blooket-wrapper/blob/main/Documention.md)

# Usage

```js
const Blooket = require('blooket')

const client = new Blooket();

client.joinGame('342865', 'twst', 'Dog')

client.on('Joined', data => {
    console.log(`Joined game with name: ${data.name} \nJoined game with blook: ${data.blook}`)
});
```
