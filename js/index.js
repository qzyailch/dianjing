/**
 * Created by pc on 2018/3/14.
 */


//加载完成
(function($){
    $(window).load(function(){
        $("#banana-box-index").css('backgroundImage',"url(images/dianjing30.gif)");
//加载更多
    });
})(jQuery);
(function(window){
    var pay_checked ="true";
    var gameMsg='';
    function loadinto(){
        //====================获取用户信息===================
        if(common.getCookie("Access_Token")){

            var options = {
                url:'/user.do',
                type: 'get',
                dataType: 'json',
                isLoading:true,
                success_fun: function (data) {
                    data.account.balance = (data.account.balance/100);
                    common.mineMsg = data;
                    common.mineMsg.account.balance = data.account?common.toDecimal2(data.account.balance):0;
                    $("#headerMain .bp-number-li p").find("span").html(common.mineMsg.account.balance);
                    $("#headerMain .icon").attr('src',data.user.figureurl);
                    $("#amount-li .isnum-btn").eq(0).click();
                    $("#way-li li").eq(1).click();
                    common.setCookie("bpNumber",data.account.balance,1);
                    getGameInfor();//获取游戏信息
                    erWeiMaInit();//支付模块

                },
                error_fun: function (err) {
                    common.removeLoading();
                    $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                    window.alertshow();
                }
            };
            common.request(options);

        }
    }

//=================================获取游戏
    var gameStatus;
    var gamePayIn;
    function getGameInfor(){
        var stateUrl =  window.location.href;
        clearInterval(gameStatus);
        gameStatus=setInterval(function(){
            var data={
                configNo:1
            };
            var options = {
                url:'/game.do',
                type: 'get',
                dataType: 'json',
                data:data,
                isLoading:true,
                success_fun: function (data) {
                    $("#pay-ways-number .changNum").html(data.game.matchNo);
                    $("#pay-ways-number .fee").html(data.config.signupCost+'Bp');
                    $("#pay-ways-number .yue").html(common.mineMsg.account.balance+"元");
                    gamePayIn =data.canApply;
                    if(data.player){
                        if(stateUrl.indexOf("index")==-1){
                            clearInterval(gameStatus);
                        }
                        common.isPlayer = true;
                        $("#btn-signup-box").addClass("disable");
                        $("#banana-box-index .signup-div").removeClass("dno");
                        $("#banana-box-index .nosignup-div").addClass("dno");
                        $("#banana-box-index .computing-session-num em").html(data.player.matchNo);
                        $("#banana-box-index .people-num em").html(data.game.signupNum);
                        $("#banana-box-index .people-num span").html('/'+data.config.startNum);
                        $("#banana-box-index .serial-num span").html(data.player.signupSort);
                    }else{
                        common.isPlayer = false;
                        clearInterval(gameStatus);
                        $("#btn-signup-box").removeClass("disable");
                        if(!gamePayIn){
                            $("#btn-signup-box").addClass("disable");
                        }
                        $("#banana-box-index .signup-div").addClass("dno");
                        $("#banana-box-index .nosignup-div").removeClass("dno");
                    }
                    gameMsg  =data;
                    animateMsg();
                    common.removeLoading();
                },
                error_fun: function (err) {
                    common.removeLoading();
                    clearInterval(gameStatus);
                    $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                    window.alertshow();

                }
            };
            common.request(options);
        },3000);
    }







//==============================登录=================
    $("#qq-login").on('click','.qqLogin',function(){
        window.location.href=common.baseUrl+"/login.do";
    });
    //$("#qq-login  .qqLogin").bind("click",function(){
    //
    //});
//==========================stream登录============
    function streamreginsfuns(){
        $(".pop-mask").removeClass("dno");
        $("#bangding-login").removeClass("dno");
    }
    $("#bangding-login .icon-delete").click(function(){
        $(".pop-mask").addClass("dno");
        $("#bangding-login").addClass("dno");
    });




//===========================奖励规则===================
    $("#lookRuler").on("click",function(){
        $(".pop-mask").removeClass("dno");
        $("#reward-rules").removeClass("dno");
    });
    $("#reward-rules .icon-delete").on("click",function(){
        $(".pop-mask").addClass("dno");
        $("#reward-rules").addClass("dno");
    });

//=============================报名===================
    $("#btn-signup-box").on('click',function(){
        if(common.loginState) {
            if(common.isPlayer){
                var err ="已经参与报名！请尽请期待下一场报名";
                $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                window.alertshow();
                return;
            }
            if(!gamePayIn){
                var err ="亲，不能有超过5场正在比赛的游戏哦，请尽快完成游戏！";
                $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                window.alertshow();
                return;
            }
            if(common.getCookie("bpNumber")<gameMsg.config.signupCost) {
                $("#pop-payfor-box li").eq(2).removeClass("isBp-pay");
                $("#pop-payfor-box li").eq(2).addClass("disable");
                $("#pop-payfor-box li").eq(1).click();

            }else{
                $("#pop-payfor-box li").eq(2).addClass("isBp-pay");
                $("#pop-payfor-box li").eq(2).addClass("active");
                $("#pop-payfor-box li").eq(2).removeClass("disable");
            }
            $(".pop-mask").removeClass("dno");
            $("#pop-payfor-box").removeClass("dno");
        }else{
            $("#login").click();
        }
    });
    $("#pop-payfor-box .icon-delete").on('click',function(){
        $(".pop-mask").addClass("dno");
        $("#pop-payfor-box").addClass("dno");
    });



//支付 RECHARGE(0, "其他充值"), RECHARGE_WX(1, "微信转入"), RECHARGE_JFB(2, "支付宝转入"),

    var cz_price;
    var pay_type;
    var zfstatus;
    var palyruo=1;//1首页的支付//2代表是充值
//首页的支付游戏
    $("#pop-payfor-box li").on("click",function(){
        if(!pay_checked){
            return;
        }
        if(common.getCookie("bpNumber")<gameMsg.config.signupCost&&$(this).index()==2) {
            return;
        }

        $(this).addClass("active").siblings().removeClass("active");
        pay_type = $(this).index()==0?1:$(this).index()==1?2:0;
        showPayRight(pay_type);
    });
//bp支付
    $("#pop-payfor-box .btn-payfor-bp").on("click",function(){
        if(pay_checked){
            applyGame();
        }

    });
    function showPayRight(payType){
        if(payType==0){
            $("#pop-payfor-box .payfor-erweima_box").addClass("dno");
            $("#pop-payfor-box .payfor-bp_box").removeClass("dno")
        }else{
            $("#pop-payfor-box .payfor-erweima_box").removeClass("dno");
            $("#pop-payfor-box .payfor-bp_box").addClass("dno");
            cz_price = gameMsg.config.signupCost;
            payGame();
        }

    }

//刷新
    $(".payfor-erweima_box .btn-default,#sweep-yards .btn-default").on("click",function(){
        if(pay_checked){
            payGame();
        }

    });
//支付
    function payGame(){
        var dtats=new Date();
        dtats=dtats.getTime();
        erWeiMaInit();
        if(!pay_type){
            alert("请选择支付方式！");
            return
        }
        var text = pay_type==1?"请使用手机微信扫描二维码完成支付":"请使用手机支付宝扫描二维码完成支付";
        if(palyruo==1){
            $('.payfor-erweima_box p').html(text);
            $('.payfor-erweima_box img.end-pay-scan').attr('src',"http://oss.qulegou.com/pubg/images/loading.gif");
        }else{
            $('#sweep-yards  img.end-pay-scan').attr('src',"http://oss.qulegou.com/pubg/images/loading.gif");
        }
        var data= JSON.stringify({
            amt:cz_price,
            dealCode:pay_type
        });
        var options = {
            url:'/pay.do',
            type: 'POST',
            dataType: 'json',
            data:data,
            success_fun: function (data) {
                var url = data.qci;
                if(palyruo==1){
                    $('.payfor-erweima_box  img.end-pay-scan').attr('src',url);
                }else{
                    $('#sweep-yards  img.end-pay-scan').attr('src',url);
                }
                ddState(data.outTradeNo);
            },
            error_fun: function (err) {
                $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                window.alertshow();
            }
        };
        common.request(options);
    }

// 查看支付状态，根据支付状态完成
    function ddState(ddId){
        clearInterval(zfstatus);
        zfstatus=setInterval(function(){
            var options = {
                url: '/pay/status.do',
                type: 'GET',
                dataType: 'json',
                data:{
                    orderNo:ddId
                },
                success_fun: function (data) {
                    if(data==1){
                        clearInterval(zfstatus);
                        //1首页的支付//2代表是充值
                        if(palyruo==2){
                            $('#sweep-yards  img.end-pay-scan').addClass("dno");
                            $('#sweep-yards  img.end-pay-success').removeClass("dno");
                            $('#sweep-yards  .error-pay').addClass("dno");
                            $(".payfor-erweima_box .btn-default").html("请重新获取二维码");
                            common.getUserInfor();
                        }else if(palyruo==1){
                            applyGame();
                        }
                    }else if(data==2){
                        clearInterval(zfstatus);
                        if(palyruo==2){
                            $('#sweep-yards  .error-pay').removeClass("dno");
                            $('#sweep-yards  img.end-pay-scan').addClass("dno");
                            $('#sweep-yards  img.end-pay-success').addClass("dno");
                        }else if(palyruo==1){
                            $('.payfor-erweima_box  img.end-pay-scan').addClass("dno");
                            $('.payfor-erweima_box  .error-pay').removeClass("dno");
                            $('.payfor-erweima_box  img.end-pay-success').addClass("dno");
                        }
                        $(".payfor-erweima_box .btn-default").html("请重新获取二维码");
                    }
                },
                error_fun: function (err) {
                    clearInterval(zfstatus);
                    $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                    window.alertshow();
                }
            };
            common.request(options);
        },3000);
    }

    function erWeiMaInit(){
        if(palyruo==1){
            $('.payfor-erweima_box  img.end-pay-scan').removeClass("dno");
            $('.payfor-erweima_box  .error-pay').addClass("dno");
            $('.payfor-erweima_box  img.end-pay-success').addClass("dno");
            if(!pay_checked){
                $('.payfor-erweima_box  img.end-pay-scan').addClass("dno");
            }
        }else if(palyruo==2){
            $('#sweep-yards  .error-pay').addClass("dno");
            $('#sweep-yards  img.end-pay-scan').removeClass("dno");
            $('#sweep-yards  img.end-pay-success').addClass("dno");
        }
    }

//==================初始加载==============

//报名参赛 /player/apply


    function applyGame(){
        var data = JSON.stringify({
            matchNo:gameMsg.game.matchNo
        });
        var options = {
            url:'/player/apply.do',
            type: 'POST',
            dataType: 'json',
            data:data,
            isLoading:true,
            success_fun: function (data) {
                $("#pop-payfor-box .icon-delete").click();
                $("#pop-success-singup .computing-session-num em").html(gameMsg.game.matchNo);
                $("#pop-success-singup .serial-num span").html(data.signupSort);
                $("#pop-payfor-box .icon-delete").click();
                common.removeLoading();
                getGameInfor();
                SignUpSuccess();

            },
            error_fun: function (err) {
                common.removeLoading();
                if(pay_type!=0){
                    err=err+"若已扫码付钱,将会以bp值的形式返还到您的账户";
                }
                $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                window.alertshow();
            }
        };
        common.request(options);
    }

//报名成功
    function SignUpSuccess(){
        $(".pop-mask").removeClass("dno");
        $("#pop-success-singup").removeClass("dno");
        common.getUserInfor();
    }

    $("#pop-success-singup .i_know_btn").on("click",function(){
        $(".pop-mask").addClass("dno");
        $("#pop-success-singup").addClass("dno");
    });


//充值页面选择支付方式
    $("#way-li li").on("click",function(){
        $(this).addClass("active").siblings().removeClass("active");
        pay_type = $(this).index()==0?1:2;
        palyruo=2;
        if(cz_price&&pay_type){
            payGame();
        }
    });

    $("#customPay").on("click",function(){
        $("#amount-li .span-amount-group").addClass("dno");
        $("#amount-li .input-amount-group").removeClass("dno");
    });
    $("#erweimamoeyno").on("click",function(){
        $("#zidingyijine").val("");
        $("#amount-li .span-amount-group").removeClass("dno");
        $("#amount-li .input-amount-group").addClass("dno");
        $("#amount-li .isnum-btn").eq(0).click();
    });
    $("#amount-li .isnum-btn").on("click",function(){
        $(this).addClass("active").siblings().removeClass("active");
        cz_price = $(this).html();
        $("#zhifujine").html("订单金额：￥ " + common.toDecimal2(cz_price));
        palyruo=2;
        if(cz_price&&pay_type){
            payGame();
        }

    });
    $("#erweimamoeyyes").click(function(){
        var zidingyijine=$("#zidingyijine").val();
        cz_price=zidingyijine;
        if(!isNaN(cz_price)){
            cz_price=parseInt(cz_price);
            cz_price=cz_price*100;
            if(cz_price>=100&&cz_price<=100000){
                chongzhifunss();
            }else{
                $("#zidingyijine").val("充值金额必须在1至1000元");
                $("#zidingyijine").css({"color":"red"});
                $("#zhifujine").html("金额错误");
            }
        }else{
            $("#zidingyijine").val("不是数字");
            $("#zidingyijine").css({"color":"red"});
            $("#zhifujine").html("金额错误");
        }
    });


    function chongzhifunss(){
        var dtats=new Date();
        dtats=dtats.getTime();
        $("#zhifujine").html("订单金额：￥ " + common.toDecimal2(cz_price/100));
        cz_price=cz_price/100;
        payGame();
    }


    $("#aginerweima").click(function(){
        chongzhifunss();
    });

    function animateMsg(){
        $("#headerMain .msg-hrader-mine").addClass("active");
        setTimeout(function(){
            $("#headerMain .msg-hrader-mine").removeClass("active");
        },2000);
    }
    //================================登录协议  关闭
    $("#agreementAlert .icon-delete").on("click",function(){
        $(".pop-mask-alert").addClass("dno");
        $("#agreementAlert").addClass("dno")
    });
    //======================qq登录协议打开

    $("#qq-login .xieyi_qq").on("click",function(){
        $(".pop-mask-alert").removeClass("dno");
        $("#agreementAlert").removeClass("dno")
    });


    //================================游戏规则  关闭
    $("#gameRulerContent .icon-delete").on("click",function(){
        $(".pop-mask-alert").addClass("dno");
        $("#gameRulerContent").addClass("dno")
    });



    //================================游戏规则打开  关闭
    $("#isReadXiYe").on("click",function(){
        $(".pop-mask-alert").removeClass("dno");
        $("#gameRulerContent").removeClass("dno")
    });
    $('#xieYiBox').mCustomScrollbar({
        callbacks: {
            onScroll: function () {
            }
        }
    });
  //规则协议时候单选
    $("#pop-payfor-box .icon-agreen-cheak").on("click",function(){
        pay_checked = !pay_checked;
        erWeiMaInit();
        if($(this).parent().hasClass("active")){
            $('#alertsss').html('<div id="alertssstop">若不阅读游戏规则将无法进行报名付款，请谨慎勾选！</div>');
            window.alertshow();
            $(this).parent().removeClass("active");
        }else{
            $(this).parent().addClass("active");
        }

    });

//登录协议时候的单选
    $("#qq-login .icon-agreen-cheak").on("click",function(){
        if($(this).parent().hasClass("active")){
            //$("#qq-login .qqLogin").off();
            $("#qq-login .btns-binding").removeClass("qqLogin");
            $(this).parent().removeClass("active");

        }else{
            $("#qq-login .btns-binding").addClass("qqLogin");
            $(this).parent().addClass("active");
        }
    });

    loadinto();

})(window);
















