import {CommandId} from "../../../event/Command";
import Component from "vue-class-component";

import Socket = SocketIO.Socket;
@Component({
    template: require('./stage-op.html')
})
export class StagePanelView {
    // constructor(panel:Socket, op:boolean) {
    //     console.log("StagePanelView");
    //     panel.on(`${CommandId.initPanel}`, function (data) {
    //         console.log("on Res init ", data);
    //     });
    // }
    ready(){
        console.log("StagePanelView");
    }
}