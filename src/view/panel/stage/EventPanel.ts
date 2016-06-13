import {StagePanelView} from "./StagePanelView";
import {loadImg} from "../../../utils/JsFunc";
import Container = createjs.Container;
export class EventPanel {
    ctn:Container;

    constructor(parent:StagePanelView) {
        var ctn = new createjs.Container();
        parent.stage.addChild(ctn);

        this.ctn = ctn;
    }

    fadeInWin() {
        
    }

    fadeInStraight3(isRed) {
        console.log("straight score 3 isRed:", isRed);
        var isBusy = false;
        // if (!isBusy) {
        isBusy = true;
        // if (!this.ctn) {
        //     this.ctn = new createjs.Container();
        //     client.panel.stage.addChild(this.ctn);
        // }
        this.ctn.removeAllChildren();

        var ctn = new createjs.Container();
        var basePath = '/img/panel/stage/straight3';
        if (isRed)
            basePath += 'Red.png';
        else
            basePath += 'Blue.png';
        loadImg(basePath, ()=> {
            var txt3 = new createjs.Bitmap(basePath);
            var bound = txt3.getBounds();
            txt3.x = -bound.width;
            txt3.y = -bound.height;
            ctn.addChild(txt3);
            ctn.x = 1920 / 2 + 200;
            ctn.y = 200;
            // ctn.cache(txt3.x, txt3.y, txt3.getBounds().width, txt3.getBounds().height);
            ctn.alpha = 1;
            ctn.scaleX = ctn.scaleY = 5;
            this.ctn.addChild(ctn);
            createjs.Tween.get(ctn)
                .to({scaleX: 1, scaleY: 1}, 150)
                .wait(4000)
                .to({alpha: 0}, 200).call(()=> {
                isBusy = false;
            });
        });
    }
}