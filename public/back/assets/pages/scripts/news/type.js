/**
 * Created by Administrator on 2019/2/21.
 */
/**
 * Created by Administrator on 2019/2/19.
 */
var newsTypeList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        NewsTypeTable.init();
        NewsTypeEdit.init();
    });
}

var NewsTypeTable = function () {
    var initTable = function () {
        var table = $('#newsType_table');
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
                newsTypeDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "newstypeid", visible: false },
                { "data": "newstype" },
                { "data": "time" },
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
                    "targets": [4],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return dateTimeFormat(data, "/");
                    }
                },
                {
                    "targets": [5],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return '<a href="javascript:;" id="op_edit">编辑</a>'
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

var NewsTypeEdit = function() {
    var handleRegister = function() {
        var validator = $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                newstype: {
                    required: true
                }
            },
            messages: {
                newstype: {
                    required: "新闻类型必须输入"
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
                var newsType = $('.register-form').getFormData();
                if($("input[name=edittype]").val() == NEWSTYPEADD){
                    newsTypeAdd(newsType);
                }else{
                    newsTypeEdit(newsType);
                }
            }
        });
        //新增新闻类型
        $('#op_add').click(function() {
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("新增新闻类型");
            $(":input",".register-form").not(":button,:reset,:submit,:radio").val("")
                .removeAttr("checked")
                .removeAttr("selected");
            $("input[name=edittype]").val(NEWSTYPEADD);
            $('#edit_news_type').modal('show');
        });
        //编辑新闻类型
        $("#newsType_table").on('click', '#op_edit', function (e) {
            e.preventDefault();
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("编辑新闻类型");
            var exclude = [""];
            var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
            var newstypeid = $("#newsType_table").dataTable().fnGetData(row).newstypeid;
            var newsType = new Object();
            for(var i=0; i < newsTypeList.length; i++){
                if(newstypeid == newsTypeList[i].newstypeid){
                    newsType = newsTypeList[i];
                }
            }
            var options = { jsonValue: newsType, exclude:exclude, isDebug: false};
            $(".register-form").initForm(options);
            $("input[name=edittype]").val(NEWSTYPEEDIT);
            $('#edit_news_type').modal('show');
        });
    };

    return {
        init: function() {
            handleRegister();
        }
    };
}();

var NewsTypeDelete = function() {
    //TODO:有人使用该新闻类型时，不应该删除
    $('#op_del').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = 1;
            confirmDialog("数据删除后将不可恢复，您确定要删除吗？", NewsTypeDelete.deleteNewsType, para)
        }
    });
    return{
        deleteNewsType: function(){
            var newsTypeList = {newstypeidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var newsTypeId = $("#newsType_table").dataTable().fnGetData(row).newstypeid;
                newsTypeList.newstypeidlist.push(newsTypeId);
            });
            newsTypeDelete(newsTypeList);
        }
    }
}();

function getNewsTypeDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.code == SUCCESS) {
            var res = result;
            newsTypeList = res.newstypelist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.newstypelist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.message);
        }
    }else{
        /*newsTypeList = [
            {newstypeid:"1", newstype:"查重经验",time:"20191220111111"},
            {newstypeid:"2", newstype:"论文修改",time:"20191220111111"},
            {newstypeid:"3", newstype:"论文协作",time:"20191220111111"},
        ];
        tableDataSet(1, 3, 3, newsTypeList, callback);*/
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("新闻类型信息获取失败！");
    }
}

function newsTypeInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "";
    var alert = "";
    switch (type){
        case NEWSTYPEADD:
            text = "新增";
            break;
        case NEWSTYPEEDIT:
            text = "编辑";
            break;
        case NEWSTYPEDELETE:
            text = "删除";
            break;
    }
    if(flg){
        if(result && result.code != SUCCESS){
            alert = result.message;
        }
        if (result && result.code == SUCCESS) {
            res = "成功";
            NewsTypeTable.init();
            $('#edit_news_type').modal('hide');
        }
    }
    if(alert == "") alert = text + "新闻类型" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#op_inquiry").on("click", function(){
    //用户查询
    NewsTypeTable.init();
});