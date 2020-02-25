/**
 * Created by Administrator on 2019/2/18.
 */
var express = require('express');
var router = express.Router();
var log4js = require("./../../log");
const logger = log4js.logger('http');
const jwt = require('jsonwebtoken');  //用来生成token
var redis = require("redis");
var client = redis.createClient("6379", "47.104.231.221");//"47.104.231.221");

router.use(function(req, res,next){
    logger.info("验证开始")
    if(req.url == "/" || req.url == "/login" || req.url == "/logout" || req.url == "/main"){
        next();
    }else{
        let token = req.body.token;    //获取token
        logger.info("token:" + token);
        let secretOrPrivateKey="jwt";   // 这是加密的key（密钥）
        jwt.verify(token, secretOrPrivateKey, (err, decode)=> {
            if (err){
                res.redirect('/back/login');
            }else{
                var name = decode.name;
                client.get(name, function (err, data) {
                    logger.info("data:" + data);
                    if(data == token){
                        next();
                    }else{
                        res.redirect('/back/login');
                    }
                })
            }
        })
    }
});

router.get('/',function(req,res,next){
    console.info(req.url);
    logger.info(req.url);
    res.render('back/login');
});

router.get('/login',function(req,res,next){
    res.render('back/login');
});

router.post('/main',function(req,res,next){
    //此时登录到主页，需要生成token并发送给前端
    var uname = req.body.username;
    var content = {name: uname};
    var secretOrPrivateKey = "jwt";
    let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 30*60*1  // 半小时过期
    });
    req.session[uname] = token;
    client.set(uname, token, function (err, data) {
        logger.info("记录token")
        req.session["ywtUname" + uname] = uname;
        req.session["ywtLogin" + uname] = req.body.loginsucc;
        res.render('back/main', {
            menu: 'main',
            loginsucc: req.session["ywtLogin" + uname],
            token: token
        });
    })
});

router.get('/logout',function(req,res){
    var uname = req.query.username;
    logger.info("logout:" + uname)
    req.session["ywtUname" + uname] = "";
    req.session["ywtLogin" + uname] = "";
    if(client.exists(uname)){
        client.del(uname)
    }
    res.redirect('/back/login');
});


router.post('/rmain',function(req,res,next){
   logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/main', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});

router.post('/user',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    logger.info("usersession" + JSON.stringify(req.session));
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/user/user', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});


router.post('/userpower',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/power/userpower', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});


router.post('/rolepower',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/power/rolepower', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});



router.post('/role',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/user/role', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});

router.post('/password',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/user/password', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});

router.post('/wxuser',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/service/wxuser', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});

router.post('/card',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/service/card', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});

router.post('/order',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/service/order', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});


router.post('/money',function(req,res,next){
    logger.info(req.url);
    var uname = req.body.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('back/money/money', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/back/login');
    }
});

module.exports = router;