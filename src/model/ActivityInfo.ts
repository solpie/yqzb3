import {RoundInfo} from "./RoundInfo";
import {BaseDoc} from "./BaseInfo";
export class ActivityDoc extends BaseDoc {
    id: number = -1
    playerIdArr: number[] = [];//16 
    gameIdArr: number[] = [];
    date: number = -1;
}
export class ActivityInfo {
    activityDoc: ActivityDoc;
    id: number;
    roundInfoArr: RoundInfo[];

    constructor() {
        this.roundInfoArr = [];
        this.activityDoc = new ActivityDoc();
    }

    getRoundInfoById(id) {
        for (var roundInfo of this.roundInfoArr) {
            if (roundInfo.id === id)
                return roundInfo;
        }
        return null;
    }

    getGameInfoById(gameId, roundId) {
        var roundInfo = this.getRoundInfoById(roundId);
        if (roundInfo)
            return roundInfo.getGameInfoById(gameId);
        return null;
    }


    setPlayerIdArr(playerIdArr: number[]) {
        this.activityDoc.playerIdArr = playerIdArr.concat();
    }
    /*
        完全高低分组队 （高分和高分组队）
    */
    createGameInHighLowMode() {

    }
    /*
     混合分组
    */
    createGameInMixMode() {

    }

    static build(activityId, activityMap, gameMap) {
        var activityMap = activityMap;
        var gameMap = gameMap;
        var reBuildGameDataArr = [];
        var actInfo = new ActivityInfo();
        for (var key in activityMap) {
            var roundData = activityMap[key];
            if (roundData.activityId == activityId) {
                for (var gameData of roundData.gameDataArr) {
                    var gameDataInMap = gameMap[gameData.id];
                    if (gameDataInMap) {
                        reBuildGameDataArr.push(gameDataInMap);
                    }
                    else {
                        reBuildGameDataArr.push(gameData)
                    }
                }
                roundData.gameDataArr = reBuildGameDataArr;

                var roundInfo: RoundInfo = new RoundInfo();
                roundInfo.gameInfoArr = reBuildGameDataArr;
                roundInfo.id = roundData.round;
                roundInfo.section = roundData.section;
                actInfo.roundInfoArr.push(roundInfo);
            }
        }
        return actInfo;
    }
}