/**
 * Created by pc on 2018/3/26.
 */
(function ($) {
    var ms = {
        isBind: false,
        args: "",
        init: function (obj, args) {
            return (function () {
                ms.fillHtml(obj, args);
                ms.args = args;
                if (!ms.isBind) {
                    ms.bindEvent(obj);
                    ms.isBind = true;
                }
            })();
        },
        //填充html
        fillHtml: function (obj, args) {
            return (function () {
                obj.empty();
                //上一页
                if (args.current > 1) {
                    obj.append('<span class="firstPage">首页</span>');
                    obj.append('<span class="prevPage">上一页</span>');
                } else {
                    obj.remove('.prevPage');
                    obj.append('<span class="firstPage">首页</span>');
                    obj.append('<span class="disabled">上一页</span>');
                }
                //中间页码
                var pageCont = "";
                if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                    pageCont += '<li><a href="javascript:;" class="tcdNumber">' + 1 + '</a></li>';
                }
                if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                    pageCont += '<li><span>...</span></li>';
                }
                var start = args.current - 2, end = args.current + 2;
                if ((start > 1 && args.current < 4) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
                    start--;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            pageCont += '<li><a href="javascript:;" class="tcdNumber">' + start + '</a></li>';
                        } else {
                            pageCont += '<li class="active"><a href="javascript:;"  class="tcdNumber ">' + start + '</a></li>';
                        }
                    }
                }
                if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                    pageCont += '<li><span>...</span></li>';
                }
                if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
                    pageCont += '<li><a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a></li>';
                }
                obj.append("<ul>" + pageCont + "</ul>");

                //下一页
                if (args.current < args.pageCount) {
                    obj.append('<span  class="nextPage">下一页</span>');
                    obj.append('<span  class="lastPage">尾页</span>');
                } else {
                    obj.remove('.nextPage');
                    obj.append('<span class="disabled">下一页</span>');
                    obj.append('<span  class="lastPage">尾页</span>');
                }
            })();
        },
        //绑定事件
        bindEvent: function (obj) {
            return (function () {
                obj.on("click", "a.tcdNumber", function () {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, {"current": current, "pageCount": ms.args.pageCount});
                    if (typeof(ms.args.backFn) == "function") {
                        ms.args.backFn(current);
                    }
                });
                //上一页
                obj.on("click", "span.prevPage", function () {
                    var myLi = obj.children("ul");
                    myLi = myLi.children("li.active");
                    var current = parseInt(myLi.text());
                    current = current == 1 ? 1 : current - 1;
                    if (typeof(ms.args.backFn) == "function") {
                        ms.args.backFn(current);
                    }
                });
                //下一页
                obj.on("click", "span.nextPage", function () {
                    var myLi = obj.children("ul");
                    myLi = myLi.children("li.active");
                    var current = parseInt(myLi.text());
                    current = current == ms.args.pageCount ? ms.args.pageCount : current + 1;
                    if (typeof(ms.args.backFn) == "function") {
                        ms.args.backFn(current);
                    }
                });
                //首页
                obj.on("click", "span.firstPage", function () {
                    if (typeof(ms.args.backFn) == "function") {
                        ms.args.backFn(1);
                    }
                });
                //尾页
                obj.on("click", "span.lastPage", function () {
                    if (typeof(ms.args.backFn) == "function") {
                        ms.args.backFn(ms.args.pageCount);
                    }
                });

            })();
        }
    }
    $.fn.createPage = function (options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function () {
            }
        }, options);
        ms.init(this, args);
    }
})(jQuery);