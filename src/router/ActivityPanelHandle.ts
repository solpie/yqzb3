import Server = SocketIO.Server;
import Socket = SocketIO.Socket;
import {PanelId} from "../event/Const";
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
                    return res.send({isFinish: true})
                }
                else {
                    stagePanelHandle.startGame(param.gameId);
                    return res.send({isFinish: false});
                }
            };

            cmdMap[`${CommandId.cs_restartGame}`] = (param)=> {
                db.game.restartGame(param.gameId);
            };

            var isSend = cmdMap[cmdId](param);
            if (!isSend)
                res.sendStatus(200);
        })
    }
}