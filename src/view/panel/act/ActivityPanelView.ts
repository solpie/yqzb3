import {BasePanelView} from "../BasePanelView";
import {PanelId} from "../../../event/Const";
import Component from "vue-class-component";
import {RankRender} from "../render/RankRender";
import {OpLinks} from "../../admin/components/home/home";
import {ActivityInfo} from "../../../model/ActivityInfo";
import {RoundInfo} from "../../../model/RoundInfo";
import {CommandId} from "../../../event/Command";
import {CountDownPanel} from "./CountDownPanel";
import {ActivityRender} from "../render/ActivityRender";
import {PlayerInfo} from "../../../model/PlayerInfo";
import {Modaler} from "../../admin/components/modal/modal";
@Component({
    template: require('./activity-panel.html'),
    components: {OpLinks, Modaler},
    props: {
        op: {
            type: Boolean,
            required: true,
            default: false
        },
        activityOptionArr: {
            type: Array,
            required: true,
            default: [
                {
                    text: 'test',
                    value: 1
                },
                {
                    text: '六月天空',
                    value: 2
                }
            ]
        },
        activitySelected: {},
        roundOptionArr: {
            type: Array,
            required: true,
            default: []
        },
        roundSelected: {},
        gameOptionArr: {
            type: Array,
            required: true,
            default: []
        },
        gameSelected: {},
        cdText: {type: String, default: '下一场比赛：'},
        cdSec: {type: Number, default: 300},
        isOpen: {type: Boolean, default: false}
    }
})
export class ActivityPanelView extends BasePanelView {
    rankRender:RankRender;
    countDownRender:CountDownPanel;
    activityRender:ActivityRender;

    activitySelected:number;

    roundOptionArr:any;
    roundSelected:number;

    gameOptionArr:any;
    gameSelected:number;

    activityMap:any;
    gameMap:any;

    activityInfoMap:any;

    cdText:string;
    cdSec:number;
    isOpen:boolean;

    ready() {
        var io = super.ready(PanelId.actPanel);
        io
            .on(`${CommandId.fadeInRankPanel}`, (param)=> {
                console.log(param);
                var playerDocArr = param.playerDocArr;
                var newPlayerArr = [];
                var a = [];
                for (var i = 0; i < playerDocArr.length; i++) {
                    var playerInfo = new PlayerInfo(playerDocArr[i]);
                    if (playerInfo.gameCount() < 3) {
                        newPlayerArr.push(playerDocArr[i]);
                    }
                    else
                        a.push(playerDocArr[i]);
                }
                this.rankRender.isCurRank = true;
                this.rankRender.fadeInRank(a.concat(newPlayerArr));
            })

            .on(`${CommandId.fadeInNextRank}`, (param)=> {
                this.rankRender.nextPage();
            })
            .on(`${CommandId.fadeOutRankPanel}`, (param)=> {
                console.log(param);
                this.rankRender.fadeOut();
            })

            .on(`${CommandId.fadeInCountDown}`, (param)=> {
                var cdSec = param.cdSec;
                var cdText = param.cdText;
                this.countDownRender.fadeInCountDown(cdSec, cdText);
            })

            .on(`${CommandId.fadeOutCountDown}`, (param)=> {
                this.countDownRender.fadeOut();
            })

            .on(`${CommandId.fadeInActivityPanel}`, (param)=> {
                var gameDocArr = param.gameDocArr;
                this.activityRender.fadeIn(gameDocArr);
                console.log('fade in activity panel ', gameDocArr);
            })
            .on(`${CommandId.fadeInNextActivity}`, (param)=> {
                this.activityRender.nextPage();
            })
            .on(`${CommandId.fadeInActivityExGame}`, (param)=> {
                var gameDocArr = param.gameDocArr;
                var roundId = this.roundSelected;
                for (var gameDoc of gameDocArr) {
                    this.gameOptionArr.push({text: `game id:${gameDoc.id}`, value: gameDoc.id});
                }
                this.selActivityInfo.addGame(gameDocArr, roundId);
                console.log('fade in ex game:', gameDocArr, this.selActivityInfo);
                this.activityRender.fadeIn(gameDocArr);
            })
            .on(`${CommandId.fadeOutActivityPanel}`, (param)=> {
                this.activityRender.fadeOut();
            });

        if (this.op) {
            this.post('/db/act/combine', function (param) {
                console.log('/db/act/combine', param);
                this.activityMap = param.activityMap;
                this.gameMap = param.gameMap;
                this.activityInfoMap = {};
            })
        }
        this.initActivity()
    }

    initActivity() {
        this.rankRender = new RankRender(this);
        this.countDownRender = new CountDownPanel(this);
        this.activityRender = new ActivityRender(this);
    }

    onActivitySelected() {
        console.log('onActivitySelected', this.activitySelected);
        if (!this.activityInfoMap[this.activitySelected]) {
            this.activityInfoMap[this.activitySelected] = ActivityInfo.build(this.activitySelected,
                this.activityMap, this.gameMap);
        }
        var selActivityInfo:ActivityInfo = this.activityInfoMap[this.activitySelected];
        console.log("activityInfo", selActivityInfo);
        this.roundOptionArr = [];
        for (var i = 0; i < selActivityInfo.roundInfoArr.length; i++) {
            var roundInfo:RoundInfo = selActivityInfo.roundInfoArr[i];
            this.roundOptionArr.push({text: `第${roundInfo.id}轮`, value: roundInfo.id});
            console.log(`第${roundInfo.id}轮`);
        }
    }

