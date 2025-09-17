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

  function reset() {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $buttons.css("background-color", "rgba(48, 63, 159, 1)");
    $("#info-bar").css("background-color", "#707070");
    buttonClickable = [true, true, true, true, true, false, true];
    fetchedNumber.fill(false);
    $sum.html("");
  }

  $("#button").mouseleave(reset);

  function isClickable(tar) {
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    return buttonClickable[index] && !fetchedNumber[index];
  }

  function fetchNumber(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $buttons.css("background-color", "#707070");
    buttonClickable.fill(false);
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
      if (allnum >= INFO_BAR) {
        buttonClickable[INFO_BAR] = true;
        $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
      }
    });
  }

  $buttons.click(function () {
    if (isClickable(this)) {
      fetchNumber(this);
    }
  });

  $("#info-bar").click(getsum);

  $(".apb").click(function (event) {
    if (buttonClickable[AT_BUTTON]) {
      buttonClickable[AT_BUTTON] = false;
      selectAll();
    }
  });

  function getsum() {
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
  }

  function allNumber() {
    for (let i = 0; i < INFO_BAR; i++) {
      if (
        $(".text:eq(" + i + ")").html() == "" ||
        $(".text:eq(" + i + ")").html() == "..."
      )
        return false;
    }
    return true;
  }

  function Callback() {
    let callback = [];
    buttonClickable = [false, false, false, false, false, false, true];
    for (let index = 0; index < INFO_BAR; index++) {
      (function (index) {
        callback[index] = function () {
          let content = $(".button:eq(" + index + ")").find("span");
          $(content).addClass("redSpot");
          $(content).text("...");
          fetchedNumber[index] = true;
          $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
          $.get("http://localhost:3000", function (data) {
            $(".text:eq(" + index + ")").text(data);
            $(".button")[index].style.backgroundColor = "#707070";
            if (allNumber()) {
              buttonClickable[INFO_BAR] = true;
              $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
              getsum();
            }
          });
        };
      })(index);
    }
    return callback;
  }

  function selectAll() {
    let callback = Callback();
    for (let i = 0; i < callback.length; i++) callback[i]();
  }
};
