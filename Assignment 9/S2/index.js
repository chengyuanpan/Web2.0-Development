window.onload = function () {
  let buttonClickable = [true, true, true, true, true, false, true];
  let fetchedNumber = [false, false, false, false, false];

  function Reset() {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $("#ring-container .button").css(
      "background-color",
      "rgba(48, 63, 159, 1)"
    );
    $("#info-bar").css("background-color", "#707070");
    buttonClickable = [true, true, true, true, true, false, true];
    fetchedNumber = [false, false, false, false, false];
  }

  $("#button").mouseleave(Reset);

  $("#ring-container .button").click(function (event) {
    if (Click(event.target)) {
      action(event.target);
    }
  });

  $("#info-bar").click(getsum);

  $(".apb").click(function (event) {
    if (buttonClickable[6]) {
      buttonClickable[6] = false;
      inorder();
    }
  });

  function getsum() {
    if (buttonClickable[5]) {
      let sum = 0;
      sum += parseInt($("#A span").html());
      sum += parseInt($("#B span").html());
      sum += parseInt($("#C span").html());
      sum += parseInt($("#D span").html());
      sum += parseInt($("#E span").html());
      $("#sum").html(sum + "");
      $("#info-bar").css("background-color", "#707070");
      buttonClickable[5] = false;
    }
  }

  function Click(tar) {
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    return buttonClickable[index] && !fetchedNumber[index];
  }

  function action(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $("#ring-container .button").css("background-color", "#707070");
    buttonClickable = [false, false, false, false, false, false];
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    fetchedNumber[index] = true;
    $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
    $.get("http://localhost:3000", function (res, status, XHR) {
      $(content).text(res);
      let allnum = 0;
      for (let i = 0; i < 5; i++) {
        if (!fetchedNumber[i]) {
          buttonClickable[i] = true;
          $(".button")[i].style.backgroundColor = "rgba(48, 63, 159, 1)";
        } else {
          allnum++;
          buttonClickable[i] = false;
          $(".button")[i].style.backgroundColor = "#707070";
        }
      }
      if (allnum >= 5) {
        buttonClickable[5] = true;
        $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
      }
    });
  }

  function Callback(order) {
    let callback = [];
    let buttons = [];
    for (let i = 0; i < order.length; i++) {
      buttons[i] = document.querySelector("#" + order[i]);
    }
    for (let i = 0; i < 5; i++) {
      (function (i) {
        let next = i + 1;
        callback[i] = function () {
          let tar = buttons[i];
          let content = $(tar).find("span");
          $(content).addClass("redSpot");
          $(content).text("...");
          $("#ring-container .button").css("background-color", "#707070");
          buttonClickable = [false, false, false, false, false, false];
          let index = tar.id.charCodeAt() - "A".charCodeAt();
          fetchedNumber[index] = true;
          $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
          $.get("http://localhost:3000", function (res, status, XHR) {
            $(content).text(res);
            let allnum = 0;
            for (let i = 0; i < 5; i++) {
              if (!fetchedNumber[i]) {
                buttonClickable[i] = true;
                $(".button")[i].style.backgroundColor = "rgba(48, 63, 159, 1)";
              } else {
                allnum++;
                buttonClickable[i] = false;
                $(".button")[i].style.backgroundColor = "#707070";
              }
            }
            callback[next]();
          });
        };
      })(i);
    }
    callback[5] = function () {
      buttonClickable[5] = true;
      $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
      getsum();
    };
    return callback;
  }

  function inorder() {
    let order = ["A", "B", "C", "D", "E"];
    let callback = Callback(order);
    callback[0]();
  }
};
