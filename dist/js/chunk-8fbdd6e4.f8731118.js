(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8fbdd6e4"],{4251:function(t,a,e){},"57da":function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("el-container",{staticClass:"Home"},[i("el-header",{staticStyle:{height:"80px"}},[i("div",{staticClass:"logo-wrap"},[i("div",{staticClass:"logo"},[i("a",{attrs:{href:"http://cs.njupt.edu.cn/",target:"_blank"}},[i("img",{attrs:{src:e("cf05"),alt:""}})])]),i("div",{staticClass:"toggle-button",on:{click:t.toggleCollapse}},[i("i",{staticClass:"iconfont icon-caidan1"})])]),i("div",{staticClass:"title"},[t._v("合为企业设备管理系统")]),i("div",{staticClass:"hd-btns"},[i("div",{staticClass:"nowtime"},[i("div",{staticClass:"timeinfo"},[i("nowTime"),i("div",{ref:"timeTips",staticClass:"am-pm"},[t._v(t._s(t.timeTip))])],1)])])]),["ROOT","ADMIN"].includes(t.userRole)?i("el-container",[i("el-aside",{attrs:{width:t.isCollapse?"80px":"200px"}},[i("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"unique-opened":!0,"collapse-transition":!1,router:!0,collapse:t.isCollapse,"default-active":t.$route.path}},t._l(t.menuList1,(function(a){return i("el-submenu",{key:a.id,attrs:{index:a.id+""}},[i("template",{slot:"title"},[i("i",{class:t.iconsObj[a.id]}),i("span",[t._v(t._s(a.authName))])]),t._l(a.children,(function(a){return i("el-menu-item",{key:a.id,staticClass:"subItem",attrs:{index:"/"+a.path}},[i("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(a.authName))])])}))],2)})),1)],1),i("el-main",[i("router-view")],1)],1):t._e(),["CREATOR"].includes(t.userRole)?i("el-container",[i("el-aside",{attrs:{width:t.isCollapse?"80px":"200px"}},[i("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"unique-opened":!0,"collapse-transition":!1,router:!0,collapse:t.isCollapse,"default-active":t.$route.path}},t._l(t.menuList2,(function(a){return i("el-submenu",{key:a.id,attrs:{index:a.id+""}},[i("template",{slot:"title"},[i("i",{class:t.iconsObj[a.id]}),i("span",[t._v(t._s(a.authName))])]),t._l(a.children,(function(a){return i("el-menu-item",{key:a.id,staticClass:"subItem",attrs:{index:"/"+a.path}},[i("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(a.authName))])])}))],2)})),1)],1),i("el-main",[i("router-view")],1)],1):t._e(),["OPERATOR"].includes(t.userRole)?i("el-container",[i("el-aside",{attrs:{width:t.isCollapse?"80px":"200px"}},[i("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"unique-opened":!0,"collapse-transition":!1,router:!0,collapse:t.isCollapse,"default-active":t.$route.path}},t._l(t.menuList3,(function(a){return i("el-submenu",{key:a.id,attrs:{index:a.id+""}},[i("template",{slot:"title"},[i("i",{class:t.iconsObj[a.id]}),i("span",[t._v(t._s(a.authName))])]),t._l(a.children,(function(a){return i("el-menu-item",{key:a.id,staticClass:"subItem",attrs:{index:"/"+a.path}},[i("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(a.authName))])])}))],2)})),1)],1),i("el-main",[i("router-view")],1)],1):t._e(),["SUPERVISOR"].includes(t.userRole)?i("el-container",[i("el-aside",{attrs:{width:t.isCollapse?"80px":"200px"}},[i("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"unique-opened":!0,"collapse-transition":!1,router:!0,collapse:t.isCollapse,"default-active":t.$route.path}},t._l(t.menuList3,(function(a){return i("el-submenu",{key:a.id,attrs:{index:a.id+""}},[i("template",{slot:"title"},[i("i",{class:t.iconsObj[a.id]}),i("span",[t._v(t._s(a.authName))])]),t._l(a.children,(function(a){return i("el-menu-item",{key:a.id,staticClass:"subItem",attrs:{index:"/"+a.path}},[i("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(a.authName))])])}))],2)})),1)],1),i("el-main",[i("router-view")],1)],1):t._e()],1)},n=[],s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"nowDate"},[t._v(t._s(t.nowDate))])},u=[],l=(e("99af"),{name:"Timer",data:function(){return{nowDate:""}},methods:{currentTime:function(){setInterval(this.formatDate,500)},formatDate:function(){var t=new Date,a=t.getHours();a=a<10?"0"+a:a;var e=t.getMinutes();e=e<10?"0"+e:e;var i=t.getSeconds();i=i<10?"0"+i:i,this.nowDate=" ".concat(a,":").concat(e,":").concat(i)}},mounted:function(){this.currentTime()},beforeDestroy:function(){this.formatDate&&clearInterval(this.formatDate)}}),o=l,h=e("2877"),r=Object(h["a"])(o,s,u,!1,null,"263990dd",null),d=r.exports,c=e("bc3a"),m=e.n(c),p={created:function(){var t=this;this.getMycount(),m.a.get("http://47.102.214.37:8080/user/me").then((function(a){console.log(a.data),t.userRole=a.data.role}))},data:function(){return{isCollapse:!1,userRole:"",timeTip:"",menuList1:[{id:1,authName:"用户管理",children:[{id:10,authName:"用户",path:"users"}]},{id:2,authName:"设备管理",children:[{id:20,authName:"新增设备",path:"addDevice"},{id:21,authName:"设备信息",path:"deviceInformation"}]},{id:3,authName:"设备保养",children:[{id:30,authName:"新增任务",path:"addTask"},{id:31,authName:"任务分配",path:"tssignTask"},{id:32,authName:"任务信息",path:"taskInformation"},{id:33,authName:"保养记录",path:"maintenanceNotes"},{id:34,authName:"保养查询",path:"searchMaintenance"}]},{id:4,authName:"设备维修",children:[{id:40,authName:"报修申请",path:"fixApply"},{id:41,authName:"全部异常",path:"allError"},{id:42,authName:"我发布的",path:"mySubmit"},{id:43,authName:"维修查询",path:"fixSearch"}]},{id:5,authName:"数据分析",children:[{id:50,authName:"故障分析",path:"faultAnalysis"},{id:51,authName:"保养分析",path:"maintenanceAnalysis"},{id:52,authName:"维修分析",path:"fixAnalysis"},{id:53,authName:"使用日志",path:"useLogs"},{id:54,authName:"维修日志",path:"fixLogs"}]}],menuList2:[{id:1,authName:"用户管理",children:[{id:10,authName:"用户",path:"users"}]},{id:2,authName:"设备管理",children:[{id:20,authName:"新增设备",path:"addDevice"},{id:21,authName:"设备信息",path:"deviceInformation"}]},{id:3,authName:"设备保养",children:[{id:30,authName:"新增任务",path:"addTask"},{id:31,authName:"任务分配",path:"tssignTask"},{id:32,authName:"任务信息",path:"taskInformation"},{id:33,authName:"保养记录",path:"maintenanceNotes"},{id:34,authName:"保养查询",path:"searchMaintenance"}]},{id:4,authName:"设备维修",children:[{id:41,authName:"维修诊断",path:"fixDiagnosis"},{id:42,authName:"我发布的",path:"mySubmit"},{id:43,authName:"维修查询",path:"fixSearch"}]}],menuList3:[{id:1,authName:"用户管理",children:[{id:10,authName:"用户",path:"users"}]},{id:3,authName:"设备保养",children:[{id:31,authName:"任务信息",path:"taskInformation"},{id:33,authName:"保养记录",path:"maintenanceNotes"},{id:34,authName:"保养查询",path:"searchMaintenance"}]},{id:4,authName:"设备维修",children:[{id:41,authName:"维修诊断",path:"fixDiagnosis"},{id:42,authName:"我发布的",path:"mySubmit"},{id:43,authName:"维修查询",path:"fixSearch"}]},{id:5,authName:"数据分析",children:[{id:50,authName:"故障分析",path:"faultAnalysis"},{id:51,authName:"保养分析",path:"maintenanceAnalysis"},{id:52,authName:"维修分析",path:"fixAnalysis"},{id:53,authName:"使用日志",path:"useLogs"},{id:54,authName:"维修日志",path:"fixLogs"}]}],menuList4:[{id:1,authName:"用户管理",children:[{id:10,authName:"用户",path:"users"}]},{id:3,authName:"设备保养",children:[{id:31,authName:"任务信息",path:"taskInformation"},{id:33,authName:"保养记录",path:"maintenanceNotes"},{id:34,authName:"保养查询",path:"searchMaintenance"}]},{id:4,authName:"设备维修",children:[{id:41,authName:"维修诊断",path:"fixDiagnosis"},{id:42,authName:"我发布的",path:"mySubmit"},{id:43,authName:"维修查询",path:"fixSearch"}]},{id:5,authName:"数据分析",children:[{id:50,authName:"故障分析",path:"faultAnalysis"},{id:51,authName:"保养分析",path:"maintenanceAnalysis"},{id:52,authName:"维修分析",path:"fixAnalysis"},{id:53,authName:"使用日志",path:"useLogs"},{id:54,authName:"维修日志",path:"fixLogs"}]}],iconsObj:{1:"iconfont icon-yonghu",2:"iconfont icon-guanli",3:"iconfont icon-baoyang",4:"iconfont icon-weixiu",5:"iconfont icon-shujufenxi"}}},methods:{toggleCollapse:function(){this.isCollapse=!this.isCollapse},handleOpen:function(t,a){console.log(t,a)},handleClose:function(t,a){console.log(t,a)},getMycount:function(){var t=this,a=new Date;a.getHours()>=0&&a.getHours()<12?t.timeTip="AM":(a.getHours()>=12&&a.getHours(),t.timeTip="PM")}},components:{nowTime:d}},f=p,N=(e("dbc2"),Object(h["a"])(f,i,n,!1,null,null,null));a["default"]=N.exports},"99af":function(t,a,e){"use strict";var i=e("23e7"),n=e("d039"),s=e("e8b5"),u=e("861d"),l=e("7b0b"),o=e("50c4"),h=e("8418"),r=e("65f0"),d=e("1dde"),c=e("b622"),m=e("2d00"),p=c("isConcatSpreadable"),f=9007199254740991,N="Maximum allowed index exceeded",v=m>=51||!n((function(){var t=[];return t[p]=!1,t.concat()[0]!==t})),g=d("concat"),x=function(t){if(!u(t))return!1;var a=t[p];return void 0!==a?!!a:s(t)},_=!v||!g;i({target:"Array",proto:!0,forced:_},{concat:function(t){var a,e,i,n,s,u=l(this),d=r(u,0),c=0;for(a=-1,i=arguments.length;a<i;a++)if(s=-1===a?u:arguments[a],x(s)){if(n=o(s.length),c+n>f)throw TypeError(N);for(e=0;e<n;e++,c++)e in s&&h(d,c,s[e])}else{if(c>=f)throw TypeError(N);h(d,c++,s)}return d.length=c,d}})},cf05:function(t,a,e){t.exports=e.p+"img/logo.9188549b.png"},dbc2:function(t,a,e){"use strict";e("4251")}}]);
//# sourceMappingURL=chunk-8fbdd6e4.f8731118.js.map