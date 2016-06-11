export var panelRouter = require('express').Router();

panelRouter.get('/', function (req, res) {
    var pid:string = req.params.pid;
    var op:boolean = req.params.op === 'op';
    console.log('get panel:', pid, op);
    res.render('panel/index', {pid: pid, op: op});
});
