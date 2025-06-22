let http = require("http");
let url = require("url");
let queryString = require("querystring");
let fs = require("fs");
let dataPath = "./userData.json";

function find(Obj, callback) {
  fs.readFile(dataPath, "utf-8", (err, data) => {
    let userData = JSON.parse(data);
    for (let i of userData) {
      if (Obj.userName && i.userName === Obj.userName) return callback(i);
      else if (Obj.studentID && i.studentID === Obj.studentID) return callback(i);
      else if (Obj.phone && i.phone === Obj.phone) return callback(i);
      else if (Obj.email && i.email === Obj.email) return callback(i);
      else continue;
    }
    return callback(false);
  });
}

http
  .createServer(async (request, response) => {
    const myURL = new url.URL(request.url, `http://${request.headers.host}`);
    const content = Object.fromEntries(myURL.searchParams.entries());
    if (Object.keys(content).length > 0) {
      console.log("Received parameters:", content);
    }
    console.log(request.url);
    if (request.url == "/") {
      // Load the signup page (Home page)
      fs.readFile("./signup.html", "utf-8", (err, data) => {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.end("Server Error");
          return;
        }
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(data);
      });
    } else if (request.url.startsWith("/signSearch")) {
      // Check if content exists
      find(content, (result) => {
        // Return true if exists, false if not
        response.end(`${!(result === false)}`);
      });
    } else if (request.url == "/signUpPost") {
      // User clicks the Sign Up button
      // chunk.toString() : userName=AlvinPan&studentID=15331248&phone=13719175357&email=panchy7%40qq.com
      let body = "";
      request.on("data", chunk => {
        body += chunk;
      });
      request.on("end", () => {
        body = queryString.parse(body);
        find(body, (result) => {
          if (!result) {
            let user = {
              userName: body.userName,
              studentID: body.studentID,
              phone: body.phone,
              email: body.email,
            };
            if (user) {
              fs.readFile(dataPath, "utf-8", (err, data) => {
                let userData = JSON.parse(data);
                userData.push(user);
                fs.writeFile(dataPath, JSON.stringify(userData), (err) => {
                  response.writeHead(302, {
                    location: `http://localhost:8000/?userName=${user.userName}`,
                  });
                  response.end();
                });
              });
            }
          } else {
            // User already exists, redirect to the signup page
            response.writeHead(302, { location: "http://localhost:8000" });
            response.end();
          }
        });
      });
    } else if (request.url.startsWith("/?userName")) {
      // Display user details
      find(content, (result) => {
        if (result === false) {
          // User does not exist, return to registration
          response.writeHead(302, { location: "http://localhost:8000" });
          response.end();
        } else {
          // User exists
          fs.readFile("./user.html", "utf-8", (err, data) => {
            data = data.replace("Target Username", result.userName);
            data = data.replace("Target Student ID", result.studentID);
            data = data.replace("Target Phone Number", result.phone);
            data = data.replace("Target Email", result.email);

            response.writeHead(200, { "Content-Type": "text/html" });
            response.end(data);
          });
        }
      });
    } else {
      try {
        // Load other files
        fs.readFile(`.${request.url}`, (err, data) => {
          let type = request.url.split(".")[1];
          if (type == "png" || type == "jpg") type = `image/${type}`;
          else type = `text/${type}`;
          response.writeHead(200, { "Content-Type": type });
          response.end(data);
        });
      } catch (err) {
        fs.readFile("./signup.html", "utf-8", (err, html) => {
          response.writeHead(200, { "Content-Type": "text/html" });
          response.end(html);
        });
      }
    }
  })
  .listen(8000);
