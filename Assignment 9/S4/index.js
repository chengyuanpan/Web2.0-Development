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
  let activeRequests = [];

  function reset() {
    // Cancel all ongoing ajax requests
    activeRequests.forEach(req => req.abort());
    activeRequests = [];  // Clear the list

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
    const req = $.get("http://localhost:3000", function (res, status, XHR) {
      $(content).text(res);
      isFetchedNumber[index] = true;
      let fetchedNumCounter = 0;
      for (let i = 0; i < INFO_BAR; i++) {
        if (!isFetchedNumber[i]) {
          isButtonClickable[i] = true;
          $buttons.eq(i).css("background-color", COLOR_ACTIVE);
        } else {
          fetchedNumCounter++;
          isButtonClickable[i] = false;
          $buttons.eq(i).css("background-color", COLOR_INACTIVE);
        }
      }
      if (fetchedNumCounter >= INFO_BAR) {
        isButtonClickable[INFO_BAR] = true;
        $infoBar.css("background-color", COLOR_ACTIVE);
      }
    }).always(function () {
      // Remove from the list regardless of success or failure to avoid memory leaks
      activeRequests = activeRequests.filter(r => r !== req);
    });
    activeRequests.push(req);
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

  function Callback(letters) {
    let callback = [];
    const buttons = [];
    for (let i = 0; i < letters.length; i++) {
      buttons[i] = document.querySelector("#" + letters[i]);
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
          $buttons.eq(index).css("background-color", COLOR_ACTIVE);
          const req = $.get("http://localhost:3000", function (res, status, XHR) {
            $(content).text(res);
            isFetchedNumber[index] = true;
            isButtonClickable[index] = false;
            let fetchedNumCounter = 0;
            for (let i = 0; i < INFO_BAR; i++) {
              if (!isFetchedNumber[i]) {
                isButtonClickable[i] = true;
                $buttons.eq(i).css("background-color", COLOR_ACTIVE);
              } else {
                fetchedNumCounter++;
                isButtonClickable[i] = false;
                $buttons.eq(i).css("background-color", COLOR_INACTIVE);
              }
            }
            callback[next]();
          }).always(function () {
            activeRequests = activeRequests.filter(r => r !== req);
          });
          activeRequests.push(req);
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
    const letters = Array.from({ length: INFO_BAR }, (_, i) =>
      String.fromCharCode("A".charCodeAt(0) + i)
    );

    // Fisher–Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // j : [0, i]
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    $("#order").text(letters.join("、"));
    return letters;
  }

  function randomOrder() {
    const letters = getRandomOrder();
    const callback = Callback(letters);
    callback[0]();
  }

  // Event handler binding
  $("#button").mouseleave(reset);

  $buttons.click(function () {
    if (isClickable(this)) {
      fetchNumber(this);
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
