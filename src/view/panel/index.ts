import {PanelId} from "../../event/Const";
import {StagePanelView} from "./StagePanelView";
declare var io:any;
class Panel {
    constructor(pid:string) {
        console.log("init panel!!!");
        var panel = io.connect(`ws://192.168.1.73:6969/${pid}`);
        var mapView:any = {};
        mapView[PanelId.stagePanel] = StagePanelView;
        new mapView[pid](panel);

        // stage.on('connect', function () {
        //     console.log("connect");
        //     stage.emit('hi!');
        // });
        //
        // news.on('news', function (data) {
        //     console.log(data);
        //     news.emit('woot');
        // });

        // socket.on('disconnect', function () {
        //     io.emit('user disconnected');
        // });
    }
}
new Panel(PanelId.stagePanel);