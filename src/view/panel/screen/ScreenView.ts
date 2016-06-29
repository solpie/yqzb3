import {BasePanelView} from "../BasePanelView";
import Component from "vue-class-component";
import {PanelId} from "../../../event/Const";
import {CommandId} from "../../../event/Command";
import {BigScorePanel} from "./BigScorePanel";
import {GameInfo} from "../../../model/GameInfo";
import {BaseScreen} from "./BaseScreen";
import {BigActivityPanel} from "./BigActivityPanel";
@Component({
    template: require('./screen.html')
})
export class ScreenView extends BasePanelView {
    bigScorePanel:BigScorePanel;
    activityPanel:BigActivityPanel;
    panelArr:BaseScreen[];

    ready() {
        this.panelArr = [];
        var io = super.ready(PanelId.screenPanel);
        this.initScreen();
        io
            .on(`${CommandId.initPanel}`, (data) => {
                console.log(`${CommandId.initPanel}`, data);
                this.setGameInfo(data.gameInfo);
                // ServerConf.isDev = data.isDev;
                // if (!this.isInit && this.isInitCanvas)
                //     this.initStage(data.gameInfo);
            })
            .on(`${CommandId.updateLeftFoul}`, (param)=> {
                this.bigScorePanel.setLeftFoul(param.leftFoul);
            })

            .on(`${CommandId.updateRightFoul}`, (param)=> {
                this.bigScorePanel.setRightFoul(param.rightFoul);
            })

            .on(`${CommandId.updateLeftScore}`, (param)=> {
                this.bigScorePanel.setLeftScore(param.leftScore);
            })

            .on(`${CommandId.updateRightScore}`, (param)=> {
                this.bigScorePanel.setRightScore(param.rightScore);
            })

            .on(`${CommandId.setGameComing}`, (param)=> {
                // this.activityPanel
                this.showOnly(this.activityPanel);
                this.activityPanel.fadeIn();
            })

    }

    initScreen() {
        this.bigScorePanel = new BigScorePanel(this);
        this.panelArr.push(this.bigScorePanel);
        this.activityPanel = new BigActivityPanel(this);
        this.panelArr.push(this.activityPanel);
    }

    showOnly(target:BaseScreen) {
        for (var panel of this.panelArr) {
            if (panel != target)
                panel.hide();
            else
                panel.show();
        }
    }

    setGameInfo(gameInfo:GameInfo) {
        this.bigScorePanel.setLeftScore(gameInfo.leftScore);
        this.bigScorePanel.setRightScore(gameInfo.rightScore);

        this.bigScorePanel.setRightFoul(gameInfo.rightFoul);
        this.bigScorePanel.setLeftFoul(gameInfo.leftFoul);
    }

}