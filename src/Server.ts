// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
/// <reference path="model/PlayerInfo.ts" />
/// <reference path="router/AdminRouter.ts" />
import {PlayerInfo} from "./model/PlayerInfo";
import {adminRouter} from "./router/AdminRouter";
var colors = require('colors');

let isDev:Boolean;
const Node_path = require("path");
var serverConf:any;
let _path = function (path:string) {
    if (!isDev)
        return Node_path.join('resources', path);
    return path;
};
/**
 * WebServer
 */

function getIPAddress() {
    // var interfaces = require('os').networkInterfaces({all: true});
    // for (var devName in interfaces) {
    //     console.log("interfaces:", devName);
    //     var iface = interfaces[devName];
    //     for (var i = 0; i < iface.length; i++) {
    //         var alias = iface[i];
    //         // console.log("ip:", JSON.stringify(alias));
    //         if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
    //             return alias.address;
    //         }
    //     }
    // }


    var os = require('os');
    var child_proc = require('child_process');
    var ls:any;
    var matches:Array<any> = [];
    var pmHosts:Array<any> = [];
    var filterRE:RegExp;
    var pingResult = "";
    var pmHost:Array<any>;

    if ('win32' == os.platform()) {
        ls = child_proc.spawn("ipconfig", {});
        // only get the IPv4 address
        filterRE = /\b(IPv4|IP\s)[^:\r\r\n]+:\s+([^\s]+)/g;
    }
    else {
        // TODO: we need try to get the local IP for other os, such as unix/mac
        return false;
    }

    ls.stdout.on('data', (data:any) => {
        // get ping result.
        pingResult = pingResult + data.toString();
        // console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data:any) => {
        pingResult = pingResult + data.toString();
        // console.log(`stderr: ${data}`);
    });

    ls.on('close', (code:any) => {
        matches = pingResult.match(filterRE) || [];
        for (var i = 0; i < matches.length; i++) {
            var host = matches[i].split(':')[1];
            console.log("host:", host);
            // trim the spaces in the string's start/end position.
            host = host.replace(/(^[\s]*)|([\s]*$)/g, "");
            pmHosts.push(host);
        }

        if (pmHosts.length > 0)
            pmHost = pmHosts[0];
    });

    ls.on('exit', function (code:any, signal:any) {
        matches = pingResult.match(filterRE) || [];
        for (var i = 0; i < matches.length; i++) {
            var host = matches[i].split(':')[1];

            // trim the spaces in the string's start/end position.
            host = host.replace(/(^[\s]*)|([\s]*$)/g, "");
            pmHosts.push(host);
        }

        if (pmHosts.length > 0)
            pmHost = pmHosts[0];

        // do other things
        console.log(pmHost);

    });
    //
    // ls.stdout.on('data', function (data) {
    //     // get ping result.
    //     pingResult = pingResult + data.toString();
    // });
}
export class WebServer {
    _path:any;

    constructor(callback?:any) {
        this.test();
        let localhost = getIPAddress();
        console.log("localhost:", localhost);
        this.initEnv(callback);
        this.initGlobalFunc();
    }

    initGlobalFunc() {
        this._path = _path;
    }

    test() {
        let playerInfo = new PlayerInfo();

    }

    initEnv(callback:any) {
        var process = require("process");
        isDev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath);
        console.log(process.execPath, isDev);

        var fs = require('fs');
        fs.readFile(_path('app/config.json'), (err:any, data:any)=> {
            if (err) throw err;
            serverConf = JSON.parse(data);
            console.log(serverConf);
            this.initServer();
            if (callback)
                callback(serverConf);
        });
    }

    initServer() {
        var express = require('express');
        var app = express();
        // view engine setup
        app.set('views', _path("./app/view"));
        app.set('view engine', 'ejs');


        app.use(express.static(_path("./app/static")));//
        // var urlencodedParser = bodyParser.urlencoded({
        //     extended: false
        //     , limit: '55mb'
        // });
        var morgan = require('morgan');
        app.use(morgan('dev'));                     // log every request to the console

        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({extended: false, limit: '55mb'}));// create application/x-www-form-urlencoded parser
        app.use(bodyParser.json({limit: '50mb'}));

        app.all("*", function (req:any, res:any, next:any) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            if (req.method == 'OPTIONS') {
                res.send(200);
            } else {
                next();
            }
        });

        app.get('/', function (req:any, res:any) {
            res.redirect('/admin');
        });

        app.use('/admin', adminRouter);


        app.listen(80, () => {
            //and... we're live
            console.log("server on:  ws port:");
        });
    }
}
export var webServer = new WebServer();