/**
 * Created by Administrator on 2019/2/19.
 */

//var hostIp = "http://127.0.0.1:";

// var regulateSucc = {
//     "uploadFolder" : "/home/yfdev/src/ywt_web",                       // 上传文件所在文件夹
//     "loginUrl" : hostIp + "8001/gramtu/ac/web/",                      // 登录URL
//     "userHostUrl" : hostIp + "8001/gramtu/ac/web/front/",             // 用户相关URL
//     "gramtuWebUrl": hostIp + "8002/gramtu/web/"                       // web端URL
// };

var hostIp = "http://www.biye.com.cn/";
var regulateSucc = {
    "uploadFolder" : "/home/yfdev/src/ywt_web",                       // 上传文件所在文件夹
    "loginUrl" : hostIp + "/gramtu/ac/web/",                      // 登录URL
    "userHostUrl" : hostIp + "",             // 用户相关URL
    "gramtuWebUrl": hostIp + ""                       // web端URL
};

const SUCCESS = "200";

const DEFAULT = 0;
const USERADD = 1;
const USEREDIT = 2;
const USERDELETE = 3;
const LOGIN = 4;
const ROLEADD = 5;
const ROLEEDIT = 6;
const ROLEDELETE = 7;
const ORGANLIST = 8;
const ARTICLEADD = 9;
const ORGANADD = 10;
const ORGANEDIT = 11;
const ORGANDELETE = 12;
const SERVADD = 13;
const SERVEDIT = 14;
const SERVDELETE = 15;
const ARTDELETE = 16;
const COUPADD = 17;
const COUPEDIT = 18;
const COUPDELETE = 19;
const NEWSTYPEADD = 20;
const NEWSTYPEEDIT = 21;
const NEWSTYPEDELETE = 22;
const ABROADADD = 23;
const ABROADDELETE = 24;
const MENUADD = 26;
const MENUEDIT = 27;
const MENUDELETE = 28;
const FUNCTIONADD = 29;
const FUNCTIONEDIT = 30;
const FUNCTIONDELETE = 31;
const ARTEDIT = 32;
const ABROADEDIT = 33;
const NEWBORNADD = 34;
const ADADD = 35;
const ADDELETE = 36;
const ADEDIT = 37;
const NEWBORNEDIT = 38;
const NEWBORNDELETE = 39;
const MANMADEEDIT = 40;

const QRCODEADD = 41;
const QRCODEDELETE = 42;
const IMAGERESULTDELETE = 43;
const IMAGERESULTEDIT = 44;
const NEWSADD = 45;
const NEWSEDIT = 46;
const NEWSDELETE = 47;
const COUNTYADD = 48;
const COUNTYDELETE = 49;
const REGDELETE = 50;
const REGADD = 51;
const REGEDIT = 52;
const COUNTYEDIT = 53;
const COUNTEDIT = 54;
const COUNTADD = 55;
const COUNTDELETE = 49;
const COUNTKJYPE = 50;


const TableLanguage = {
        "aria": {
            "sortAscending": ": 以升序排列此列",
                "sortDescending": ": 以降序排列此列"
        },
        "emptyTable": "暂无数据",
        "info": "当前显示第 _START_ 到 _END_ 项，共 _TOTAL_项",
        "infoEmpty": "当前显示第 0 至 0 项，共 0 项",
        "infoFiltered": "(由 _MAX_ 项结果过滤)",
        "lengthMenu": "每页 _MENU_ 条",
        "search": "搜索:",
        "zeroRecords": "没有匹配的数据",
        "paginate": {
            "previous":"上一页",
            "next": "下一页",
            "last": "首页",
            "first": "末页",
            "page": "第",
            "pageOf": "共"
        },
        "processing": "正在加载中......"
    };
const TableLengthMenu = [
        [10, 20, 30, 50, -1],
        [10, 20, 30, 50, "所有"] // change per page values here
    ];

var PageLength = 20;
//测试数据
var userMenuList = {
    menulist:[
        {"menuid":"usermanager","menutype":1,sort:"0", power:"1", "menuname":"用户管理","url":"", menuicon:"icon-users",
            "menulist":[
                {"menuid":"password","menutype":0,sort:"1", power:"1", "menuname":"修改密码","url":"password", menuicon:"icon-lock"}
            ]
        },
        {"menuid":"organmanager","menutype":1,sort:"0", power:"1", "menuname":"服务管理","url":"", menuicon:"icon-badge",
            "menulist":[
                {"menuid":"organ","menutype":0,sort:"0", power:"1", "menuname":"注册用户查询","url":"wxuser", menuicon:"icon-home"},
                {"menuid":"station","menutype":0,sort:"1", power:"1", "menuname":"发卡管理","url":"card", menuicon:"icon-user-following"},
                {"menuid":"item","menutype":0,sort:"2", power:"1", "menuname":"订单查询","url":"order", menuicon:"icon-star"}
            ]
        },
        {"menuid":"evamanager","menutype":1,sort:"0", power:"1", "menuname":"资金管理","url":"", menuicon:"icon-envelope-letter",
            "menulist":[
                {"menuid":"evaluation","menutype":0,sort:"0", power:"1", "menuname":"资金查询","url":"money", menuicon:"icon-home"},
            ]
        },
        {"menuid":"news","menutype":1,sort:"0", power:"1", "menuname":"行业新闻","url":"", menuicon:"icon-docs",
            "menulist":[
                {"menuid":"newstype","menutype":0,sort:"0", power:"1", "menuname":"新闻分类","url":"newstype", menuicon:"icon-settings"},
                {"menuid":"newscontent","menutype":0,sort:"1", power:"1", "menuname":"新闻内容","url":"newscontent", menuicon:"icon-note"},
            ]
        }
    ]
};