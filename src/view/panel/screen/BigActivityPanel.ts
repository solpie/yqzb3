import {ScreenView} from "./ScreenView";
import {BaseScreen} from "./BaseScreen";
import {PlayerInfo} from "../../../model/PlayerInfo";
import {loadImg} from "../../../utils/JsFunc";
import Container = createjs.Container;
import Shape = createjs.Shape;


class ScreenActivityCard extends Container {
    avatarCtn:Container;
    avtMask:Shape;

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
        this.setAvatar('/img/player/10056.png');

        var bg = new createjs.Bitmap(_bluePath('/img/panel/screen/activity/card'));
        this.addChild(bg);
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

    constructor(parent:ScreenView) {
        super();
        this.ctn = new createjs.Container();
        this.parent = parent.stage;
        var bg = new createjs.Bitmap('/img/panel/screen/activity/bg.png');
        this.ctn.addChild(bg);
        for (var i = 0; i < 4; i++) {
            var playerInfo = new PlayerInfo();
            playerInfo.isBlue = true;
            var card = new ScreenActivityCard(playerInfo);
            card.x = 50;
            card.y = i * 250 + 50;
            this.ctn.addChild(card);
        }

        for (var i = 0; i < 4; i++) {
            var playerInfo = new PlayerInfo();
            var card = new ScreenActivityCard(playerInfo);
            card.x = 1300;
            card.y = i * 250 + 50;
            this.ctn.addChild(card);
        }
    }

    fadeIn() {
        if (!this.ctn.parent)
            this.parent.addChild(this.ctn);
    }
}