import {VueEx, Component} from "../../VueEx";
@Component({
    template: require('./navbar.html'),
    props: {
        active: {
            type: String,
            default: ""
        }
    }
})
export class Navbar extends VueEx {
    public active:string
}
