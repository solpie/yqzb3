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