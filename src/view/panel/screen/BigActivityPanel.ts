import {ScreenView} from "./ScreenView";
import {BaseScreen} from "./BaseScreen";
import {PlayerInfo} from "../../../model/PlayerInfo";
import {loadImg} from "../../../utils/JsFunc";
import Container = createjs.Container;
import Shape = createjs.Shape;


class ScreenActivityCard extends Container {
    avatarCtn:Container;
    styleCtn:Container;
    avtMask:Shape;
    nameText:any;
    eloScoreText:any;
    backNumText:any;

    constructor(playerInfo:PlayerInfo) {
        super();
        var isBlue = playerInfo.isBlue;

        function _bluePath(p:string) {
            if (isBlue)
                return p + 'Blue.png';
            return p + 'Red.png';
        }

        var avatarCtn = new createjs.Container();
        avatarCtn.y = 25;
        this.avtMask = new createjs.Shape();
        this.avtMask.graphics.beginFill('#000').drawRect(0, 0, 165, 185);
        // this.avtMask.y = 5;
        if (isBlue) {
            this.avtMask.x = 128;
            avatarCtn.x = 295;
        }
        else {
            this.avtMask.x = 142;
            avatarCtn.x = -105;
        }
        this.addChild(avatarCtn);
        this.avatarCtn = avatarCtn;
        this.setAvatar(playerInfo.avatar());

        var bg = new createjs.Bitmap(_bluePath('/img/panel/screen/activity/card'));
        this.addChild(bg);

        var nameText = new createjs.Text(playerInfo.name(), "bold 28px Arial", "#fff");
        nameText.textAlign = 'center';
        nameText.y = 32;
        if (isBlue)
            nameText.x = 145;
        else
            nameText.x = 465;
        this.nameText = nameText;
        this.addChild(nameText);

        var eloScoreText = new createjs.Text(playerInfo.eloScore(), "bold 28px Arial", "#fff");
        eloScoreText.textAlign = 'center';
        eloScoreText.y = 98;
        if (isBlue)
            eloScoreText.x = 145;
        else
            eloScoreText.x = 465;
        this.eloScoreText = eloScoreText;
        this.addChild(eloScoreText);

        var backNumText = new createjs.Text(playerInfo.backNumber() + "", "bold 28px Arial", "#fff");
        backNumText.textAlign = 'center';
        backNumText.y = 163;
        if (isBlue)
            backNumText.x = 145;
        else
            backNumText.x = 465;
        this.backNumText = backNumText;
        this.addChild(backNumText);

        var styleCtn = new createjs.Container();
        styleCtn.y = 155;
        if (isBlue) {
            styleCtn.x = 35;
        }
        else {
            styleCtn.x = 352;
        }
        this.styleCtn = styleCtn;
        this.addChild(styleCtn);
        this.setStyle(playerInfo.style());
    }

    setPlayerDoc(playerDoc) {
        this.setAvatar(playerDoc.avatar);
        this.setStyle(playerDoc.style);
        this.setBackNum(playerDoc.backNumber);
        this.nameText.text = playerDoc.name;
        this.eloScoreText.text = playerDoc.eloScore;
    }

    setStyle(style:number) {
        this.styleCtn.removeAllChildren();
        var img = new createjs.Bitmap(`/img/panel/screen/activity/style${style}.png`);
        this.styleCtn.addChild(img);
    }

    setBackNum(backNum:number) {
        if (backNum != null)
            this.backNumText.text = backNum + "";
        else
            this.backNumText.text = '';
    }

    setAvatar(path) {
        this.avatarCtn.removeAllChildren();
        loadImg(path, ()=> {
            var img = new createjs.Bitmap(path);
            var scale = 185 / img.getBounds().height;
            img.scaleX = img.scaleY = scale;
            img.mask = this.avtMask;
            this.avatarCtn.addChild(img)
        });

    }
}

export class BigActivityPanel extends BaseScreen {
    ctn:Container;
    leftEloScoreText:any;
    rightEloScoreText:any;
    playerCardArr:ScreenActivityCard[];

    constructor(parent:ScreenView) {
        super();
        this.playerCardArr = [];
        this.ctn = new createjs.Container();
        this.parent = parent.stage;
        var bg = new createjs.Bitmap('/img/panel/screen/activity/bg.png');
        this.ctn.addChild(bg);
        var sum = 0;
        for (var i = 0; i < 4; i++) {
            var playerInfo = new PlayerInfo();
            playerInfo.isBlue = true;
            playerInfo.name('一二三四五六');
            playerInfo.avatar('/img/player/10070.png');
            playerInfo.style(i + 1);
            playerInfo.eloScore(2000);
            var card = new ScreenActivityCard(playerInfo);
            sum += playerInfo.eloScore();
            card.x = 50;
            card.y = i * 250 + 50;
            this.playerCardArr.push(card);
            this.ctn.addChild(card);
        }
        this.leftEloScoreText = new createjs.Text("", "bold 28px Arial", "#fff");
        this.leftEloScoreText.textAlign = 'center';
        this.leftEloScoreText.x = 838;
        this.leftEloScoreText.y = 638;
        this.ctn.addChild(this.leftEloScoreText);
        this.setLeftEloScore(Math.floor(sum / 4));

        sum = 0;
        for (var i = 0; i < 4; i++) {
            var playerInfo = new PlayerInfo();
            playerInfo.name('一二三四五六');
            playerInfo.avatar('/img/player/10070.png');
            playerInfo.style(i + 1);
            playerInfo.eloScore(2000);
            var card = new ScreenActivityCard(playerInfo);
            sum += playerInfo.eloScore();
            card.x = 1300;
            card.y = i * 250 + 50;
            this.playerCardArr.push(card);
            this.ctn.addChild(card);
        }
        this.rightEloScoreText = new createjs.Text("", "bold 28px Arial", "#fff");
        this.rightEloScoreText.textAlign = 'center';
        this.rightEloScoreText.x = 1068;
        this.rightEloScoreText.y = this.leftEloScoreText.y;
        this.ctn.addChild(this.rightEloScoreText);
        this.setRightEloScore(Math.floor(sum / 4));
    }

    setLeftEloScore(score:number) {
        this.leftEloScoreText.text = `${score}`;
    }

    setRightEloScore(score:number) {
        this.rightEloScoreText.text = `${score}`;
    }

    fadeIn(playerDocArr:Array<any>) {
        if (!this.ctn.parent)
            this.parent.addChild(this.ctn);

        var sum = 0;
        for (var i = 0; i < 4; i++) {
            var playerDoc = playerDocArr[i];
            sum += playerDoc.eloScore;
            this.playerCardArr[i].setPlayerDoc(playerDoc);
            this.setLeftEloScore(Math.floor(sum / 4));
        }
        sum = 0;
        for (var j = 4; j < 8; j++) {
            var playerDoc = playerDocArr[j];
            sum += playerDoc.eloScore;
            this.playerCardArr[j].setPlayerDoc(playerDoc);
            this.setRightEloScore(Math.floor(sum / 4));
        }
    }
}