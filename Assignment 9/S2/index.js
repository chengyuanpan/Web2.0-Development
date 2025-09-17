window.onload = function () {
  let buttonClickable = [true, true, true, true, true, false, true];
  let fetchedNumber = [false, false, false, false, false];
  const INFO_BAR = 5;

  const Reset = function() {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $("#ring-container .button").css(
      "background-color",
      "rgba(48, 63, 159, 1)"
    );
    $("#info-bar").css("background-color", "#707070");
    buttonClickable = [true, true, true, true, true, false, true];
    fetchedNumber = [false, false, false, false, false];
  };

  $("#button").mouseleave(Reset);

  const clickable = function(tar) {
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    return buttonClickable[index] && !fetchedNumber[index];
  };

  const action = function(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $("#ring-container .button").css("background-color", "#707070");
    buttonClickable.fill(false);
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
    $.get("http://localhost:3000", function (res, status, XHR) {
      fetchedNumber[index] = true;
      $(content).text(res);
      let allnum = 0;
      for (let i = 0; i < INFO_BAR; i++) {
        if (!fetchedNumber[i]) {
          buttonClickable[i] = true;
          $(".button")[i].style.backgroundColor = "rgba(48, 63, 159, 1)";
        } else {
          allnum++;
          buttonClickable[i] = false;
          $(".button")[i].style.backgroundColor = "#707070";
        }
      }
      if (allnum >= INFO_BAR) {
        buttonClickable[INFO_BAR] = true;
        $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
      }
    });
  };

  $("#ring-container .button").click(function () {
    if (clickable(this)) {
      action(this);
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
    if (buttonClickable[INFO_BAR]) {
      let sum = 0;
      sum += parseInt($("#A span").html());
      sum += parseInt($("#B span").html());
      sum += parseInt($("#C span").html());
      sum += parseInt($("#D span").html());
      sum += parseInt($("#E span").html());
      $("#sum").html(sum + "");
      $("#info-bar").css("background-color", "#707070");
      buttonClickable[INFO_BAR] = false;
    }
  }

  function Callback(order) {
    let callback = [];
    let buttons = [];
    for (let i = 0; i < order.length; i++) {
      buttons[i] = document.querySelector("#" + order[i]);
    }
    for (let i = 0; i < INFO_BAR; i++) {
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
            for (let i = 0; i < INFO_BAR; i++) {
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
    callback[INFO_BAR] = function () {
      buttonClickable[INFO_BAR] = true;
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
