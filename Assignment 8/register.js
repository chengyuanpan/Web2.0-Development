window.onload = function () {
	document.getElementById("reset").onclick = function () {
		document.getElementById("name").value = "";
		document.getElementById("id").value = "";
		document.getElementById("email").value = "";
		document.getElementById("phone").value = "";
	}
}