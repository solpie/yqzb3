import {VueEx, Component} from "../../../VueEx";
/**
 * Activity
 */
var _this_:Activity;
@Component({
    template: require('./activity.html'),
    props: {
        playerId: {
            type: Number
        }
    },
    watch: {
        playerId: (val)=> {
            console.log('playerId:', val);
            _this_.post('/db/player/' + val, function (param) {
                if (param.playerDoc) {

                }
            })
        }
    }
})
export class Activity extends VueEx {
    playerId:number;

    ready() {
        _this_ = this;
        console.log('Activity')
    }

    onQueryPlayer(e) {
        console.log(e.target.value);
    }
}