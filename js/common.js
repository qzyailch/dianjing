//公用的js
var common = {
    baseUrl: "http://pkpltest.wodeji.net",//http://pkpltest.wodeji.net  //  //http://192.168.0.116
    mallExchange: false,
    loginState: false,
    isPlayer: false,
    loadingFc: '',
    mineMsg: {
        account: {
            figureurl: '',
            nickname: '',
            balance: 0
        }
    },
    userCookie: '',
    loadingDd: '',
    request: function (options) {
        var Token = this.getCookie("Access_Token");
        var that = this;
        var html = "";
        common.removeLoading();
        html += '<div class="js_loading" id="jsLoading">';
        html += '<div id="loadingBox" ><i id="loadingPic" style="background-position:0,0"></i><p>loading<em id="ellipsis">...</em></p></div>';
        html += '</div>';
        options.isLoading = options.isLoading || false;
        if (options.isLoading) {
            $("body").append(html);
            that.loadingMore();
        }
        $.ajax({
            url: common.baseUrl + options.url,//请求路径
            data: options.data || '', //参数
            type: options.type || "post", //请求方法
            cache: false, //是否缓存
            dataType: options.dataType || "json", //请求数据格式
            contentType: "application/json",
            beforeSend: function (request) { //请求前
                //设置公共header
                request.setRequestHeader("access_token", Token);
            },
            success: function (resp) {  //成功回掉
                if (resp.code == 0) {
                    options.success_fun(resp.data);
                } else {
                    common.removeLoading();
                    options.error_fun(resp.message);
                }
            },
            error: function (err) { //失败回掉
                common.removeLoading();
                if (err.status == 404) {
                    options.error_fun("请求地址错误！");
                } else if (err.status == 401) {
                    options.error_fun("权限错误，请登陆！");
                    loginOUt401();
                } else {
                    options.error_fun("网络请求错误！");

                }

            }
        })
    },
    //===============================================获取？后面的参数
    getQueryString:function(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return ""; 
    },
    //===============================================金额小数点后2位
    toDecimal2: function (x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    },

    //====================================设置cookie
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;

    },
    //=========================================得到cookie
    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = $.trim(ca[i]);
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return common.getQueryString(cname);
    },
    //==================================检查cookie
    checkCookie: function () {
        var user = this.getCookie("Access_Token");
        if (user != "") {
            this.loginState = true;
        }
        else {
            this.loginState = false;
        }
    },
    // =====================================删除cookie
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },

    //  ===========================================删除loading
    removeLoading: function () {
        var that = this;
        clearInterval(common.loadingFc);
        clearInterval(common.loadingDd);
        $("#jsLoading").remove();
    },
    //  加载的loading
    loadingMore: function () {
        var loadingBox = $('#loadingPic');
        var ellipsisCont = $("#ellipsis");
        var cont = 0, that = this, ellipsisInt = ".";
        clearInterval(that.loadingFc);
        clearInterval(that.loadingDd);
        that.loadingFc = setInterval(function () {
            cont = cont - 131;
            loadingBox.css('background-position', '' + cont + 'px  0px ');
            if (cont == -6681) {
                cont = 0;
            }
        }, 51);
        that.loadingDd = setInterval(function () {
            ellipsisInt = ellipsisInt + '.';
            ellipsisCont.html(ellipsisInt);
            if (ellipsisInt == "...") {
                ellipsisInt = ""
            }
        }, 600);
    },


    //========================================时间搓转年月日
    formatDateTime: function (timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y + M + D + h + m + s;
    },

    //==============================获取用户信息 bp值
    getUserInfor: function () {
        var options = {
            url: '/user.do',
            type: 'get',
            dataType: 'json',
            isLoading: true,
            success_fun: function (data) {
                data.account.balance = data.account.balance / 100;
                common.mineMsg = data;
                common.mineMsg.account.balance = data.account ? common.toDecimal2(data.account.balance) : 0;
                $("#headerMain .bp-number-li p").find("span").html(common.mineMsg.account.balance);
                $("#headerMain .icon").attr('src', data.user.figureurl);
                common.setCookie("bpNumber", data.account.balance, 1);
            },
            error_fun: function (err) {
                common.removeLoading();
                $('#alertsss').html('<div id="alertssstop">' + err + '</div>');
                alertshow();
            }
        };
        common.request(options);
    },

    //===================================获取登录的信息
    getLoginState: function () {
        var stateUrl = window.location.href;
        common.mallExchange = stateUrl.indexOf("exchangemMall") > -1 ? true : false;
        if (stateUrl.indexOf("index") == -1 && !common.loginState && !common.mallExchange) {
            window.location.href = 'index.html';
        }
        if (stateUrl.indexOf("index") > -1) {
            $("#headerMain ul>li").eq(0).addClass("active");
        }
        if (common.loginState) {
            $("#login").addClass("dno");
            $("#headerMain .islogin-box").removeClass("dno");
            $("#headerMain .bp-number-li p").removeClass("dno");
            $("#headerMain .hrader-mine-right ol").removeClass("dno");
        } else {
            $("#login").removeClass("dno");
            $("#headerMain .islogin-box").addClass("dno");
            $("#headerMain .bp-number-li p").addClass("dno");
            $("#headerMain .hrader-mine-right ol").addClass("dno");
        }
    },


};

