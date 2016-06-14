import {BasePanelView} from "../BasePanelView";
import {PanelId} from "../../../event/Const";
import Component from "vue-class-component";
import {RankRender} from "../render/RankRender";
import {OpLinks} from "../../admin/components/home/home";
import {ActivityInfo} from "../../../model/ActivityInfo";
import {RoundInfo} from "../../../model/RoundInfo";
import {CommandId} from "../../../event/Command";
@Component({
    template: require('./activity-panel.html'),
    components: {OpLinks},
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
    }
})
export class ActivityPanelView extends BasePanelView {
    rankRender:RankRender;
    activitySelected:number;

    roundOptionArr:any;
    roundSelected:number;

    gameOptionArr:any;
    gameSelected:number;

    activityMap:any;
    gameMap:any;

    activityInfoMap:any;

    ready() {
        var io = super.ready(PanelId.actPanel);
        io.on(`${CommandId.fadeInRankPanel}`, (param)=> {
            console.log(param);
            this.rankRender.fadeInRank(param.playerDocArr);
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
        var selActivityInfo:ActivityInfo = this.activityInfoMap[this.activitySelected];
        var selRoundInfo:RoundInfo = selActivityInfo.getRoundInfoById(this.roundSelected);
        this.gameOptionArr = [];
        for (var i = 0; i < selRoundInfo.gameInfoArr.length; i++) {
            var gameData:any = selRoundInfo.gameInfoArr[i];
            this.gameOptionArr.push({text: `game id:${gameData.id}`, value: gameData.id});
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

    get selGameDoc():any {
        var selActivityInfo:ActivityInfo = this.activityInfoMap[this.activitySelected];
        return selActivityInfo.getGameInfoById(this.gameSelected, this.roundSelected);
    }

    onRankIn() {
        console.log('onRankIn', this.selGameDoc);
        // var playerIdArr = [];
        // for (var i = 0; i < this.selGameDoc.playerIdArr.length; i++) {
        //     var playerInfo = this.selGameDoc.playerIdArr[i];
        //     playerIdArr.push(playerInfo.playerData.id);
        // }
        this.opReq(`${CommandId.cs_fadeInRankPanel}`,
            {playerIdArr: this.selGameDoc.playerIdArr},
            (param)=> {
                console.log(param);
            })
    }

    onRankOut() {
        console.log('onRankOut')
    }

    onActivityIn() {
        console.log('onActivityIn')

    }

    onActivityOut() {
        console.log('onActivityOut')
    }
}
