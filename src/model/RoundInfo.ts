import {GameInfo} from "./GameInfo";
export class RoundInfo {
    static HIGH_SECTION:string = 'high';
    static LOW_SECTION:string = 'low';
    date:number;//比赛日
    gameInfoArr:Array<GameInfo>;
    roundId:number;
    curGameId:number;
    constructor() {
        this.gameInfoArr = [];
    }
}