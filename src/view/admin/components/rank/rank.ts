import {VueEx, Component} from "../../../VueEx";
import {mapToArr, descendingProp} from "../../../../utils/JsFunc";
@Component({
    template: require('./rank.html'),
    props: {
        playerDocArr: {
            type: Array
        }
    }
})
export class Rank extends VueEx {
    playerDocArr:any;
    ready() {
        console.log("rank");
        this.post('/db/player', {}, (data)=> {
            var playerMap = data.PlayerMap;
            this.playerDocArr  = mapToArr(playerMap).sort(descendingProp('eloScore'));
            // this.playerDocArr = rank;
        });
    }
}
