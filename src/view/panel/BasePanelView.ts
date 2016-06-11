import {VueEx} from "../VueEx";
import Stage = createjs.Stage;
import Container = createjs.Container;
export class BasePanelView extends VueEx {
    op:boolean;
    stageWidth:number;
    stageHeight:number;
    stage:Stage;
    ctn:Container;
    initCanvas() {
        this.stageWidth = 1920;
        this.stageHeight = 1080;
        var canvas = document.getElementById("stage");
        canvas.setAttribute("width", this.stageWidth + "");
        canvas.setAttribute("height", this.stageHeight + "");
        var stage = new createjs.Stage(canvas);
        stage.autoClear = true;
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });

        this.ctn = new createjs.Container();
        stage.addChild(this.ctn);
        this.stage = stage;
    }

    ready() {
        this.initCanvas();

        var panel:any = this.$parent;
        this.op = panel.isOp;
        console.log("BasePanelView.ready", panel.isOp);
        return panel.connect();
    }
}