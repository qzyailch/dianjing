/**
 * Created by pc on 2018/3/14.
 */

var storeSize=10;
var storePage=1;

//===================仓库数据===========
var sellprice=0;//总价格
var totalPage=1;
var redMsgCont=[];
var pageCont=[];
// 仓库数据获取
function getStoreData() {
    var storeData;
        storeData = {
            "page": storePage,
            "size": storeSize,
            "shopId":1
        };
    if (storePage == 1) {
        $("#cangbox").html(" ");
        $("#warehouse-footer-box").addClass("dno");
        //$("#content_1").addClass("dno");
    }
    var stnw=' ';
    var options = {
        url:'/storage/store.do',
        type: 'get',
        dataType: 'json',
        data:storeData,
        isLoading:true,
        success_fun: function (data) {
                 $("#cangbox").html("");
                var rowStr = "";
              var pageList = data.data;//data.data
             if(storePage==1){
                 pageCont=[];
             }
            if(pageList.length<=0&&storePage==1){
                 $("#warehouse-library-box .store-nothing").removeClass("dno");
                  $("#warehouse-footer-box").addClass("dno");
               }else{

                   $("#warehouse-library-box .store-nothing").addClass("dno");
                   $("#warehouse-footer-box").removeClass("dno");

                   //li.active(选中状态)
                for(var i=0;i<pageList.length;i++) {
                    if(pageList[i].status==1) {
                        pageCont.push(pageList[i].sid);
                        rowStr += '<li priceNum="' + pageList[i].recycleValue + '"   onclick="getRedMsgCont(this,' + pageList[i].sid + ')"  class="isRemove"> ';
                    }else{
                        rowStr += '<li>';
                    }
                    rowStr += '<div class="pop_content">'
                    rowStr += ''+ pageList[i].status==7?"出货中":"出货中"+'';
                    rowStr +='</div>';
                    rowStr += ' <i class="style-shop"><img src="images/'+pageList[i].quality+'.png" alt=""/></i>';
                    rowStr += '<div class="imges-shopp-box bt-tm-1px"><img src='+pageList[i].picUrl+' class="mCS_img_loaded"></div> ';
                    rowStr += '<h4>'+pageList[i].goodsName+'</h4>';
                    rowStr += '<p class="color-org">BP:<em>'+common.toDecimal2(pageList[i].goodsValue/100)+'</em></p>';
                    rowStr += '<i class="checked-like"><img src="images/msg_icon_checked1.png" alt="选中"/></i> </li>';
                    if(storePage==1){
                        $("#cangbox").html(rowStr);
                    }else{
                        $("#cangbox").push(rowStr);
                    }

                }
               }
            common.removeLoading();
        },
        error_fun: function (err) {
            common.removeLoading();
            $('#alertsss').html('<div id="alertsss">'+ err + '</div>');
            window.alertshow();
        }
    };
    common.request(options);

}




//全选
$("#warehouse-footer-box .check-all").on("click", function(){
    if($(this).hasClass("active")){
        $(this).removeClass("active");
        $("#cangbox li.isRemove").removeClass("active");
        redMsgCont=[];
    }else{
        $(this).addClass("active");
        $("#cangbox li.isRemove").addClass("active");
        redMsgCont=pageCont;
    }
    getTotalPrice();
});


//单个获取
function getRedMsgCont(that,id){
    if($(that).hasClass("active")){
        $(that).removeClass("active");
        for(var i=0;i<redMsgCont.length;i++) {
            if (redMsgCont[i]==id) {
                redMsgCont.splice(i,1);
                break;
            }
        }
    }else{
        $(that).addClass("active");
        redMsgCont.push(id);
    }
    var priceList =$("#cangbox li.isRemove");
    if(priceList.length>redMsgCont.length){
        $("#warehouse-footer-box .check-all").removeClass("active");
    }else if(priceList.length==redMsgCont.length){
        $("#warehouse-footer-box .check-all").addClass("active");
    }
    getTotalPrice();
}


