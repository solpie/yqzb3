import {PlayerInfo} from "../model/PlayerInfo";
import {db} from "../model/DbInfo";
import {base64ToPng} from "../utils/NodeJsFunc";
export var adminRouter = require('express').Router();

adminRouter.get('/', function (req:any, res:any) {
    res.render('admin/index');
});

// adminRouter.get('/player', function (req:any, res:any) {
//     res.render('admin/admin-player', {playerDataArr: []});
// });
// post /admin/player/add
adminRouter.post('/player/add', function (req:any, res:any) {
    if (!req.body) return res.sendStatus(400);

    var playerData = req.body.playerData;
    var playerInfo = new PlayerInfo(playerData);
    playerInfo.id(db.player.getIdNew());
    var avatarPath = 'img/player/' + playerInfo.id() + '.png';
    var dbImgPath = "app/db/" + avatarPath;
    console.log('/admin/player/add');
    base64ToPng(dbImgPath, playerData.avatar, function (imgPath) {
        playerInfo.avatar("/" + avatarPath);
        console.log('/admin/player/add', JSON.stringify(playerInfo.playerData));
        db.player.create(playerInfo.playerData, function (err, newDoc) {
            if (!err) {
                db.player.saveIdUsed();
                res.sendStatus(200);
            }
            else
                res.sendStatus(400);
        });
    });
});