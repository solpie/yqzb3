import Server = SocketIO.Server;
import Socket = SocketIO.Socket;
import {PanelId, ServerConst} from "../event/Const";
import {ScParam, stagePanelHandle} from "../SocketIOSrv";
import {Response} from "express-serve-static-core";
import {Request} from "express";
import {CommandId} from "../event/Command";
import {ServerConf} from "../Env";
import {panelRouter} from "./PanelRouter";
import {db} from "../model/DbInfo";
import {arrUniqueFilter} from "../utils/JsFunc";
export class ActivityPanelHandle {
    io:any;

    constructor(io:Server) {
        console.log('ActivityPanelHandle!!');

        this.io = io.of(`/${ PanelId.actPanel}`);
        this.io
            .on("connect", (socket:Socket)=> {
                socket.emit(`${CommandId.initPanel}`, ScParam({isDev: ServerConf.isDev}));
            })
            .on('disconnect', function (socket:Socket) {
                console.log('disconnect');
            });
        this.initOp();
    }

    initOp() {
        panelRouter.post(`/act/:cmdId`, (req:Request, res:Response) => {
            if (!req.body) return res.sendStatus(400);
            var cmdId = req.params.cmdId;
            var param = req.body;
            console.log(`/act/${cmdId}`);
            var cmdMap:any = {};

            cmdMap[`${CommandId.cs_startGame}`] = (param)=> {
                if (db.game.isGameFinish(param.gameId)) {
                    res.send({isFinish: true})
                }
                else {
                    stagePanelHandle.startGame(param.gameId);
                    res.send({isFinish: false});
                }
                return ServerConst.SEND_ASYNC;
            };

            cmdMap[`${CommandId.cs_restartGame}`] = (param)=> {
                db.game.restartGame(param.gameId);
            };

            cmdMap[`${CommandId.cs_fadeInRankPanel}`] = (param)=> {
                var activityId = param.activityId;
                var playerIdArr = param.playerIdArr;
                this.io.emit(`${CommandId.fadeInRankPanel}`,
                    ScParam({playerDocArr: db.player.getPlayerRank(playerIdArr)}));
                // return ServerConst.SEND_ASYNC;
                // db.game.restartGame(param.gameId);
            };

            cmdMap[`${CommandId.cs_fadeOutRankPanel}`] = (param)=> {
                this.io.emit(`${CommandId.fadeOutRankPanel}`);
            };

            cmdMap[`${CommandId.cs_fadeInCountDown}`] = (param)=> {
                this.io.emit(`${CommandId.fadeInCountDown}`, param);
            };

            cmdMap[`${CommandId.cs_fadeOutCountDown}`] = (param)=> {
                this.io.emit(`${CommandId.fadeOutCountDown}`);
            };

            cmdMap[`${CommandId.cs_fadeInActivityPanel}`] = (param)=> {
                db.game.syncDataMap(()=> {
                    var gameIdArr = param.gameIdArr;
                    var gameDocArr = db.game.getDocArr(gameIdArr);
                    for (var gameDoc of gameDocArr) {
                        gameDoc.playerDocArr = [];
                        for (var playerId of gameDoc.playerIdArr) {
                            gameDoc.playerDocArr.push(db.player.dataMap[playerId]);
                        }
                    }
                    this.io.emit(`${CommandId.fadeInActivityPanel}`,
                        ScParam({gameDocArr: gameDocArr}));
                })
            };

            cmdMap[`${CommandId.cs_fadeOutActivityPanel}`] = (param)=> {
                this.io.emit(`${CommandId.fadeOutActivityPanel}`);
            };
            cmdMap[`${CommandId.cs_fadeInActivityExGame}`] = (param)=> {
                var gameIdArr = param.gameIdArr;
                var gameDocArr = db.game.getDocArr(gameIdArr);
                var playerIdArr = [];
                for (var gameDoc of gameDocArr) {
                    // playerDocArr = playerDocArr.concat();
                    playerIdArr = playerIdArr.concat(gameDoc.playerIdArr);
                }
                console.log('ex game playerDoc Arr:', playerIdArr);
                playerIdArr = playerIdArr.sort().filter(arrUniqueFilter);
                console.log('ex game playerDoc Arr:', playerIdArr);
                var playerDocArr = db.player.getPlayerRank(playerIdArr);
                this.io.emit(`${CommandId.fadeInActivityExGame}`,
                    ScParam({playerDocArr: playerDocArr}));
            };
            cmdMap[`${CommandId.cs_fadeInNextRank}`] = (param)=> {
                this.io.emit(`${CommandId.fadeInNextRank}`);
            };

            var isSend = cmdMap[cmdId](param);
            if (!isSend)
                res.sendStatus(200);
        })
    }
}