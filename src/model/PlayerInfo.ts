/// <reference path="./BaseInfo.ts"/>
import {BaseInfo, obj2Class, prop} from "./BaseInfo";
export class PlayerDoc {
    id:number = 0;
    name:string = '';//昵称
    realName:string = '';
    phone:number = 0;
    eloScore:number = 0;//天梯分
    style:number = 0;//风林火山 1 2 3 4
    avatar:string = "";
    height:number = 0;//身高
    weight:number = 0;//体重
    dtScore:number = 0;//最近一场天梯分变化
    activityId:number = 0;//赛事id
    gameRec:Array<number> = [];//比赛记录
    loseGameCount:number = 0;//输场
    winGameCount:number = 0;//胜场
    size:string;//衣服尺寸
    backNumber:number = 0;//当场球衣号码
}
export class PlayerInfo extends BaseInfo {
    playerData:PlayerDoc = new PlayerDoc();
    pos:number;
    isRed:boolean = true;
    isBlue:boolean;
    isMvp:boolean = false;
    // backNumber:number = 0;//当场球衣号码

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
            this.playerData.backNumber = data.backNumber;
    }

    getPlayerData() {
        this.playerData['isRed'] = this.isRed;
        this.playerData['isMvp'] = this.isMvp;
        // this.playerData['backNumber'] = this.backNumber;
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

    backNumber(val?:any) {
        return prop(this.playerData, "backNumber", val);
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

    static winPercent(playerDoc) {
        var p = playerDoc.winGameCount / PlayerInfo.gameCount(playerDoc);
        if (!p)p = 0;
        return p;
    }

    static winPercentStr(playerDoc) {
        return (PlayerInfo.winPercent(playerDoc) * 100).toFixed(1) + "%"
    }

    static sections = [
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

    static section(playerDoc) {
        var sections = PlayerInfo.sections;
        for (var j = 0; j < sections.length; j++) {
            var sobj = sections[j];
            if (playerDoc.eloScore > sobj[0]) {
                playerDoc.section = sobj[1];
                break;
            }
            else//D-
                playerDoc.section = sobj[1];
        }
    }

    static setStyleFromStr(playerDoc, str:string) {
        if (str == '风')
            playerDoc.style = 1;
        else if (str == '林')
            playerDoc.style = 2;
        else if (str == '火')
            playerDoc.style = 3;
        else if (str == '山')
            playerDoc.style = 4;
    }

    winpercent(val?:any) {
        return this.winGameCount() / this.gameCount();
    }

    static gameCount(playerDoc) {
        return (playerDoc.loseGameCount + playerDoc.winGameCount) || 0;
    }

    gameCount() {
        return this.loseGameCount() + this.winGameCount();
    }

    winGameCount(val?:any) {
        return prop(this.playerData, "winGameCount", val);
    }

    loseGameCount(val?:any) {
        return prop(this.playerData, "loseGameCount", val);
    }

    getWinPercent():string {
        return (this.winpercent() * 100).toFixed(1) + "%";
    }

    static getStyleIcon(style:number) {
        var path = '/img/panel/stage/';
        if (style === 1) {
            path += 'feng.png'
        }
        else if (style === 2) {
            path += 'lin.png'
        }
        else if (style === 3) {
            path += 'huo.png'
        }
        else if (style === 4) {
            path += 'shan.png'
        }
        return path;
        // var path = '/img/panel/stage/';
        // if (style === 1) {
        //     path += 'feng.png'
        // }
        // else if (style === 2) {
        //     path += 'huo.png'
        // }
        // else if (style === 3) {
        //     path += 'shan.png'
        // }
        // else if (style === 4) {
        //     path += 'lin.png'
        // }
        // return path
    }

    getWinStyleIcon() {
        var path = '/img/panel/stage/win/';
        if (this.style() == 1) {
            path += 'fengWin.png'
        }
        else if (this.style() == 2) {
            path += 'linWin.png'
        }
        else if (this.style() == 3) {
            path += 'huoWin.png'
        }
        else if (this.style() == 4) {
            path += 'shanWin.png'
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
        // this.gameCount(this.gameCount() + 1);
        // this.winpercent(this.getCurWinningPercent());
    }

    getCurWinningPercent():number {
        return this.winGameCount() / (this.loseGameCount() + this.winGameCount());
    }
}
