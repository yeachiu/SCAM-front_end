<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>认证管理</span>
      </p>
      <div>
        <template>
          <Row>
            <Col span="15">
              <Button type="info" @click="openAddOrUpModal(null)"><Icon type="md-add"></Icon>&nbsp;添加</Button>
              <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
              <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
            </Col>
            <Col span="9">
              <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                <Button slot="append" icon="ios-search"></Button>
              </Input>
            </Col>
          </Row>
          <Table  ref="table"  class="margin-bottom-10" :columns="columns" 
              :loading="setting.loading"  :border="setting.showBorder" :data="data.records"></Table>
            <Page :total="data.total" class="tr" @on-change="pageChange":current.sync="data.current" :page-size="data.size"
            @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
        </template>
      </div>
    </Card>
    <AddUserAuth v-if="addUserAuthModal"  @cancel="onAddUserAuthModalCancel"/>
    <UpdateUserAuth v-if="updateUserAuthModal" :updateObject="updateObject" @cancel="onUpdateUserAuthModalCancel"/>
    <Modal v-model="removeModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提示</span>
      </p>
      <div style="text-align:center">
        <p>此操作为不可逆操作，是否确认删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="setting.loading" @click="remove">确认删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import AddUserAuth from './components/addUserAuth.vue'
  import UpdateUserAuth from './components/updateUserAuth.vue'
  import { post } from '@/libs/axios-cfg'
  export default {
    data () {
      return {
        addUserAuthModal:false,
        updateUserAuthModal:false,
        updateObject:null,
        removeModal:false,
        setting:{
          loading:true,
          showBorder:true
        },
        search:{
          type:'realName',
          value:''
        },
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h('div',[
                h('p',{style:{margin:'10px'}},[
                  h('span',{style:{fontWeight:'bold',margin:'20px'}},'用户ID'),
                  h('span',{},params.row.uid),
                ]),
                h('p',{style:{margin:'10px'}},[
                  h('span',{style:{fontWeight:'bold',margin:'20px'}},'学生ID'),
                  h('span',{},params.row.stuId),
                ])
              ])
              
            }
              
          },
          {title: '学号', key: 'stuNum',sortable: true,width:130},
          {title: '姓名', key: 'realName',sortable: true,width:120},
          {title: '专业', sortable:true,key: 'profession',
            render: (h, params) => {
              return h('p',{},params.row.profession)
            }
          },
          {title: '年级', sortable:true, width:80,key: 'period',
            render: (h, params) => {
              return h('p',{},params.row.period)
            }
          },
          {title: '班级', sortable:true,width:80,key: 'whatClass',
            render: (h, params) => {
              return h('p',{},params.row.whatClass)
            }
          },
          {title: '认证状态', sortable:true,width:120,key: 'status',
            render: (h, params) => {
              let code = params.row.status;
              let status = '';
              switch(code){
                case 0: status = '未认证';break;
                case 1: status = '认证中';break;
                case 2: status = '已认证';break;
                case 3: status = '不通过';break;
                default: status = '--'
              }
              return h('p',{},status)
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width:150,
            render: (h, params) => {
              if(params.row.status == 1){ //认证中
                return h('div', [
                  h('Button', {
                    props: {type: 'primary',size: 'small'},
                    style: {marginRight: '5px'},
                    on:{
                      click:()=>{
                        this.openAddOrUpModal(params.row)
                      }
                    }
                  }, '审核'),
                  h('Button', {
                    props: {type: 'error',size: 'small'},
                    on:{
                      click:()=>{
                        this.removeObject = {
                          obj:params.row,
                          index:params.index
                        }
                        this.removeModal = true;
                      }
                    }
                  }, '删除')
                ]);
              }else{
                return h('div', [
                  h('Button', {
                    props: {type: 'error',size: 'small'},
                    on:{
                      click:()=>{
                        this.removeObject = {
                          obj:params.row,
                          index:params.index
                        }
                        this.removeModal = true;
                      }
                    }
                  }, '删除')
                ]);
              }
             
            }
          }
        ],
        data: {},
        dataFilter:{
            page:1,
            pageSize:10
        },
        removeObject:null,
        allMember:null
      }
    },
    components: {
      AddUserAuth,UpdateUserAuth
    },
    created(){

      this.getData();
    },
    methods:{
      pageChange(p){
        this.dataFilter.page = p;
        this.getData();
      },
      pageSizeChange(p){
        this.dataFilter.pageSize = p;
        this.getData();
      },
      async remove(){
        this.removeModal = false;
        if(this.removeObject==null){
          this.$Message.warning("删除对象为空，无法继续执行！");
          return false;
        }
        this.setting.loading = true;
        try {
          let res = await post('/student/auth/remove/{id}',null,{
            id: this.removeObject.obj.id
          })
          this.$Message.success("删除成功");
          this.data.records.splice(this.removeObject.index,1);
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false;
      },
      async getData(){
        this.setting.loading = true;
        try {
          let res = await post('/student/auth/list',{
            page:this.dataFilter.page,
            pageSize:this.dataFilter.pageSize
          })
          this.data = res.data;
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false;
      },
      async openAddOrUpModal(obj,type = 'update'){
        if(obj===null){
          this.addUserAuthModal = true;
        }else if(type==='update'){
          this.updateObject = obj;
          this.updateUserAuthModal = true;
        }
      },
      onAddUserAuthModalCancel(up=false){
        this.addUserAuthModal = false;
        if(up) this.getData()
      },
      onUpdateUserAuthModalCancel(up=false){
        this.updateUserAuthModal = false;
        if(up) this.getData()
      },
      exportData(type){
        let exportInfo = this.data.records;
        exportInfo.forEach(ele => {
          ele.stuNum = ele.stuNum + ' ';
          switch(ele.status){
            case 0: ele.status = '未认证';break;
            case 1: ele.status = '认证中';break;
            case 2: ele.status = '已认证';break;
            case 3: ele.status = '不通过';break;
            default: ele.status = '--'
          }
        });
        if (type === 1) {
          this.$refs.table.exportCsv({
            filename: '学生认证信息-'+new Date().getTime(),
            columns: this.columns.filter((col, index) => index > 0 && index < this.columns.length-1),
            data: this.data.records
          });
        }
      }
    }
  }
</script>
