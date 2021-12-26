(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0a4227"],{"04c0":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Card",[a("p",{staticClass:"card-title",attrs:{slot:"title"},slot:"title"},[a("Icon",{attrs:{type:"home"}}),a("span",[t._v("部门管理")])],1),a("div",[[a("Row",[a("Col",{attrs:{span:"15"}},[a("Button",{attrs:{type:"info"},on:{click:function(e){t.openAddOrUpModal(null)}}},[a("Icon",{attrs:{type:"md-add"}}),t._v(" 添加部门")],1),a("Button",{attrs:{disabled:t.setting.loading,type:"success"},on:{click:t.getData}},[a("Icon",{attrs:{type:"md-refresh"}}),t._v(" 刷新数据")],1),a("Button",{attrs:{type:"primary"},on:{click:function(e){t.exportData(1)}}},[a("Icon",{attrs:{type:"ios-download-outline"}}),t._v(" 导出表格")],1)],1),a("Col",{attrs:{span:"9"}},[a("Input",{staticClass:"margin-bottom-10",attrs:{placeholder:"请输入您想要搜索的内容..."},model:{value:t.search.value,callback:function(e){t.$set(t.search,"value",e)},expression:"search.value"}},[a("Button",{attrs:{slot:"append",icon:"ios-search"},slot:"append"})],1)],1)],1),a("Table",{ref:"table",staticClass:"margin-bottom-10",attrs:{columns:t.columns,loading:t.setting.loading,border:t.setting.showBorder,data:t.data.records}}),a("Page",{staticClass:"tr",attrs:{total:t.data.total,current:t.data.current,"page-size":t.data.size,"show-elevator":"","show-sizer":""},on:{"on-change":t.pageChange,"update:current":function(e){t.$set(t.data,"current",e)},"on-page-size-change":t.pageSizeChange}})]],2)]),t.addApartmentModal?a("AddApartment",{on:{cancel:t.onAddApartmentModalCancel}}):t._e(),t.updateApartmentModal?a("UpdateApartment",{attrs:{updateObject:t.updateObject},on:{cancel:t.onUpdateApartmentModalCancel}}):t._e(),a("Modal",{attrs:{width:"360"},model:{value:t.removeModal,callback:function(e){t.removeModal=e},expression:"removeModal"}},[a("p",{staticStyle:{color:"#f60","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"information-circled"}}),a("span",[t._v("提示")])],1),a("div",{staticStyle:{"text-align":"center"}},[a("p",[t._v("此操作为不可逆操作，是否确认删除？")])]),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"error",size:"large",long:"",loading:t.setting.loading},on:{click:t.remove}},[t._v("确认删除")])],1)])],1)},r=[],i=(a("ac6a"),a("7f7f"),a("96cf"),a("3b8d")),s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Modal",{attrs:{title:"添加部门","mask-closable":!1,closable:!1},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[a("Form",{ref:"modalForm",attrs:{model:t.data,rules:t.ruls,"label-width":80}},[a("FormItem",{attrs:{label:"名称",prop:"name"}},[a("Input",{model:{value:t.data.name,callback:function(e){t.$set(t.data,"name","string"===typeof e?e.trim():e)},expression:"data.name"}})],1),a("FormItem",{attrs:{label:"职能简介",prop:"about"}},[a("Input",{attrs:{type:"textarea",autosize:{minRows:3,maxRows:5},placeholder:"Enter something..."},model:{value:t.data.about,callback:function(e){t.$set(t.data,"about",e)},expression:"data.about"}})],1),a("FormItem",{attrs:{label:"管理员"}},[a("Select",{attrs:{filterable:"",remote:"","remote-method":t.findAllStudent,loading:t.loading},model:{value:t.data.apartAdmin,callback:function(e){t.$set(t.data,"apartAdmin",e)},expression:"data.apartAdmin"}},t._l(t.options,function(e,n){return a("Option",{key:n,attrs:{value:e.id}},[t._v(t._s(e.className)+" - "+t._s(e.realName))])}),1)],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"default",disabled:t.loading},on:{click:function(e){t.cancel(!1)}}},[t._v("取消")]),a("Button",{attrs:{type:"primary",loading:t.loading},on:{click:t.ok}},[t._v("确定")])],1)],1)],1)},o=[],l=a("f499"),c=a.n(l),d=a("d689"),u={data:function(){return{show:!0,loading:!1,data:{name:"",about:"",apartAdmin:""},ruls:{name:[{required:!0,message:"部门名称不能为空"}],about:[{required:!0,message:"部门简介不能为空"}],apartAdmin:[{required:!0,message:"请选择一个部门管理员"}]},options:[],lists:[]}},props:{},methods:{cancel:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.$emit("cancel","add",t)},ok:function(){var t=this;this.$refs.modalForm.validate(function(e){if(e){var a=JSON.parse(c()(t.data));t.add(a)}})},add:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.loading=!0,t.prev=1,t.next=4,Object(d["b"])("/app/apartment/add",e);case 4:t.sent,this.$Message.success("部门 "+e.name+" 添加成功"),this.cancel(!0),t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](1),this.$throw(t.t0);case 12:this.loading=!1;case 13:case"end":return t.stop()}},t,this,[[1,9]])}));function e(e){return t.apply(this,arguments)}return e}(),findAllStudent:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(e){var a,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(""===e){t.next=15;break}return this.loading=!0,t.prev=2,t.next=5,Object(d["b"])("/student/auth/list/already/exmember");case 5:a=t.sent,this.lists=a.data,t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](2),this.$throw(t.t0);case 12:setTimeout(function(){n.options=[],n.loading=!1;var t=n.lists.map(function(t){return{id:t.uid,realName:t.realName,whatClass:t.whatClass,className:t.className}});t.forEach(function(t){t.realName.toLowerCase().indexOf(e.toLowerCase())>-1?n.options.push(t):t.className.toLowerCase().indexOf(e.toLowerCase())>-1&&n.options.push(t)})},200),t.next=16;break;case 15:this.options=[];case 16:case"end":return t.stop()}},t,this,[[2,9]])}));function e(e){return t.apply(this,arguments)}return e}()}},p=u,m=a("2877"),h=Object(m["a"])(p,s,o,!1,null,null,null);h.options.__file="add.vue";var f=h.exports,b=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Modal",{attrs:{title:"更新部门信息","mask-closable":!1,closable:!1},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[a("Form",{ref:"modalForm",attrs:{model:t.data,rules:t.ruls,"label-width":80}},[a("FormItem",{attrs:{label:"ID"}},[a("Input",{attrs:{disabled:""},model:{value:t.data.id,callback:function(e){t.$set(t.data,"id","string"===typeof e?e.trim():e)},expression:"data.id"}})],1),a("FormItem",{attrs:{label:"名称",prop:"name"}},[a("Input",{model:{value:t.data.name,callback:function(e){t.$set(t.data,"name","string"===typeof e?e.trim():e)},expression:"data.name"}})],1),a("FormItem",{attrs:{label:"简介",prop:"about"}},[a("Input",{attrs:{type:"textarea",autosize:{minRows:3,maxRows:5},placeholder:"Enter something..."},model:{value:t.data.about,callback:function(e){t.$set(t.data,"about",e)},expression:"data.about"}})],1),a("FormItem",{attrs:{label:"管理员"}},[a("Select",{attrs:{filterable:"",remote:"","remote-method":t.findAllStudent,loading:t.loading,placeholder:t.data.adminName},model:{value:t.data.apartAdmin,callback:function(e){t.$set(t.data,"apartAdmin",e)},expression:"data.apartAdmin"}},t._l(t.options,function(e){return a("Option",{key:e.id,attrs:{value:e.id}},[t._v(t._s(e.className)+" - "+t._s(e.realName))])}),1)],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"default",disabled:t.loading},on:{click:function(e){t.cancel(!1)}}},[t._v("取消")]),a("Button",{attrs:{type:"primary",loading:t.loading},on:{click:t.ok}},[t._v("确定")])],1)],1)],1)},g=[],v={data:function(){return{show:!0,loading:!1,data:{id:0,name:"",about:"",apartAdmin:"",adminName:""},ruls:{name:[{required:!0,message:"部门名称不能为空"}],about:[{required:!0,message:"部门简介不能为空"}],apartAdmin:[{required:!0,message:"请选择一个部门管理员"}]},options:[]}},props:{updateObject:{type:Object,default:{}}},created:function(){null!=this.updateObject&&(this.data.id=this.updateObject.id,this.data.name=this.updateObject.name,this.data.about=this.updateObject.about,this.data.apartAdmin="",this.data.adminName=this.updateObject.apartAdmin.realName)},methods:{cancel:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.$emit("cancel","update",t)},getApartmentInfo:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,Object(d["b"])("/app/apartment/get/id/{id}",null,{id:this.aparId});case 3:e=t.sent,this.data=e.data.map(function(t){return{id:t.id,name:t.name,about:t.about,apartAdmin:t.apartAdmin.uid,adminName:t.apartAdmin.realName}}),t.next=10;break;case 7:t.prev=7,t.t0=t["catch"](0),this.$throw(t.t0);case 10:case"end":return t.stop()}},t,this,[[0,7]])}));function e(){return t.apply(this,arguments)}return e}(),ok:function(){this.update(this.data)},update:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return console.info(e),this.loading=!0,""==e.apartAdmin&&(e.apartAdmin=this.updateObject.apartAdmin.uid),t.prev=3,t.next=6,Object(d["b"])("/app/apartment/update/{id}",e,{id:this.data.id});case 6:t.sent,this.$Message.success("部门信息 "+e.name+" 更新成功"),this.cancel(!0),t.next=14;break;case 11:t.prev=11,t.t0=t["catch"](3),this.$throw(t.t0);case 14:this.loading=!1;case 15:case"end":return t.stop()}},t,this,[[3,11]])}));function e(e){return t.apply(this,arguments)}return e}(),findAllStudent:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(e){var a,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(""===e){t.next=15;break}return this.loading=!0,t.prev=2,t.next=5,Object(d["b"])("/student/auth/list/already/exmember");case 5:a=t.sent,this.lists=a.data,t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](2),this.$throw(t.t0);case 12:setTimeout(function(){n.loading=!1,n.options=[];var t=n.lists.map(function(t){return{id:t.uid,realName:t.realName,whatClass:t.whatClass,className:t.className}});t.forEach(function(t){t.realName.toLowerCase().indexOf(e.toLowerCase())>-1?n.options.push(t):t.className.toLowerCase().indexOf(e.toLowerCase())>-1&&n.options.push(t)})},200),t.next=16;break;case 15:this.options=[];case 16:case"end":return t.stop()}},t,this,[[2,9]])}));function e(e){return t.apply(this,arguments)}return e}()}},w=v,x=Object(m["a"])(w,b,g,!1,null,null,null);x.options.__file="update.vue";var y=x.exports,k={data:function(){var t=this;return{addApartmentModal:!1,updateApartmentModal:!1,updateObject:null,removeModal:!1,setting:{loading:!0,showBorder:!0},search:{type:"name",value:""},columns:[{type:"expand",width:50,render:function(t,e){return t("div",[t("p",{style:{fontWeight:"bold",lineHeight:"40px"}},"部门简介"),t("p",{},e.row.about)])}},{title:"ID",key:"id",sortable:!0},{title:"部门名",key:"name",sortable:!0},{title:"管理员",sortable:!0,render:function(t,e){return t("span",{},e.row.apartAdmin.realName)}},{title:"操作",key:"action",width:260,align:"center",render:function(e,a){return e("div",[e("Button",{props:{type:"success",size:"small"},style:{marginRight:"5px"},on:{click:function(){t.showAllMember(a.row)}}},"查看部门成员"),e("Button",{props:{type:"primary",size:"small"},style:{marginRight:"5px"},on:{click:function(){t.openAddOrUpModal(a.row)}}},"修改信息"),e("Button",{props:{type:"error",size:"small"},on:{click:function(){t.removeObject={obj:a.row,index:a.index},t.removeModal=!0}}},"删除")])}}],data:{},dataFilter:{page:1,pageSize:10},removeObject:null,allMember:null,isArray:!0,dataReady:!0}},components:{AddApartment:f,UpdateApartment:y},created:function(){this.getData()},methods:{pageChange:function(t){this.dataFilter.page=t,this.getData()},pageSizeChange:function(t){this.dataFilter.pageSize=t,this.getData()},getAllMember:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(e){var a;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.loading=!0,t.prev=1,t.next=4,Object(d["b"])("/app/apartment/member/list/{id}",null,{id:e});case 4:a=t.sent,this.allMember=a.data,this.isArray=this.allMember instanceof Array,this.dataReady=!0,t.next=13;break;case 10:t.prev=10,t.t0=t["catch"](1),this.$throw(t.t0);case 13:this.loading=!1;case 14:case"end":return t.stop()}},t,this,[[1,10]])}));function e(e){return t.apply(this,arguments)}return e}(),remove:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(this.removeModal=!1,null!=this.removeObject){t.next=4;break}return this.$Message.warning("删除对象为空，无法继续执行！"),t.abrupt("return",!1);case 4:return this.setting.loading=!0,t.prev=5,t.next=8,Object(d["b"])("/app/apartment/remove/{id}",null,{id:this.removeObject.obj.id});case 8:t.sent,this.$Message.success("删除成功"),this.data.records.splice(this.removeObject.index,1),t.next=16;break;case 13:t.prev=13,t.t0=t["catch"](5),this.$throw(t.t0);case 16:this.setting.loading=!1;case 17:case"end":return t.stop()}},t,this,[[5,13]])}));function e(){return t.apply(this,arguments)}return e}(),getData:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.setting.loading=!0,t.prev=1,t.next=4,Object(d["b"])("/app/apartment/list",{page:this.dataFilter.page,pageSize:this.dataFilter.pageSize});case 4:e=t.sent,this.data=e.data,t.next=11;break;case 8:t.prev=8,t.t0=t["catch"](1),this.$throw(t.t0);case 11:this.setting.loading=!1;case 12:case"end":return t.stop()}},t,this,[[1,8]])}));function e(){return t.apply(this,arguments)}return e}(),openAddOrUpModal:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(e){var a,n=arguments;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:a=n.length>1&&void 0!==n[1]?n[1]:"update",null===e?this.addApartmentModal=!0:"update"===a&&(this.updateObject=e,this.updateApartmentModal=!0);case 2:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),onAddApartmentModalCancel:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.addApartmentModal=!1,t&&this.getData()},onUpdateApartmentModalCancel:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.updateApartmentModal=!1,t&&this.getData()},showAllMember:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(e){var a;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:this.getAllMember(e.id),a=this.allMember,null!=a&&this.isArray&&a.length>0?this.$Modal.info({title:e.name+" - 成员",width:"40%",render:function(t){var e=[];return a.forEach(function(a){if(0==a.isadmin){var n=t("Tag",{props:{color:"#f90",type:"dot"}},a.member.realName);e.push(n)}else{var r=t("Tag",{props:{color:"#19be6b",type:"dot"}},a.member.realName);e.push(r)}}),t("div",{style:{padding:"20px 0 10px 0"}},e)}}):(this.$Notice.destroy(),this.$Notice.info({title:"该部门暂无成员信息",duration:3}));case 3:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),exportData:function(t){var e=this;1===t&&this.$refs.table.exportCsv({filename:"部门数据-"+(new Date).getTime(),columns:this.columns.filter(function(t,a){return a>1&&a<e.columns.length-1}),data:this.data.records})}}},A=k,O=Object(m["a"])(A,n,r,!1,null,null,null);O.options.__file="manage.vue";e["default"]=O.exports}}]);