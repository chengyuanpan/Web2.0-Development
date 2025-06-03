var http = require("http");
var fs = require('fs');
var url = require("url");
var querystring = require('querystring');

var jsonObj;
var user = null;
fs.readFile('./data.json',function(err,data){
  if(err) throw err;
  jsonObj=JSON.parse(data);
});

var server = http.createServer(function(request, response) {
	console.log(request.url)
	if(request.method == 'POST') {
		check(request,response);
	}
	else {
		displayPage(request,response);
	}
});
server.listen(8000);

function check(request,response) {
	request.on('data', function(chunk) {
			var crash = false;
			user = querystring.parse(chunk.toString());
			var error_username = "";
			var error_studentId = "";
			var error_phone = "";
			var error_email = "";

			for(var i in jsonObj.users) {
				if(jsonObj.users[i].username == user.username) {
					error_username = "用户已注册";
					crash = true;
				}
				if(jsonObj.users[i].studentId == user.studentId) {
					error_studentId = "学号已注册";
					crash = true;
				}
				if(jsonObj.users[i].phone == user.phone) {
					error_phone = "电话已注册";
					crash = true;
				}
				if(jsonObj.users[i].email == user.email) {
					error_email = "邮箱已注册";
					crash = true;
				}
			}

			if(!crash) {
				jsonObj.users.push(user);
				fs.writeFile('./data.json',JSON.stringify(jsonObj),function(err){
					if(err) throw err;
				});
				response.writeHead(301, {Location: '?username=' + user.username});
				alert("成功注册\n");
				response.end();					
			}
			else {
				var nname = user.username;
				var nId = user.studentId;
				var nphone = user.phone;
				var nemail = user.email;
				errorDisplay(response,error_username,error_studentId,error_phone,error_email,nname,nId,nphone,nemail);
			}
	});
}

function displayPage(request,response) {
	var username = querystring.parse(url.parse(request.url).query).username;
	if(!username || !!!jsonObj.users[username]) {
		//test whether the user has signed up
		// for(var i = 0; i < jsonObj.users.length; i++){
		// 	if(jsonObj.users[i].username == username){
		// 		user = jsonObj.users[i];
		// 		break;
		// 	}
		// }
		var pathName = request.url;
		if(pathName == '/') {
			pathName = "./signUp.html";
		}
		else {
			pathName = '.' + pathName;
		}
		var file = pathName;
		fs.readFile(file, function(err,data) { 
			if(err) {
				response.writeHead(301, {Location: '/'});
				response.end();
			}

			else if(file.indexOf("html") != -1){
				errorDisplay(response,"","","","","","","","");
			}
			else if(file.indexOf("css") != -1){
				response.writeHead(200,{'Context-Type': 'text/css;charset = "utf-8"'});
				response.write(data);
				response.end();
			}
			else if(file.indexOf("js") != -1){
				response.writeHead(200,{'Context-Type': 'text/js;charset=utf-8'});
				response.write(data);
				response.end();
			}
		})
	}
	else {
		var pathName = request.url;
		if(pathName == '/' || pathname.indexOf("/?username=") != -1) {
			pathName = "./display.html";
		}
		else {
			pathName = '.' + pathName;
		}
		var file = pathname;
		fs.readFile(file, function(err,data) { 
			if(err) {
				response.writeHead(301, {Location: '/'});
				response.end();
			}

			else if(file.indexOf("html") != -1) {
				detailDisplay(response,jsonObj.users[username].username,jsonObj.users[username].studentId,jsonObj.users[username].phone,jsonObj.users[username].email);		
			}

			else if(file.indexOf("css") != -1){
				response.writeHead(200,{'Context-Type': 'text/css;charset = "utf-8"'});
				response.write(data);
				response.end();
			}
		})
	}
}

function errorDisplay(response,error_1,error_2,error_3,error_4,
	nname,nId,nphone,nemail) {
	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	response.write("<!DOCTYPE \"html\">");
	response.write("<html>");
	response.write("<head>");
	response.write("<meta charset=\"utf-8\">");
	response.write("</script>");
	response.write("<script src = \"signUp.js\" type = \"text/JavaScript\">")
	response.write("</script>")
	response.write("<title>注册页面</title>");
	response.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"signUp.css\">");
	response.write("</head>");

	response.write("<body>");
	response.write("<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js\">");
		response.write("<div id = \"SignUp\">")
		response.write("<div id = \"information\">")
		response.write("<h1>注册页面</h1>");
		response.write("<form id = \"data\" method = \"post\" onsubmit = \"return isValid()\">");
			response.write("<p>");
			response.write("用户 ： ");
			response.write("<input id = \"username\" name = \"username\" type = \"text\" value = " + nname + ">");
			response.write("<span>");
			response.write(error_1);
			response.write("</span>");
			response.write("</p>");

			response.write("<p>");
			response.write("学号 ： ");
			response.write("<input id = \"studentId\" name = \"studentId\" type = \"text\" value = " + nId + ">");
			response.write("<span>");
			response.write(error_2);
			response.write("</span>");
			response.write("</p>");

			response.write("<p>");
			response.write("电话 ： ");
			response.write("<input id = \"phone\" name = \"phone\" type = \"text\" value = " + nphone + ">");
			response.write("<span>");
			response.write(error_3);
			response.write("</span>");
			response.write("</p>");

			response.write("<p>");
			response.write("邮箱 ： ");
			response.write("<input id = \"email\" name = \"email\" type = \"text\" value = " + nemail + ">");
			response.write("<span>");
			response.write(error_4);
			response.write("</span>");
			response.write("</p>");

			response.write("<input id = \"reset\" name = \"reset\" type = \"button\" value = \"重置\">");
			response.write("<input id = \"submit\" name = \"submit\" type = \"submit\" value = \"提交\">");
		response.write("</form>")
		
			response.write("<div id = \"hint\">")
			response.write("<p>注册提示：</br>用户名为6~18位英文字母、数字或下划线（以英文字母开头）</br>学号8位数字，不能以0开头</br>电话11位数字，不能以0开头</br>邮箱格式为标准格式</br></p>")
			response.write("</div>");

		response.write("</div>");
		response.write("</div>");
	response.write("</body>");
	response.write("</html>");

	response.end();			
}

function detailDisplay(response,username,studentId,phone,email) {
	response.writeHead(200, {'Content-Type':'text/html'});
	response.write("<!DOCTYPE \"html\">");
	response.write("<html>");
	response.write("<head>");
	response.write("<meta charset=\"utf-8\">");
	response.write("<title>用户信息</title>");
	response.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"display.css\">");
	response.write("</head>");
	response.write("<body>");
	response.write("<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js\">");
	response.write("<div id = \"SignUp\">");
	response.write("<div id = \"information\">");

		response.write("<h1>用户信息</h1>");
		response.write("<div id = \"username\">");
		response.write("<p>用户：");
		response.write(username);
		response.write("</p>");
		response.write("</div>");

		response.write("<div id = \"studentId\">");
		response.write("<p>学号：");
		response.write(studentId);
		response.write("</p>");
		response.write("</div>");

		response.write("<div id = \"phone\">");
		response.write("<p>电话：");
		response.write(phone);
		response.write("</p>");
		response.write("</div>");

		response.write("<div id = \"email\">");
		response.write("<p>邮箱：");
		response.write(email);
		response.write("</p>");
		response.write("</div>");

	response.write("</div>");
	response.write("</div>");
	response.write("</body>");
	response.write("</html>");

	response.end();	
}
