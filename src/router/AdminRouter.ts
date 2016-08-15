import {PlayerInfo} from "../model/PlayerInfo";
import {db} from "../model/DbInfo";
import {base64ToPng} from "../utils/NodeJsFunc";
import {ServerConst} from "../event/Const";
export var adminRouter = require('express').Router();

adminRouter.get('/', function (req: any, res: any) {
    res.render('admin/index');
});

// adminRouter.get('/player', function (req:any, res:any) {
//     res.render('admin/admin-player', {playerDataArr: []});
// });
// post /admin/player/add
adminRouter.post('/player/xlsx/add', function (req: any, res: any) {
    if (!req.body) return res.sendStatus(400);
    var playerDocArr = req.body.playerDocArr;
    console.log('/admin/player/xlsx/add', req.body);
    var insertPlayerDoc = (playerDoc)=> {
        db.player.create(playerDoc, function (err, newDoc) {
            if (!err) {
                if (playerDocArr.length)
                    insertPlayerDoc(playerDocArr.pop());
                else
                    res.sendStatus(200);
            }
            else
                res.sendStatus(400);
        });
    };
    insertPlayerDoc(playerDocArr.pop());
});

adminRouter.post('/player/add', function (req: any, res: any) {
    if (!req.body) return res.sendStatus(400);

    var playerData = req.body.playerData;
    var playerInfo = new PlayerInfo(playerData);
    console.log('/admin/player/add', db.player.getIdNew());
    playerInfo.id(db.player.getIdNew());
    function createPlayer() {
        db.player.create(playerInfo.playerData, function (err, newDoc) {
            if (!err) {
                res.sendStatus(200);
            }
            else
                res.sendStatus(400);
        });
    }

    var avatarPath = 'img/player/' + playerInfo.id() + '.png';
    if (playerData.avatar) {
        var dbImgPath = "app/db/" + avatarPath;
        console.log('/admin/player/add');
        base64ToPng(dbImgPath, playerData.avatar, function (imgPath) {
            playerInfo.avatar("/" + avatarPath);
            console.log('/admin/player/add', JSON.stringify(playerInfo.playerData));
            createPlayer();
        });
    }
    else {
        playerInfo.avatar(ServerConst.DEF_AVATAR);
        createPlayer();
    }

});

adminRouter.post('/player/delete', function (req: any, res: any) {
    if (!req.body) return res.sendStatus(400);
    var playerId = req.body.id;
    db.player.remove({id: playerId}, function (err, numRemoved) {
        // numRemoved = 1
        if (!err) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
    });
});

adminRouter.post('/player/update', function (req: any, res: any) {
    if (!req.body) return res.sendStatus(400);
    var playerDocUpdate: any = req.body.playerDoc;
    console.log('/player/update', playerDocUpdate);

    var playerDoc = db.player.dataMap[playerDocUpdate.id];
    if (playerDoc) {
        var avatarPathOld = playerDoc.avatar;
        if (avatarPathOld == ServerConst.DEF_AVATAR || !avatarPathOld)
            avatarPathOld = '/' + 'img/player/' + playerDocUpdate.id + '.png';

        function updatePlayer() {
            playerDocUpdate.avatar = avatarPathOld;
            console.log('/player/update playerDoc', playerDocUpdate);
            db.player.ds().update({id: playerDocUpdate.id}, {$set: playerDocUpdate}, {}, (err, newDoc) => {
                db.player.syncDataMap();
                res.sendStatus(200);
            });
        }

        if (playerDocUpdate.avatar) {
            var avatarPath = 'img/player/' + playerDocUpdate.id + '.png';
            var dbImgPath = "app/db/" + avatarPath;
            base64ToPng(dbImgPath, playerDocUpdate.avatar, (imgPath)=> {
                console.log('/player/update base64ToPng');
                updatePlayer();
            });
        }
        else {
            updatePlayer();
        }
    }
    else {
        console.log('/player/update no playerDoc in map');
    }
});

////////////// game admin 
adminRouter.get('/game/delete/:gameId', function (req: any, res: any) {
    var gameId = Number(req.params.gameId);
    console.log('/admin/game/delete/', gameId);
    db.game.remove({id: gameId});
    db.activity.removeGame(gameId, (sus)=> {
        res.send(sus);
    });
});

