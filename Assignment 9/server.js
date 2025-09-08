let http = require("http");
let url = require("url");
let path = require("path");
let fs = require("fs");
let port = 3000;

function getMimeType(pathName) {
  let validExtensions = {
    ".js": "application/javascript",
    ".html": "text/html",
    ".css": "text/css",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png",
  };
  let ext = path.extname(pathName);
  let type = validExtensions[ext];
  return type;
}

function handlePage(req, res, pathName) {
  // `__dirname` is a global variable that represents the full path to the directory where the currently executing script is located.
  let filePath = __dirname + pathName;
  let mimeType = getMimeType(pathName);
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.writeHead(500);
        res.end();
      } else {
        res.setHeader("Content-Length", data.length);
        res.setHeader("Content-Type", mimeType);
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    res.writeHead(500);
    res.end();
  }
}

function getRandomNumber(limit) {
  // Math.random(): returns a floating-point, pseudo-random number in the range 0 to less than 1 (inclusive of 0, but not 1)
  // Math.round(): returns the value of a number rounded to the nearest integer
  // return a random integer between 0 and limit
  return Math.round(Math.random() * limit);
}

function handleAjax(req, res) {
  let random_time = 1000 + getRandomNumber(2000);
  let random_num = 1 + getRandomNumber(9);
  setTimeout(function () {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("" + random_num);
  }, random_time);
}

http
  .createServer(function (req, res) {
    let pathName = url.parse(req.url).pathName;
    let mimeType = getMimeType(pathName);
    if (!!mimeType) {
      handlePage(req, res, pathName);
    } else {
      handleAjax(req, res);
    }
  })
  .listen(port, function () {
    console.log("server listen on ", port);
  });
