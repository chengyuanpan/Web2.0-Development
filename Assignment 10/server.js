let fs = require('fs');
let express = require('express');
let session = require('express-session'); // Use session to manage cookies
let app = express();
let bodyParser = require('body-parser');
let crypto = require('crypto');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let db = require('./model/db');
let ejs = require('ejs');

app.set('view engine', 'ejs'); // Use EJS as the template engine.
app.set('views', './views'); // Specifies the folder where your view templates (EJS files) are located.
app.use(express.static('./assets')); // Use static to send other files
app.use( // Registers middleware in Express
  session({ // Creates a session middleware that manages user sessions via cookies.
    secret: 'keyborad cat', // A string used to sign the session ID cookie.
    // true → Every request rewrites the session in the store, even if nothing changed.
    // false → Session is only saved if it was modified during the request.
    resave: true, // Controls whether the session is saved back to the session store on every request, even if it wasn’t modified.
    // 	true → can inflate your session store with useless empty sessions.
    // 	false → better for privacy laws (GDPR) and saves storage, only create sessions for active users.
    saveUninitialized: true, // Save all new sessions to the store even if they are empty.
    cookie: {
      maxAge: 2147483647, // The lifetime of the cookie (in milliseconds).
    },
  })
);

// Registration page
app.get('/regist', (req, res) => {
  fs.readFile('./assets/html/signup.html', 'utf-8', (err, data) => {
    res.send(data);
  });
});

// Use ajax to query whether the data meets the requirements
app.get('/signSearch', (req, res) => {
  db.find(req.query, (result) => {
    // `${...}` → A template literal (string interpolation in JavaScript). It ensures the expression inside {} is converted to a string.
    // This line will send either "true" or "false" (as strings, not booleans) to the client.
    res.send(`${result.length != 0}`);
  });
});

// Registration form submission
app.post('/signUpPost', urlencodedParser, (req, res) => {
  let hash = crypto.createHash('md5');
  hash.update(req.body.password);
  // tar is the “user document” you want to save to MongoDB
  let tar = {
    userName: req.body.userName,
    password: hash.digest('hex').toString(),
    email: req.body.email,
    phone: req.body.phone,
    studentID: req.body.studentID,
  };
  db.find(tar, (result) => {
    if (result.length == 0) { // If user does not exist
      db.insert(tar, (result) => {
        if (result) {
          req.session.user = { userName: tar.userName }; // Store username in session → logs them in automatically.
          res.redirect(`http://localhost:8000?userName=${tar.userName}`);
        }
      });
    } else { // If user already exists
      res.render('jump', { tarStr: 'User already exists', tarAdd: '/regist' });
    }
  });
});

// Login page
app.get('/login', (req, res) => {
  fs.readFile('./assets/html/login.html', 'utf-8', (err, data) => {
    res.send(data);
    return;
  });
});

// Log in
app.post('/login', urlencodedParser, (req, res, next) => {
  let hash = crypto.createHash('md5');
  hash.update(req.body.password);
  let tar = {
    userName: req.body.userName,
    password: hash.digest('hex').toString(),
  };
  db.find({ userName: tar.userName }, (result) => {
    // The username does not exist
    if (result.length == 0) {
      res.render('jump', { tarStr: 'User Name Does Not Exist', tarAdd: '/login' });
      // res.redirect('http://localhost:8000/jump?string=UsernameDoesNotExist');
      return;
    } else {
      db.find(tar, (result) => {
        // Error password
        if (result.length == 0) {
          res.render('jump', { tarStr: 'Incorrect Password', tarAdd: '/login' });
          // res.redirect('http://localhost:8000/jump?string=IncorrectPassword');
          return;
        } else {
          // Login successfully
          req.session.user = { userName: tar.userName };
          res.redirect(`http://localhost:8000?userName=${tar.userName}`);
          return next();
        }
      });
    }
  });
});

// Sign out
app.get('/logOut', urlencodedParser, (req, res) => {
  req.session.user = {};
  res.redirect('http://localhost:8000/login');
});

// Details
app.get('/', (req, res) => {
  let tar = req.session.user;
  if (!tar)
    res.redirect('http://localhost:8000/login'); // No cookies, jump to login page
  else if (!req.query.userName)
    res.redirect(`http://localhost:8000?userName=${tar.userName}`);
  else {
    db.find({ userName: tar.userName }, (result) => {
      tar = result[0];
      tar.tarUsername = req.query.userName;
      res.render('./user', tar);
    });
  }
});

let server = app.listen(8000, () => {
  let host = server.address().address;
  let port = server.address().port;
  db.initialDB();
  console.log('Server ready');
});
