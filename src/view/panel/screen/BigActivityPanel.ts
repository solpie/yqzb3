import {ScreenView} from "./ScreenView";
import {BaseScreen} from "./BaseScreen";
import {PlayerInfo} from "../../../model/PlayerInfo";
import Container = createjs.Container;


class ScreenActivityCard extends Container {
    constructor(playerInfo:PlayerInfo) {
        super();
        var isBlue = playerInfo.isBlue;

        function _bluePath(p:string) {
            if (isBlue)
                return p + 'Blue.png';
            return p + 'Red.png';

        }

        var bg = new createjs.Bitmap(_bluePath('/img/panel/screen/activity/card'));
        this.addChild(bg);
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
            var card = new ScreenActivityCard(new PlayerInfo());
            this.ctn.addChild(card);
        }
    }

    fadeIn() {
        if (!this.ctn.parent)
            this.parent.addChild(this.ctn);
    }
}