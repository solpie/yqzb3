import {VueEx, Component} from "../../../VueEx";
/**
* Activity
*/
@Component({
    template: require('./activity.html'),
})
export class Activity extends VueEx {
    ready() {
        console.log('Activity')

    }
}