window.onload = function () {
  let isButtonClickable = [true, true, true, true, true, false];
  let isFetchedNumber = [false, false, false, false, false];
  const $buttons = $("#ring-container .button");
  const $sum = $("#sum");
  const DECIMAL = 10;
  const INFO_BAR = 5;
  const COLOR_ACTIVE = "rgba(48, 63, 159, 1)";
  const COLOR_INACTIVE = "#707070";

  function reset() {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $buttons.css(
      "background-color",
      COLOR_ACTIVE
    );
    $("#info-bar").css("background-color", COLOR_INACTIVE);
    isButtonClickable = [true, true, true, true, true, false];
    isFetchedNumber.fill(false);
  }

  $("#button").mouseleave(reset);

  function getIndex(tar) {
    return tar.id.charCodeAt() - "A".charCodeAt();
  }

  function clickable(tar) {
    let index = getIndex(tar);
    return isButtonClickable[index] && !isFetchedNumber[index];
  }

  function action(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $("#ring-container .button").css("background-color", COLOR_INACTIVE);
    isButtonClickable.fill(false);
    let index = getIndex(tar);
    $(".button").eq(index).css("background-color", COLOR_ACTIVE);
    $.get("http://localhost:3000", function (res, status, XHR) {
      $(content).text(res);
      isFetchedNumber[index] = true;
      let fetchedNumCounter = 0;
      for (let i = 0; i < INFO_BAR; i++) {
        if (!isFetchedNumber[i]) {
          isButtonClickable[i] = true;
          $buttons[i].style.backgroundColor = COLOR_ACTIVE;
        } else {
          fetchedNumCounter++;
          isButtonClickable[i] = false;
          $buttons[i].style.backgroundColor = COLOR_INACTIVE;
        }
      }
      if (fetchedNumCounter >= INFO_BAR) {
        isButtonClickable[INFO_BAR] = true;
        $("#info-bar").css("background-color", COLOR_ACTIVE);
      }
    });
  }

  $("#ring-container .button").click(function () {
    if(clickable(this)) action(this);
  });

  function getSum() {
    if (isButtonClickable[INFO_BAR]) {
      let sum = 0;
      sum += parseInt($("#A span").html(), DECIMAL);
      sum += parseInt($("#B span").html(), DECIMAL);
      sum += parseInt($("#C span").html(), DECIMAL);
      sum += parseInt($("#D span").html(), DECIMAL);
      sum += parseInt($("#E span").html(), DECIMAL);
      $sum.html("" + sum);
      $("#info-bar").css("background-color", COLOR_ACTIVE);
      isButtonClickable[INFO_BAR] = false;
    }
  }

  $("#info-bar").click(getSum);
};
