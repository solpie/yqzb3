import {loadImg} from "../../../utils/JsFunc";
import {PlayerInfo} from "../../../model/PlayerInfo";
import Text = createjs.Text;
import Container = createjs.Container;
import Bitmap = createjs.Bitmap;
export class StagePlayerCard extends Container {
    // _ctn:Container;
    nameText:Text;
    eloScoreText:Text;
    backNumText:Text;
    _styleCtn:Container;
    isBlue:boolean;
    avatarBmp:Bitmap;

    constructor(playerInfo:PlayerInfo, scale = 1, isBlue = true) {
        super();
        this.setPlayerInfo(playerInfo, scale, isBlue);
    }

    setName(name:string) {
        this.nameText.text = name;
    }

    setEloScore(eloScore:number) {
        this.eloScoreText.text = eloScore.toString();
    }

    setBackNumber(backNumber:number) {
        this.backNumText.text = backNumber.toString();
    }

    setStyle(style:number) {
        this._styleCtn.removeAllChildren();
        var styleIcon = new createjs.Bitmap(PlayerInfo.getStyleIcon(style));//694x132
        this._styleCtn.addChild(styleIcon);
    }

    setPlayerInfo(playerInfo:PlayerInfo, scale = 1, isBlue = true) {
        this.isBlue = isBlue;
        //width 150
        var ctn = this;
        this.removeAllChildren();

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

        loadImg(playerInfo.avatar(), ()=> {
            var avatarBmp = new createjs.Bitmap(playerInfo.avatar());
            avatarBmp.mask = avatarMask;
            avatarCtn.addChild(avatarMask);
            avatarCtn.addChild(avatarBmp);
            // leftAvatarBmp = avatarBmp;
            this.avatarBmp = avatarBmp;
            avatarBmp.scaleX = avatarBmp.scaleY = 180 / avatarBmp.getBounds().width;
        });
//        this.avatarArr.push(avatarCtn);
        ctn.addChild(avatarCtn);
        ctn.addChild(avatarFrame);

        var backNumText = new createjs.Text(playerInfo.backNumber + "", "18px Arial", "#fff");
        backNumText.y = 5;
        this.backNumText = backNumText;
        if (isBlue) {
            backNumText.textAlign = "right";
            backNumText.x = 182;
        }
        else {
            backNumText.textAlign = "left";
            backNumText.x = 15;
        }
        ctn.addChild(backNumText);

        var eloText = '---';
        if (playerInfo.gameRec().length >= 3)
            eloText = playerInfo.eloScore();
        console.log(`player${playerInfo.name()}game Count`, playerInfo.gameCount());
        var eloScoreText = new createjs.Text(eloText, "18px Arial", "#fff");
        eloScoreText.y = 59;
        this.eloScoreText = eloScoreText;
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
        this._styleCtn = styleCtn;
        var styleIcon = new createjs.Bitmap(PlayerInfo.getStyleIcon(playerInfo.style()));//694x132
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
        this.nameText = nameText;
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


    static newScoreText() {
        var sheet = new createjs.SpriteSheet({
            animations: {
                "0": 1,
                "1": 2,
                "2": 3,
                "3": 4,
                "4": 5,
                "5": 6,
                "6": 7,
                "7": 8,
                "8": 9,
                "9": 0
            },
            images: ["/img/panel/scoreNum.png"],
            frames: [[0, 0, 40, 54],
                [41, 0, 40, 54],
                [0, 55, 40, 54],
                [41, 55, 40, 54],
                [82, 0, 40, 54],
                [82, 55, 40, 54],
                [123, 0, 40, 54],
                [123, 55, 40, 54],
                [0, 110, 40, 54],
                [41, 110, 40, 54]]
        });
        return new createjs.BitmapText("0", sheet);
    }
}