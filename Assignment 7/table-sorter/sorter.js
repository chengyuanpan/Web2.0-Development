let order = { todo: 0, staff: 0 };

const rowsNumber = 4; // Number of rows to sort, including the header
const columnsNumber = 3; // Number of columns in the table

// Swaps the position of two rows in the DOM
const swap = (rowA, rowB) => {
  const parent = rowA.parentNode;
  const next = rowA.nextSibling === rowB ? rowA : rowA.nextSibling;
  parent.insertBefore(rowB, rowA);
  parent.insertBefore(rowA, next);
};

// Sorts the rows of a table based on the clicked header
const sort = (tableId, i, rows) => {
  for (let j = 1; j < rowsNumber - 1; j++) {
    let upIndex = j;
    for (let k = j + 1; k < rowsNumber; k++) {
      const valK = rows[k].cells[i].textContent.trim();
      const valUp = rows[upIndex].cells[i].textContent.trim();

      if (order[tableId] === 0 || order[tableId] === -1) {
        if (valK < valUp) upIndex = k;
      } else {
        if (valK > valUp) upIndex = k;
      }
    }
    if (upIndex !== j) {
      swap(rows[j], rows[upIndex]);
      // Since the rows may have been moved by the DOM, refresh the rows reference
      rows = document.getElementById(tableId).rows;
    }
  }
};

// Determines which table to sort based on the clicked header and calls the sort function
const judge = (event) => {
  let tableId;
  const targetText = event.target.textContent.trim();
  if (targetText === "What?" || targetText === "When?" || targetText === "Location") {
    tableId = "todo";
  } else {
    tableId = "staff";
  }

  let rows = document.getElementById(tableId).rows;
  for (let i = 0; i < columnsNumber; i++) {
    if (rows[0].cells[i].textContent.trim() === targetText) {
      sort(tableId, i, rows);
      order[tableId] = order[tableId] === 1 ? -1 : 1;
    }
  }

  $("#" + tableId + " th").attr("class", "normal");
  if (order[tableId] === 1) {
    event.target.className = "sortedAscend";
  } else {
    event.target.className = "sortedDescend";
  }
};

window.onload = () => {
  $("th").click(judge);
};
