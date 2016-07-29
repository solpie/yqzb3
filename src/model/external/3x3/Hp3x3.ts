import {BaseXLSX} from "../BaseXLSX";
import {PlayerInfo} from "../../PlayerInfo";
import {EloConf} from "../../../utils/EloUtil";
import {Team, XLSX} from "../ExternalInfo";
import {_path} from "../../../Env";
import {db} from "../../DbInfo";
import {mapToArr} from "../../../utils/JsFunc";
class Hp3x3PlayerXLSX extends BaseXLSX {
    playerInfo:PlayerInfo;
    teamId:string;
    city:string;

    constructor(sheet, row) {
        super(sheet, row);
        if (!this.isEmpty) {
            if (this.col('D') && this.col('E')) {
                this.teamId = this.col('A').v.toString();
                // this.city = this.col('B').v;
                var id = this.col('C').v;
                var userName = this.col('D').v;
                var phone = this.col('E').v;
                this.playerInfo = new PlayerInfo();
                this.playerInfo.eloScore(EloConf.score);
                this.playerInfo.id(id);
                this.playerInfo.name(userName);
                this.playerInfo.phone(phone);
            }
            else {
                this.isFake = true;
                console.log('col D', this.col('D'));
            }
        }
    }

    static getData(xlsxPath) {
        var playerMap:any = {};

        var playerWB = XLSX.readFile(xlsxPath);
        var playerSheet = playerWB.Sheets['Sheet1'];
        // var playerXLSXArr:PlayerXLSX[] = [];
        var teamMap:any = {};

        var countPlayer = 0;
        for (var i = 2; ; i++) {
            var team_player:Hp3x3PlayerXLSX = new Hp3x3PlayerXLSX(playerSheet, i);
            if (!team_player.isEmpty) {
                if (team_player.isFake)
                    continue;

                if (!teamMap[team_player.teamId]) {
                    teamMap[team_player.teamId] = new Team();
                }
                var team:Team = teamMap[team_player.teamId];
                team.id = team_player.teamId;
                team.playerIdArr.push(team_player.playerInfo.phone());

                if (!playerMap[team_player.playerInfo.phone()])
                    playerMap[team_player.playerInfo.phone()] = team_player.playerInfo;
                if (!playerMap[team_player.playerInfo.phone()]) {
                    team.isFake = true;
                    console.warn(`no player map data ${team_player.playerInfo.phone()} ,teamId${team_player.teamId}`);
                }
                else {
                    team.playerInfoArr.push(playerMap[team_player.playerInfo.phone()]);
                }
                if (i < 10) {
                    console.log(team_player);
                }
                countPlayer++;
            }
            else
                break;
        }
        console.log('player count:', countPlayer);
        return [playerMap, teamMap];
    }
}
class Hp3x3GameXLSX extends BaseXLSX {
    gameId:string;
    date:number;
    homeTeamId:string;
    guestTeamId:string;
    homeTeamScore:number;
    guestTeamScore:number;
//
    id:string;

    constructor(sheet, row) {
        super(sheet, row);
        if (!this.isEmpty) {
            this.gameId = (this.col('A').v).toString();
            this.homeTeamId = this.col('B').v.toString();
            this.guestTeamId = this.col('C').v.toString();
            this.homeTeamScore = this.col('D').v;
            this.guestTeamScore = this.col('E').v;
            this.id = this.gameId;
        }
    }

    static getData(xlsxPath) {
        var gameWB = XLSX.readFile(xlsxPath);
        var gameSheet = gameWB.Sheets['Sheet1'];
        var gameXLSXArr:Hp3x3GameXLSX[] = [];
        for (var i = 2; ; i++) {
            var gameXLSX:Hp3x3GameXLSX = new Hp3x3GameXLSX(gameSheet, i);
            if (!gameXLSX.isEmpty) {
                gameXLSXArr.push(gameXLSX);
                if (i < 10) {
                    console.log(gameXLSX);
                }
                // if (i > 250) {
                //     console.log(gameXLSX);
                // }
            }
            else
                break;
        }
        console.log('game count:', gameXLSXArr.length);
        return gameXLSXArr;
    }
}
export class Hp3x3 {

    static  importXLSX() {
        var gameXLSXArr:Hp3x3GameXLSX[] = Hp3x3GameXLSX.getData(_path('app/db/xlsx/3x3/game.xlsx'));
        var a = Hp3x3PlayerXLSX.getData(_path('app/db/xlsx/3x3/team.xlsx'));
        var playerMap = a[0];
        var teamMap = a[1];

        var gameXLSXavailbleArr = [];
        for (var i = 0; i < gameXLSXArr.length; i++) {
            var gameXLSX:Hp3x3GameXLSX = gameXLSXArr[i];
            var homeTeam:Team = teamMap[gameXLSX.homeTeamId];
            var guestTeam:Team = teamMap[gameXLSX.guestTeamId];
            if (homeTeam && guestTeam) {
                if (gameXLSX.gameId == '300176') {
                    console.log('300176', homeTeam, guestTeam);
                }
                if (homeTeam.isFake || guestTeam.isFake) {
                    gameXLSX.isFake = true;
                    console.log('fake team');
                    continue;
                }

                // console.log("homeTeam", homeTeam, homeTeam.teamEloScore(), 'guestTeam', guestTeam, guestTeam.teamEloScore());
                if (gameXLSX.homeTeamScore > gameXLSX.guestTeamScore) {
                    homeTeam.beat(guestTeam, gameXLSX.gameId);
                }
                else
                    guestTeam.beat(homeTeam, gameXLSX.gameId);
                // console.log("homeTeam", homeTeam.teamEloScore(), 'guestTeam', guestTeam.teamEloScore());
                var gameDoc = {
                    id: gameXLSX.id,
                    date: gameXLSX.date,
                    homeTeamId: gameXLSX.homeTeamId,
                    guestTeamId: gameXLSX.guestTeamId,
                    homeTeamScore: gameXLSX.homeTeamScore,
                    guestTeamScore: gameXLSX.guestTeamScore,
                };
                gameXLSXavailbleArr.push(gameDoc);
            }
            else {
                gameXLSX.isFake = true;
                console.log('fake game', gameXLSX.gameId, 'home:', homeTeam, gameXLSX.homeTeamId, 'guest:', guestTeam, gameXLSX.guestTeamId);
            }
        }
        var playerDocArr = [];
        var playerInfoArr = mapToArr(playerMap);
        for (var i = 0; i < playerInfoArr.length; i++) {
            var playerInfo = playerInfoArr[i];
            playerDocArr.push(playerInfo.playerData);
        }
        db.playerHuiTi.ds().insert(playerDocArr);


        db.gameHuiTi.ds().insert(gameXLSXavailbleArr, function (err, doc) {
            console.log('hui ti data import complete!!');
        });
    }
}