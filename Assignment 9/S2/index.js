window.onload = function () {
  let buttonClickable = [true, true, true, true, true, false, true];
  let fetchedNumber = [false, false, false, false, false];
  const INFO_BAR = 5;
  const AT_BUTTON = 6;
  const COLOR_ACTIVE = "rgba(48, 63, 159, 1)";
  const COLOR_INACTIVE = "#707070";
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
      COLOR_ACTIVE
    );
    $("#info-bar").css("background-color", COLOR_INACTIVE);
    buttonClickable = [true, true, true, true, true, false, true];
    fetchedNumber.fill(false);
  };

  $("#button").mouseleave(reset);

  const getIndex = function (tar) {
    return tar.id.charCodeAt() - "A".charCodeAt();
  };

  const isClickable = function (tar) {
    let index = getIndex(tar);
    return buttonClickable[index] && !fetchedNumber[index];
  };

  const fetchNumber = function (tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $buttons.css("background-color", COLOR_INACTIVE);
    buttonClickable.fill(false);
    let index = getIndex(tar);
    $(".button")[index].style.backgroundColor = COLOR_ACTIVE;
    $.get("http://localhost:3000", function (res, status, XHR) {
      fetchedNumber[index] = true;
      $(content).text(res);
      let fetchedNumCounter = 0;
      for (let i = 0; i < INFO_BAR; i++) {
        if (!fetchedNumber[i]) {
          buttonClickable[i] = true;
          $(".button")[i].style.backgroundColor = COLOR_ACTIVE;
        } else {
          fetchedNumCounter++;
          buttonClickable[i] = false;
          $(".button")[i].style.backgroundColor = COLOR_INACTIVE;
        }
      }
      if (fetchedNumCounter >= INFO_BAR) {
        buttonClickable[INFO_BAR] = true;
        $("#info-bar").css("background-color", COLOR_ACTIVE);
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
      $("#info-bar").css("background-color", COLOR_INACTIVE);
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
          $buttons.css("background-color", COLOR_INACTIVE);
          buttonClickable.fill(false);
          let index = getIndex(tar);
          $(".button")[index].style.backgroundColor = COLOR_ACTIVE;
          // Asynchronous request
          $.get("http://localhost:3000", function (res, status, XHR) {
            fetchedNumber[index] = true;
            $(content).text(res);
            let fetchedNumCounter = 0;
            for (let i = 0; i < INFO_BAR; i++) {
              if (!fetchedNumber[i]) {
                buttonClickable[i] = true;
                $(".button")[i].style.backgroundColor = COLOR_ACTIVE;
              } else {
                fetchedNumCounter++;
                buttonClickable[i] = false;
                $(".button")[i].style.backgroundColor = COLOR_INACTIVE;
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
      $("#info-bar").css("background-color", COLOR_ACTIVE);
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
