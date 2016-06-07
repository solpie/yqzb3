import Component from "vue-class-component";
import {VueEx} from "../../../VueEx";

@Component({
    template: require('./profile.html'),
    props: {
        name: {
            type: String,
            default: ''
        },
        realName: {
            type: String,
            default: ""
        },
        phone: {
            type: Number,
        },
        qq: {
            type: Number,
        },
        height: {
            type: Number,
            default: 178
        },
        style: {
            type: Number,
            default: 1
        },
        weight: {
            type: Number,
            default: 70
        }
    }
})
export class Profile extends VueEx {
}
