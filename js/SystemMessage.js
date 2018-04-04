/**
 * Created by pc on 2018/3/14.
 */

var MsgSize = 10;
var MsgPage = 1;
var status = '';
var redMsgCont = [];
var pageCont = [];
function loadMsg() {
    $("#top-titlebd-cc .fr>.btn-default").eq(0).click();
}

//信息筛选
$("#top-titlebd-cc .fr>.btn-default").on("click", function () {
    MsgPage = 1;
    $(this).addClass("active").siblings("span").removeClass("active");
    status = $(this).index() == 0 ? "" : $(this).index() == 1 ? 0 : 1;
    getmsg();
});

function getmsg(tip) {

    var liLen = $("#system-message-box .system-manufacturers>li");
    if (liLen.length == 0 && MsgPage > 1) {
        MsgPage -= 1;
    }
    var options = {
        url: '/message.do',
        type: 'get',
        dataType: 'json',
        data: {
            'size': MsgSize,
            'page': MsgPage,
            'status': status
        },
        isLoading: true,
        success_fun: function (data) {
            var msg = " ";
            var pageList = data.data;
            var page = data.pageable;
            pageCont = [];
            $("#system-message-box .system-manufacturers").html("");
            $("#system-message-box .page-box").html("");
            if (pageList.length <= 0) {
                $("#system-message-box .nofound-exchange-mall").removeClass("dno");
                $("#system-message-box .msglist-system").addClass("dno");
            } else {
                $("#system-message-box .nofound-exchange-mall").addClass("dno");
                $("#system-message-box .msglist-system").removeClass("dno");
                for (var i = 0; i < pageList.length; i++) {
                    pageCont.push(pageList[i].id);
                    if (i % 2 == 0 && pageList[i].status == 0) {
                        msg += '<li class="bg-f1f1f1 clear">';
                    } else if (i % 2 == 0 && pageList[i].status == 1) {
                        msg += '<li class="bg-f1f1f1 clear isRead">';
                    } else if (i % 2 != 0 && pageList[i].status == 1) {
                        msg += '<li class="clear isRead">';
                    } else {
                        msg += '<li class="clear">';
                    }
                    msg += '<i class="check-num-cc" onclick="getRedMsgCont(this,' + pageList[i].id + ')" uiId=' + pageList[i].id + '></i>';
                    msg += '<i class="icon-msg-sys"></i>';
                    msg += '<span class="timer-sys">' + common.formatDateTime(pageList[i].create_time) + '</span>';
                    msg += '<span  class="title-sys">绝地求生</span>';
                    msg += '<p class="content-sys">第' + pageList[i].match_no + '场奖励已发放，请到账户查收</p>';
                    msg += '</li>';
                }
                $("#system-message-box .page-box").createPage({
                    pageCount: page.totalPage,
                    current: MsgPage,
                    backFn: function (p) {
                        MsgPage = p;
                        getmsg();
                    }
                });

                $("#system-message-box .system-manufacturers").html(msg);

                $("#MsgRead").on("click", function () {
                    msgFc(1);
                });
                $("#DetMsgRead").on("click", function () {
                    msgFc(2);
                });
            }
            common.removeLoading();


            if (tip) {
                $('#alertsss').html('<div id="alertssstop">' + tip + '</div>');
                alertshow();
            }
        },
        error_fun: function (err) {
            common.removeLoading();
            $('#alertsss').html('<div id="alertssstop">' + err + '</div>');
            alertshow();

        }
    };
    common.request(options);
}

//单个获取
function getRedMsgCont(that, id) {
    if ($(that).parent().hasClass("active")) {
        $(that).parent().removeClass("active");
        for (var i = 0; i < redMsgCont.length; i++) {
            if (redMsgCont[i] == id) {
                redMsgCont.splice(i, 1);
                break;
            }
        }
    } else {
        $(that).parent().addClass("active");
        redMsgCont.push(id);
    }
    var liLen = $("#system-message-box .system-manufacturers>li");
    if (redMsgCont.length < liLen.length) {
        $("#MsgCheckAll").removeClass("active");
    } else {
        $("#MsgCheckAll").addClass("active");
    }
}
function msgFc(type) {
    var err = "请选中你将要进行此操作的项！";
    if (redMsgCont.length <= 0) {
        $('#alertsss').html('<div id="alertssstop">' + err + '</div>');
        alertshow();
        return;
    }
    if (type == 1) {
        allReadFc()
    } else {
        deleteMsgFc();
    }

}

function allReadFc() {
    var data = redMsgCont.toString();
    var options = {
        url: '/message/read.do?ids=' + data,
        type: 'post',
        dataType: 'json',
        isLoading: true,
        //data:data,
        success_fun: function (data) {
            var err = "操作成功";
            common.removeLoading();
            if (data[0].code == 0) {
                redMsgCont = [];
                getmsg(err);
            } else {
                err = data[0].message;
                $('#alertsss').html('<div id="alertssstop">' + err + '</div>');
                alertshow();
            }
        },
        error_fun: function (err) {
            common.removeLoading();
            $('#alertsss').html('<div id="alertssstop">' + err + '</div>');
            alertshow();
        }
    };
    common.request(options);
}


function deleteMsgFc() {
    var data = redMsgCont.toString();
    var options = {
        url: '/message.do?ids=' + data,
        type: 'DELETE',
        dataType: 'json',
        isLoading: true,
        success_fun: function (data) {
            common.removeLoading();
            redMsgCont = [];
            getmsg('删除成功！');
        },
        error_fun: function (err) {
            common.removeLoading();
            $('#alertsss').html('<div id="alertssstop">' + err + '</div>');
            alertshow();
        }
    };
    common.request(options);
}


//全选
$("#MsgCheckAll").on("click", function () {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#system-message-box li").removeClass("active");
        redMsgCont = [];
    } else {
        $(this).addClass("active");
        $("#system-message-box li").addClass("active");
        redMsgCont = pageCont;
    }
});


loadMsg();
