/// <reference path="./BaseInfo.ts"/>
import {BaseInfo, obj2Class, prop} from "./BaseInfo";
class PlayerDoc {
    id:number = 0;
    name:string = '';
    phone:number = 0;
    eloScore:number = 0;
    style:number = 0;//风林火山 1 2 3 4
    avatar:string = "";
    height:number = 0;
    weight:number = 0;
    dtScore:number = 0;//最近一场天梯分变化
    winpercent:number = 0;//  胜率  100/100.0%
    activityId:number = 0;//赛事id
    gameRec:Array<number> = [];//比赛记录
    // gameCount:number = 0;//场数
    loseGameCount:number = 0;
    winGameCount:number = 0;
}
export class PlayerInfo extends BaseInfo {
    playerData:PlayerDoc = new PlayerDoc();
    pos:number;
    isRed:Boolean = true;
    isMvp:Boolean = false;
    backNumber:number;//当场球衣号码 

    constructor(playerData?:any) {
        super();
        if (playerData) {
            if (playerData['playerData'] != null)//playerInfo data
            {
                this.playerData = obj2Class(playerData.playerData, PlayerDoc);
                this.setPlayerInfoFromData(playerData);
            }
            else {//playerData with isRed isMvp etc.
                this.playerData = obj2Class(playerData, PlayerDoc);
                this.setPlayerInfoFromData(playerData);
            }
        }
    }

    setPlayerInfoFromData(data:any) {
        if (data['isRed'] != null)
            this.isRed = data.isRed;
        if (data['isMvp'] != null)
            this.isMvp = data.isMvp;
        if (data['backNumber'] != null)
            this.backNumber = data.backNumber;
    }

    getPlayerData() {
        this.playerData['isRed'] = this.isRed;
        this.playerData['isMvp'] = this.isMvp;
        this.playerData['backNumber'] = this.backNumber;
        return this.playerData;
    }

    id(val?:any) {
        return prop(this.playerData, "id", val);
    }

    phone(val?:any) {
        return prop(this.playerData, "phone", val);
    }

    name(val?:any) {
        return prop(this.playerData, "name", val);
    }

    activityId(val?:any) {
        return prop(this.playerData, "activityId", val);
    }

    eloScore(val?:any) {
        return prop(this.playerData, "eloScore", val);
    }

    dtScore(val?:any) {
        return prop(this.playerData, "dtScore", val);
    }

    style(val?:any) {
        return prop(this.playerData, "style", val);
    }

    avatar(val?:any) {
        return prop(this.playerData, "avatar", val);
    }

    gameRec(val?:any) {
        return prop(this.playerData, "gameRec", val);
    }

    winpercent(val?:any) {
        return prop(this.playerData, "winpercent", val);
    }

    gameCount(val?:any) {
        return this.loseGameCount() + this.winGameCount();
    }

    winGameCount(val?:any) {
        return prop(this.playerData, "winGameCount", val);
    }

    loseGameCount(val?:any) {
        return prop(this.playerData, "loseGameCount", val);
    }

    getWinPercent() {
        return (this.winpercent() * 100).toFixed(1) + "%";
    }

    static getStyleIcon(style:number) {
        var path = '/img/panel/stage/';
        if (style === 1) {
            path += 'feng.png'
        }
        else if (style === 2) {
            path += 'huo.png'
        }
        else if (style === 3) {
            path += 'shan.png'
        }
        else if (style === 4) {
            path += 'lin.png'
        }
        return path
    }

    getWinStyleIcon() {
        var path = '/img/panel/';
        if (this.style() == 1) {
            path += 'fengWin.png'
        }
        else if (this.style() == 2) {
            path += 'huoWin.png'
        }
        else if (this.style() == 3) {
            path += 'shanWin.png'
        }
        else if (this.style() == 4) {
            path += 'linWin.png'
        }
        return path
    }

    getRec() {
        return {id: this.id(), eloScore: this.eloScore(), dtScore: this.dtScore()};
    }

    saveScore(dtScore:number, isWin:Boolean) {
        this.dtScore(dtScore);
        this.eloScore(this.eloScore() + dtScore);
        // this.ret.push({score: this.eloScore, isWin: isWin});
        if (isWin) {
            this.winGameCount(this.winGameCount() + 1);
        }
        else
            this.loseGameCount(this.loseGameCount() + 1);
        this.gameCount(this.gameCount() + 1);
        this.winpercent(this.getCurWinningPercent());
    }

    getCurWinningPercent():number {
        return this.winGameCount() / (this.loseGameCount() + this.winGameCount());
    }
}
