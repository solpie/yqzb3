import {CommandId} from "../../../event/Command";
import Component from "vue-class-component";
import {BasePanelView} from "../BasePanelView";
import {PanelId, ViewEvent} from "../../../event/Const";
import {formatSecond} from "../../../utils/JsFunc";
import {PlayerInfo} from "../../../model/PlayerInfo";
import {PlayerPanel} from "./PlayerPanel";
import {EventPanel} from "./EventPanel";
import {GameInfo} from "../../../model/GameInfo";
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
        },
        timerName: {
            type: String,
            default: "start"
        },
        mvpIdx: {
            type: Number,
            required: true,
            default: 0
        },
        gameId: {
            type: Number,
            required: true,
            default: 0
        },
        playerInfoArr: {
            type: Array,
            default: [1, 2, 3, 4, 5, 6, 7, 8]
        }
    }
})
export class StagePanelView extends BasePanelView {
    scorePanel:ScorePanel;
    playerPanel:PlayerPanel;
    eventPanel:EventPanel;

    mvpIdx:number;
    timerName:string;
    isInit:boolean;
    gameId:number;
    playerInfoArr:any;

    ready() {
        var io = super.ready(PanelId.stagePanel);
        io.on(`${CommandId.initPanel}`, (data)=> {
            console.log(`${CommandId.initPanel}`, data);
            // ServerConf.isDev = data.isDev;
            if (!this.isInit)
                this.initStage(data.gameInfo);
        });

        io
            .on(`${CommandId.addLeftScore}`, (data)=> {
                console.log(`${CommandId.addLeftScore}`, data);
                this.scorePanel.setLeftScore(data.leftScore);
            })
            .on(`${CommandId.addRightScore}`, (data)=> {
                this.scorePanel.setRightScore(data.rightScore);
            })
            .on(`${CommandId.straightScore3}`, (param)=> {
                if (param.team === ViewEvent.STRAIGHT3_LEFT) {
                    this.eventPanel.fadeInStraight3(false);
                }
                else if (param.team === ViewEvent.STRAIGHT3_RIGHT) {
                    this.eventPanel.fadeInStraight3(true);
                }
            })
            .on(`${CommandId.toggleTimer}`, (data)=> {
                if (this.timerName === 'start')
                    this.timerName = 'pause';
                else
                    this.timerName = 'start';
                this.scorePanel.toggleTimer1();
            })
            .on(`${CommandId.resetTimer}`, (data)=> {
                this.timerName = 'start';
                this.scorePanel.resetTimer();
            })
            .on(`${CommandId.updatePlayer}`, (data)=> {
                // this.getElem('#playerImg' + data.idx).src = data.playerDoc.avatar;
                this.playerPanel.setPlayer(data.idx, new PlayerInfo(data.playerDoc));
                this.scorePanel.setAvgEloScore(data.avgEloScore);
            })
            .on(`${CommandId.updatePlayerAll}`, (param)=> {
                //todo effect
                for (var i = 0; i < param.playerInfoArr.length; i++) {
                    var playerInfo:PlayerInfo = new PlayerInfo(param.playerInfoArr[i]);
                    this.playerPanel.setPlayer(i, playerInfo);
                }
                this.scorePanel.setAvgEloScore(param.avgEloScore);
            })
            .on(`${CommandId.fadeInWinPanel}`, (param)=> {
                var teamInfo = param.teamInfo;
                var mvpIdx = param.mvpIdx;
                var mvpId = param.mvpId;
                this.eventPanel.fadeInWinPanel(teamInfo, mvpIdx,mvpId);
            })
            .on(`${CommandId.fadeOutWinPanel}`, (param)=> {
                this.eventPanel.fadeOutWinPanel();
            })
            .on(`${CommandId.updatePlayerBackNum}`, (param)=> {
                this.playerPanel.playerCardArr[param.idx].setBackNumber(param.backNum);
            })

    }


