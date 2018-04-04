/**
 * Created by pc on 2018/3/14.
 */
(function(){
    var shopSize=8;
    var shopPage=1;
    var filter={
        order:1,//2是降序，1是升序
        from:"",//最低价格
        to:"",//最高价格
        qualitys:[],//种类筛选 格式是["1","2"],
        searchName:""//筛选名称
    };
    var shopId="";
//lunbo
    jQuery(".ym-slider").slide({
        autoPlay: true,
        autoPage: true,
        interTime: 3000,
        mainCell: ".bd ul",
        titCell: ".hd ul",
        effect: "leftLoop",
    });
    function loadFc(){
        //====================获取商城信息===================
        var dataInt =JSON.stringify({
            "shopId": 1,
            "order": filter.order,
            "from": filter.from,
            "to": filter.to,
            "search":filter.searchName,
            "qualitys":filter.qualitys,
            "pageable": {
                "page":shopPage ,
                "size": shopSize
            }
        });
        var options = {
            url:'/mall/list.do',
            type: 'post',
            dataType: 'json',
            data:dataInt,
            isLoading:true,
            success_fun: function (data) {
                var pageList = data.data;
                var page= data.pageable;
                var pageCont = "";
                $("#exchange-mall-box .page-box").html("");
                $("#exchange-mall-list ul").html('');
                $("#exchange-mall-box .page-box").removeClass("dno");
                $("#exchange-mall-box ul").removeClass("dno");
                $("#exchange-mall-box .nofound-exchange-mall").addClass("dno");
                if(pageList.length<=0){
                    $("#exchange-mall-box .page-box").addClass("dno");
                    $("#exchange-mall-box .nofound-exchange-mall").removeClass("dno");
                    $("#exchange-mall-box ul").addClass("dno");
                }else{

                    var stow=" ";
                    for(var i=0;i<pageList.length;i++){
                        stow+='<li> <div class="content-shop"><i class="style-shop"><img src="images/'+ pageList[i].quality+ '.png" alt=""/></i>';
                        stow+='<div class="imges-shopp-box bt-tm-1px">';
                        stow+='<img src="'+pageList[i].picUrl+'"  class="mCS_img_loaded">';
                        stow+='</div>';
                        stow+='<h4>'+pageList[i].goodsName+'</h4>';
                        stow+='<p class="color-org">BP:<em>'+common.toDecimal2(pageList[i].goodsValue/100)+'</em></p>';
                        stow+='<p class="color-b2b2b2"><em>'+pageList[i].storeTotal+'</em>件在售</p>';
                        stow+='</div>';
                        if(!common.getCookie("Access_Token")||((pageList[i].goodsValue)<=((common.getCookie("bpNumber"))*100))){
                            stow+='<span class="btn-136 btn-cc exchangeMallBtn"  shopId="'+pageList[i].gid+'">兑换</span>';
                        }else{
                            stow+='<span class="btn-136 btn-default" >兑换</span>';
                        }
                        stow+='</li>';
                    }
                    //totalPage 总页数  page当前页码数  currentSize 当前页的实际条数
                    //pageCont = common.pageContFc(shopPage,page);

                        $("#exchange-mall-box .page-box").createPage({
                            pageCount:page.totalPage,
                            current:shopPage,
                            backFn:function(p){
                                console.log(p);
                                shopPage = p;
                                loadFc();

                            }
                        });

                    $("#exchange-mall-list  ul").html(stow);
                    $("#exchange-mall-list .exchangeMallBtn").click(function(){
                        if(!common.loginState){
                            $('#alertsss').html('<div id="alertsss">请先登陆后才能兑换商品哦！</div>');
                            alertshow();
                            return;
                        }
                        shopId = $(this).attr("shopId");
                        exchangeMallfc();
                    });

                }

                common.removeLoading();

            },
            error_fun: function (err) {
                common.removeLoading();
                $('#alertsss').html('<div id="alertsss">'+ err + '</div>');
                alertshow();
            }
        };
        common.request(options);


    }

//=================兑换商品==============================
    function exchangeMallfc(){
        $(".pop-mask-alert").removeClass("dno");
        $("#MallAlert").removeClass("dno");
    }

    function hideMall(){
        $(".pop-mask-alert").addClass("dno");
        $("#MallAlert").addClass("dno");
    }

    $("#MallAlert .sure-alert-btn").on("click",function(){
        isOkMall();
    });
//确定兑换
    $("#MallAlert .sure-alert-btn").on("click",function(){
        isOkMall();
    });
//取消兑换
    $("#MallAlert .makeNo-alert-btn,#MallAlert .icon-delete").on("click",function(){
        hideMall();
    });

    function isOkMall(){
        if(!shopId){
            return;
        }
        var goods =[{
            gid:shopId,
            total:1
        }];
        var goodsData=JSON.stringify({goods:goods});
        hideMall();
        var options = {
            url:'/mall/buy.do',
            type: 'post',
            dataType: 'json',
            isLoading:true,
            data:goodsData,
            success_fun: function (data) {
                common.getUserInfor();
                common.removeLoading();
                shopId="";
                $('#alertsss').html('<div id="alertsss">兑换成功，请前往仓库查看兑换饰品</div>');
                alertshow();
            },
            error_fun: function (err) {
                common.removeLoading();
                shopId="";
                $('#alertsss').html('<div id="alertsss">'+ err + '</div>');
                alertshow();
            }
        };
        common.request(options);
    }
//=========================筛选=======================

    $("#filter_content-btns .bt-color").on("click",function(){
        var that = this;
        if(!$(this).hasClass("active")){
            $(this).addClass("active");
            var a =$(this).html();
            filter.qualitys.push(a);
        }else{
            $(this).removeClass("active");
            var b =$(this).html();
            for(var i=0;i<filter.qualitys.length;i++) {
                if (filter.qualitys[i]==b) {
                    filter.qualitys.splice(i,1);
                    break;
                }
            }

        }


    });
//选中颜色种类
    $("#filter_content-btns .btn-reset").on("click", function () {
        filter.qualitys=[];
        $("#filter_content-btns .bt-color").removeClass("active");
    });
    $("#filter_content-btns .btn-sure").on("click", function () {
        if( filter.qualitys.length<=0){
            return;
        }
        loadFc();
    });

//价格升降序
    $("#filter-conditions-box .byprice").on("click",function(){
        if(!$(this).hasClass("active")){
            $(this).addClass("active");
            filter.order =2;
        }else{
            $(this).removeClass("active");
            filter.order=1;
        }
        loadFc();
    });

//输入字段
    $("#search-box-filter .btn-search").on("click",function(){
        var searchName=$("#search-box-filter .search-input").val();
        filter.searchName=searchName;
        loadFc();
    });

//输入价格
    $("#filter-price-inputs .btn-sure").on("click",function(){
        var formPrice=$("#filter-price-inputs .filter-byform").val();
        var toPrice=$("#filter-price-inputs .filter-byto").val();
        filter.from=formPrice;
        filter.to=toPrice;
        if(formPrice){
            if(isNaN(formPrice)){
                $("#filter-price-inputs .filter-byform").val("不是数字");
                return;
            }else{
                formPrice = formPrice*100;
                formPrice=parseInt(formPrice);

            }
        }
        if(toPrice){
            if(isNaN(toPrice)){
                $("#filter-price-inputs .filter-byto").val("不是数字");
                return;
            }else{
                toPrice = toPrice*100;
                toPrice=parseInt(toPrice);
            }
        }
        if(toPrice&&formPrice){
            if(formPrice<toPrice){
                loadFc();
            }
        }else if(toPrice||formPrice){
            loadFc();
        }



    });

    loadFc();
})(window);

