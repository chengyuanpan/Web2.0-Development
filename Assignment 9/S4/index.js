(function(){
    const status = {informBar : true, num : false, start : false, finish : 0};
    let url = 'http://localhost';
    let port = 3000;

    function newArray(num) {
        let res = new Array();
        for (let i = 0; i < num; i++) res.push(i);
        return res;
    }

    Array.prototype.shuffle = function() { // 打乱数组
        var array = this;
        var m = array.length,
            t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }    

    function initial() {
        $(".num").on('click', function (event) {
            if (status.num || $(this).children('span').text() != '...') 
                event.preventDefault();
            else {
                disableButton($(this));
                console.log(`${$(this).attr('title')}`);
                $(this).children("span").css({backgroundColor : 'red', opacity : '1'}).text('...');
                $.get(`${url}:${port}/getNum/${$(this).attr('title')}`, (data) => {
                    $(this).children("span").text(data);
                    enablenButton($(this));
                    checkAt();
                });
            }
        });


        $('#button').mouseleave(() => {
            $('.num').children("span").css({opacity : '0'}).text('...');
            $('.num').css('backgroundColor', '#2e3ba4');
            $('.apb').css('backgroundColor', 'grey');
            $('#sum').text('');
            status.start = false;
            status.finish = 0;
        });

        $('.apb').click(() => {
            if (!status.start) {
                status.start = true;
                let btn = newArray(5).shuffle();
                numClick($('.num').eq(btn[0]), () => {
                    numClick($('.num').eq(btn[1]), () => {
                        numClick($('.num').eq(btn[2]), () => {
                            numClick($('.num').eq(btn[3]), () => {
                                numClick($('.num').eq(btn[4]), () => {
                                    $('.apb').click();
                                    status.start = false;
                                });
                            });
                        });
                    });                                
                });
                // status.start = false;
            }
            else {
                if (!status.informBar) event.preventDefault();
                let sum = 0;
                if (status.informBar) {
                    $('.val').each(function() {
                        sum += parseInt($(this).text());
                    });
                    $('#sum').text(`${sum}`);
                    status.informBar = false;
                    $('.apb').css('backgroundColor', 'grey');
                }
            }
        });
    }

    function checkAt() {
        status.informBar = true;
        $('.val').each(function(tar) {
            if ($(this).text() == '...') status.informBar = false;
        });
        if (status.informBar) $('.apb').css('backgroundColor', '#2e3ba4');
        else $('.apb').css('backgroundColor', 'grey');
    }

    /**
     * 激活（enable）其余按钮，呈现为蓝色，用户可以点击，从服务器获取随机数
     */
    function enablenButton(Obj) {
        Obj.css('background', 'grey');
        $('.val').each(function() {
            if ($(this).text() == '...') $(this).parent('.num').css('backgroundColor', '#2e3ba4');
        });
        // $(`.num[title!=${Obj.attr('title')}]`).css('backgroundColor', '#2e3ba4');
        status.num = false;
    }

    /*
     *
     *灭活（disable）其它按钮，变为灰色，用户不能够点击（点击没有响应，也不会发送新的请求到服务器）
     * 
    */
    function disableButton(Obj) {
        $(`.num[title!=${Obj.attr('title')}]`).css('backgroundColor', 'grey');
        status.num = true;
    }

    function numClick(numObjs, callBack) {
        numObjs.each(function() {
            if ($(this).children('span').text() != '...') 
            event.preventDefault();
            else {
                disableButton($(this));
                console.log(`${$(this).attr('title')}`);
                $(this).children("span").css({backgroundColor : 'red', opacity : '1'}).text('...');
                $.get(`${url}:${port}/getNum/${$(this).attr('title')}`, (data) => {
                    $(this).children("span").text(data);
                    enablenButton($(this));
                    checkAt();
                    callBack();
                });
            }
        });
    }

    initial();
})();