//=========================计算价格===================
function getTotalPrice(){
    sellprice=0;
    var priceList =$("#cangbox li.isRemove");
    if(redMsgCont.length>0){
        for(var i=0;i<priceList.length;i++){
            if(priceList[i].className=="isRemove active"){
                sellprice+=Number($(priceList[i]).attr("priceNum"));
            }
        }
        $("#thingname").html("已选中<em class='color-org'>"+redMsgCont.length+"</em>件物品");
    }else{
        $("#thingname").html("未选择物品");
    }

    if(sellprice==0){
        $("#chushou").removeClass("btn-org");
        $("#chushou").addClass("btn-default");
        $("#chushou").html("出售");
    }else{
        $("#chushou").addClass("btn-org");
        $("#chushou").removeClass("btn-default");
        $("#chushou").html("以<em>"+common.toDecimal2(sellprice/100)+"</em>bp的价格出售");
    }

}
//==================刷新仓库============
$("#ageinscangku").click(function(){
    sellprice=0;
    $("#chushou").html("出售");
    pageCont=[];
    redMsgCont=[];
    storePage=1;
    getTotalPrice();
    getStoreData();
});

//========================弹框的出现=========================
function alertshow(){
    $("#alertbox").removeClass("dno");
}
$("#alertbox .icon-delete").on("click",function(){
    $("#alertbox").addClass("dno");
});


//加载更多
$("#content_1").mCustomScrollbar({
    callbacks:{
        onScroll: function(){
            if(storePage==-1||totalPage==storePage){
            }else{
                storePage+=1;
                getStoreData();
            }
        } //回调函数
    }
});




//=====================设置交易链接地址===============

$(".getjiaoyilianjiebtn").click(function(){
    window.open("https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url");
});
//======================获取交易链接===============
$("#getjiaoyilianjie").click(function(){
    window.open("https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url");
});
//==================获取交易链接失败================
$("#huoqulianjieshi").click(function(){
    $(".pop-mask").removeClass("dno");
    $("#transaction-failure-pop").removeClass("dno");
});
$("#errorlianjiebox .close").click(function(){
    $("#mengceng").css({"display":"none"});
    $("#errorlianjiebox").css({"display":"none"});
});
$(".getjiaoyilianjieno").click(function(){
    $("#huoqulianjieshi").click();
});

$("#teleupate2").click(function(){
    xiugaitel2();
});

$("#transaction-failure-pop .icon-delete").on("click",function(){
    $(".pop-mask").addClass("dno");
    $("#transaction-failure-pop").addClass("dno");
});


//======================出售商品=================
function soleStore(){
    if(redMsgCont.length==0){
        $("#alertsss").html("您还未选择任何物品，请选择后在出售");
        window.alertshow();
        return;
    }else if(redMsgCont.length>10){
        $("#alertsss").html("亲，对不起每次只能同时出售10件饰品");
        window.alertshow();
        return;
    }
    var goods = JSON.stringify({
        "goods":redMsgCont
    });
    var options = {
        url:'/storage/sale.do',
        type: 'POST',
        dataType: 'json',
        data:goods,
        isLoading:false,
        success_fun: function (data) {
            var err="";
            common.removeLoading();
            common.getUserInfor();
            $("#ageinscangku").click();
            $('#alertsss').html('<div id="alertsss">出售成功，回收金额已返回您的账户</div>');
            window.alertshow();

        },
        error_fun: function (err) {
            common.removeLoading();
            $('#alertsss').html('<div id="alertsss">'+ err + '</div>');
            window.alertshow();
        }
    };
    common.request(options);

}
//==============================取出商品==============================
function putStore(){
    if(redMsgCont.length==0){
        $("#alertsss").html("您还未选择任何物品，请选择后在取出");
        window.alertshow();
        return;
    }else if(redMsgCont.length>10){
        $("#alertsss").html("亲，对不起每次只能同时取出10件饰品");
        window.alertshow();
        return;
    }

    var options = {
        url:'/user.do',
        type: 'get',
        dataType: 'json',
        isLoading:true,
        success_fun: function (data) {
            common.removeLoading();
            var delivery_urlstring=data.user.tradeLinks;
            var tcontact_info=data.user.telephone;
            if(delivery_urlstring==null||delivery_urlstring==" "||delivery_urlstring==undefined||delivery_urlstring==""){
                $("#alertsss").html("您还未设置steam交易链接，请设置");
                window.alertshow();
            }else if(tcontact_info==null||tcontact_info==" "||tcontact_info==undefined||tcontact_info==""){
                $("#alertsss").html("您的联系方式不对，请设置你的联系方式");
                window.alertshow();
            }else if(delivery_urlstring.indexOf("https://steamcommunity.com/tradeoffer/new/?partner=") < 0){
                $("#alertsss").html("您的取出链接有误，请前往钱包设置");
                window.alertshow();
            }else{
                  var goods = JSON.stringify({
                      "goods":redMsgCont
                  });
                  var options = {
                      url:'/storage/delivery.do',
                      type: 'POST',
                      dataType: 'json',
                      data:goods,
                      isLoading:false,
                      success_fun: function (data) {
                          var err="";
                          common.removeLoading();
                          common.getUserInfor();
                          $("#ageinscangku").click();
                          $('#alertsss').html('<div id="alertsss">我们将在24小时内完成发货,请到steam账号收取</div>');
                          window.alertshow();

                      },
                      error_fun: function (err) {
                          common.removeLoading();
                          $('#alertsss').html('<div id="alertsss">'+ err + '</div>');
                          window.alertshow();
                      }
                  };
                  common.request(options);
              }
        },
        error_fun: function (err) {
            common.removeLoading();
            $('#alertsss').html('<div id="alertsss">'+ err + '</div>');
            window.alertshow();
        }
    };
    common.request(options);



}

