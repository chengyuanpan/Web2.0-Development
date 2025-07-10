window.onload = function () {
  var clickbutton = [true, true, true, true, true, false, true];
  var Number = [false, false, false, false, false];

  $("#button").mouseleave(Reset);

  $("#ring-container .button").click(function (event) {
    if (Click(event.target)) {
      action(event.target);
    }
  });

  $("#info-bar").click(getsum);

  $(".apb").click(function (event) {
    if (clickbutton[6]) {
      clickbutton[6] = false;
      seleteall();
    }
  });

  function Reset() {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $("#ring-container .button").css(
      "background-color",
      "rgba(48, 63, 159, 1)"
    );
    $("#info-bar").css("background-color", "#707070");
    clickbutton = [true, true, true, true, true, false, true];
    Number = [false, false, false, false, false];
  }

  function getsum() {
    if (clickbutton[5]) {
      var sum = 0;
      sum += parseInt($("#A span").html());
      sum += parseInt($("#B span").html());
      sum += parseInt($("#C span").html());
      sum += parseInt($("#D span").html());
      sum += parseInt($("#E span").html());
      $("#sum").html(sum + "");
      $("#info-bar").css("background-color", "#707070");
      clickbutton[5] = false;
    }
  }

  function Click(tar) {
    var index = tar.id.charCodeAt() - "A".charCodeAt();
    return clickbutton[index] && !Number[index];
  }

  function action(tar) {
    var content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $("#ring-container .button").css("background-color", "#707070");
    clickbutton = [false, false, false, false, false, false];
    var index = tar.id.charCodeAt() - "A".charCodeAt();
    Number[index] = true;
    $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
    $.get("http://localhost:3000", function (res, status, XHR) {
      $(content).text(res);
      var allnum = 0;
      for (var i = 0; i < 5; i++) {
        if (!Number[i]) {
          clickbutton[i] = true;
          $(".button")[i].style.backgroundColor = "rgba(48, 63, 159, 1)";
        } else {
          allnum++;
          clickbutton[i] = false;
          $(".button")[i].style.backgroundColor = "#707070";
        }
      }
      if (allnum >= 5) {
        clickbutton[5] = true;
        $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
      }
    });
  }

  function allNumber() {
    for (var i = 0; i < 5; i++) {
      if (
        $(".text:eq(" + i + ")").html() == "" ||
        $(".text:eq(" + i + ")").html() == "..."
      )
        return false;
    }
    return true;
  }

  function Callback() {
    var callback = [];
    clickbutton = [false, false, false, false, false, false, true];
    for (var index = 0; index < 5; index++) {
      (function (index) {
        callback[index] = function () {
          var content = $(".button:eq(" + index + ")").find("span");
          $(content).addClass("redSpot");
          $(content).text("...");
          Number[index] = true;
          $(".button")[index].style.backgroundColor = "rgba(48, 63, 159, 1)";
          $.get("http://localhost:3000", function (data) {
            $(".text:eq(" + index + ")").text(data);
            $(".button")[index].style.backgroundColor = "#707070";
            if (allNumber()) {
              clickbutton[5] = true;
              $("#info-bar").css("background-color", "rgba(48, 63, 159, 1)");
              getsum();
            }
          });
        };
      })(index);
    }
    return callback;
  }

  function seleteall() {
    var callback = Callback();
    for (var i = 0; i < callback.length; i++) callback[i]();
  }
};
