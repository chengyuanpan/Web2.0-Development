let dataPath = 'mongodb://localhost:27017';
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;

// Initialize the database
function initialDB() {
  mongoClient.connect(dataPath, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    let dbo = db.db('users');
    dbo.createCollection('user', (err, res) => {
      if (err) throw err;
      console.log('database ready');
      db.close();
    });
  });
}

// Find the database
function find(obj, callback) {
  mongoClient.connect(dataPath, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    let dbo = db.db('users');
    dbo
      .collection('user')
      .find(obj)
      .toArray((err, result) => {
        if (err) throw err;
        callback(result);
        db.close();
      });
  });
}

// Insert the database
function insert(obj, callback) {
  mongoClient.connect(dataPath, { useNewUrlParser: true }, (err, db) => {
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
  initialDB: initialDB,
  find: find,
  insert: insert,
};
