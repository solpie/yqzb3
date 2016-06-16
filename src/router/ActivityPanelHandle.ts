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

            var isSend = cmdMap[cmdId](param);
            if (!isSend)
                res.sendStatus(200);
        })
    }
}