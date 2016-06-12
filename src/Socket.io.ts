import {StagePanelHandle} from "./router/StagePanelHandle";
export class SocketIOSrv {
    constructor() {
        var io = require('socket.io')(6969);
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

