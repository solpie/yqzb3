import {db} from "../model/DbInfo";
export var dbRouter = require('express').Router();

// dbRouter.get('/', function (req:any, res:any) {
// });
// /db/player
dbRouter.post('/player/', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);
    res.send({PlayerMap: db.player.dataMap});
});

dbRouter.post('/player/:playerId', function (req:any, res:any) {
    var playerId = req.params.playerId;
    console.log(`/player/${playerId}`);
    if (playerId) {
        res.send({playerDoc: db.player.dataMap[playerId]});
    }
});
