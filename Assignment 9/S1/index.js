window.onload = function () {
  let isButtonisClickable = [true, true, true, true, true, false];
  let isFetchedNumber = [false, false, false, false, false];
  // Writing 10 ensures that it is parsed as a decimal integer to avoid compatibility issues.
  // If you don't specify the base, some browsers will automatically identify the base based on the string prefix (such as "0x", "0"), which may result in strange results.
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

  function isClickable(tar) {
    let index = $(tar).data("index");
    return isButtonisClickable[index] && !isFetchedNumber[index];
  }

  function fetchNumber(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $buttons.css("background-color", COLOR_INACTIVE);
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

  function getSumAndDisplay() {
    if (isButtonisClickable[INFO_BAR]) {
      let sum = 0;
      $buttons.each(function (i) {
        // || 0 is a fault-tolerant way of writing, ensuring that when parseInt fails (returns NaN), sum can still be accumulated normally without error.
        sum += parseInt($(this).find("span").html(), DECIMAL) || 0;
      });
      $("#sum").html("" + sum);
      $infoBar.css("background-color", COLOR_ACTIVE);
      isButtonisClickable[INFO_BAR] = false;
    }
  }

  // Event handler binding
  $("#button").mouseleave(reset);

  $buttons.click(function () {
    if (isClickable(this)) {
      fetchNumber(this);
    }
  });

  $infoBar.click(getSumAndDisplay);
};
