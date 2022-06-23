function checkPinType(gamePin) {
    if (typeof gamePin == 'number') {
        throw new TypeError('gamePin must be a string!')
    };
};

function checkNameType(name) {
    if (typeof name != 'string') {
        throw new TypeError('name must be a string!');
    };
};

module.exports = { checkPinType, checkNameType };