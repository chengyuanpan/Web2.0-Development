window.onload = function() {
	this.document.getElementById("reset").addEventListener("click", this.initialize);
	this.document.getElementById("submit").addEventListener("click", this.isValid);
	$("#submit").click((event) => {
		if(!this.isValid()) event.preventDefault();
	})
}

function initialize() {
	$("#username").val("");
	$("#studentId").val("");
	$("#phone").val("");
	$("#email").val("");
	$("#username").next("span").text("");
	$("#studentId").next("span").text("");
	$("#phone").next("span").text("");
	$("#email").next("span").text("");
}

function isValid() {
	var username = $("#username").val();
	var studentId = $("#studentId").val();
	var phone = $("#phone").val();
	var email = $("#email").val();
	var valid = true;

	if(!(/^[a-zA-Z]\w{5,17}$/.test(username))) {
		$("#username").next("span").text("名称不合法");
		valid = false;
	}
	else {
		$("#username").next("span").text("");
	}

	if(!(/^[1-9][0-9]{7}$/.test(studentId))) {
		$("#studentId").next("span").text("学号不合法");
		valid = false;
	}
	else {
		$("#studentId").next("span").text("");
	}

	if(!(/^[1-9][0-9]{10}$/.test(phone))) {
		$("#phone").next("span").text("电话不合法");
		valid = false;
	}
	else {
		$("#phone").next("span").text("");
	}

	if(!(/^[\w-]+@([\w-]+\.)+[a-zA-Z]{2,4}$/.test(email))) {
		$("#email").next("span").text("邮箱不合法");
		valid = false;
	}
	else {
		$("#email").next("span").text("");
	}

	return valid;
}


