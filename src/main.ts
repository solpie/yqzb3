const {app, BrowserWindow,ipcMain} = require('electron');
var win:any;
function onReady() {
    openWin();
}

function openWin(serverConf?:any) {
    win = new BrowserWindow({
        width: 950, height: 540,
        // width: 500, height: 540,
        resizable: false,
        frame: true,
        autoHideMenuBar: false,
        webaudio: false
    });
    // win.setMenu(null);
    win.setMenuBarVisibility(false);
    // win.loadURL('http://127.0.0.1');
    win.loadURL(`file://${__dirname}app/reload.html`);
    // win.loadURL(`file:///app/reload.html`);
    win.on('closed', function () {
        win = null;
    });

    ipcMain.on('open-devtool', (event:any, status:any) => {
        console.log(status);
        win.toggleDevTools({mode: 'detach'});
    });

    //todo print
    // http://electron.atom.io/docs/api/web-contents/
}

app.on('ready', onReady);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (win === null) {
        // onReady();
    }
});