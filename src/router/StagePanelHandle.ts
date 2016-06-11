import Server = SocketIO.Server;
import {CommandId} from "../event/Command";
import {PanelId} from "../event/Const";
import Socket = SocketIO.Socket;
export class StagePanelHandle {
    io:Server;

    constructor(io:Server) {
        console.log('StagePanelHandle!!');
        this.io = io;
        io.of(`/${ PanelId.stagePanel}`)
            .on("connect", function (socket:Socket) {
                console.log('connected');
                socket.emit(`${CommandId.initPanel}`, {initInfo: ''});
            })
            .on('disconnect', function (socket:Socket) {
                console.log('disconnect');
            });
    }


}