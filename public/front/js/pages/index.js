
$(document).ready(function () {
   if(login == 1){
       if( free == 'false' || !free ){
           $("#free-btn").addClass("el-active");
           $("#pay-btn").removeClass("el-active");
           $("#type").val("0");
       }else{
           $("#pay-btn").addClass("el-active");
           $("#free-btn").removeClass("el-active");
           $("#type").val("1");
       }
       rabbitMQConnect("", openid);
       PaperSubmit.init()
       CardSubmit.init();
   }
});

$("#upload-btn, #pay-btn, #submit-btn").on("click", function(){
    if(login != 1){
        makeQRCode();
        $("#login-modal").modal('show');
        //$(".paymenu").show();
    }
});

$("#upload-btn").on("click", function(){
    if(login == 1){
        $("#upload-file").click();
    }
});

$("#title, #author").on("focus", function(){
    if(login != 1){
        makeQRCode();
        $("#login-modal").modal('show');
    }
});

$("#pay-btn").on("click", function(){
    if(login == 1){
        if(vip == "false"){
            $(".paymenu").show();
        }
    }
});

//$("#pay-btn")以外的位置按下后，付款弹框消失
$(document).click(function(e){
    var show = false;
    $(e.target).parents().each(function(){
        if($(this)[0] == $("#pay-btn")[0]){
            show = true;
            return false;
        }
    });
    if($(e.target)[0] == $("#pay-btn")[0]){
        show = true;
        return false;
    }
    if(!show){
        $(".paymenu").hide();
    }
});

$("#upload-file").change(function(){
    var fileInfo = $("#upload-file").get(0).files[0];
    //判断文件类型和文件大小
    if(!fileInfo) return;
    var filename = fileInfo.name;
    var fileExtend = "";
    if(filename.lastIndexOf(".") != -1){
        fileExtend = filename.substr(filename.lastIndexOf(".") + 1);
    }
    fileExtend = fileExtend.toUpperCase();
    if(fileExtend != "DOC" && fileExtend != "DOCX" ){
        alertDialog("只能上传doc/docx类型的文件！");
        return;
    }
    if(fileInfo.size >= 30 * 1024 * 1024){
        alertDialog("上传的文件大小不能超过30M！");
        return;
    }
    var formData = new FormData();
    formData.append('file', fileInfo);
    $("#upload-file").val("");
    App.blockUI({target:'.paper-container',boxed: true});
    $.ajax({
        type: 'POST',
        url: webUrl + "paper/content/trade",
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (result) {
            App.unblockUI('.paper-container');
            console.info(result);
            if(result.code == 200){
                $("#content").val(result.content);
            }else{
                alertDialog(result.message);
            }
        },
        error: function () {
            App.unblockUI('.paper-container');
            alertDialog("上传文件失败！");
        }
    });
})

$("#wpay").on("click", function(){
    payQrcodeGet("2", "");
})

$("#alipay").on("click", function(){
    payQrcodeGet("1", "");
})

$("#cardpay").on("click", function(){
    $("#pay-modal").modal('hide');
    $("#card-modal").modal('show');
})

$("#free-btn, #pay-btn").on("click", function(){
    $(".check-type").find("button").removeClass("el-active");
    $(this).addClass("el-active");
    $("#type").val($(this).data("type"));
})

function payQrcodeGet(type, cardno){
    App.blockUI({target:'.paper-container',boxed: true});
    var data = {openid: openid, paytype: type, cardno:cardno};
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "paper/payment",    //请求发送到TestServlet处
        data: sendMessageEdit(data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("payQrcodeMake:" + JSON.stringify(result));
            App.unblockUI('.paper-container');
            $("#pay-modal").modal('hide');
            if(result.code == 200){
                if(type == 1 || type == 2){
                    $("#pay-qrcode").empty();
                    $("#pay-qrcode").qrcode({
                        render: "canvas", //也可以替换为table
                        width: 200,
                        height: 200,
                        text: result.code_url
                    });
                    var title = "请使用微信扫码支付";
                    if(type == 1){
                        title = "请使用支付宝扫码支付";
                    }
                    $("#pay-title").html(title);
                    $("#paycode-modal").modal('show');
                }else{
                    $("#pay-modal").modal('hide');
                    $("#card-modal").modal('hide');
                    alertDialog("会员卡包月支付成功！");
                    vip = "true";
                    endtime = result.endtime;
                    vipTimeDisplay();
                    //存储到session中
                    userInfoSave();
                }
            }else{
                alertDialog(result.message);
            }
        },
        error: function (errorMsg) {
            console.info("payQrcodeMake-error:" + JSON.stringify(errorMsg));
            App.unblockUI('.paper-container');
            if(type == 1 || type == 2){
                alertDialog("支付二维码生成失败！");
            }else{
                alertDialog("会员卡包月支付失败！");
            }
        }
    });
}