//==============================================页面跳转
//index页面跳转
$("#headerMain span.utlSpan").on("click", function () {
    var url = $(this).attr('url');
    $("#headerMain li").removeClass("active");
    $(this).parent().addClass("active").end().parents("li").addClass("active");
    if (!common.loginState) {
        if (!common.mallExchange) {
            if (url.indexOf("exchangemMall") > -1) {
                common.mallExchange = true;
                window.location.href = url;
            } else {

                $("#login").click();
            }
        } else {
            common.mallExchange = false;
            window.location.href = "index.html";
        }

    } else {
        window.location.href = url;
    }
});
//==============================系统消息
function noticeMsg() {
    var options = {
        url: '/message.do',
        type: 'GET',
        dataType: 'json',
        data: {
            status: 0,
            page: 1,
            size: 5
        },
        isLoading: true,
        success_fun: function (data) {
            $("#alertMessges").html("");
            var msg = "";
            if (data.data.length > 0) {
                for (var i = 0; i < data.data.length; i++) {
                    msg = '<li class="clear"><p class="fl clear"><em class="fl">第</em><span class="fl">' + data.data[i].match_no + '</span><em class="fl">场</em></p><span class="fr">奖金已发放</span></li>'
                }
            }
            $("#alertMessges").html(msg);

        },
        error_fun: function (err) {
            //alert(err);
        }
    };
    common.request(options);
}

//========================弹框的出现=========================
function alertshow() {
    $(".pop-mask-alert").removeClass("dno");
    $("#alertbox").removeClass("dno");
}

$("#alertbox .icon-delete,#alertbox .sure-alert-btn").on("click", function () {
    $(".pop-mask-alert").addClass("dno");
    $("#alertbox").addClass("dno");
});

//=================退出=========
$("#logoOut").click(function () {
    var options = {
        url: '/login/out.do',
        type: 'get',
        dataType: 'json',
        isLoading: true,
        success_fun: function (data) {
            common.removeLoading();
            loginOUt401();
        },
        error_fun: function (err) {
            common.removeLoading();
            $('#alertsss').html('<div id="alertssstop">' + err + '</div>');
            alertshow();
        }
    };
    common.request(options);

});
function loginOUt401() {
    common.delCookie("Access_Token");
    common.delCookie("bpNumber");
    window.location.href = "index.html";
}

function init() {
    common.checkCookie();
    var stateUrl = window.location.href;
    if (stateUrl.indexOf("access_token") > -1 && !common.loginState) {
        common.userCookie = stateUrl.substring(stateUrl.indexOf("=") + 1);
        if (common.userCookie) {
            common.setCookie("Access_Token", common.userCookie, 1);
            common.checkCookie();
        }
    }
    common.getLoginState();
    if (common.loginState) {
        common.getUserInfor();
        noticeMsg();
    }
}


//==============================qq登录=================

$("#login").on("click", function () {
    var stateUrl = window.location.href;
    if (stateUrl.indexOf("index") > -1) {
        $(".pop-mask").removeClass("dno");
        $("#qq-login").removeClass("dno");
    } else {
        window.location.href = "index.html";
    }

});
$("#qq-login .icon-delete").on("click", function () {
    $(".pop-mask").addClass("dno");
    $("#qq-login").addClass("dno");
});

init();





