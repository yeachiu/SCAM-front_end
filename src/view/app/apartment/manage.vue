<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>部门管理</span>
      </p>
      <div>
        <template>
          <Row>
            <Col span="15">
              <Button type="info" @click="openAddOrUpModal(null)"><Icon type="md-add"></Icon>&nbsp;添加部门</Button>
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
    <AddApartment v-if="addApartmentModal"  @cancel="onAddApartmentModalCancel"/>
    <UpdateApartment v-if="updateApartmentModal" :updateObject="updateObject" @cancel="onUpdateApartmentModalCancel"/>
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
  import AddApartment from './components/add.vue'
  import UpdateApartment from './components/update.vue'
  import { post } from '@/libs/axios-cfg'
  export default {
    data () {
      return {
        addApartmentModal:false,
        updateApartmentModal:false,
        updateObject:null,
        removeModal:false,
        setting:{
            loading:true,
            showBorder:true
        },
        search:{
            type:'name',
            value:''
        },
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h('div',[
                h('p',{
                  style:{fontWeight:'bold',lineHeight:'40px'}
                },'部门简介'),
                h('p',{},params.row.about)
              ])
            }
              
          },
          {title: 'ID', key: 'id',sortable: true},
          {title: '部门名', key: 'name',sortable: true},
          {title:'管理员',sortable:true,
            render: (h, params) => {
              return h('span',{},params.row.apartAdmin.realName)
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 260,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'success',size: 'small'},
                  style: {marginRight: '5px'},
                  on:{
                    click:()=>{
                      this.showAllMember(params.row)
                    }
                  }
                }, '查看部门成员'),
                h('Button', {
                  props: {type: 'primary',size: 'small'},
                  style: {marginRight: '5px'},
                  on:{
                    click:()=>{
                      this.openAddOrUpModal(params.row)
                    }
                  }
                }, '修改信息'),
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
        ],
        data: {},
        dataFilter:{
            page:1,
            pageSize:10
        },
        removeObject:null,
        allMember:null,
        // member:[
        //       {id:'1111111233',realName:'邱XX',whatClass:'15信息管理1班',stuNum:'1562852555545',phone:'12356489611'},
        //       {id:'1111111333',realName:'陈XX',whatClass:'15信息管理1班',stuNum:'1562852555534',phone:'12356489658'},
        //       {id:'1111111433',realName:'刘XX',whatClass:'15信息管理1班',stuNum:'1562852555586',phone:'12356489532'},
        //       {id:'11111233',realName:'部门管理员',whatClass:'15信息管理1班',stuNum:'1562852555545',phone:'12356489611'}
        //     ]
      }
    },
    components: {
      AddApartment,UpdateApartment
    },
    created(){
      this.getData();
      console.info(this.data)
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
      async getAllMember(id){
        try {
          let res = await post('/app/apartment/member/list/{id}',null,{
            id:id
          })
          this.allMember = res.data;
        } catch (error) {
          this.$throw(error)
        }
      },
      async remove(){
        this.removeModal = false;
        if(this.removeObject==null){
          this.$Message.warning("删除对象为空，无法继续执行！");
          return false;
        }
        this.setting.loading = true;
        try {
          let res = await post('/app/apartment/remove/{id}',null,{
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
          let res = await post('/app/apartment/list',{
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
          this.addApartmentModal = true;
        }else if(type==='update'){
          this.updateObject = obj;
          this.updateApartmentModal = true;
        }
      },
      onAddApartmentModalCancel(up=false){
        this.addApartmentModal = false;
        if(up) this.getData()
      },
      onUpdateApartmentModalCancel(up=false){
        this.updateApartmentModal = false;
        if(up) this.getData()
      },
      async showAllMember(row){
        this.getAllMember(row.id);
          let members = this.allMember;
          if(members != null && members instanceof Array && members.length > 0){
            this.$Modal.info({
              title: row.name+' - 成员',
              width:'40%',
              render: (h)=>{
                let ps = [];
                members.forEach(element => {
                    let r = h('Tag',{
                        props:{
                          color:'#19be6b',
                          type:'dot',
                        }
                    },element.realName);
                    ps.push(r);
                });
                return h('div',{
                    style:{padding:'20px 0 10px 0'}
                },ps);
              }
            });
          }else{
              this.$Notice.destroy()
              this.$Notice.info({
                  title:"该部门暂无成员信息",
                  duration:3
              })
          }
      },
      exportData(type){
          if (type === 1) {
              this.$refs.table.exportCsv({
                  filename: '部门数据-'+new Date().getTime(),
                  columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
                  data: this.data
              });
          }
      }
    }
  }
</script>
