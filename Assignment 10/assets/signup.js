(function () {
    if (typeof $ === "undefined") {
        var flag = 0,a = document.createElement("script"), b = document.createElement("script");
        a.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js";
        document.body.appendChild(a);
        b.src = "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js";document.body.appendChild(b);
        a.onload = b.onload = () => {
            flag++;
            if (flag == 2) main();
        }
    }

    function initial() {
        let reg = {
            username : /^[a-zA-Z][\w_]{5,17}$/, // 用户名6~18位英文字母、数字或下划线，必须以英文字母开头
            studentID : /^[1-9]\d{7}$/, //学号8位数字，不能以0开头
            phone : /^[1-9]\d{10}$/, //电话11位数字，不能以0开头
            email : /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //
            password : /[\w-]{6,12}/ //密码为6~12位数字、大小写字母、中划线、下划线
        };
        $(".info").blur(function() {
            let name = $(this).attr("name");
            if ($(this).val().length == 0) {
                status[$(this).attr("name")] = false;
                $(`#${name}`).text(`请填写${$(this).attr("placeholder")}`);
                $(`#${name}`).css("opacity", "1");
                $(`#${name}`).css("color", `#ff5a6a`);
                status[name] = false;
                return;
            }
            else {
                $.get("http://localhost:8000/signSearch", $(this).val().length == 0 ? {} : {[name] : $(this).val()}, (data) => {
                    if (!reg[name].test($(this).val())) {
                        $(`#${name}`).css("opacity", "1");
                        $(`#${name}`).css("color", `#ff5a6a`);        
                        $(`#${name}`).text(`${$(this).attr("placeholder")}不符合规则`);
                        status[name] = false;
                    }
                    else if (data == "true") { //用户名已经存在
                        $(`#${name}`).css("opacity", "1");
                        $(`#${name}`).css("color", `#ff5a6a`);            
                        $(`#${name}`).text(`${$(this).attr("placeholder")}已经存在`);
                        status[name] = false;
                        // $("#name").css("opacity", "1");    
                    }
                    else {
                        $(`#${name}`).css("opacity", "1");
                        $(`#${name}`).css("color", `#ff5a6a`);            
                        $(`#${name}`).text(`该${$(this).attr("placeholder")}可以使用`);
                        $(`#${name}`).css("color", "#42ca6b");
                        status[name] = true;
                        // $("#name").css("opacity", "1");    
                    }
                });// 1 existed, 2 not existed    
            }

        });

        $('.pwd').blur(function() {
            let name = $(this).attr("name");
            if ($(this).val().length == 0) {
                status[$(this).attr("name")] = false;
                $(`#${name}`).text(`请填写${$(this).attr("placeholder")}`);
                $(`#${name}`).css("opacity", "1");
                $(`#${name}`).css("color", `#ff5a6a`);
                status[name] = false;
            }
            else if (!reg[name].test($(this).val())) {
                $(`#${name}`).css("opacity", "1");
                $(`#${name}`).css("color", `#ff5a6a`);        
                $(`#${name}`).text(`${$(this).attr("placeholder")}不符合规则`);
                status[name] = false;
            }
            else {
                $(`#${name}`).css("opacity", "1");
                $(`#${name}`).css("color", `#ff5a6a`);            
                $(`#${name}`).text(`该${$(this).attr("placeholder")}可以使用`);
                $(`#${name}`).css("color", "#42ca6b");
                status[name] = true;
            }
        });

        $('.pwdr').blur(function() {
            let name = $(this).attr("name");
            if ($(this).val().length == 0) {
                $(`#${name}`).css("opacity", "1");
                $(`#${name}`).css("color", `#ff5a6a`);        
                $(`#${name}`).text(`${$(this).attr("placeholder")}为空`);
            }
            else if ($(this).val() != $('.pwd').val()) {
                $(`#${name}`).css("opacity", "1");
                $(`#${name}`).css("color", `#ff5a6a`);        
                $(`#${name}`).text(`${$(this).attr("placeholder")}不一样`);
                status[name] = false;
            }
            else {
                $(`#${name}`).css("opacity", "1");
                $(`#${name}`).css("color", `#ff5a6a`);            
                $(`#${name}`).text(`${$(this).attr("placeholder")}一样`);
                $(`#${name}`).css("color", "#42ca6b");
                status[name] = true;
            }
        });

        $("#reset").click(function() {
            $("span").css("opicaty", "0");
            $("input[type=text]").val(``);
        });

        $("form").on(`submit`, function(event) {
            $('input[type=text]').blur();
            if (!(status.username && status.studentID && 
                  status.phone && status.email && 
                  status.password && status.passwordR)) {
                alert(`请正确填写用户信息`);
                event.preventDefault();
            }
        })
    }

    const status = {
        username : false,
        studentID : false,
        email : false,
        phone : false,
        password : false,
        passwordR : false
    }; // 0 null, 1 error, 2 ok

    function main() {
        initial();
    }
})();

// window.onload = () => {
//     alert('只能够访问自己的数据');
// }
// window.location = 'http://localhost:8000?username=abc';
