window.onload = function () {
  let isButtonClickable = [true, true, true, true, true, false, true];
  let isFetchedNumber = [false, false, false, false, false];
  const INFO_BAR = 5;
  const AT_BUTTON = 6;
  const COLOR_ACTIVE = "rgba(48, 63, 159, 1)";
  const COLOR_INACTIVE = "#707070";
  // Writing 10 ensures that it is parsed as a decimal integer to avoid compatibility issues.
  // If you don't specify the base, some browsers will automatically identify the base based on the string prefix (such as "0x", "0"), which may result in strange results.
  const DECIMAL = 10;
  const $buttons = $("#ring-container .button");
  const $infoBar = $("#info-bar");

  function reset() {
    $("span").html("");
    $(".text").removeClass("redSpot");
    $buttons.css("background-color", COLOR_ACTIVE);
    $infoBar.css("background-color", COLOR_INACTIVE);
    isButtonClickable = [true, true, true, true, true, false, true];
    isFetchedNumber.fill(false);
  }

  function isClickable(tar) {
    const index = $(tar).data("index");
    return isButtonClickable[index] && !isFetchedNumber[index];
  }

  function fetchNumber(tar) {
    const content = $(tar).find("span");
    $(content).addClass("redSpot");
    $(content).text("...");
    $buttons.css("background-color", COLOR_INACTIVE);
    isButtonClickable.fill(false);
    const index = $(tar).data("index");
    $buttons.eq(index).css("background-color", COLOR_ACTIVE);
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
        $infoBar.css("background-color", COLOR_ACTIVE);
      }
    });
  }

  function getSumAndDisplay() {
    if (isButtonClickable[INFO_BAR]) {
      let sum = 0;
      $buttons.each(function (i) {
        // || 0 is a fault-tolerant way of writing, ensuring that when parseInt fails (returns NaN), sum can still be accumulated normally without error.
        sum += parseInt($(this).find("span").html(), DECIMAL) || 0;
      });
      $("#sum").html("" + sum);
      $infoBar.css("background-color", COLOR_INACTIVE);
      isButtonClickable[INFO_BAR] = false;
    }
  }

  function Callback(order) {
    let callback = [];
    let buttons = [];
    for (let i = 0; i < order.length; i++) {
      buttons[i] = document.querySelector("#" + order[i]);
    }
    for (let i = 0; i < INFO_BAR; i++) {
      (function (i) {
        let next = i + 1;
        callback[i] = function () {
          let tar = buttons[i];
          let content = $(tar).find("span");
          $(content).addClass("redSpot");
          $(content).text("...");
          $buttons.css("background-color", COLOR_INACTIVE);
          isButtonClickable.fill(false);
          let index = $(tar).data("index");
          isFetchedNumber[index] = true;
          $buttons[index].style.backgroundColor = COLOR_ACTIVE;
          $.get("http://localhost:3000", function (res, status, XHR) {
            $(content).text(res);
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
            callback[next]();
          });
        };
      })(i);
    }
    callback[INFO_BAR] = function () {
      isButtonClickable[INFO_BAR] = true;
      $infoBar.css("background-color", COLOR_ACTIVE);
      getSumAndDisplay();
    };
    return callback;
  }

  function getRandomOrder() {
    let order = [];
    for (let i = 0; i < INFO_BAR; i++) {
      order[i] = Math.round(Math.random() * INFO_BAR);
      order[i] += "A".charCodeAt();
      order[i] = String.fromCharCode(order[i]);
      for (let j = 0; j < i; j++) {
        if (order[j] == order[i] || order[i] == "F") {
          i--;
          break;
        }
      }
    }
    $("#order").text(order.join("、"));
    return order;
  }

  function randomOrder() {
    const order = getRandomOrder();
    const callback = Callback(order);
    callback[0]();
  }

  // Event handler binding
  $("#button").mouseleave(reset);

  $buttons.click(function (event) {
    if (isClickable(event.target)) {
      fetchNumber(event.target);
    }
  });

  $infoBar.click(getSumAndDisplay);

  $(".apb").click(function (event) {
    if (isButtonClickable[AT_BUTTON]) {
      isButtonClickable[AT_BUTTON] = false;
      randomOrder();
    }
  });

};
