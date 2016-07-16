import {VueEx, Component} from "../../../VueEx";


@Component({
    template: require('./starting-line.html')
})
export class StartingLine extends VueEx {
    $els:{
        StartingLine:HTMLElement
    };
    ready() {

    }
}