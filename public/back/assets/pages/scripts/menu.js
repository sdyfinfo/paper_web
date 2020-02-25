/**
 * Created by Administrator on 2019/2/19.
 */
var menuMake = '<li class="sidebar-toggler-wrapper hide">' +
'<div class="sidebar-toggler">' +
    '</div>' +
    '</li>' +
    '<li class="sidebar-search-wrapper">' +
    '<div style="color:white; padding: 0px 0px">' +
    '</div>' +
    '</li>';

function makeMenu(data){
    for(var i=0; i<data.length; i++){
        if(data[i].power == 0) {
            if( i == data.length - 1) menuMake += "</ul>";
            continue;
        }
        if(data[i].menutype == 1){
            menuMake += '<li class="nav-item">' +
                '<a href="javascript:;" class="nav-link nav-toggle" name="' + data[i].menuid + '">' +
                    '<i class="'+ data[i].menuicon +'"></i>' +
                    '<span class="title"> '+ data[i].menuname +' </span>' +
                    '<span class="arrow"></span>' +
                '</a>' +
                    '<ul class="sub-menu">'
        }else{
            menuMake += '<li class="nav-item">' +
                '<a href="' + data[i].url + '" class="nav-link nav-toggle" data-id="' + data[i].menuid + '">' +
                    '<i class="'+ data[i].menuicon +'"></i>' +
                    '<span class="title"> '+ data[i].menuname +' </span>' +
                '</a>'
        }
        if(data[i].hasOwnProperty("menulist") && data[i].menulist != undefined && data[i].menulist != null ){
            makeMenu(data[i].menulist);
        }else{
            menuMake += "</li>";
            if( i == data.length - 1) menuMake += "</ul>"
        }
    }
    menuMake += "</li>";

}

$(".page-sidebar-menu").on("click",  "a", function(e){
    e.preventDefault();
    var url = $(this).attr("href");
    if(url == "javascript:;") return;
    creatFormSubmit(url);
});

$("#password").on("click", function(){
    creatFormSubmit("password");
});

$("#main, #logo").on("click", function(){
    creatFormSubmit("rmain");
});

function creatFormSubmit(url){
    var token = localStorage.getItem("token");
    var form = document.createElement('form');
    form.action = url;
    form.method = 'post';
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'username';
    input.value = loginSucc.userid;
    form.appendChild(input);
    var input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'token';
    input1.value = token;
    form.appendChild(input1);
    $(document.body).append(form);
    form.submit();
}

function makeFunction(menu,data){
    var dataList = data.usermenulist;
    for(var i in dataList){
        if(dataList[i].menuid == menu.substr(0, menu.indexOf("?"))){
            for(var j in dataList[i].functionlist){
                var functionid = "#" + dataList[i].functionlist[j].functioncode;
                if(dataList[i].functionlist[j].power == 1){
                    $(functionid).show();
                }else{
                    $(functionid).hide();
                }
            }
        }
    }
}

//编辑功能判断
function makeEdit(menu,data,id){
    var dataList = data.usermenulist;
    for(var i in dataList){
        if(dataList[i].menuid == menu.substr(0, menu.indexOf("?"))){
            for(var j in dataList[i].functionlist){
                var functionid = "#" + dataList[i].functionlist[j].functioncode;
                //判断该页面的编辑id是否存在
                if(functionid == id){
                    return (dataList[i].functionlist[j].power == 1);
                }
            }
        }
    }
}