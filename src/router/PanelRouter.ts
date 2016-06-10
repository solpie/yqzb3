export var panelRouter = require('express').Router();

panelRouter.get('/:pid/:op', function (req, res) {
    var pid:string = req.params.pid;
    var op:boolean = req.params.op === 'op';
    res.render('panel/index', {pid: pid, op: op});
});
