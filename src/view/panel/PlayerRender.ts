import {loadImg} from "../../utils/JsFunc";
import {PlayerInfo} from "../../model/PlayerInfo";
export function getStagePlayerCard(playerInfo:PlayerInfo, scale, isBlue = true) {
    //width 150
    var ctn = new createjs.Container();

    function _isBluePath(p) {
        if (isBlue)
            return p + "Blue.png";
        return p + "Red.png";
    }

    var avatarFrame = new createjs.Bitmap(_isBluePath('/img/panel/stage/avatarFrame'));//694x132
    // leftAvatarBg.x = 15;
    // leftAvatarBg.y = 6;

    var avatarCtn = new createjs.Container();
    if (isBlue) {
        avatarCtn.x = 19;
        avatarCtn.y = 1;
    }
    else {
        avatarCtn.x = 3;
        avatarCtn.y = 1;
    }
    var avatarMask = new createjs.Shape();
    var sx = 44;
    if (isBlue)
        avatarMask.graphics.beginFill("#000000")
            .moveTo(sx, 0)
            .lineTo(0, 76)
            .lineTo(180 - sx, 76)
            .lineTo(180, 0)
            .lineTo(sx, 0);
    else {
        avatarMask.graphics.beginFill("#000000")
            .moveTo(0, 0)
            .lineTo(sx, 76)
            .lineTo(180, 76)
            .lineTo(180 - sx, 0)
            .lineTo(0, 0);
    }

    loadImg(playerInfo.avatar(), function () {
        var avatarBmp = new createjs.Bitmap(playerInfo.avatar());
        avatarBmp.mask = avatarMask;
        avatarCtn.addChild(avatarMask);
        avatarCtn.addChild(avatarBmp);
        // leftAvatarBmp = avatarBmp;
        avatarBmp.scaleX = avatarBmp.scaleY = 180 / avatarBmp.getBounds().width;
    });
//        this.avatarArr.push(avatarCtn);
    ctn.addChild(avatarCtn);
    ctn.addChild(avatarFrame);

    // var leftEloBg = new createjs.Bitmap("/img/panel/leftEloBg.png");//694x132
    // leftEloBg.x = avatarFrame.x + 27;
    // leftEloBg.y = 70;
    // ctn.addChild(leftEloBg);

    var backNumText = new createjs.Text(playerInfo.backNumber + "", "18px Arial", "#fff");
    backNumText.y = 5;
    if (isBlue) {
        backNumText.textAlign = "right";
        backNumText.x = 182;
    }
    else {
        backNumText.textAlign = "left";
        backNumText.x = 15;
    }
    ctn.addChild(backNumText);

    var eloScoreText = new createjs.Text(playerInfo.eloScore(), "18px Arial", "#fff");
    eloScoreText.y = 59;
    if (isBlue) {
        eloScoreText.textAlign = "left";
        eloScoreText.x = 31;
    }
    else {
        eloScoreText.textAlign = "right";
        eloScoreText.x = 172;
    }
    ctn.addChild(eloScoreText);


    var styleCtn = new createjs.Container();
    var styleIcon = new createjs.Bitmap(playerInfo.getStyleIcon());//694x132
    if (isBlue) {
        styleCtn.x = 110;
    }
    else {
        styleCtn.x = 52;
    }
    styleCtn.y = 75;
    styleCtn.addChild(styleIcon);
//        this.styleArr.push(styleCtn);
    ctn.addChild(styleCtn);

    var nameText = new createjs.Text(playerInfo.name(), "bold 18px Arial", "#fff");
    nameText.y = 84;
    if (isBlue) {
        nameText.textAlign = "left";
        nameText.x = 16;
    }
    else {
        nameText.textAlign = "right";
        nameText.x = 185;
    }
//        this.nameLabelArr.push(leftNameLabel);
    ctn.addChild(nameText);
    return ctn;
}


