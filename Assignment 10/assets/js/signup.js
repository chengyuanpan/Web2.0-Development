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
      if (flag == 2) main();
    };
  }

  function initial() {
    let reg = {
      userName: /^[a-zA-Z][\w_]{5,17}$/, // userName 6~18 characters, must start with a letter
      studentID: /^[1-9]\d{7}$/, // studentID 8 digits, cannot start with 0
      phone: /^[1-9]\d{10}$/, // phone 11 digits, cannot start with 0
      email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, // email format
      password: /[\w-]{6,12}/, // password 6~12 characters, can include letters, numbers, underscores, and hyphens
    };
    $(".info").blur(function () {
      let name = $(this).attr("name");
      if ($(this).val().length == 0) {
        status[$(this).attr("name")] = false;
        $(`#${name}`).text(`Please fill in ${$(this).attr("placeholder")}`);
        $(`#${name}`).css("opacity", "1");
        $(`#${name}`).css("color", `#ff5a6a`);
        status[name] = false;
        return;
      } else {
        $.get(
          "http://localhost:8000/signSearch",
          $(this).val().length == 0 ? {} : { [name]: $(this).val() },
          (data) => {
            if (!reg[name].test($(this).val())) {
              $(`#${name}`).css("opacity", "1");
              $(`#${name}`).css("color", `#ff5a6a`);
              $(`#${name}`).text(`${$(this).attr("placeholder")} is not valid`);
              status[name] = false;
            } else if (data == "true") {
              // userName has existed
              $(`#${name}`).css("opacity", "1");
              $(`#${name}`).css("color", `#ff5a6a`);
              $(`#${name}`).text(`${$(this).attr("placeholder")} has existed`);
              status[name] = false;
              // $("#name").css("opacity", "1");
            } else {
              $(`#${name}`).css("opacity", "1");
              $(`#${name}`).css("color", `#ff5a6a`);
              $(`#${name}`).text(`This ${$(this).attr("placeholder")} can be used`);
              $(`#${name}`).css("color", "#42ca6b");
              status[name] = true;
              // $("#name").css("opacity", "1");
            }
          }
        ); // 1 existed, 2 not existed
      }
    });

    $(".pwd").blur(function () {
      let name = $(this).attr("name");
      if ($(this).val().length == 0) {
        status[$(this).attr("name")] = false;
        $(`#${name}`).text(`Please fill in ${$(this).attr("placeholder")}`);
        $(`#${name}`).css("opacity", "1");
        $(`#${name}`).css("color", `#ff5a6a`);
        status[name] = false;
      } else if (!reg[name].test($(this).val())) {
        $(`#${name}`).css("opacity", "1");
        $(`#${name}`).css("color", `#ff5a6a`);
        $(`#${name}`).text(`${$(this).attr("placeholder")} is not valid`);
        status[name] = false;
      } else {
        $(`#${name}`).css("opacity", "1");
        $(`#${name}`).css("color", `#ff5a6a`);
        $(`#${name}`).text(`This ${$(this).attr("placeholder")} can be used`);
        $(`#${name}`).css("color", "#42ca6b");
        status[name] = true;
      }
    });

    $(".pwdr").blur(function () {
      let name = $(this).attr("name");
      if ($(this).val().length == 0) {
        $(`#${name}`).css("opacity", "1");
        $(`#${name}`).css("color", `#ff5a6a`);
        $(`#${name}`).text(`${$(this).attr("placeholder")} is empty`);
      } else if ($(this).val() != $(".pwd").val()) {
        $(`#${name}`).css("opacity", "1");
        $(`#${name}`).css("color", `#ff5a6a`);
        $(`#${name}`).text(`${$(this).attr("placeholder")} is not the same`);
        status[name] = false;
      } else {
        $(`#${name}`).css("opacity", "1");
        $(`#${name}`).css("color", `#ff5a6a`);
        $(`#${name}`).text(`${$(this).attr("placeholder")} is the same`);
        $(`#${name}`).css("color", "#42ca6b");
        status[name] = true;
      }
    });

    $("#reset").click(function () {
      $("span").css("opicaty", "0");
      $("input[type=text]").val(``);
    });

    $("form").on(`submit`, function (event) {
      $("input[type=text]").blur();
      if (
        !(
          status.userName &&
          status.studentID &&
          status.phone &&
          status.email &&
          status.password &&
          status.passwordR
        )
      ) {
        alert(`Please fill in the user information correctly`);
        event.preventDefault();
      }
    });
  }

  // 0 null, 1 error, 2 ok
  const status = {
    userName: false,
    studentID: false,
    email: false,
    phone: false,
    password: false,
    passwordR: false,
  };

  function main() {
    initial();
  }
})();
