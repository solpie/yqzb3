import {CommandId} from "../../event/Command";
import Socket = SocketIO.Socket;
export class StagePanelView {
    constructor(panel:Socket) {
        console.log("StagePanelView");
        panel.on(`${CommandId.initPanel}`, function (data) {
            console.log("on Res init ", data);
        });
    }
}