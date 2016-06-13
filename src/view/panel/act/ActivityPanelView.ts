import {BasePanelView} from "../BasePanelView";
import {PanelId, ViewEvent} from "../../../event/Const";

import Component from "vue-class-component";
@Component({
    template: require('./activity-panel.html'),
    props: {
        op: {
            type: Boolean,
            required: true,
            default: false
        }
    }
})
export class ActivityPanelView extends BasePanelView {
    ready() {
        var io = super.ready(PanelId.actPanel);
    }
}
