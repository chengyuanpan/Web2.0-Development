window.onload = function () {
  let buttonClickable = [true, true, true, true, true, false];
  let numberFetched = [false, false, false, false, false];

  function Reset() {
    // This selector will match all <span> elements on the page, clearing their contents.
    // There are the following <span> tags:
    // 1. <span id="sum"></span>
    // Located within the #info-bar, it displays the total.
    // 2. <span class="text"></span> tags within the five buttons
    // Inside the five <li> tags A, B, C, D, and E, they display the corresponding numbers.
    $("span").html("");
    $(".text").removeClass("redSpot");
    $("#ring-container .button").css(
      "background-color",
      "rgba(48, 159, 48, 1)"
    );
    $("#info-bar").css("background-color", "#808080");
    buttonClickable = [true, true, true, true, true, false];
    numberFetched = [false, false, false, false, false];
  }

  $("#button").mouseleave(Reset);

  function clickable(tar) {
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    return buttonClickable[index] && !numberFetched[index];
  }

  function action(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $("#ring-container .button").css("background-color", "#707070");
    buttonClickable = [false, false, false, false, false, false];
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    $(".button")[index].style.backgroundColor = "rgba(255, 123, 53, 1)";
    $.get("http://localhost:3000", function (res, status, XHR) {
      $(content).text(res);
      numberFetched[index] = true;
      let fetchedNumCounter = 0;
      for (let i = 0; i < 5; i++) {
        if (!numberFetched[i]) {
          buttonClickable[i] = true;
          $(".button")[i].style.backgroundColor = "rgba(48, 159, 48, 1)";
        } else {
          fetchedNumCounter++;
          buttonClickable[i] = false;
          $(".button")[i].style.backgroundColor = "#707070";
        }
      }
      if (fetchedNumCounter >= 5) {
        buttonClickable[5] = true;
        $("#info-bar").css("background-color", "rgba(48, 159, 48, 1)");
      }
    });
  }

  $("#ring-container .button").click(function (event) {
    if (clickable(event.target)) {
      action(event.target);
    }
  });

  function getSum() {
    if (buttonClickable[5]) {
      let sum = 0;
      sum += parseInt($("#A span").html());
      sum += parseInt($("#B span").html());
      sum += parseInt($("#C span").html());
      sum += parseInt($("#D span").html());
      sum += parseInt($("#E span").html());
      $("#sum").html("" + sum);
      $("#info-bar").css("background-color", "rgba(48, 159, 48, 1)");
      buttonClickable[5] = false;
    }
  }

  $("#info-bar").click(getSum);
};
