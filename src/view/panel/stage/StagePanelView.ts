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
    }
}