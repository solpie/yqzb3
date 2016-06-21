import {PlayerInfo} from "../model/PlayerInfo";
import {db} from "../model/DbInfo";
import {base64ToPng} from "../utils/NodeJsFunc";
import {ServerConst} from "../event/Const";
export var adminRouter = require('express').Router();

adminRouter.get('/', function (req:any, res:any) {
    res.render('admin/index');
});

// adminRouter.get('/player', function (req:any, res:any) {
//     res.render('admin/admin-player', {playerDataArr: []});
// });
// post /admin/player/add
adminRouter.post('/player/wx/add', function (req:any, res:any) {

});

adminRouter.post('/player/add', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);

    var playerData = req.body.playerData;
    var playerInfo = new PlayerInfo(playerData);
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

adminRouter.post('/player/delete', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);
    var playerId = req.body.id;
    db.player.ds().remove({id: playerId}, {}, function (err, numRemoved) {
        db.player.syncDataMap();
        // numRemoved = 1
        if (!err) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
    });
});

adminRouter.post('/player/update', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);
    var playerDocUpdate:any = req.body.playerDoc;
    console.log('/player/update', playerDocUpdate);

    var playerDoc = db.player.dataMap[playerDocUpdate.id];
    if (playerDoc) {
        var avatarPathOld = playerDoc.avatar;
        if (avatarPathOld == ServerConst.DEF_AVATAR)
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