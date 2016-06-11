import {CommandId} from "../../../event/Command";
import Component from "vue-class-component";
import {BasePanelView} from "../BasePanelView";

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
    ready() {
        var io = super.ready();
        io.on(`${CommandId.initPanel}`, function (data) {
            console.log(`${CommandId.initPanel}`, data);
        });
        var bg = new createjs.Shape();
        bg.graphics.beginFill("#333")
            .drawRect(0, 0, this.stageWidth, this.stageHeight)
        this.ctn.addChild(bg);
    }

    onToggleTimer() {
        console.log('onToggleTimer');
    }
    onResetTimer() {
        console.log('onResetTimer');
    }
    onAddLeftScore() {
        console.log('onAddLeftScore');
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