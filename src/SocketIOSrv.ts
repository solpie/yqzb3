import {StagePanelHandle} from "./router/StagePanelHandle";
import {ServerConf} from "./Env";
import {ActivityPanelHandle} from "./router/ActivityPanelHandle";
export var stagePanelHandle;
export class SocketIOSrv {
    constructor() {
        var io = require('socket.io')(ServerConf.wsPort);
        stagePanelHandle = new StagePanelHandle(io);
        var activityPanelHandle = new ActivityPanelHandle(io);
        // var news = io
        //     .of('/news')
        //     .on('connection', function (socket) {
        //         socket.emit('item', {news: 'item'});
        //     });
    }
}

//for refactor
export function ScParam(param) {
    return param
}

