// This code is executed immediately after it is defined, Immediately Invoked Function Expression(IIFE)
// (function() {}) : Anonymous function expressions;
// (); : This is the syntax of a function call, which means that the function is executed immediately after it is defined.
(function () {
  if (typeof $ === "undefined") {
    let flag = 0,
      a = document.createElement("script"),
      b = document.createElement("script");
    a.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js";
    document.body.appendChild(a);
    b.src = "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js";
    document.body.appendChild(b);
    a.onload = b.onload = () => {
      flag++;
      if (2 == flag) main();
    };
  }

  const status = {
    userName: false,
    studentID: false,
    email: false,
    phone: false,
  };

  function initial() {
    let rules = {
      userName: /^[A-Za-z]+( [A-Za-z]+)*$/,
      studentID: /^[1-9]\d{7}$/,
      phone: /^[1-9]\d{10}$/,
      email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    };

    $("input[type=text]").blur(function () {
      let name = $(this).attr("name");
      if ($(this).val().length > 0) {
        // 1 existed, 2 not existed
        $(`#${name}`).css("opacity", "1");
        $.get(
          "http://localhost:8000/signSearch",
          { [name]: $(this).val() },
          (data) => {
            if (!rules[name].test($(this).val())) {
              $(`#${name}`).text(
                `${$(this).attr(
                  "placeholder"
                )} isn't in compliance with the rules`
              );
              status[name] = false;
            } else if (data == "true") {
              $(`#${name}`).text(
                `${$(this).attr("placeholder")} already exists`
              );
              status[name] = false;
            } else {
              $(`#${name}`).text(
                `This ${$(this).attr("placeholder")} can be used`
              );
              $(`#${name}`).css("color", "#42ca6b");
              status[name] = true;
            }
          }
        );
      }
    });

    $("#reset").click(function () {
      $("span").css("opacity", "0");
      $("span").text("");
      $("input[type=text]").val("");
    });

    $("form").on(`submit`, function (event) {
      if (
        !(status.userName && status.studentID && status.phone && status.email)
      ) {
        alert(`Please fill in the user information correctly`);
        event.preventDefault();
      }
    });
  }

  function main() {
    initial();
  }
})();
