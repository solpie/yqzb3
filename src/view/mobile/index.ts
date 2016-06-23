import {PanelId} from "../../event/Const";
import {VueEx} from "../VueEx";
import {OpLinks} from "../admin/components/home/home";

declare var io:any;
declare var pid:string;
declare var op:boolean;
declare var host:any;
declare var wsPort:any;
export class Mobile extends VueEx {
    pid:string;
    isOp:boolean;
    panel:any;

    connect() {
        var wsUrl = `http://${host}:${wsPort}/${this.pid}`;
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

var router = new VueRouter<Mobile>();

router.map({
    '/': {
        component: OpLinks,
        name: 'OpLinks'
    },
    // '/stage/:op': {
    //     component: StagePanelView,
    //     name: 'stage'
    // },
    // '/screen/:op': {
    //     component: ScreenView,
    // },
    // '/act/:op': {
    //     component: ActivityPanelView,
    //     name: 'act'
    // }
});
router.afterEach((transition) => {
    var toPath = transition.to.path;
    router.app.isOp = /\/op/.test(toPath);
    if (/\/stage/.test(toPath)) {
        router.app.pid = PanelId.stagePanel;
    } else if (/\/act/.test(toPath)) {
        router.app.pid = PanelId.actPanel;
    } else if (/\/screen/.test(toPath)) {
        router.app.pid = PanelId.screenPanel;
    }
    console.log('after each!!!', toPath);
});
router.start(Mobile, '#panel');
console.log('start router');
