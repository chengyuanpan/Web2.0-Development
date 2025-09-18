window.onload = function () {
  let isButtonisClickable = [true, true, true, true, true, false];
  let isFetchedNumber = [false, false, false, false, false];
  const DECIMAL = 10;
  const INFO_BAR = 5;
  const COLOR_ACTIVE = "rgba(48, 63, 159, 1)";
  const COLOR_INACTIVE = "#707070";
  const $buttons = $("#ring-container .button");
  const $infoBar = $("#info-bar");

  function reset() {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $buttons.css(
      "background-color",
      COLOR_ACTIVE
    );
    $infoBar.css("background-color", COLOR_INACTIVE);
    isButtonisClickable = [true, true, true, true, true, false];
    isFetchedNumber.fill(false);
  }

  $("#button").mouseleave(reset);

  function isClickable(tar) {
    let index = $(tar).data("index");
    return isButtonisClickable[index] && !isFetchedNumber[index];
  }

  function fetchNumber(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $("#ring-container .button").css("background-color", COLOR_INACTIVE);
    isButtonisClickable.fill(false);
    let index = $(tar).data("index");
    $buttons.eq(index).css("background-color", COLOR_ACTIVE);
    $.get("http://localhost:3000", function (res, status, XHR) {
      $(content).text(res);
      isFetchedNumber[index] = true;
      let fetchedNumCounter = 0;
      for (let i = 0; i < INFO_BAR; i++) {
        if (!isFetchedNumber[i]) {
          isButtonisClickable[i] = true;
          $buttons.eq(i).css("background-color", COLOR_ACTIVE);
        } else {
          fetchedNumCounter++;
          isButtonisClickable[i] = false;
          $buttons.eq(i).css("background-color", COLOR_INACTIVE);
        }
      }
      if (fetchedNumCounter >= INFO_BAR) {
        isButtonisClickable[INFO_BAR] = true;
        $infoBar.css("background-color", COLOR_ACTIVE);
      }
    });
  }

  $("#ring-container .button").click(function () {
    if (isClickable(this)) {
      fetchNumber(this);
    }
  });

  function getSumAndDisplay() {
    if (isButtonisClickable[INFO_BAR]) {
      let sum = 0;
      sum += parseInt($("#A span").html(), DECIMAL);
      sum += parseInt($("#B span").html(), DECIMAL);
      sum += parseInt($("#C span").html(), DECIMAL);
      sum += parseInt($("#D span").html(), DECIMAL);
      sum += parseInt($("#E span").html(), DECIMAL);
      $("#sum").html("" + sum);
      $infoBar.css("background-color", COLOR_ACTIVE);
      isButtonisClickable[INFO_BAR] = false;
    }
  }

  $infoBar.click(getSumAndDisplay);
};
