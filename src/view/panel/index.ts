import {StagePanelView} from "./stage/StagePanelView";
import {ActivityPanelView} from "./act/ActivityPanelView";
import {PanelId} from "../../event/Const";
import {CommandId} from "../../event/Command";
import {VueEx} from "../VueEx";

declare var io: any;
declare var pid: string;
declare var op: boolean;
export class Panel extends VueEx {
    pid: string;
    isOp: boolean;
    panel: any;
    connect() {
        var wsUrl = `http://192.168.1.73:6969/${this.pid}`;
        console.log("init panel!!!", this.pid, this.isOp, wsUrl);
        return io.connect(wsUrl)
    }
}

//router

import Vue = require('vue');
Vue.use(require('vue-resource'));

import VueRouter = require('vue-router');
import ComponentOption = vuejs.ComponentOption;
Vue.use(VueRouter);

const router = new VueRouter<Panel>();

router.map({
    // '/': {
    //     component: StagePanelView,
    //     name: 'index'
    // },
    '/stage/:op': {
        component: StagePanelView,
        name: 'stage'
    },
    '/act/:op': {
        component: ActivityPanelView,
        name: 'act'
    }
});
router.afterEach((transition) => {
    var toPath = transition.to.path;
    router.app.isOp = /\/op/.test(toPath);
    if (/\/stage/.test(toPath)) {
        router.app.pid = PanelId.stagePanel;
    }
    console.log('after each!!!', toPath);
});
router.start(Panel, '#panel');
console.log('start router');