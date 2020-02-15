/**
 * Created by Administrator on 2019/2/19.
 */
function sendMessageEdit(oJson){
    console.info(oJson);
    return JSON.stringify(oJson);
}

function msgHeadMake(type){
    return {
        "timestamp": getTimeStamp(),
        "token": loginSucc.token || '',
        "userid": loginSucc.userid || '',
        "termid": ""
    };
}

function getTimeStamp(){
    var now = new Date(),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
    return y.toString() + (m < 10 ? "0" + m : m) + (d < 10 ? "0" + d : d) + now.toTimeString().substr(0, 8).replace(/:/g, "");
}

function confirmDialog(tips, func, para){
    bootbox.dialog({
        message: tips,
        title: "提示",
        buttons: {
            success: {
                label: "确定",
                className: "blue",
                callback: function(){
                    func(para)
                }
            },
            danger: {
                label: "取消",
                className: "red"
            }
        }
    });
}

function alertDialog(tips){
    bootbox.dialog({
        message: tips,
        title: "提示",
        buttons: {
            success: {
                label: "确定",
                className: "blue"
            }
        }
    });
}

function sexFormat(sexcode){
    var sex = "女";
    switch (sexcode){
        case "0":
            sex = "男";
            break;
    }
    return sex;
}

function dateTimeFormat(datetime){
    if(datetime.length < 14) return datetime;
    return datetime.substr(0, 4) + "/" + datetime.substr(4, 2) + "/" +
        datetime.substr(6, 2) + " " + datetime.substr(8, 2) + ":" +
        datetime.substr(10, 2) + ":" + datetime.substr(12, 2);
}


function conferenceDateFormat(dateRange){
    if(dateRange.length < 8) return dateRange;
    return dateRange.substr(0, 4) + "/" + dateRange.substr(4, 2) + "/" +
        dateRange.substr(6, 2);
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function getNowFormatTime() {
    var date = new Date();
    var seperator1 = ":";
    var hours= date.getHours();
    var minutes = date.getMinutes();
    if (hours >= 1 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    var currentTime = hours + seperator1 + minutes;
    return currentTime;
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";

    var uuid = s.join("-");
    return uuid.replace(/-/g, "");
}

function makeQRCode(){
    var state = uuid();
    var url = "https://open.weixin.qq.com/connect/qrconnect?appid=wxa8dbebc53ea8b98d&" +
        "redirect_uri=http%3A%2F%2Fwww.biye.com.cn/paper/login&response_type=code&" +
        "scope=snsapi_login&state=" + state + "#wechat_redirect";
    $("#qrcode").empty();
    $("#qrcode").attr("src", url)
}

function btnDisable(id){
    id.attr("disabled","disabled");
    setTimeout(btnEnable, 3000, id);
}


function btnEnable(id){
    id.removeAttr("disabled");
}

$(".el-menu-item").on("click", function(){
    var url = $(this).data("url");
    var form = document.createElement('form');
    form.action = url;
    form.method = 'post';
    $(document.body).append(form);
    form.submit();
});

$("#login-btn").on("click", function(){
    if(login != 1){
        makeQRCode();
        $("#login-modal").modal('show');
    }
});

function niceIn(prop){
    prop.find('i').addClass('niceIn');
    setTimeout(function(){
        prop.find('i').removeClass('niceIn');
    },1000);
}
$("#zan").click(function () {
    if(login != 1) {
        makeQRCode();
        $("#login-modal").modal('show');
        return;
    }
    var that = this;
    //点赞处理
    App.blockUI({target:'.paper-container',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: "/zan",    //请求发送到TestServlet处
        data: sendMessageEdit({}),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            App.unblockUI('.paper-container');
            console.info("zan:" + JSON.stringify(result));
            $("#zan-number").text(result.zan);
            $.tipsBox({
                obj: $(that),
                str: "+1",
                callback: function () {
                }
            });
            niceIn($(this));
        },
        error: function (errorMsg) {
            console.info("zan-error:" + JSON.stringify(errorMsg));
            App.unblockUI('.paper-container');
        }
    });
});

function userInfoSave(){
    var data = {vip: vip, free: free, endtime: endtime};
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: "/user/save",    //请求发送到TestServlet处
        data: sendMessageEdit(data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {

        },
        error: function (errorMsg) {
        }
    });
}

function vipTimeDisplay(){
    if(vip == "true"){
        $("#endtime").show();
        $("#novip").hide();
        $("#time").html(endtime);
    }else{
        $("#endtime").hide();
        $("#novip").show();
    }
}