    initStage(gameDoc:any) {
        this.isInit = true;
        this.scorePanel = new ScorePanel(this);
        this.scorePanel.init(gameDoc);
        this.playerPanel = new PlayerPanel(this);
        this.playerPanel.init(gameDoc);
        this.gameId = gameDoc.id;
        this.eventPanel = new EventPanel(this);
        console.log('initStage', gameDoc);
        if (this.op) {
            for (var i = 0; i < gameDoc.playerInfoArr.length; i++) {
                var playerInfo = gameDoc.playerInfoArr[i];
                this.getElem("#player" + i).value = playerInfo.playerData.id;
            }
        }

    }

    onToggleTimer() {
        this.opReq(`${CommandId.cs_toggleTimer}`);
        console.log('onToggleTimer');
    }

    onResetTimer() {
        console.log('onResetTimer');
        this.opReq(`${CommandId.cs_resetTimer}`);
    }

    onAddLeftScore() {
        console.log('onAddLeftScore');
        this.opReq(`${CommandId.cs_addLeftScore}`,
            {param: 'addLeftScore'});
    }

    onAddRightScore() {
        console.log('onAddRightScore');
        this.opReq(`${CommandId.cs_addRightScore}`);
    }

    onQueryPlayer(idx) {
        var queryId = this.getElem("#player" + idx).value;
        console.log('onQueryPlayer', idx, queryId);
        this.post(`/db/player/${queryId}`, (data)=> {
            console.log('res: ', data);
            var playerDoc = data.playerDoc;
            this.getElem('#playerImg' + idx).src = playerDoc.avatar;
        });
    }

    onUpdatePlayerNum(idx) {
        var backNum = this.getElem("#playerNum" + idx).value;
        console.log('onUpdatePlayerNum', idx, backNum);
        this.opReq(`${CommandId.cs_updatePlayerBackNum}`, {idx: idx, backNum: backNum});
        // this.playerPanel.playerCardArr[idx].setBackNumber(playerNum);
    }

    onStarting() {
        console.log('onStarting');
        var playerIdArr = [];
        var backNumArr = [];
        for (var i = 0; i < 8; i++) {
            var queryId = Number(this.getElem("#player" + i).value);
            playerIdArr.push(queryId);
            backNumArr.push(Number(this.getElem("#playerNum" + i).value));
        }
        // playerIdArr = [10002, 10003, 10004, 10005,
        //     10008, 10010, 10011, 10012];
        this.opReq(`${CommandId.cs_updatePlayerAll}`,
            {playerIdArr: playerIdArr, backNumArr: backNumArr}
        );
    }

    onUpdatePlayer(idx) {
        console.log('onUpdatePlayer', idx);
        var queryId = Number(this.getElem("#player" + idx).value);
        console.log('onQueryPlayer', idx, queryId);
        this.opReq(`${CommandId.cs_updatePlayer}`, {idx: idx, playerId: queryId});
    }

    onMinRightScore() {
        console.log('onMinRightScore');
    }

    onMinLeftScore() {
        console.log('onMinLeftScore');
    }

    onShowWin() {
        console.log('onShowWin mvp ', this.mvpIdx);
        this.opReq(`${CommandId.cs_fadeInWinPanel}`, {mvpIdx: this.mvpIdx});
    }

    onHideWin() {
        console.log('onHideWin mvp ');
        this.opReq(`${CommandId.cs_fadeOutWinPanel}`);
    }

