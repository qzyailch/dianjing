/**
 * Created by pc on 2018/3/14.
 */
(function(){
var GameSize=10;
var GamePage=1;
var matchNo="";

function loadGameInfor(){
    var options = {
        url:'/record/game.do',
        type: 'get',
        dataType: 'json',
        data:{
            'size':GameSize,
            'page':GamePage,
            'matchNo':matchNo
        },
        isLoading:true,
        success_fun: function (data) {
            var msg=" ";
            var pageList = data.data?data.data:[];
            var page= data.pageable;
            $("#table-game-record").html("");
            if(pageList.length<=0){
                $("#game-records-box .table-list-game").css("height",80+'px');
                $("#game-records-box .nofound-exchange-mall").removeClass("dno");
            }else{
                $("#game-records-box .nofound-exchange-mall").addClass("dno");
                for(var i=0;i<pageList.length;i++){
                    if(i%2==0){
                        msg+='<tr class="bg-191919">';
                    }else{
                        msg+='<tr>';
                    }
                    msg+='<td class="size-209"><div>'+pageList[i].playerName+'</div></td>';
                    msg+='<td class="size-209"><div>'+pageList[i].matchNo+'</div></td>';
                    msg+='<td class="size-150"><div>'+pageList[i].rankingNo+'</div></td>';
                    msg+='<td class="size-150"><div>'+pageList[i].matchResult.split("|")[1]+'</div></td>';
                    msg+='<td class="size-150"><div>'+pageList[i].matchResult.split("|")[2]+'</div></td>';
                    msg+='<td class="size-150"><div>'+pageList[i].rankingAmt+'</div></td>';
                    msg+='<td><span>'+common.formatDateTime(pageList[i].matchComplateTime)+'</span></td>';
                    msg+='</tr>';

                }

                $("#game-records-infor .page-box").createPage({
                    pageCount:page.totalPage,
                    current:GamePage,
                    backFn:function(p){
                        GamePage = p;
                        loadGameInfor();
                    }
                });
                $("#game-infor-table").html(msg);

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





function loadInit(){
    var url=location.href;
    var tmp1=url.split("?")[1];
    var tmp2=tmp1.split("&")[0];
    var tmp3=tmp2.split("=")[1];
    matchNo = tmp3;
    loadGameInfor();
}
loadInit();
})(window);



