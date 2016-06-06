export var dbRouter = require('express').Router();

// dbRouter.get('/', function (req:any, res:any) {
// });
dbRouter.post('/player/', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);
    res.send({PlayerDataArr: [1, 2]});
});
