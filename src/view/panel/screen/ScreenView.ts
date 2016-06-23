import {BasePanelView} from "../BasePanelView";
import Component from "vue-class-component";
import {PanelId} from "../../../event/Const";
import {CommandId} from "../../../event/Command";
import {BigScorePanel} from "./BigScorePanel";
@Component({
    template: require('./screen.html')
})
export class ScreenView extends BasePanelView {
    bigScorePanel:BigScorePanel;

    ready() {
        var io = super.ready(PanelId.screenPanel);
        io
            .on(`${CommandId.inScreenScore}`, (param)=> {
            })

        this.initScreen()
    }

    initScreen() {
        this.bigScorePanel = new BigScorePanel(this);
    }

}