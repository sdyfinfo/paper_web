/**
 * Created by Administrator on 2019/2/21.
 */
/**
 * Created by Administrator on 2019/2/19.
 */
var newsContentList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        //百度富文本编辑器初始化
        UE.getEditor("article", {
            toolbars: [[
                'fullscreen', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                'directionalityltr', 'directionalityrtl', 'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                'simpleupload',  'insertimage', 'emotion', 'insertvideo', 'music', 'map', 'template', 'background', '|',
                'horizontal', 'date', 'time', 'spechars', '|',
                'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                'searchreplace'
            ]],
            autoHeightEnabled: false,
            initialFrameHeight: 300,
            serverUrl: 'http://localhost:8080/fileUpload',  //此处请求服务器的地址
            imageFieldName: "uploadFile",
            imageUrlPrefix: '',
            imageActionName: 'ajaxUpload',
            imageAllowFiles: [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
            catcherUrlPrefix: '',
        });
        NewsContentTable.init();
        NewsContentEdit.init();
    });
}

var NewsContentTable = function () {
    var initTable = function () {
        var table = $('#news_table');
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
                    newstype: formData.newstype,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                newsContentDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "newsid", visible: false },
                { "data": "newstype" },
                { "data": "title" },
                { "data": "newsurl" },
                { "data": "summary" },
                { "data": "time" },
                { "data": "read" },
                { "data": "thumbs" },
                { "data": null }
            ],
            columnDefs: [
                {
                    "targets":[1],
                    "render":function(data, type, row, meta){
                        return '<input type="checkbox" class="checkboxes" value="1" />';
                    }
                },
                {
                    "targets": [0],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;  //行号
                    }
                },
                {
                    "targets": [5],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return "<img src='" + data + "' style='width: 30px; height:20px'>";
                    }
                },
                {
                    "targets": [6],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return "<div class='toLong'>" + data + "</div>";
                    }
                },
                {
                    "targets": [7],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return dateTimeFormat(data);
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td:eq(1)', nRow).attr('style', 'text-align: center;');
            }
        });
        table.find('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).prop("checked", true);
                    $(this).parents('tr').addClass("active");
                } else {
                    $(this).prop("checked", false);
                    $(this).parents('tr').removeClass("active");
                }
            });
        });

        table.on('change', 'tbody tr .checkboxes', function () {
            $(this).parents('tr').toggleClass("active");
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

var NewsContentEdit = function() {
    var handleRegister = function() {
        var validator = $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                newstype: {
                    required: true
                },
                title: {
                    required: true
                },
                newsimage: {
                    required: true
                },
                summary: {
                    required: true
                },
                article: {
                    required: true
                }
            },
            messages: {
                newstype: {
                    required: "新闻类型必须输入"
                },
                title: {
                    required: "新闻标题必须输入"
                },
                newsimage: {
                    required: "缩略图必须上传"
                },
                summary: {
                    required: "新闻摘要必须输入"
                },
                content: {
                    required: "新闻内容必须输入"
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
                if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                form.submit();
            }
        });
        $('#register-btn').click(function() {
            btnDisable($('#register-btn'));
            if ($('.register-form').validate().form()) {
                var newsContent = $('.register-form').getFormData();
                newsContent.content = UE.getEditor('content').getContent();
                ////先上传LOGO
                //如果头像发生了变化，先上传头像
                //获取原来的头像
                var oldimage = $("input[name=oldimage]").val();
                if(newsContent.newsimage != oldimage) {
                    var formData = new FormData();
                    var fileInfo = $("#newsurl").get(0).files[0];
                    formData.append('image', fileInfo);
                    $.ajax({
                        type: 'POST',
                        url: webUrl + "new/news/upload/image",
                        data: formData,
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        success: function (result) {
                            if (result.code == SUCCESS) {
                                newsContent.newsurl = result.newsurl;
                                if($("input[name=edittype]").val() == NEWSADD){
                                    newsContentAdd(newsContent);
                                }else{
                                    newsContentEdit(newsContent);
                                }
                            } else {
                                alertDialog("上传新闻缩略图片失败！" + result.message);
                            }
                        },
                        error: function () {
                            alertDialog("上传新闻缩略图片失败！");
                        }
                    });
                }else {
                    if($("input[name=edittype]").val() == NEWSADD){
                        newsContentAdd(newsContent);
                    }else{
                        newsContentEdit(newsContent);
                    }
                }
            }
        });
        //新增新闻类型
        $('#op_add').click(function() {
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("新增新闻");
            $(":input",".register-form").not(":button,:reset,:submit,:radio").val("")
                .removeAttr("checked")
                .removeAttr("selected");
            //清空图片
            $("#newsurl").siblings("img").attr("src", "/public/manager/assets/pages/img/default.jpg");
            $("#newsurl").siblings("input[name=newsimage], input[name=oldimage]").val("");
            //清空文本框

            $("input[name=edittype]").val(NEWSADD);
            $('#edit_news_type').modal('show');
        });
        //编辑新闻类型
        $("#news_table").on('click', '#op_edit', function (e) {
            e.preventDefault();
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("编辑新闻");
            var exclude = [""];
            var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
            var newsid = $("#news_table").dataTable().fnGetData(row).newsid;
            var newsContent = new Object();
            for(var i=0; i < newsContentList.length; i++){
                if(newsid == newsContentList[i].newsid){
                    newsContent = newsContentList[i];
                }
            }
            var options = { jsonValue: newsContent, exclude:exclude, isDebug: false};
            $(".register-form").initForm(options);
            $("input[name=edittype]").val(NEWSEDIT);
            $('#edit_news_type').modal('show');
        });
    };

    return {
        init: function() {
            handleRegister();
        }
    };
}();

var NewsContentDelete = function() {
    //TODO:有人使用该新闻类型时，不应该删除
    $('#op_del').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = 1;
            confirmDialog("数据删除后将不可恢复，您确定要删除吗？", NewsContentDelete.deleteNewsContent, para)
        }
    });
    return{
        deleteNewsContent: function(){
            var newsContentList = {newsidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var newsContentId = $("#news_table").dataTable().fnGetData(row).newsid;
                newsContentList.newsidlist.push(newsContentId);
            });
            newsContentDelete(newsContentList);
        }
    }
}();

function getNewsContentDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.code == SUCCESS) {
            var res = result;
            newsContentList = res.newslist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.newslist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.message);
        }
    }else{
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("新闻类型信息获取失败！");
    }
}

function newsContentInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "";
    var alert = "";
    switch (type){
        case NEWSADD:
            text = "新增";
            break;
        case NEWSEDIT:
            text = "编辑";
            break;
        case NEWSDELETE:
            text = "删除";
            break;
    }
    if(flg){
        if(result && result.code != SUCCESS){
            alert = result.message;
        }
        if (result && result.code == SUCCESS) {
            res = "成功";
            NewsContentTable.init();
            $('#edit_news_type').modal('hide');
        }
    }
    if(alert == "") alert = text + "新闻类型" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#op_inquiry").on("click", function(){
    //用户查询
    NewsContentTable.init();
});