function paperSubmit(data){
    App.blockUI({target:'.paper-container',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "paper/content/submit",    //请求发送到TestServlet处
        data: sendMessageEdit(data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("paperSubmit:" + JSON.stringify(result));
            App.unblockUI('.paper-container');
            if(result.code == 200){
                var type = data.type;
                //清空画面上的输入项
                data = {title: "", author: "", content:"", paste_content:""};
                var options = { jsonValue: data, exclude:["type"],isDebug: false};
                $(".paper-form").initForm(options);
                $(".check-type").children("button").removeClass("el-active");
                if(type == 0) {
                    free = "true";
                    $("#free-btn, #free-tips").hide();
                    //存储到session中
                    userInfoSave();
                }
                //进入下载列表页面
                $("#download").trigger("click");
            }else{
                alertDialog(result.message);
            }
        },
        error: function (errorMsg) {
            console.info("paperSubmit-error:" + JSON.stringify(errorMsg));
            App.unblockUI('.paper-container');
            alertDialog("提交检测失败！");
        }
    });
}

var PaperSubmit = function() {
    var handleRegister = function() {
        var validator = $('.paper-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                title: {
                    required: true
                },
                paste_content: {
                    frequired: true
                },
                content: {
                    frequired: true
                },
                type: {
                    required: true
                }
            },

            messages: {
                title: {
                    required: "请输入标题"
                },
                paste_content: {
                    frequired: "请输入文章内容"
                },
                content: {
                    frequired: "请上传文件"
                },
                type: {
                    required: "请选择检测方式"
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                form.submit();
            }
        });

        jQuery.validator.addMethod("frequired", function(value, element) {
            if($(".nav-tabs > li.active").find("a")[0].id == "paste"){
                if(element.id == "paste_content"){
                    return value.replace(/\s+/g, "") != "";
                }else {
                    return true;
                }
            }else if($(".nav-tabs > li.active").find("a")[0].id == "upload"){
                if(element.id == "content"){
                    return value.replace(/\s+/g, "") != "";
                }else {
                    return true;
                }
            }
        }, "");

        //点击确定按钮
        $('#submit-btn').click(function() {
            btnDisable($('#submit-btn'));
            if ($('.paper-form').validate().form()) {
                var paper_data = $('.paper-form').getFormData();
                if (paper_data.type == "1" && vip == "false") {
                    alertDialog("请先付款再进行提交！")
                    return;
                };
                //先弹出验证码
                $('#mpanel1').empty();
                jigsaw.init({
                    el: document.getElementById('mpanel1'),
                    onSuccess: function() {
                        $("#verify-modal").modal("hide");
                        paper_data.openid = openid;
                        if($(".nav-tabs > li.active").find("a")[0].id == "paste"){
                            paper_data.content = paper_data.paste_content;
                        }
                        paper_data.paste_content = "";
                        paperSubmit(paper_data);
                    },
                    onFail: null,
                    onRefresh: null
                })
                $("#verify-modal").modal("show");
            }
        });
    };
    return {
        init: function() {
            handleRegister();
        }
    };
}();

var CardSubmit = function() {
    var handleRegister = function() {
        var validator = $('.card-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                cardno: {
                    required: true
                }
            },

            messages: {
                cardno: {
                    required: "请输入会员卡卡号"
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                form.submit();
            }
        });

        //点击确定按钮
        $('#card-submit').click(function() {
            if ($('.card-form').validate().form()) {
                var card_data = $('.card-form').getFormData();
                payQrcodeGet("3", card_data.cardno)
            }
        });
    };
    return {
        init: function() {
            handleRegister();
        }
    };
}();