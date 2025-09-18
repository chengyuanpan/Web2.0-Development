let dataPath = 'mongodb://localhost:27017';
let mongodb = require("mongodb");
let mongoClient = mongodb.MongoClient;


// 初始化数据库
function initialDB() { 
    mongoClient.connect(dataPath, {useNewUrlParser : true}, (err, db) => {
        if (err) throw err;
        let dbo = db.db('users');
        dbo.createCollection('user', (err, res) => {
            if (err) throw err;
            console.log('database ready');
            db.close();
        });
    });
}

// 查找数据库
function find(obj, callback){ 
    mongoClient.connect(dataPath, {useNewUrlParser : true}, (err, db) => {
        if (err) throw err;
        let dbo = db.db('users');
        dbo.collection('user').find(obj).toArray((err, result) => {
            if (err) throw err;
            // console.log(result);
            callback(result);
            db.close();
        });
    })
}

// 插入数据库
function insert(obj, callback) { 
    mongoClient.connect(dataPath, {useNewUrlParser : true}, (err, db) => {
        if (err) throw err;
        let dbo = db.db('users');
        dbo.collection('user').insertOne(obj, (err, result) => {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
}

module.exports = {
    initialDB : initialDB, 
    find : find,
    insert : insert
};