import {VueEx, Component} from "../../../VueEx";
import {mapToArr, descendingProp} from "../../../../utils/JsFunc";
import {PlayerInfo} from "../../../../model/PlayerInfo";
@Component({
    template: require('./rank.html'),
    props: {
        playerDocArr: {
            type: Array
        }
    }
})
export class Rank extends VueEx {
    playerDocArr:Array<any>;

    ready() {
        console.log("rank");
        this.post('/db/player', {}, (data)=> {
            var playerMap = data.PlayerMap;
            this.playerDocArr = mapToArr(playerMap).sort(descendingProp('eloScore'));
            for (var i = 0; i < this.playerDocArr.length; i++) {
                var playerDoc = this.playerDocArr[i];
                var s = playerDoc.eloScore;
                var sections = [
                    [2624, 'S+'],
                    [2528, 'S'],
                    [2448, 'S-'],
                    [2368, 'A+'],
                    [2288, 'A'],
                    [2224, 'A-'],
                    [2160, 'B+'],
                    [2096, 'B'],
                    [2048, 'B-'],
                    [2000, 'C+'],
                    [1968, 'C'],
                    [1936, 'C-'],
                    [1904, 'D+'],
                    [1888, 'D'],
                    [1872, 'D-']
                ];
                for (var j = 0; j < sections.length; j++) {
                    var sobj = sections[j];
                    if (s > sobj[0]) {
                        playerDoc.section = sobj[1];
                        break;
                    }
                }
            }
        });
    }

    onSortWinPercent() {
        console.log('onSortWinPercent');
    }

    onSortGameCount() {
        for (var p of this.playerDocArr) {
            p.gameCount = PlayerInfo.gameCount(p);
        }
        this.playerDocArr.sort(descendingProp('gameCount'));
        console.log('onSortGameCount');
    }
}
