(function() {
	document.getElementById("reset").onclick = function() {
		//initialize
		$("#userName").val("");
		$("#studentId").val("");
		$("#phone").val("");
		$("#email").val("");
		$("#userName").next("span").text("");
		$("#studentId").next("span").text("");
		$("#phone").next("span").text("");
		$("#email").next("span").text("");
	};
})();

function isValid() {

	var userName = $("#userName").val();
	var studentId = $("#studentId").val();
	var phone = $("#phone").val();
	var email = $("#email").val();
	var valid = true;

	if(!(/^[a-zA-Z]\w{5,17}$/.test(userName))) {
		$("#userName").next("span").text("名称不合法");
		flag = false;
	}
	else {
		$("#userName").next("span").text("");
	}

	if(!(/^[1-9][0-9]{7}$/.test(studentId))) {
		$("#studentId").next("span").text("学号不合法");
		flag = false;
	}
	else {
		$("#studentId").next("span").text("");
	}

	if(!(/^[1-9][0-9]{10}$/.test(phone))) {
		$("#phone").next("span").text("电话不合法");
		flag = false;
	}
	else {
		$("#phone").next("span").text("");
	}

	if(!(/^[\w-]+@([\w-]+\.)+[a-zA-Z]{2,4}$/.test(email))) {
		$("#email").next("span").text("邮箱不合法");
		flag = false;
	}
	else {
		$("#email").next("span").text("");
	}

	return flag;
}

(function () {
	$("#submit").click((event) => {
		if (!isValid()) event.preventDefault();
	})
})();

