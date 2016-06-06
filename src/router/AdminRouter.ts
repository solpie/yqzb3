export var adminRouter = require('express').Router();
adminRouter.get('/', function (req:any, res:any) {
    res.render('admin/index');
});

console.log('adminRouter');

adminRouter.get('/player', function (req:any, res:any) {
    res.render('admin/admin-player', {playerDataArr: []});
});