    onRoundSelected() {
        console.log('onRoundSelected');
        var selRoundInfo:RoundInfo = this.selActivityInfo.getRoundInfoById(this.roundSelected);
        this.gameOptionArr = [];
        for (var i = 0; i < selRoundInfo.gameInfoArr.length; i++) {
            var gameDoc:any = selRoundInfo.gameInfoArr[i];
            this.gameOptionArr.push({text: `game id:${gameDoc.id}`, value: gameDoc.id});
        }
    }

    onGameSelected() {
        var selActivityInfo:ActivityInfo = this.activityInfoMap[this.activitySelected];
        var selGameInfo = selActivityInfo.getGameInfoById(this.gameSelected, this.roundSelected);
    }

    onStartGame() {
        var selActivityInfo:ActivityInfo = this.activityInfoMap[this.activitySelected];
        var selGameInfo = selActivityInfo.getGameInfoById(this.gameSelected, this.roundSelected);
        console.log('onStartGame', selGameInfo);
        this.opReq(`${CommandId.cs_startGame}`,
            {gameId: selGameInfo.id, activityId: this.activitySelected, gameData: selGameInfo},
            (param)=> {
                if (param.isFinish)
                    alert("比赛已完结");
                else {
                    alert("比赛开始");
                }
                console.log(param);
            })
    }

    onDeleteOk() {
        console.log('onDeleteOk');
        this.isOpen = false;
    }

    onDeleteGame() {
        console.log('onDeleteGame');
        $("#delDialog").appendTo("body");
        this.isOpen = true;
    }

    onResetGame() {
        var selActivityInfo:ActivityInfo = this.activityInfoMap[this.activitySelected];
        var selGameInfo = selActivityInfo.getGameInfoById(this.gameSelected, this.roundSelected);
        console.log('onResetGame', selGameInfo);
        this.opReq(`${CommandId.cs_restartGame}`,
            {gameId: selGameInfo.id},
            (param)=> {
                console.log(param);
            })
    }

    get curActivityPlayerIdArr() {
        var selActivityInfo:ActivityInfo = this.activityInfoMap[this.activitySelected];
        return selActivityInfo.getActivityPlayerIdArr();
        // console.log(playerInfoArr);
        // var playerIdArr:number[] = [];
        // for (var i = 0; i < playerInfoArr.length; i++) {
        //     var playerInfo = playerInfoArr[i];
        //     playerIdArr.push(playerInfo.id);
        // }
        // return playerIdArr;
    }

    get selGameDoc():any {
        var selActivityInfo:ActivityInfo = this.activityInfoMap[this.activitySelected];
        return selActivityInfo.getGameInfoById(this.gameSelected, this.roundSelected);
    }

    get selActivityInfo():ActivityInfo {
        return this.activityInfoMap[this.activitySelected];
    }


    onRankIn() {
        console.log('onRankIn', this.selGameDoc);
        var playerIdArr = this.curActivityPlayerIdArr;
        if (playerIdArr.length) {
            this.opReq(`${CommandId.cs_fadeInRankPanel}`,
                {playerIdArr: playerIdArr},
                (param)=> {
                    console.log(param);
                });
        }
        else {
            alert('没有选择比赛');
        }
    }

    onRankNext() {
        this.opReq(`${CommandId.cs_fadeInNextRank}`);

    }

    onRankOut() {
        console.log('onRankOut');
        this.opReq(`${CommandId.cs_fadeOutRankPanel}`);
    }

    onCountDownIn() {
        console.log('onCountDownIn');
        this.opReq(`${CommandId.cs_fadeInCountDown}`,
            {cdSec: this.cdSec, cdText: this.cdText},
            (param)=> {
                console.log(param);
            });
    }

    onCountDownOut() {
        console.log('onCountDownOut');
        this.opReq(`${CommandId.cs_fadeOutCountDown}`);
    }

    onActivityNextIn() {
        this.opReq(`${CommandId.cs_fadeInNextActivity}`);
    }

    onActivityIn() {
        var selActivityInfo = this.selActivityInfo;
        if (selActivityInfo) {
            var gameIdArr = this.selActivityInfo.getGameIdArr();
            console.log('onActivityIn', gameIdArr);
            this.opReq(`${CommandId.cs_fadeInActivityPanel}`,
                {gameIdArr: gameIdArr});
        }
        else {
            alert(`无效赛程 id${this.activitySelected}`);
        }
    }

    onActivityInExGameIn() {
        var selActivityInfo = this.selActivityInfo;
        if (selActivityInfo && this.roundSelected) {
            var gameIdArr = this.selActivityInfo.getGameIdArr();
            console.log('onActivityInExGameIn', gameIdArr, this.roundSelected);
            this.opReq(`${CommandId.cs_fadeInActivityExGame}`,
                {
                    gameIdArr: gameIdArr,
                    activityId: this.activitySelected,
                    roundId: this.roundSelected
                });
        }
        else {
            alert(`无效赛程 activityId:${this.activitySelected} roundId:${this.roundSelected}`);
        }
    }

    onActivityOut() {
        console.log('onActivityOut');
        this.opReq(`${CommandId.cs_fadeOutActivityPanel}`);
    }
}
