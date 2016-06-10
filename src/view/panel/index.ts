declare var io:any;
class Panel {
    constructor() {
        console.log("init panel!!!");
        var stage = io.connect('ws://192.168.1.73:6969/stage')
            , news = io.connect('ws://192.168.1.73:6969/news');

        stage.on('connect', function () {
            console.log("connect");
            stage.emit('hi!');
        });

        news.on('news', function (data) {
            console.log(data);
            news.emit('woot');
        });

        // socket.on('disconnect', function () {
        //     io.emit('user disconnected');
        // });
    }
}
new Panel();