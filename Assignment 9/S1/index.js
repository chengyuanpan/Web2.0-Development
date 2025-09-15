window.onload = function () {
  let clickButton = [true, true, true, true, true, false];
  let number = [false, false, false, false, false];

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
      "rgba(48, 63, 159, 1)"
    );
    $("#info-bar").css("background-color", "#1f1f1fff");
    clickButton = [true, true, true, true, true, false];
    number = [false, false, false, false, false];
  }

  $("#button").mouseleave(Reset);

  $("#ring-container .button").click(function (event) {
    if (Click(event.target)) {
      action(event.target);
    }
  });

  $("#info-bar").click(getsum);

  function getsum() {
    if (clickButton[5]) {
      let sum = 0;
      sum += parseInt($("#A span").html());
      sum += parseInt($("#B span").html());
      sum += parseInt($("#C span").html());
      sum += parseInt($("#D span").html());
      sum += parseInt($("#E span").html());
      $("#sum").html(sum + "");
      $("#info-bar").css("background-color", "#707070");
      clickButton[5] = false;
    }
  }

  function Click(tar) {
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    return clickButton[index] && !number[index];
  }

  function action(tar) {
    let content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $("#ring-container .button").css("background-color", "#707070");
    clickButton = [false, false, false, false, false, false];
    let index = tar.id.charCodeAt() - "A".charCodeAt();
    number[index] = true;
    $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
    $.get("http://localhost:3000", function (res, status, XHR) {
      $(content).text(res);
      let allnum = 0;
      for (let i = 0; i < 5; i++) {
        if (!number[i]) {
          clickButton[i] = true;
          $(".button")[i].style.backgroundColor = "rgba(48, 63, 159, 1)";
        } else {
          allnum++;
          clickButton[i] = false;
          $(".button")[i].style.backgroundColor = "#707070";
        }
      }
      if (allnum >= 5) {
        clickButton[5] = true;
        $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
      }
    });
  }
};
