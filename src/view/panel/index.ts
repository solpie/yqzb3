import {PanelId} from "../../event/Const";
import {StagePanelView} from "./stage/StagePanelView";
import {VueEx} from "../VueEx";
declare var io:any;
import Component from "vue-class-component";

@Component(null)
class Panel extends VueEx {
    // constructor(pid:string, op:boolean) {
    //     super();
    //     console.log("init panel!!!");
    //     var panel = io.connect(`ws://192.168.1.73:6969/${pid}`);
    //     var mapView:any = {};
    //     mapView[PanelId.stagePanel] = StagePanelView;
    //     new mapView[pid](panel, op);
    //
    //     // stage.on('connect', function () {
    //     //     console.log("connect");
    //     //     stage.emit('hi!');
    //     // });
    //     //
    //     // news.on('news', function (data) {
    //     //     console.log(data);
    //     //     news.emit('woot');
    //     // });
    //
    //     // socket.on('disconnect', function () {
    //     //     io.emit('user disconnected');
    //     // });
    // }
    ready(){
        console.log('init panel~~~');
    }
}




//router

import Vue = require('vue');
Vue.use(require('vue-resource'));

import VueRouter = require('vue-router');
import ComponentOption = vuejs.ComponentOption;
Vue.use(VueRouter);

const router = new VueRouter<Panel>();

function configureRouter(router:vuejs.Router<Panel>) {
    router.map({
        '/': {
            component: StagePanelView,
            name: 'index'
        },
        '/stage': {
            component: StagePanelView,
            name: 'stage'
        }
    });
}
configureRouter(router);
router.start(Panel, '#panel');
console.log('start router');