/**
 * Created by Jianggy on 2019/12/04.
 */
var cardList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        CardTable.init();
        CardEdit.init();
    });
}

var CardTable = function () {
    var initTable = function () {
        var table = $('#card_table');
        pageLengthInit(table);
        table.dataTable({
            "language": TableLanguage,
            "bStateSave": false, // save datatable state(pagination, sort, etc) in cookie.
            "lengthMenu": TableLengthMenu,
            "destroy": true,
            "pageLength": PageLength,
            "serverSide": true,
            "pagingType": "bootstrap_extended",
            "processing": true,
            "searching": false,
            "ordering": false,
            "autoWidth": false,
            "ajax":function (data, callback, settings) {
                var formData = $(".inquiry-form").getFormData();
                var da = {
                    cardno: formData.cardno,
                    issuing: formData.issuing,
                    isvalid: formData.isvalid,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                cardDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": "cardno" },
                { "data": "issuing" },
                { "data": "isvalid" },
                { "data": "nickname" },
                { "data": "activetime" },
                { "data": "endtime" }
            ],
            columnDefs: [
                {
                    "targets": [0],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;  //行号
                    }
                },
                {
                    "targets":[2],
                    "render":function(data, type, row, meta){
                        var status = "";
                        switch (data) {
                            case "1":
                                status = "已售出";
                                break;
                            case "0":
                                status = "未售出";
                                break;
                        }
                        return status
                    }
                },
                {
                    "targets":[3],
                    "render":function(data, type, row, meta){
                        var status = "";
                        switch (data) {
                            case "1":
                                status = "已激活";
                                break;
                            case "0":
                                status = "未激活";
                                break;
                        }
                        return status
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td', nRow).attr('style', 'text-align: center; vertical-align: middle;');
            }
        });
    };
    return {
        init: function (data) {
            if (!jQuery().dataTable) {
                return;
            }
            initTable(data);
        }
    };
}();


var CardEdit = function() {
    var handleRegister = function() {
        var validator = $('.card-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                number: {
                    required: true
                }
            },

            messages: {
                number: {
                    required: "发卡个数必须输入"
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
        $('#register-btn').click(function() {
            btnDisable($('#register-btn'));
            if ($('.card-form').validate().form()) {
                var card = $('.card-form').getFormData();
                if(card.edittype == 0){
                    cardSend(card);
                }else{
                    cardDownload(card);
                }

            }
        });
        //新增用户
        $('#op_add').click(function() {
            //清除校验错误信息
            validator.resetForm();
            $(".card-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("发卡");
            $(":input",".card-form").not(":button,:reset,:submit,:radio,:input[name=birthday],#evaluationneed").val("")
                .removeAttr("checked")
                .removeAttr("selected");
            $("input[name=edittype]").val(0);
            $('#send-card').modal('show');
        });
        $("#card_download").on("click", function(){
            //发卡文件下载
            validator.resetForm();
            $(".card-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("导出发卡文件");
            $(":input",".card-form").not(":button,:reset,:submit,:radio,:input[name=birthday],#evaluationneed").val("")
                .removeAttr("checked")
                .removeAttr("selected");
            $("input[name=edittype]").val(1);
            $('#send-card').modal('show');
        });
    };
    return {
        init: function() {
            handleRegister();
        }
    };
}();

function getCardDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.code == SUCCESS) {
            var res = result;
            cardList = res.cardlist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.cardlist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.message);
        }
    }else{
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("会员卡信息获取失败！");
    }
}

function cardInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "发卡";
    var alert = "";
    if(flg){
        if(result && result.code != SUCCESS){
            alert = result.message;
        }
        if (result && result.code == SUCCESS) {
            res = "成功";
            CardTable.init();
            $('#send-card').modal('hide');
        }
    }
    if(alert == "") alert = text + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#card_inquiry").on("click", function(){
    //用户查询
    CardTable.init();
});

function cardDownloadEnd(flg, result, type){
    if(flg){
        if(result && result.code != SUCCESS){
            alert = result.message;
            alertDialog(alert);
            App.unblockUI('#lay-out');
            return;
        }
        $('#send-card').modal('hide');
        var a = document.createElement('a');
        //a.download = '未售出卡号列表.xlsx';
        a.href = webUrl + result.downurl;
        $("body").append(a); //修复firefox中无法触发click
        a.click();
        $(a).remove();
    }else{
        alertDialog("发卡文件导出失败！");
    }
    App.unblockUI('#lay-out');
}
