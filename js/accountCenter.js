/**
 * Created by pc on 2018/3/14.
 */


(function(){
    var minSize=7;
    var minePage=1;
    var statusInde="";//空是所有的记录 ,0支出 1收入 2充值

    function getall(getnumCo){
        var  numCo=getnumCo;
        var  url='/account/list.do';
        if(numCo==4){
            url='/storage/delivery.do'
        }else if(numCo==5){
            url='/storage/sale.do';
        }

        var data= {
            'status':statusInde,
            'size':minSize,
            'page':minePage,
        };
        $("#pageList-game-center .liushui-box").removeClass("dno");
        $("#pageList-game-center .order-box").addClass("dno");
        if(numCo>=4){
            data= {
                'shopId':1,
                'size':minSize,
                'page':minePage
            };
            $("#pageList-game-center .liushui-box").addClass("dno");
            $("#pageList-game-center .order-box").removeClass("dno");
        }
        var options = {
            url:url,
            type: 'get',
            dataType: 'json',
            data:data,
            isLoading:true,
            success_fun: function (data) {
                var pageList = data.data;
                var page = data.pageable;
                var stow=" ";
                $("#table-list-mine").html("");
                if(pageList.length<=0){
                    $("#pageList-game-center .table-list-game").css("height","auto");
                    $("#pageList-game-center .nofound-exchange-mall").removeClass("dno");
                    $("#pageList-game-center .page-box").addClass("dno");
                }else{
                    $("#pageList-game-center .nofound-exchange-mall").addClass("dno");
                    $("#pageList-game-center .table-list-game").css("height",580+'px');
                    $("#pageList-game-center .page-box").removeClass("dno");
                    for(var i=0;i<pageList.length;i++){
                        if(i%2==0){
                            stow+='<tr class="bg-191919">';
                        }else{
                            stow+='<tr>';
                        }
                        if(numCo==5){
                            stow+='<td class="size-260"><div>'+pageList[i].dealId+'</div></td>';
                            stow+='<td class="size-260 img-table"><div><img src='+pageList[i].picUrl+'  alt=""/></div></td>';
                            stow+='<td class="size-260"><div>';
                            stow+='' +pageList[i].status==2?"已售出":"售出失败"+'</div></td>';
                            stow+='<td class="size-260"><div>'+common.formatDateTime(pageList[i].recycleDate)+'</div></td>';
                            stow+='</tr>';
                        }else if(numCo==4){
                            stow+='<td class="size-260"><div>'+pageList[i].sid+'</div></td>';
                            stow+='<td class="size-260 img-table"><div><img src='+pageList[i].picUrl+' alt=""/></div></td>';
                            stow+='<td class="size-260"><div>';
                            stow+='' +pageList[i].status==3?"取出完成":pageList[i].status==4?"取出失败":pageList[i].status==7?"取出中":"取出中"+'</div></td>';
                            stow+='<td class="size-260"><div>'+common.formatDateTime(pageList[i].deliveryDate)+'</div></td>';
                            stow+='</tr>';
                        }else if(numCo<4){
                            stow+='<td class="size-209"><div>'+pageList[i].dealId+'</div></td>';
                            stow+='<td class="size-150"><div>';
                            stow+='' +pageList[i].dealCode==0?"其他充值":pageList[i].dealCode==1?"微信转入":pageList[i].dealCode==2?"支付宝转入":pageList[i].dealCode==3?"比赛奖励":pageList[i].dealCode==-1?"报名":pageList[i].dealCode==-4?"购物":"物品卖出"+'</div></td>';
                            stow+='<td class="size-150"><div>绝地求生</div></td>';
                            stow+='<td class="size-140"><div>';
                            stow+=''+pageList[i].amt>0?"+"+(pageList[i].amt/100):(pageList[i].amt/100)+'</div></td>';
                            stow+='<td class="size-140"><div>'+(pageList[i].account/100)+'</div></td>';
                            stow+='<td class="size-209"><div>'+common.formatDateTime(pageList[i].createTime)+'</div></td>';
                            stow+='</tr>';
                        }
                    }

                    $("#pageList-game-center .page-box").removeClass("dno");
                    $("#pageList-game-center .page-box").createPage({
                        pageCount:page.totalPage,
                        current:minePage,
                        backFn:function(p){
                            minePage = p;
                            getall(getnumCo);
                        }
                    });
                    $("#table-list-mine").html(stow);

                }
                common.removeLoading();
            },
            error_fun: function (err) {
                common.removeLoading();
                $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                window.alertshow();
            }
        };
        common.request(options);
    }


//==============================获取用户信息 bp值
    function getUserInfor(){
        var options = {
            url:'/user.do',
            type: 'get',
            dataType: 'json',
            isLoading:true,
            success_fun: function (data) {
                common.mineMsg = data;
                common.mineMsg.account.balance = common.toDecimal2(data.account.balance/100);
                $("#center_mine p").find("em").html(common.mineMsg.account.balance);
                $("#center_mine .icon").attr('src',data.user.figureurl);
                $("#center_mine .name-cc").html(data.user.nickname);

            },
            error_fun: function (err) {
                alert(err);
            }
        };
        common.request(options);
    }

//var statusInde=0;//0支出 1收入 2充值
    $(".bread-nav-account>span").on("click",function(){
        $(this).addClass("active").siblings("span").removeClass("active");
        minePage = 1;
        statusInde = $(this).index()==0?'':$(this).index()==1?1:$(this).index()==2?0:2;
        getall($(this).index());
    });

//近期交易统计
//==============================获取用户信息 bp值
    function tradeStatistics(){
        var options = {
            url:'/account/info.do',
            type: 'get',
            dataType: 'json',
            isLoading:true,
            success_fun: function (data) {
                common.removeLoading();
                $("#right-center-account .dayAccount").html(common.toDecimal2(data.todayIn/100));
                $("#right-center-account .thisMouthGet").html(common.toDecimal2(data.monthIn/100));
                $("#right-center-account .thisMouthPay").html(common.toDecimal2(data.monthOut/100));
                $("#right-center-account .preMouthGet").html(common.toDecimal2(data.lastMonthIn/100));
                $("#right-center-account .preMouthPay").html(common.toDecimal2(data.lastMonthOut/100));

            },
            error_fun: function (err) {
                common.removeLoading();
                $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
                window.alertshow();
            }
        };
        common.request(options);
    }


    function getMine(){
        getUserInfor();
        tradeStatistics();
        getall(0);
    }

    getMine();


})(window);



