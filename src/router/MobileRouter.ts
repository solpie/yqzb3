export var mobileRouter = require('express').Router();

mobileRouter.get('/', function (req, res) {
    console.log('get mobile:');
    res.send('233');
});
