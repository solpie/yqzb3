import {CommandId} from "../../../event/Command";
import Component from "vue-class-component";
import {BasePanelView} from "../BasePanelView";
import {PanelId} from "../../../event/Const";
import Text = createjs.Text;
import BitmapText = createjs.BitmapText;
import Container = createjs.Container;

@Component({
    template: require('./stage-panel.html'),
    props: {
        op: {
            type: Boolean,
            required: true,
            default: false
        }
    }
})
export class StagePanelView extends BasePanelView {
    scorePanel:ScorePanel;

    ready() {
        var io = super.ready(PanelId.stagePanel);
        io.on(`${CommandId.initPanel}`, (data)=> {
            console.log(`${CommandId.initPanel}`, data);
            // ServerConf.isDev = data.isDev;
            this.initStage();
        });

        io.on(`${CommandId.addLeftScore}`, (data)=> {
            console.log(`${CommandId.addLeftScore}`, data);
            this.scorePanel.setLeftScore(data.leftScore);
        });
    }


    initStage() {
        this.scorePanel = new ScorePanel(this);
    }

    onToggleTimer() {
        console.log('onToggleTimer');
    }

    onResetTimer() {
        console.log('onResetTimer');
    }

    onAddLeftScore() {
        console.log('onAddLeftScore');
        this.opReq(`${CommandId.cs_addLeftScore}`,
            {param: 'addLeftScore'},
            function (res) {
                console.log(res);
            });
        // this.socketReq(`${CommandId.cs_addLeftScore}`, {param: "add left"});
    }

    onAddRightScore() {
        console.log('onAddRightScore');
    }

    onMinRightScore() {
        console.log('onMinRightScore');
    }

    onMinLeftScore() {
        console.log('onMinLeftScore');
    }

    onShowWin() {
        console.log('onShowWin');
    }

    onRefresh() {
        console.log('onRefresh');
    }
}
function blink(target) {
    var blink = 80;
    createjs.Tween.get(target)
        .to({alpha: 1}, blink)
        .to({alpha: 0}, blink)
        .to({alpha: 1}, blink)
        .to({alpha: 0}, blink)
        .to({alpha: 1}, blink);
}
class ScorePanel {
    timeText:Text;
    leftScoreText:BitmapText;
    rightScoreText:BitmapText;
    leftScoreTextX:number;
    rightScoreTextX:number;
    leftCircleArr:any;
    rightCircleArr:any;

    constructor(parent:StagePanelView) {
        var scoreCtn = new createjs.Container();
        scoreCtn.y = parent.stageHeight - 132;

        parent.stage.addChild(scoreCtn);

        var bg = new createjs.Bitmap('/img/panel/stage/scoreBg.png');
        bg.x = 1;
        scoreCtn.addChild(bg);

        var timeText:Text = new createjs.Text("99:99", "28px Arial", "#e2e2e2");
        timeText.x = parent.stageWidth * .5 - 32;
        timeText.y = parent.stageHeight - 30;
        this.timeText = timeText;
        scoreCtn.addChild(timeText);


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
            images: ["/img/panel/stage/scoreNum.png"],
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
        var px = 865;
        var leftScoreNum = new createjs.BitmapText("0", sheet);
        leftScoreNum.letterSpacing = -2;
        leftScoreNum.x = px;
        leftScoreNum.y = 60;
        this.leftScoreText = leftScoreNum;
        this.leftScoreTextX = leftScoreNum.x;
        scoreCtn.addChild(leftScoreNum);

        var rightScoreNum = new createjs.BitmapText("0", sheet);
        rightScoreNum.letterSpacing = -2;
        rightScoreNum.x = px + 160;
        rightScoreNum.y = leftScoreNum.y;
        this.rightScoreText = rightScoreNum;
        this.rightScoreTextX = rightScoreNum.x;
        scoreCtn.addChild(rightScoreNum);

        this.leftCircleArr = [];
        this.rightCircleArr = [];
        var px = 205 + 470;
        var py = 43;
        for (var i = 0; i < 7; i++) {
            var leftScoreBg = new createjs.Bitmap("/img/panel/stage/leftScoreBg.png");//694x132
            leftScoreBg.x = px + i * 20;
            leftScoreBg.y = py;
            scoreCtn.addChild(leftScoreBg);
            var leftScore = new createjs.Bitmap("/img/panel/stage/leftScore.png");//694x132
            leftScore.x = leftScoreBg.x;
            leftScore.y = leftScoreBg.y;
            scoreCtn.addChild(leftScore);
            this.leftCircleArr.push(leftScore);
        }
        //right score
        px = 1090;
        for (var i = 0; i < 7; i++) {
            var rightScoreBg = new createjs.Bitmap("/img/panel/stage/rightScoreBg.png");//694x132
            rightScoreBg.x = px + i * 20;
            rightScoreBg.y = py;
            scoreCtn.addChild(rightScoreBg);
            var rightScore = new createjs.Bitmap("/img/panel/stage/rightScore.png");//694x132
            rightScore.x = rightScoreBg.x;
            rightScore.y = rightScoreBg.y;
            scoreCtn.addChild(rightScore);
            this.rightCircleArr.push(rightScore);
        }
    }

    setLeftScore(leftScore) {
        this.leftScoreText.text = leftScore + "";
        if (leftScore > 9)
            this.leftScoreText.x = this.leftScoreTextX - 18;
        else
            this.leftScoreText.x = this.leftScoreTextX;

        // console.log("LeftScoreLabel width:", this.leftScoreLabel.getBounds().width);
        var len = this.leftCircleArr.length;

        for (var i = 0; i < this.leftCircleArr.length; i++) {
            if (i < leftScore) {
                if (this.leftCircleArr[len - 1 - i].alpha == 0)
                    blink(this.leftCircleArr[len - 1 - i]);
                //circleArr[i].alpha = 1;
            }
            else {
                createjs.Tween.get(this.leftCircleArr[len - 1 - i]).to({alpha: 0}, 200);
                //circleArr[i].alpha = 0;
            }
        }
        // console.log(leftScore);
    }
}