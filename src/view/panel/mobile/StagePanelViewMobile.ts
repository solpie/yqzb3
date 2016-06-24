import {StagePanelView} from "../stage/StagePanelView";
import Component from "vue-class-component";
import {PanelId} from "../../../event/Const";
@Component({
    template: require('./stage-panel-mobile.html'),
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
export class StagePanelViewMobile extends StagePanelView{
    ready() {
        var io = super.ready(PanelId.stagePanel,false);
    }
}