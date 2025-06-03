let http = require("http");
let url = require("url");
let queryString = require("querystring");
let fs = require("fs");
let dataPath = "./userData.json";

async function findTest(Obj, callback) {
    let userData = JSON.parse(await fs.promises.readFile(dataPath, "utf-8"));
    for (let i of userData) {
        // console.log(typeof(i));
        // console.log(res);
        if (Obj.username && i.username === Obj.username) return i;
        else if (Obj.studentID && i.studentID === Obj.studentID) return i;
        else if (Obj.phone && i.phone === Obj.phone) return i;
        else if (Obj.email && i.email === Obj.email) return i;
        else continue;
    }
    return false; // not exist
}

function find(Obj, callback) {
    fs.readFile(dataPath, "utf-8", (err,data) => {
        let userData = JSON.parse(data);
        for (let i of userData) {
            // console.log(typeof(i));
            // console.log(res);
            if (Obj.username && i.username === Obj.username) return callback(i);
            else if (Obj.studentID && i.studentID === Obj.studentID) return callback(i);
            else if (Obj.phone && i.phone === Obj.phone) return callback(i);
            else if (Obj.email && i.email === Obj.email) return callback(i);
            else continue;
        }
        return callback(false); // not exist
    });
}


http.createServer(async (request, response) => {
    let content = queryString.parse(url.parse(request.url).query);
    // console.log(request.url.split('.'));
    console.log(content);
    if (request.url == "/") { // 主页
        fs.readFile("./signup.html", "utf-8", (err, html) => {
            response.writeHead(200, {"Content-Type" : "text/html"});
            response.end(html);
        });    
    }
    else if (request.url.startsWith("/signSearch")) { // 判断内容是否存在
        find(content, (result) => {response.end(`${!(result === false)}`);});
        // console.log(find(content));
    }
    else if (request.url.startsWith("/?username")) { // 进入用户详情
        find(content, (result) => {
            // console.log(result);
            if (result === false) { // 用户不存在，返回注册
                fs.readFile("./signup.html", "utf-8", (err, html) => {
                    response.writeHead(302, {"location" : "http://localhost:8000"});
                    response.end();
                });
            }
            else { // 用户存在
                fs.readFile("./user.html", "utf-8", (err, html) => {
                    html = html.replace("目标用户名", result.username);
                    html = html.replace("目标学号", result.studentID);
                    html = html.replace("目标手机号", result.phone);
                    html = html.replace("目标邮箱", result.email);
                    
                    response.writeHead(200, {"Content-Type" : "text/html"});
                    response.end(html);
                });

            }
        });
    }
    else if (request.url == "/signUpPost") { // 注册
        request.on("data", (chunk) => {
            // console.log(chunk);
            chunk = queryString.parse(chunk.toString());
            find(chunk, (result) => {
                if (!result) {
                    let user = {
                        username : chunk.username,
                        studentID : chunk.studentID,
                        phone : chunk.phone,
                        email : chunk.email
                    };
                    if (user) {
                        fs.readFile(dataPath, "utf-8", (err,data) => {
                            let userData = JSON.parse(data);
                            userData.push(user);
                            fs.writeFile(dataPath, JSON.stringify(userData), (err) => {
                                response.writeHead(302, {"location" : `http://localhost:8000/?username=${user.username}`});
                                response.end();            
                            });
                        });    
                    }
                }
            });
    
        })
    }
    else {
        try { // 加载其他文件
            fs.readFile(`.${request.url}`, (err, data) => {
                let type = request.url.split('.')[1];
                if (type == "png" || type == "jpg") type = `image/${type}`;
                else type = `text/${type}`;
                response.writeHead(200, {"Content-Type" : type});
                response.end(data);
            })
        } catch(err) {
            fs.readFile("./signup.html", "utf-8", (err, html) => {
                response.writeHead(200, {"Content-Type" : "text/html"});
                response.end(html);
            });
        }
    }
}).listen(8000);