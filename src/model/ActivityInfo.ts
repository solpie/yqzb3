import {RoundInfo} from "./RoundInfo";
export class ActivityInfo {
    id:number;
    roundInfoArr:RoundInfo[];

    constructor() {
        this.roundInfoArr = [];
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

                var roundInfo:RoundInfo = new RoundInfo();
                roundInfo.gameInfoArr = reBuildGameDataArr;
                roundInfo.id = roundData.round;
                roundInfo.section = roundData.section;
                actInfo.roundInfoArr.push(roundInfo);
            }
        }
        return actInfo;
    }
}