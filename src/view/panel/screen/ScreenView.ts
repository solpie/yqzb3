import {BasePanelView} from "../BasePanelView";
import Component from "vue-class-component";
import {PanelId} from "../../../event/Const";
import {CommandId} from "../../../event/Command";
import {BigScorePanel} from "./BigScorePanel";
import {GameInfo} from "../../../model/GameInfo";
@Component({
    template: require('./screen.html')
})
export class ScreenView extends BasePanelView {
    bigScorePanel:BigScorePanel;

    ready() {
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

    }

    initScreen() {
        this.bigScorePanel = new BigScorePanel(this);
    }

    setGameInfo(gameInfo:GameInfo) {
        this.bigScorePanel.setLeftScore(gameInfo.leftScore);
        this.bigScorePanel.setRightScore(gameInfo.rightScore);

        this.bigScorePanel.setRightFoul(gameInfo.rightFoul);
        this.bigScorePanel.setLeftFoul(gameInfo.leftFoul);
    }

}