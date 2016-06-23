import {PanelId} from "../event/Const";
import {ServerConf} from "../Env";
import {CommandId} from "../event/Command";
import {ScParam} from "../SocketIOSrv";
import Socket = SocketIO.Socket;

class ScreenInfo {
    blueScore:number;
    redScore:number;
}
export class ScreenPanelHandle {
    io:any;
    screenInfo:ScreenInfo;

    constructor(io) {
        this.io = io.of(`/${PanelId.screenPanel}`);
        this.io
            .on("connect", (socket:Socket) => {
                socket.emit(`${CommandId.initPanel}`, ScParam({screenInfo: this.screenInfo, isDev: ServerConf.isDev}));
            })
    }


}