    onRefresh() {
        console.log('onRefresh');
        window.location.reload()
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


////////////////////////////////ScorePanel///////////////////////////////////////////////
class ScorePanel {
    timeText:Text;
    leftAvgEloScoreText:Text;
    rightAvgEloScoreText:Text;
    leftScoreText:BitmapText;
    rightScoreText:BitmapText;
    leftScoreTextX:number;
    rightScoreTextX:number;
    leftCircleArr:any;
    rightCircleArr:any;
    timeOnSec:number;

    timerId:any;
    timerState:number;
    ctn:Container;

    constructor(parent:StagePanelView) {
        this.timeOnSec = 0;

        var scoreCtn = new createjs.Container();
        this.ctn = scoreCtn;
        scoreCtn.y = parent.stageHeight - 132;

        parent.stage.addChild(scoreCtn);

        var bg = new createjs.Bitmap('/img/panel/stage/scoreBg.png');
        bg.x = 1;
        scoreCtn.addChild(bg);

        var timeText:Text = new createjs.Text("99:99", "28px Arial", "#fff");
        timeText.x = parent.stageWidth * .5 - 31;
        timeText.y = 100;
        this.timeText = timeText;
        scoreCtn.addChild(timeText);


        var sheet = new createjs.SpriteSheet({
            animations: {
                "0": 1, "1": 2, "2": 3, "3": 4, "4": 5,
                "5": 6, "6": 7, "7": 8, "8": 9, "9": 0
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


        //////
        this.leftCircleArr = [];
        this.rightCircleArr = [];
        var px = 675;
        var py = 88;
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

        px = 770;
        var lTxt = new createjs.Text("", "28px Arial", "#fff");
        lTxt.text = '0'
        lTxt.textAlign = 'center';
        lTxt.x = px;
        lTxt.y = 22;
        this.leftAvgEloScoreText = lTxt;
        scoreCtn.addChild(lTxt);

        var rTxt = new createjs.Text("", "28px Arial", "#fff");
        rTxt.text = '0'
        rTxt.textAlign = 'center';
        rTxt.x = lTxt.x + 385;
        rTxt.y = lTxt.y;
        this.rightAvgEloScoreText = rTxt;
        scoreCtn.addChild(rTxt);
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

    setRightScore(rightScore) {
        if (rightScore > 9)
            this.rightScoreText.x = this.rightScoreTextX - 18;
        else
            this.rightScoreText.x = this.rightScoreTextX;
        this.rightScoreText.text = rightScore + "";

        var len = this.rightCircleArr.length;
        for (var i = 0; i < len; i++) {
            if (i < rightScore) {
                if (this.rightCircleArr[i].alpha == 0)
                    blink(this.rightCircleArr[i]);
                // createjs.Tween.get(this.rightCircleArr[len - 1 - i]).to({alpha: 1}, 200);
            }
            else {
                createjs.Tween.get(this.rightCircleArr[i]).to({alpha: 0}, 200);
            }
        }
    }

    setAvgEloScore(data) {
        // function getAvgRight(start, playerInfoArr) {
        //     var sum = 0;
        //     var count = 0;
        //     for (var i = start; i < start + 4; i++) {
        //         var playerInfo:PlayerInfo = playerInfoArr[i];
        //         if (playerInfo) {
        //             count++;
        //             sum += playerInfo.eloScore();
        //         }
        //     }
        //     var ret = Math.floor(sum / count);
        //     return ret ? ret : 0;
        // }

        this.leftAvgEloScoreText.text = data.left + "";
        this.rightAvgEloScoreText.text = data.right + "";
    }

    resetTimer() {
        this.timeOnSec = 0;
        this.timerState = 0;
        this.timeText.text = formatSecond(this.timeOnSec);
    }

    toggleTimer1() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = 0;
            this.timerState = 0;
        }
        else {
            this.timerId = setInterval(()=> {
                this.timeOnSec++;
                this.timeText.text = formatSecond(this.timeOnSec);
            }, 1000);
            this.timerState = 1;
        }
    }

    setTime(time, state:number) {
        this.timeText.text = formatSecond(time);
        this.timeOnSec = time;
        if (state) {
            this.toggleTimer1();
        }
    }

    init(gameInfo:any) {
        this.setLeftScore(gameInfo.leftScore);
        this.setRightScore(gameInfo.rightScore);
        var gameInfoClone:GameInfo = new GameInfo(gameInfo);
        this.setAvgEloScore(gameInfoClone.getAvgEloScore());
    }
}