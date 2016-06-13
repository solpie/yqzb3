import {BasePanelView} from "../BasePanelView";
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

}
