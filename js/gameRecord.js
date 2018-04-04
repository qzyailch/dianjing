/**
 * Created by pc on 2018/3/14.
 */
(function(){
var GameSize=10;
var GamePage=1;
var pageList="";
function loadGameRecords(){
    var options = {
        url:'/record/award.do',
        type: 'get',
        dataType: 'json',
        data:{
            'size':GameSize,
            'page':GamePage,
            'gameId':1
        },
        isLoading:true,
        success_fun: function (data) {
            var msg=" ";
            pageList = data?data.data:[];
            var page= data?data.pageable:[];
            $("#table-game-record").html("");
            if(pageList.length<=0){
                $("#game-records-box .table-list-game").css("height",'auto');
                $("#game-records-box .nofound-exchange-mall").removeClass("dno");
            }else{
                $("#game-records-box .nofound-exchange-mall").addClass("dno");
                for(var i=0;i<pageList.length;i++){
                    if(i%2==0){
                        msg+='<tr class="bg-191919">';
                    }else{
                        msg+='<tr>';
                    }
                    msg+='<td class="size-200"><div>'+common.formatDateTime(pageList[i].signupTime) +'</div></td>';
                    msg+='<td  class="size-200"><div>'+pageList[i].matchNo+'</div></td>';
                    msg+='<td class="size-200"><div>'+pageList[i].signupSort+'</div></td>';
                    msg+='<td class="size-80"><div>';
                    msg+=''+pageList[i].rankingNo?" ":pageList[i].rankingNo+'</div></td>';
                    msg+='<td class="size-130"><div>';
                    msg+=''+pageList[i].rankingAmt?"":pageList[i].rankingAmt+'</div></td>';
                    msg+='<td class="size-120"><div>';
                    msg+=''+pageList[i].rankingAmt?"":pageList[i].rankingAmt+'</div></td>'
                    msg+='<td class="size-100"><div>';
                    msg+=''+pageList[i].status==1?"比赛中":pageList[i].status==2?"结算中":pageList[i].status==3?"结算中":pageList[i].status==4?"结算中":pageList[i].status==5?"发放成功":"发放失败"+'</div></td>';
                    msg+='<td class="size-200">';
                    if(pageList[i].status>=5){
                        if(pageList[i].status==6){
                            msg+='<div><a href="javascript:;" class="record-pop" onclick="popErr()">奖励详情</a>'
                        }else{
                            msg+='<div><a href="javascript:;" class="record-pop" onclick="popOpenInfo('+ i +')">奖励详情</a>'
                        }
                        msg+= '<a href="javascript:;" onclick="recordInfo('+pageList[i].matchNo+')">比赛详情</a></div></td>';
                    }else{
                        msg+='<div><span class="disable">奖励详情</span><span class="disable">比赛详情</span></div></td>';
                    }

                    msg+='</tr>';
                }
                $("#game-records-box .page-box").createPage({
                    pageCount:page.totalPage,
                    current:GamePage,
                    backFn:function(p){
                        GamePage = p;
                        loadGameRecords();
                    }
                });
                $("#table-game-record").html(msg);

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


function recordInfo(id){
    id = "120180321160405";
     window.location.href="gameInfor.html?id="+id;
}


$("#Reward-details-pop .icon-delete,#Reward-details-pop .sure-alert-btn").on("click",function(){
    $(".pop-mask").addClass("dno");
    $("#Reward-details-pop").addClass("dno");
});


function popOpenInfo(data){
     var info = "";
    $("#Reward-details-pop ul").html("");
    info +='<li class="clear"><em>参赛场次</em><span>'+pageList[data].matchNo+'</span></li>';
    info +=' <li class="clear"><em>参赛编号</em><span>'+pageList[data].signupSort+'</span></li>';
    info +='<li class="clear"><em>参赛时间</em><span>'+common.formatDateTime(pageList[data].signupTime)+'</span></li>';
    info +='<li class="clear mt30"><em>Steam昵称</em><span>'+pageList[data].playerName+'</span></li>';
    info +='<li class="clear"><em>我的排名</em><span>'+pageList[data].rankingNo+'</span></li>';
    info +='<li class="clear"><em>排名奖励</em><span>'+pageList[data].rankingAmt+'</span></li>';
    $("#Reward-details-pop ul").html(info);
    $(".pop-mask").removeClass("dno");
    $("#Reward-details-pop").removeClass("dno");
}


function popErr(){
    var err = "奖金发送失败，具体情况请联系客服！"
    $('#alertsss').html('<div id="alertssstop">'+ err + '</div>');
    window.alertshow();
}


loadGameRecords();
})(window);






