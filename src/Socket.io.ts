import {StagePanelHandle} from "./router/StagePanelHandle";
import {ServerConf} from "./Env";
export class SocketIOSrv {
    constructor() {
        var io = require('socket.io')(ServerConf.wsPort);
        var stage = new StagePanelHandle(io);

        var news = io
            .of('/news')
            .on('connection', function (socket) {
                socket.emit('item', {news: 'item'});
            });
    }
}

//for refactor
export function ScParam(param) {
    return param
}

