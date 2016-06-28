import {ScreenView} from "./ScreenView";
import {BaseScreen} from "./BaseScreen";
import {PlayerInfo} from "../../../model/PlayerInfo";
import Container = createjs.Container;


class ScreenActivityCard {
    constructor(playerInfo:PlayerInfo) {
        var ctn = new createjs.Container();
        var isBlue = playerInfo.isBlue;

        function _bluePath(p:string) {
            if (isBlue)
                return p + 'Blue.png';
            return p + 'Red.png';

        }

        var bg = new createjs.Bitmap(_bluePath('/img/panel/screen/activity/card'));
        ctn.addChild(bg);
        return ctn;
    }
}

export class BigActivityPanel extends BaseScreen {
    ctn:Container;

    constructor(parent:ScreenView) {
        this.ctn = new createjs.Container();
        this.parent = parent.stage;
        var bg = new createjs.Bitmap('');
    }
}