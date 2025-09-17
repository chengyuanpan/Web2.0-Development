window.onload = function () {
  let buttonClickable = [true, true, true, true, true, false, true];
  let fetchedNumber = [false, false, false, false, false];
  const INFO_BAR = 5;
  const AT_BUTTON = 6;
  // Writing 10 ensures that it is parsed as a decimal integer to avoid compatibility issues.
  // If you don't specify the base, some browsers will automatically identify the base based on the string prefix (such as "0x", "0"), which may result in strange results.
  const DECIMAL = 10;
  const $buttons = $("#ring-container .button");
  const $sum = $("#sum");

  const reset = function () {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $buttons.css(
      "background-color",
      "rgba(48, 63, 159, 1)"
    );
    $("#info-bar").css("background-color", "#707070");
    buttonClickable = [true, true, true, true, true, false, true];
    fetchedNumber.fill(false);
  };

  $("#button").mouseleave(reset);

  const isClickable = function (tar) {
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    return buttonClickable[index] && !fetchedNumber[index];
  };

  const fetchNumber = function (tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $buttons.css("background-color", "#707070");
    buttonClickable.fill(false);
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
    $.get("http://localhost:3000", function (res, status, XHR) {
      fetchedNumber[index] = true;
      $(content).text(res);
      let fetchedNumCounter = 0;
      for (let i = 0; i < INFO_BAR; i++) {
        if (!fetchedNumber[i]) {
          buttonClickable[i] = true;
          $(".button")[i].style.backgroundColor = "rgba(48, 63, 159, 1)";
        } else {
          fetchedNumCounter++;
          buttonClickable[i] = false;
          $(".button")[i].style.backgroundColor = "#707070";
        }
      }
      if (fetchedNumCounter >= INFO_BAR) {
        buttonClickable[INFO_BAR] = true;
        $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
      }
    });
  };

  $buttons.click(function () {
    if (isClickable(this)) {
      fetchNumber(this);
    }
  });

  const getSum = function () {
    if (buttonClickable[INFO_BAR]) {
      let sum = 0;
      sum += parseInt($("#A span").html(), DECIMAL);
      sum += parseInt($("#B span").html(), DECIMAL);
      sum += parseInt($("#C span").html(), DECIMAL);
      sum += parseInt($("#D span").html(), DECIMAL);
      sum += parseInt($("#E span").html(), DECIMAL);
      $sum.html("" + sum);
      $("#info-bar").css("background-color", "#707070");
      buttonClickable[INFO_BAR] = false;
    }
  };

  $("#info-bar").click(getSum);

  function Callback(order) {
    let callback = [];
    let buttons = [];
    for (let i = 0; i < order.length; i++) {
      buttons[i] = document.querySelector("#" + order[i]);
    }
    for (let i = 0; i < INFO_BAR; i++) {
      (function (i) { // IIFE
        let next = i + 1;
        callback[i] = function () {
          let tar = buttons[i];
          let content = $(tar).find("span");
          $(content).addClass("redSpot");
          $(content).text("...");
          $buttons.css("background-color", "#707070");
          buttonClickable.fill(false);
          let index = tar.id.charCodeAt() - "A".charCodeAt();
          $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
          // Asynchronous request
          $.get("http://localhost:3000", function (res, status, XHR) {
            fetchedNumber[index] = true;
            $(content).text(res);
            let fetchedNumCounter = 0;
            for (let i = 0; i < INFO_BAR; i++) {
              if (!fetchedNumber[i]) {
                buttonClickable[i] = true;
                $(".button")[i].style.backgroundColor = "rgba(48, 63, 159, 1)";
              } else {
                fetchedNumCounter++;
                buttonClickable[i] = false;
                $(".button")[i].style.backgroundColor = "#707070";
              }
            }
            // $.get is asynchronous.
            // The function inside it executes only after the Ajax request completes.
            // This gives the outer for loop enough time to complete the assignment of all callback[i] values.
            // Therefore, callback[next] won't be called before a value is assigned.
            callback[next]();
          });
        };
      })(i);
    }
    callback[INFO_BAR] = function () {
      buttonClickable[INFO_BAR] = true;
      $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
      getSum();
    };
    return callback;
  }

  function inorder() {
    const order = ["A", "B", "C", "D", "E"];
    const callback = Callback(order);
    callback[0]();
  }

  $(".apb").click(function (event) {
    if (buttonClickable[AT_BUTTON]) {
      buttonClickable[AT_BUTTON] = false;
      inorder();
    }
  });
};
