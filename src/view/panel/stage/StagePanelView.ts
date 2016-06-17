import {CommandId} from "../../../event/Command";
import Component from "vue-class-component";
import {BasePanelView} from "../BasePanelView";
import {PanelId, ViewEvent} from "../../../event/Const";
import {PlayerInfo} from "../../../model/PlayerInfo";
import {PlayerPanel} from "./PlayerPanel";
import {EventPanel} from "./EventPanel";
import {ScorePanel} from "./ScorePanel";
// import Text = createjs.Text;
// import BitmapText = createjs.BitmapText;
// import Container = createjs.Container;

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
                this.eventPanel.fadeInWinPanel(teamInfo, mvpIdx, mvpId);
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

    onSubmitGame() {
        var date = new Date();
        var dateTime = date.getTime();
        console.log('onSubmitGame', dateTime);
        if (this.scorePanel.leftScoreText) {

        }
    }

    onRefresh() {
        console.log('onRefresh');
        window.location.reload()
    }
}
