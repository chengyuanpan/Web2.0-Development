var http=require('http');
var fs=require('fs');
var url=require('url');
var queryString=require('querystring');
var database = new Array();

function giveBack(response, filePath) {
	fs.readFile(filePath, function(err, data) {
		console.log("load file "+filePath);
		var suffix = filePath.substr(filePath.lastIndexOf('.')+1, filePath.length);
		response.writeHead(200, {"Content-Type":"text/"+suffix});
		response.write(data.toString());
		response.end();
	});
}

function isValid(params) {
	if (params["name"] == "" || params["phhone"] == "") return false;
	if (params["id"] > 99999999 || params["id"] < 10000000) return false;
	if (!(/^[a-zA-Z0-9_\-]+@([a-zA-Z0-9_\-]+\.)+[a-zA-Z]{2,4}$/.test(params["email"]))) return false;
	return true;
}

function print(response, info) {
	response.write("Name:"+info['name']);
	response.write("\nStudent ID:"+info["id"]);
	response.write("\nEmail:"+info["email"]);
	response.write("\nPhone:"+info["phone"]);
	response.end();
}

function handleRegist(request, response, postData, database) {
	var params = queryString.parse(postData);
	var isFound = 0;
	for (var i = 0; i < database.length; i++) {
		if (database[i]['name'] == params['name'] || database[i]['id'] == params["id"] || database[i]['email'] == params["email"] || database[i]['phone'] == params["phone"]) {
			isFound = 1;
			break;
		}
	}
	if (isFound == 0) {
		if (isValid(params)) {
			var message = params['name']+","+params["id"]+","+params["email"]+","+params["phone"]+"\r\n";
			database[database.length] = new Array();
			database[database.length-1]['name'] = params['name'];
			database[database.length-1]['id'] = params['id'];
			database[database.length-1]['email'] = params['email'];
			database[database.length-1]['phone'] = params['phone'];
			fs.appendFile("database.txt", message, function(err, data) {});
			response.writeHead(200, {"Content-Type":"text/plain;charset=utf-8"});
			print(response, params);
		} else {
			response.writeHead(200, {"Content-Type":"text/plain;charset=utf-8"});
			response.write("Your input information is incorrect");
			response.end();
		}
	} else {
		response.writeHead(200, {"Content-Type":"text/plain;charset=utf-8"});
		response.write("User already exists, information as follows:\n");
		print(response, database[i]);
	}	
}

function start() {
	var database = new Array();
	fs.readFile("database.txt", 'utf-8', function (err, data) {
		var tmp1 = data.toString().split('\r\n');
		for (var i = 0; i < tmp1.length-1; i++) {
			tmp2 = tmp1[i].split(",");
			database[i] = {};
			database[i]['name'] = tmp2[0];
			database[i]['id'] = tmp2[1];
			database[i]['email'] = tmp2[2];
			database[i]['phone'] = tmp2[3];
		}
	});
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		var search = url.parse(request.url).search;
		var query = queryString.parse(url.parse(request.url).query);
		var postData = "";
		request.addListener("data", function (data) {
			postData += data;
		});
		request.addListener("end", function () {
			if (pathname == "/logIn") handleRegist(request, response, postData, database);
			postData = "";
		});
		if ((pathname != "/logIn") && (search == null)) {
			var suffix = pathname.substr(pathname.lastIndexOf('.')+1, pathname.length);
			if (suffix != 'css' && suffix != 'js') suffix = 'html';
			giveBack(response, "register."+suffix);
		} else if (search != null){
			var isFound = 0;
			for (var i = 0; i < database.length; i++) {
				if (database[i]['name'] == query['username']) {
					isFound = 1;
					response.writeHead(200, {"Content-Type":"text/plain;charset=utf-8"});
					print(response, database[i]);
					break;
				}
			}
			if (isFound == 0) {
				response.writeHead(200, {"Content-Type":"text/plain;charset=utf-8"});
				response.write("User does not exist");
				response.end();
			}
		}
	}
	http.createServer(onRequest).listen(8000);
	console.log("Server is running at 127.0.0.1:8000");
}

start();
