(function () {
  if (typeof $ === "undefined") {
    var flag = 0,
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
      // Username: 6 to 18 characters long, including English letters, numbers or underscores.
      // Must start with an English letter
      username: /^[a-zA-Z][\w_]{5,17}$/,
      // Student ID: 8 digits, cannot start with 0
      studentID: /^[1-9]\d{7}$/,
      // Phone Number: 11 digits, cannot start with 0
      phone: /^[1-9]\d{10}$/,
      // Email: Must contain an @ symbol, followed by a domain name and a top-level domain (e.g., .com, .cn, etc.)
      // The domain name can contain letters, numbers, underscores, and hyphens.
      email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    };
    $("input[type=text]").blur(function () {
      let name = $(this).attr("name");
      $(`#${name}`).css("opacity", "1");
      $(`#${name}`).css("color", `#ff5a6a`);
      if ($(this).val().length == 0) {
        status[$(this).attr("name")] = false;
        $(`#${name}`).text(`Please input ${$(this).attr("placeholder")}`);
        return;
      } else {
        $.get(
          "http://localhost:8000/signSearch",
          $(this).val().length == 0 ? {} : { [name]: $(this).val() },
          (data) => {
            if (!reg[name].test($(this).val())) {
              $(`#${name}`).text(
                `${$(this).attr(
                  "placeholder"
                )} isn't in compliance with the rules`
              );
              status[name] = false;
            } else if (data == "true") {
              // Username already exists
              $(`#${name}`).text(
                `${$(this).attr("placeholder")} already exists`
              );
              status[name] = false;
              // $("#name").css("opacity", "1");
            } else {
              $(`#${name}`).text(
                `This ${$(this).attr("placeholder")} can be used`
              );
              $(`#${name}`).css("color", "#42ca6b");
              status[name] = true;
              // $("#name").css("opacity", "1");
            }
          }
        ); // 1 existed, 2 not existed
      }
    });
    $("#reset").click(function () {
      $("span").css("opacity", "0");
      $("input[type=text]").val(``);
    });

    $("form").on(`submit`, function (event) {
      if (
        !(status.username && status.studentID && status.phone && status.email)
      ) {
        alert(`Please fill in the user information correctly`);
        event.preventDefault();
      }
    });
  }

  const status = {
    username: false,
    studentID: false,
    email: false,
    phone: false,
  }; // 0 null, 1 error, 2 ok

  function main() {
    initial();
  }
})();
