import Server = SocketIO.Server;
import {CommandId} from "../event/Command";
import {PanelId} from "../event/Const";
import {ServerConf} from "../Env";
import {panelRouter} from "./PanelRouter";
import {GameInfo} from "../model/GameInfo";
import {Response} from "express-serve-static-core";
import {Request} from "express";
import {ScParam} from "../Socket.io";
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
            console.log(`/stage/${cmdId}`);
            this.io.emit('broadcast', req.body);

            var cmdMap:any = {};
            cmdMap[`${CommandId.cs_addLeftScore}`] = ()=> {
                var straight = this.gameInfo.addLeftScore();
                if (straight == 3) {
                    console.log("straight score 3");
                    this.io.emit(`${CommandId.straightScore3}`, ScParam({team: "left"}));
                }
                if (straight == 5) {

                }
                this.io.emit(`${CommandId.addLeftScore}`, ScParam({leftScore: this.gameInfo.leftScore}));
            };

            cmdMap[`${CommandId.cs_addRightScore}`] = ()=> {
                var straight = this.gameInfo.addRightScore();
                if (straight == 3) {
                    console.log("straight score 3");
                    this.io.emit(`${CommandId.straightScore3}`, ScParam({team: "right"}));
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

            cmdMap[cmdId]();

            res.sendStatus(200);
        });
    }
}