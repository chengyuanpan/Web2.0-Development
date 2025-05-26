order = 0;
$("th").click(function (event) {
	var rows = document.getElementsByTagName("table")[0].rows;
	var tmp;
	for (var i = 0; i < rows[0].cells.length; i++) {
		if (rows[0].cells[i].innerHTML == event.target.innerHTML) {
			var up;
			for (var j = 1; j < rows.length; j++) {
				up = rows[j];
				for (var k = j+1; k < rows.length; k++) {
					if (order == 0 || order == -1) {
						if (parseInt(rows[k].cells[i].innerHTML) < parseInt(up.cells[i].innerHTML)) up = rows[k];
					} else {
						if (parseInt(rows[k].cells[i].innerHTML) > parseInt(up.cells[i].innerHTML)) up = rows[k];
					}
				}
				tmp = up.innerHTML;
				up.innerHTML = rows[j].innerHTML;
				rows[j].innerHTML = tmp;
			}
			if (order == 1) order = -1;
			else order = 1;
		}
	}
});
