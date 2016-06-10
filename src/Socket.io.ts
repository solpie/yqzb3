import {PanelId}  from './event/Const'
export class SocketIOSrv {
    constructor() {
        var io = require('socket.io')(6969);
        var stage = io
            .of('/' + PanelId.stage)
            .on('connection', function (socket) {
                socket.emit('a message', {
                    that: 'only'
                    , '/chat': 'will get'
                });
                stage.emit('a message', {
                    everyone: 'in'
                    , '/chat': 'will get'
                });
            });

        var news = io
            .of('/news')
            .on('connection', function (socket) {
                socket.emit('item', { news: 'item' });
            });
    }
}