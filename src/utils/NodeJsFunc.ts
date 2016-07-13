import {_path, ServerConf} from "../Env";
export function base64ToPng(imgPath2, base64Data, callback?) {
    var base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
    var writePath = imgPath2;
    if (!ServerConf.isDev)
        writePath = _path(imgPath2);
    var fs = require('fs');
    fs.writeFile(writePath, base64Data, 'base64', (err)=> {
        if (!err) {
            if (callback)
                callback('/' + imgPath2);
        }
        else throw err;
    });
}
function getNetGate(callback) {
    var child_proc = require('child_process');
    var ls = child_proc.spawn("nslookup", {});
    ls.stdout.on('data', (data:any) => {
        var str = data.toString();
        var match = str.match(/Address:\s+(.+)/);
        if (match.length == 2) {
            var netGate = match[1];
            callback(netGate);
        }
        if (str == '>') {
            console.log('kill nslookup');
            ls.kill();
        }
    });

    ls.stderr.on('data', (data:any) => {
        data.toString();
        console.log(`stderr: ${data}`);
    });
}
export function getIPAddress(callback) {
    getNetGate((netGate)=> {
        var os = require('os');
        var child_proc = require('child_process');
        var ls:any;
        var pingResult = "";
        if ('win32' == os.platform()) {
            ls = child_proc.spawn("ipconfig", {});
        }
        else {
            // TODO: we need try to get the local IP for other os, such as unix/mac
            return false;
        }
        ls.stdout.on('data', (data:any) => {
            pingResult = pingResult + data.toString();
        });

        ls.stderr.on('data', (data:any) => {
            pingResult = pingResult + data.toString();
            // console.log(`stderr: ${data}`);
        });

        ls.on('close', (code:any) => {
            var ipLines = pingResult.split('\n');
            for (var i = 0; i < ipLines.length; i++) {
                var line = ipLines[i];
                // console.log('l:', line);
                if (line.search(netGate) > -1) {
                    var ip = ipLines[i - 2].match(/IPv4.+\s+(.+)/);
                    if (ip.length == 2) {
                        console.log('ip:', ip[1]);
                        callback(ip[1]);
                    }
                    else {
                        callback('localhost');
                    }
                }
            }
        });
    });
}