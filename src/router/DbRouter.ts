import {db} from "../model/DbInfo";
import {ExternalInfo} from "../model/external/ExternalInfo";
import {PlayerInfo} from "../model/PlayerInfo";
import {Hp3x3} from "../model/external/3x3/Hp3x3";
// import {Act619} from "../event/Const";
export var dbRouter = require('express').Router();

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
dbRouter.get('/player/wx', function (req:any, res:any) {
    console.log('/player/wx');
    var playerDataArr = [];
    // db.playerHuiTi.dataMap
    for (var id in db.playerHuiTi.dataMap) {
    // for (var id in db.player.dataMap) {
        var playerDoc = db.playerHuiTi.dataMap[id];
        var playerObj:any = {};
        playerObj.phone = playerDoc.phone + "";
        playerObj.name = playerDoc.name;
        playerObj.eloScore = playerDoc.eloScore;
        playerObj.gameCount = PlayerInfo.gameCount(playerDoc);
        playerObj.winAmount = playerDoc.winGameCount;
        playerObj.winPercent = PlayerInfo.winPercentStr(playerDoc);
        playerObj.section = PlayerInfo.section(playerDoc);

        playerDataArr.push(playerObj);
    }
    var playerJson:string = JSON.stringify(playerDataArr);
    var fs = require('fs');
    fs.writeFile('player.json', playerJson, null, null);
    res.sendStatus(200);
});
///////////////
dbRouter.post('/act/', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);
    res.send({activityMap: db.activity.dataMap});
});

dbRouter.post('/act/combine', function (req:any, res:any) {
    res.send({
        activityMap: db.activity.dataMap,
        gameMap: db.game.dataMap
    });
});

dbRouter.post('/game/', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);
    res.send({gameMap: db.game.dataMap});
});

dbRouter.post('/game/player', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);
    var gameIdArr = req.body.gameIdArr;
    var gameDocArr = db.game.getDocArr(gameIdArr);
    var playerIdArr = [];
    for (var gameDoc of gameDocArr) {
        playerIdArr = playerIdArr.concat(gameDoc.playerIdArr);
    }
    var playerDocArr = db.player.getDocArr(playerIdArr);
    res.send({playerIdArr: playerIdArr, playerDocArr: playerDocArr});
});


dbRouter.post('/external/player', function (req:any, res:any) {
    res.send({playerInfoMap: db.playerHuiTi.dataMap})
});

dbRouter.get('/external/import', function (req:any, res:any) {
    //https://github.com/SheetJS/js-xlsx
    console.log('/db/external');
    ExternalInfo.importHuiTi();
    res.sendStatus(200);
});
dbRouter.get('/external/import/3x3', function (req:any, res:any) {
    //https://github.com/SheetJS/js-xlsx
    console.log('/db/external/import/3x3');
    Hp3x3.importXLSX();
    res.sendStatus(200);
});
