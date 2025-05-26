var order = {todo: 0, staff: 0};

function judge(event) {
	if (event.target.innerHTML == "What?" || event.target.innerHTML == "When?" || event.target.innerHTML == "Location") var tableId = "todo";
	else var tableId = "staff";
	var rows = document.getElementById(tableId).rows;
	for (var i = 0; i < 3; i++) {
		if (rows[0].cells[i].innerHTML == event.target.innerHTML) {
			sort(tableId, i, rows);
			if (order[tableId] == 1) order[tableId] = -1;
			else order[tableId] = 1;
		}
	}
	$("#"+tableId+" th").attr("class","normal");
	if (order[tableId] == 1) event.target.className = "sortedAscend";
	else event.target.className = "sortedDescend";
}

function sort(tableId, i, rows) {
	var up;
	for (var j = 1; j < 3; j++) {
		up = rows[j];
		for (var k = j+1; k < 4; k++) {
			if (order[tableId] == 0 || order[tableId] == -1) {
				if (rows[k].cells[i].innerHTML < up.cells[i].innerHTML) up = rows[k];
			} else {
				if (rows[k].cells[i].innerHTML > up.cells[i].innerHTML) up = rows[k];
			}
		}
		swap(rows[j], up);
	}
}

function swap(rowA, rowB) {
	var tmp;
	tmp = rowA.innerHTML;
	rowA.innerHTML = rowB.innerHTML;
	rowB.innerHTML = tmp;
}

window.onload = function() {
	$("th").click(judge);
}
