import {App} from "./app";
import {Home} from "./components/home/home";
import {Settings} from "./components/settings/settings";
import {Player} from "./components/player/player";
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
        '/rank': {
            component: Player,
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
