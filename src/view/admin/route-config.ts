import {App} from "./app";
import {Home} from "./components/home/home";
import {Settings} from "./components/settings/settings";
import {Player} from "./components/player/player";
import {Activity} from "./components/activity/activity";
import {Rank} from "./components/rank/rank";
export function configureRouter(router:vuejs.Router<App>) {
    router.map({
        '/': {
            component: Home,
            name: 'home'
        },
        '/player': {
            component: Player,
            name: 'player'
        },
        '/activity': {
            component: Activity,
            name: 'activity'
        },
        '/rank': {
            component: Rank,
            name: 'rank'
        },
        '/settings': {
            component: Settings,
            name: 'settings'
        }
    });

    router.afterEach((transition) => {
        router.app.active = transition.to.path.split("/")[1];
    });
}
