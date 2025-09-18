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

    status = {
        username : false,
        password : false
    }

    function main() {
        $('#reg').click(function() {
            window.location = 'http://localhost:8000/regist';
            return;
        });

        $('#login').click(function() {
            if ($('.info').val() == '' || $('.pwd').val() == '') {
                alert('请填写用户名与密码');
                event.preventDefault();
            }
        });
    };
    
    
})();