adminRouter.get('/test', function (req: any, res: any) {
    var unirest = require('unirest');
    // var jsss = JSON.stringify({
    //     "winUsers": [10082, 10082, 10082, 10082],
    //     "loseUsers": [10082, 10082, 10082, 10082],
    //     "mvp": [10082]
    // });

    // var jsss = JSON.stringify({
    //     "winUsers": ["15502168938"],
    //     "loseUsers": ["15692173023"],
    //     "key": '140fe1da9eab651944c',
    //     "secret": 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=',
    //     "mvp": ["10082"]
    // });

    var jsss = JSON.stringify({
        "winUsers": ["13616542277"],
        "loseUsers": ["15692173023"],
        "key": '140fe1da9eab651944c',
        "secret": 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI='
    });
    unirest.post('http://api.yuanqi.tv/ladder/enroll_result')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({
            "content": jsss
        })
        .end(function (response) {
            console.log(response, response.body);
        });

    var submitGame = (winPhoneArr: Array<string>, losePhoneArr: Array<string>, mvpPhone: string)=> {
        var jsss = JSON.stringify({
            "winUsers": winPhoneArr,
            "loseUsers": losePhoneArr,
            "key": '140fe1da9eab651944c',
            "mvp": [mvpPhone],
            "secret": 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI='
        });
        unirest.post('http://api.yuanqi.tv/ladder/enroll_result')
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .send({
                "content": jsss
            })
            .end(function (response) {
                console.log(response, response.body);
            });
    };


    /////////////
    var isNoPhone = false;
    var gameArr = [];
    var getBluePhoneArr = (playerDocArr, start = 0)=> {
        var a = [];
        for (var i = start; i < 4 + start; i++) {
            var playerDoc = playerDocArr[i];
            if (!playerDoc['phone']) {
                isNoPhone = true;
                console.log('no phone ', playerDoc.name);
            }
            else
                a.push(playerDoc.phone + "");
        }
        return a;
    };

    var getRedPhoneArr = (playerDocArr)=> {
        return getBluePhoneArr(playerDocArr, 4);
    };

    for (var i = 0; i < 14; i++) {
        var gameDoc = db.game.dataMap[43001 + i];
        var winPhoneArr = [];
        var losePhoneArr = [];
        var playerDocArr = db.player.getDocArr(gameDoc.playerIdArr);
        console.log('playerDocArr ', playerDocArr);
        if (gameDoc.isBlue) {
            winPhoneArr = getBluePhoneArr(playerDocArr);
            losePhoneArr = getRedPhoneArr(playerDocArr);
        }
        else {
            losePhoneArr = getBluePhoneArr(playerDocArr);
            winPhoneArr = getRedPhoneArr(playerDocArr);
        }
        var mvpPhone;
        if (db.player.dataMap[gameDoc.mvp]['phone'])
            mvpPhone = db.player.dataMap[gameDoc.mvp].phone + "";

        console.log('winPhoneArr', winPhoneArr, 'losePhoneArr', losePhoneArr, 'mvp', mvpPhone);
        gameArr.push(gameDoc);
        // submitGame(winPhoneArr, losePhoneArr, mvpPhone);
    }
    console.log(gameArr);
    if (isNoPhone)
        res.send('no phone');
    else
        res.send("ok")
});

//////////////////activity admin
adminRouter.post('/act/add', function (req: any, res: any) {
    var activityId = req.body.activityId;
    var playerIdArr = db.player.getPlayerIdArrRank(req.body.playerIdArr);
    //组合球员
    var t1 = playerIdArr.slice(0, 4);
    var t2 = playerIdArr.slice(4, 8);
    // var t1 = playerIdArr.slice(0, 2).concat(playerIdArr.slice(6, 8));
    // var t2 = playerIdArr.slice(2, 4).concat(playerIdArr.slice(4, 6));
    var t3 = playerIdArr.slice(8, 12);
    var t4 = playerIdArr.slice(12, 16);
    var gameOnePlayerIdArr = playerIdArr.slice(0, 8);
    var gameTwoPlayerIdArr = playerIdArr.slice(8, 16);
    console.log('/admin/act/add', req.body.playerIdArr);
    var lastTeamArr = [t1, t2, t3, t4];
    //
    db.activity.addActivity(activityId, playerIdArr, (roundId)=> {
        db.activity.addGame(activityId, roundId, gameOnePlayerIdArr, 1, ()=> {
            db.activity.addGame(activityId, roundId, gameTwoPlayerIdArr, 1, null);
        });
        res.sendStatus(200);
    });
});
adminRouter.post('/act/19', function (req: any, res: any) {
    // if (!req.body) return res.sendStatus(400);
    // var act:any = Act619;
    // for (var gameDoc of act.gameDataArr) {
    //     gameDoc.playerDocArr = [];
    //     for (var i = 0; i < gameDoc.playerIdArr.length; i++) {
    //         var playerId = gameDoc.playerIdArr[i];
    //         console.log('playerId: ', playerId);
    //         gameDoc.playerDocArr.push(db.player.dataMap[playerId]);
    //     }
    // }
    // res.send(act);
});