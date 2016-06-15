import {VueEx, Component} from "../../../VueEx";
var _this_:ExternalData;
@Component({
    template: require('./external-data.html'),
    props: {
        playerId: {
            type: Number
        }
    }
})
export class ExternalData extends VueEx {
    playerId:number;

    ready() {
        _this_ = this;

        // this.importDataFromHT();
        this.post('/db/external/player', function (param) {
            var playerInfoMap = param.playerInfoMap;
            console.log('playerInfo map', playerInfoMap);
        })
    }

    importDataFromHT() {
        this.post('/db/external', (res)=> {
            console.log(res);
        })
    }
}