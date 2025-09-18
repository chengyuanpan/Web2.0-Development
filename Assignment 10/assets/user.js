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

    function main() {
        $('#logout').click(function() {
            $.get('http://localhost:8000/logout');
            window.location = 'http://localhost:8000/login';
        });
    }
})();