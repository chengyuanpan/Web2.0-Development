let fs = require("fs");
let express = require("express");
let session = require('express-session'); // 利用session来管理cookie
let app = express();
let bodyParser = require('body-parser');
let crypto = require('crypto');
let urlencodedParser = bodyParser.urlencoded({extended : false});
let db = require('./model/db');
let ejs = require('ejs');

app.set('view engine', 'ejs');
app.set('views', './view')
app.use(express.static('./assets')); // use static to send other file
app.use(express.static('./view'));
app.use(session({
    secret : 'keyborad cat',
    resave : true,
    saveUninitialized : true,
    cookie : {
        maxAge : 2147483647, // cookie持续时间为xx分钟
    }
}));

// 注册页面
app.get('/regist', (req, res) => { 
    fs.readFile('./view/signup.html', 'utf-8', (err, data) => {
        res.send(data);
    });
});

// 利用ajax查询数据是否符合要求
app.get('/signSearch', (req, res) => { 
    db.find(req.query, (result) => {
        res.send(`${result.length != 0}`);
    });
});

// 注册表单提交
app.post('/signUpPost', urlencodedParser, (req, res) => { 
    let hash = crypto.createHash('md5');
    hash.update(req.body.password);
    let tar = {
        username : req.body.username,
        password : hash.digest('hex').toString(),
        email : req.body.email,
        phone : req.body.phone,
        studentID : req.body.studentID
    };
    db.find(tar, result => {
        if (result.length == 0) {
            db.insert(tar, result => {
                if (result) {
                    req.session.user = {
                        username : tar.username,
                    }
                    res.redirect(`http://localhost:8000?username=${tar.username}`);
                }
            });
        }
        else res.render('./jump', {tarStr : '用户已经存在', tarAdd : '/regist'});
        // {
        //     res.redirect('http://localhost:8000/jump?string=用户已经存在了')
        // }
    })
});

// 登录页面
app.get('/login', (req, res) => {
    // console.log(req.originalUrl);
    fs.readFile('./view/login.html', 'utf-8', (err, data) => {
        res.send(data);
        return;
    });
});

// 登录
app.post('/login', urlencodedParser, (req, res, next) => {
    let hash = crypto.createHash('md5');
    hash.update(req.body.password);
    let tar = {
        username : req.body.username,
        password : hash.digest('hex').toString(),
    };
    db.find({username : tar.username}, result => { // 用户名不存在
        if (result.length == 0) {
            res.render('./jump', {tarStr : '用户名不存在', tarAdd : '/login'});
            // res.redirect('http://localhost:8000/jump?string=用户名不存在');
            return ;
        }
        else {
            db.find(tar, result => { // 密码错误
                if (result.length == 0) {
                    res.render('./jump', {tarStr : '密码错误', tarAdd : '/login'});
                    // res.redirect('http://localhost:8000/jump?string=密码错误');
                    return;
                }
                else { // 登录成功
                    req.session.user = { username : tar.username};
                    // console.log(req.session);
                    res.redirect(`http://localhost:8000?username=${tar.username}`);
                    return next();
                }
            });
        }

    });
});

// 登出
app.get('/logout', urlencodedParser, (req, res) => {
    req.session.user = {};
    res.redirect('http://localhost:8000/login');
});

// 详情
app.get('/', (req, res) => {
    let tar = req.session.user;
    // console.log(req.session);
    if (!tar) res.redirect('http://localhost:8000/login'); // 没有cookie，跳转到登录页面
    else if (!req.query.username) res.redirect(`http://localhost:8000?username=${tar.username}`);
    else {
        db.find({username : tar.username}, result => {
            // console.log(result);
            tar = result[0];
            tar.tarUsername = req.query.username;
            res.render('./user', tar);
        });
    }
});

let server = app.listen(8000, () => {
    let host = server.address().address;
    let port = server.address().port;
    // initialDB();
    db.initialDB();
    // console.log('server ready');
});