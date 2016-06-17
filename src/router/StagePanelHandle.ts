import {CommandId} from "../event/Command";
import {PanelId, ViewEvent} from "../event/Const";
import {ServerConf} from "../Env";
import {panelRouter} from "./PanelRouter";
import {GameInfo} from "../model/GameInfo";
import {Response} from "express-serve-static-core";
import {Request} from "express";
import {ScParam} from "../SocketIOSrv";
import {db} from "../model/DbInfo";
import {TeamInfo} from "../model/TeamInfo";
import {PlayerInfo} from "../model/PlayerInfo";
import Server = SocketIO.Server;
import Socket = SocketIO.Socket;
export class StagePanelHandle {
    io:any;
    gameInfo:GameInfo;

    constructor(io:Server) {
        console.log('StagePanelHandle!!');
        this.gameInfo = new GameInfo();

        this.io = io.of(`/${ PanelId.stagePanel}`);
        this.io
            .on("connect", (socket:Socket)=> {
                socket.emit(`${CommandId.initPanel}`, ScParam({gameInfo: this.gameInfo, isDev: ServerConf.isDev}));
            })
            .on('disconnect', function (socket:Socket) {
                console.log('disconnect');
            });
        this.initOp();
    }

    initOp() {
        //post /panel/stage/:cmd
        panelRouter.post(`/stage/:cmdId`, (req:Request, res:Response) => {
            if (!req.body) return res.sendStatus(400);
            var cmdId = req.params.cmdId;
            var param = req.body;
            console.log(`/stage/${cmdId}`);
            var cmdMap:any = {};


            cmdMap[`${CommandId.cs_addLeftScore}`] = ()=> {
                var straight = this.gameInfo.addLeftScore();
                if (straight == 3) {
                    console.log("straight score 3");
                    this.io.emit(`${CommandId.straightScore3}`, ScParam({team: ViewEvent.STRAIGHT3_LEFT}));
                }
                if (straight == 5) {

                }
                this.io.emit(`${CommandId.addLeftScore}`, ScParam({leftScore: this.gameInfo.leftScore}));
            };

            cmdMap[`${CommandId.cs_addRightScore}`] = ()=> {
                var straight = this.gameInfo.addRightScore();
                if (straight == 3) {
                    console.log("straight score 3 right");
                    this.io.emit(`${CommandId.straightScore3}`, ScParam({team: ViewEvent.STRAIGHT3_RIGHT}));
                }
                if (straight == 5) {

                }
                this.io.emit(`${CommandId.addRightScore}`, ScParam({rightScore: this.gameInfo.rightScore}));
            };

            cmdMap[`${CommandId.cs_toggleTimer}`] = ()=> {
                this.gameInfo.toggleTimer();
                this.io.emit(`${CommandId.toggleTimer}`);
            };

            cmdMap[`${CommandId.cs_resetTimer}`] = ()=> {
                this.gameInfo.resetTimer();
                this.io.emit(`${CommandId.resetTimer}`);
            };

            cmdMap[`${CommandId.cs_updatePlayer}`] = (param)=> {
                if (this.gameInfo.gameState == GameInfo.GAME_STATE_ING) {
                    param.playerDoc = db.player.dataMap[param.playerId];
                    this.gameInfo.setPlayerInfoByIdx(param.idx, db.player.getPlayerInfoById(param.playerId));
                    param.avgEloScore = this.gameInfo.getAvgEloScore();
                    this.io.emit(`${CommandId.updatePlayer}`, ScParam(param))
                }

            };

            cmdMap[`${CommandId.cs_updatePlayerAll}`] = (param)=> {
                var playerInfoArr = [];
                for (var i = 0; i < param.playerIdArr.length; i++) {
                    var playerId = param.playerIdArr[i];
                    var playerInfo = db.player.getPlayerInfoById(playerId);
                    console.log('cs_updatePlayerAll', playerInfo.gameCount(), playerInfo);
                    this.gameInfo.setPlayerInfoByIdx(i, playerInfo);
                    playerInfoArr.push(playerInfo);
                    if (param.backNumArr[i]) {
                        playerInfo.backNumber = param.backNumArr[i];
                    }
                }
                this.io.emit(`${CommandId.updatePlayerAll}`, ScParam({
                    avgEloScore: this.gameInfo.getAvgEloScore(),
                    playerInfoArr: playerInfoArr
                }));
            };

            cmdMap[`${CommandId.cs_fadeInWinPanel}`] = (param)=> {
                console.log('cs_fadeInWinPanel', param.mvpIdx, this.gameInfo);
                var winTeam:TeamInfo = this.gameInfo.setWinByMvpIdx(param.mvpIdx);

                this.io.emit(`${CommandId.fadeInWinPanel}`, ScParam({
                    teamInfo: winTeam,
                    mvpIdx: param.mvpIdx,
                    mvpId: this.gameInfo.mvpPlayerId
                }));
            };

            cmdMap[`${CommandId.cs_fadeOutWinPanel}`] = (param)=> {
                this.io.emit(`${CommandId.fadeOutWinPanel}`);
            };

            cmdMap[`${CommandId.cs_updatePlayerBackNum}`] = (param)=> {
                this.io.emit(`${CommandId.updatePlayerBackNum}`, param);
            };

            cmdMap[cmdId](param);
            res.sendStatus(200);
        });
    }

    startGame(gameId) {
        var gameDoc = db.game.getDataById(gameId);
        if (!gameDoc) {
            gameDoc = db.activity.getGameDocByGameId(gameId)
        }
        this.gameInfo = new GameInfo(gameDoc);
        if (gameDoc.playerIdArr) {
            this.gameInfo.playerInfoArr = [];
            for (var playerId of gameDoc.playerIdArr) {
                console.log('playerId', playerId);
                this.gameInfo.playerInfoArr.push(new PlayerInfo(db.player.dataMap[playerId]));
            }
        }

        db.game.startGame(gameDoc);
        console.log('startGame:', gameId, gameDoc);
    }
}