$("#chushou").on("click",function(){
    if(redMsgCont.length==0){
        $("#alertsss").html("您还未选择任何物品，请选择后在出售");
        window.alertshow();
        return;
    }else if(redMsgCont.length>10){
        $("#alertsss").html("亲，对不起每次只能同时出售10件饰品");
        window.alertshow();
        return;
    }
    $("#storeAlert").removeClass("dno");

});
$("#putStore").on("click",function(){
    putStore();
});

$("#storeAlert .icon-delete,#giveUp").on("click",function(){
    $("#storeAlert").addClass("dno");
});
$("#makeStoreSure").on("click",function(){
    $("#storeAlert .icon-delete").click();
    soleStore();
});


//=================粘贴================
$(".niantie").click(function(){
    var a=window.clipboardData.getData("text");
    $('.delivery-url').val(a);
});

//================修改地址==========
$('.urlupate').eq(0).on('click', function () {
    xiugaiurl(0);
});
$(".delivery-url").eq(0).change(function(){
    xiugaiurl(0);
});

function xiugaiurl(obj){
    var deliverysurl=$(".delivery-url").eq(obj).val();
    var telInfo = JSON.stringify( {
        "tradeLinks": deliverysurl
    });
    deliverysurl=$.trim(deliverysurl);
    var zhengzenbiaodaoshi=/^https:\/\/steamcommunity.com\/tradeoffer\/new\/\?partner=[0-9]+&token=.*$/;
    if(zhengzenbiaodaoshi.test(deliverysurl)){
        var options = {
            url:'/user.do',
            type: 'POST',
            dataType: 'json',
            data:telInfo,
            isLoading:true,
            success_fun: function (data) {
                common.removeLoading();
                common.getUserInfor();
                $("#alertsss").html("修改交易链接成功");
                window.alertshow();
            },
            error_fun: function (err) {
                common.removeLoading();
                $('#alertsss').html('<div id="alertsss">'+ err + '</div>');
                window.alertshow();
            }
        };
        common.request(options);
    }else{
        $("#alertsss").html("交易链接有误");
        window.alertshow();
    }


}


//============================修改联系方式===============
function xiugaitel2(){
    var inputUrlInfo=$(".teleph").eq(0).val();
    var inputUrlInfodaoshi=/^0?1[3|4|5|7|8][0-9]\d{8}$/;
    if(!inputUrlInfodaoshi.test(inputUrlInfo)){
        $("#alertsss").html("请输入正确的联系方式！");
        window.alertshow();
    }else{
        var urlInfo =JSON.stringify( {
            "telephone": inputUrlInfo
        });
        var options = {
            url:'/user.do',
            type: 'POST',
            dataType: 'json',
            data:urlInfo,
            isLoading:true,
            success_fun: function (data) {
                common.removeLoading();
                common.getUserInfor();
                $("#alertsss").html("修改联系方式成功");
                window.alertshow();
            },
            error_fun: function (err) {
                common.removeLoading();
                $('#alertsss').html('<div id="alertsss">'+ err + '</div>');
                alertshow();
            }
        };
        common.request(options);
    }
}

getStoreData();

