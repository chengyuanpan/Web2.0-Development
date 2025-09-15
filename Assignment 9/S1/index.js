window.onload = function () {
  let buttonClickable = [true, true, true, true, true, false];
  let numberFetched = [false, false, false, false, false];
  const $buttons = $("#ring-container .button");
  const $sum = $("#sum");
  const DECIMAL = 10;
  const INFO_BAR = 5;

  function Reset() {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $("#ring-container .button").css(
      "background-color",
      "rgba(48, 159, 48, 1)"
    );
    $("#info-bar").css("background-color", "#808080");
    buttonClickable = [true, true, true, true, true, false];
    numberFetched.fill(false);
  }

  $("#button").mouseleave(Reset);

  function getIndex(tar) {
    return tar.id.charCodeAt() - "A".charCodeAt();
  }

  function clickable(tar) {
    let index = getIndex(tar);
    return buttonClickable[index] && !numberFetched[index];
  }

  function action(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $("#ring-container .button").css("background-color", "#707070");
    buttonClickable.fill(false);
    let index = getIndex(tar);
    $buttons[index].style.backgroundColor = "rgba(255, 123, 53, 1)";
    $.get("http://localhost:3000", function (res, status, XHR) {
      $(content).text(res);
      numberFetched[index] = true;
      let fetchedNumCounter = 0;
      for (let i = 0; i < INFO_BAR; i++) {
        if (!numberFetched[i]) {
          buttonClickable[i] = true;
          $buttons[i].style.backgroundColor = "rgba(48, 159, 48, 1)";
        } else {
          fetchedNumCounter++;
          buttonClickable[i] = false;
          $buttons[i].style.backgroundColor = "#707070";
        }
      }
      if (fetchedNumCounter >= INFO_BAR) {
        buttonClickable[INFO_BAR] = true;
        $("#info-bar").css("background-color", "rgba(48, 159, 48, 1)");
      }
    });
  }

  $("#ring-container .button").click(function () {
    if(clickable(this)) action(this);
  });

  function getSum() {
    if (buttonClickable[INFO_BAR]) {
      let sum = 0;
      sum += parseInt($("#A span").html(), DECIMAL);
      sum += parseInt($("#B span").html(), DECIMAL);
      sum += parseInt($("#C span").html(), DECIMAL);
      sum += parseInt($("#D span").html(), DECIMAL);
      sum += parseInt($("#E span").html(), DECIMAL);
      $sum.html("" + sum);
      $("#info-bar").css("background-color", "rgba(48, 159, 48, 1)");
      buttonClickable[INFO_BAR] = false;
    }
  }

  $("#info-bar").click(getSum);
};
