<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>活动管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15">
                            <!-- <Button type="info" to="./add"><Icon type="md-add"></Icon>&nbsp;创建活动</Button> -->
                            <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;创建活动</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
                        </Col>
                        <Col span="9">
                            <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                                <Button slot="append" icon="ios-search"></Button>
                            </Input>
                        </Col>
                    </Row>
                    <Table ref="table"  class="margin-bottom-10"
                         :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="data.records"></Table>
                    <Page :total="data.total" class="tr" @on-change="pageChange" :current.sync="data.current" :page-size="data.size"
                      @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
                </template>
            </div>
        </Card>
        <AddActivity v-if="addActivityModal" @cancel="onModalCancel"/>
        <UpdateActivity v-if="updateActivityModal" :roles="roles" :uid="updateId" @cancel="onModalCancel"/>
        <DetailActivity v-if="detailActivityModel" :data="detailVO" @cancel="onModalCancel" />
    </div>
</template>
<script> 
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    import AddActivity from './components/add.vue'
    import UpdateActivity from './components/update.vue'
    import DetailActivity from './components/detail.vue'
    /** 活动状态 **/
    let ACT_STATUS_DRAFT = 1;   //草稿
    let ACT_STATUS_PUBLISH = 2;   //已发布
    let ACT_STATUS_PROCESS = 3;   //进行中
    let ACT_STATUS_COMPLETE = 4;   //已结束
    let ACT_STATUS_CANCEL = 0;  //已取消
    export default {
      data () {
        return {
          aparId:'',
          addActivityModal:false,
          updateActivityModal:false,
          detailActivityModel:false,
          updateId:null,
          detailVO:{},
          selections:[],
          removeModal:false,
          setting:{
            loading:true,
            showBorder:true
          },
          search:{
            type:'title',
            value:''
          },
          columns: [
            // {
            //   type: 'expand',
            //   width: 50,
            //   render: (h, params) => {
            //     return h('div',[
            //       h('p',{style:{margin:'10px'}},[
            //         h('span',{style:{fontWeight:'bold',margin:'20px'}},'报名时间：'),
            //         h('span',{},params.row.signupTime),
            //         h('span',{style:{fontWeight:'bold',margin:'20px'}},' -- '),
            //         h('span',{},params.row.deadlineTime)
            //       ]),
            //       h('p',{style:{margin:'10px'}},[
            //         h('span',{style:{fontWeight:'bold',margin:'20px'}},'活动时间：'),
            //         h('span',{},params.row.startTime),
            //         h('span',{style:{fontWeight:'bold',margin:'20px'}},' -- '),
            //         h('span',{},params.row.endTime)
            //       ]),
            //       h('p',{style:{margin:'10px'}},[
            //         h('span',{style:{fontWeight:'bold',margin:'20px'}},'活动描述'),
            //         h('span',{},params.row.description),
            //       ]),
                  
            //     ])
            //   }
            // },
            {
              title:'详情',
              width:80,
              render:(h,params)=>{
                return h('Icon',{
                  props:{
                    type:"ios-list-box-outline",
                    size:"24",
                    color:'#8f90a2'
                  },
                  on:{
                    click:()=>{
                      this.openDetailModal(params.row)
                    }
                  }
                },'')
              }
            },
            {title: '活动名称', key: 'title',sortable: true},
            {
              title: '状态',
              key: 'status', 
              render:(h,params)=>{
                let value;
                switch ( params.row.status){
                  case ACT_STATUS_PUBLISH : value = '已发布';break;
                  case ACT_STATUS_PROCESS : value = '进行中';break;
                  case ACT_STATUS_COMPLETE : value = '已结束';break;
                  case ACT_STATUS_CANCEL : value = '已取消';break;
                  case ACT_STATUS_DRAFT : value = '草稿';break;
                  default: value = 'error';
                }
                return h('span', value)
              },
              sortable: true
            },
            {
              title: '已参与名额',
              key: 'limitQuota', 
              render:(h,params)=>{
                return h('span',params.row.memberNow + ' / ' + params.row.limitQuota)
              }
            },
            {
              title: '创建日期',
              key: 'createTime',
              render:(h,params)=>{
                return h('span',dayjs(params.row.createTime).format('YYYY-MM-DD HH:mm:ss'))
              },
              sortable: true
            },
            {
              title: '操作',
              key: 'action',
              width: 260,
              align: 'center',
              render: (h, params) => {
                let type,value,currentStatus;
                switch ( params.row.status){
                  case ACT_STATUS_PUBLISH || ACT_STATUS_PROCESS: //已发布to草稿，to取消，to编辑
                    return h('div', [
                      h('Button', {
                        props: {type: 'primary',size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.openAddModal(params.row)
                          }
                        }
                      }, '编辑'),
                      h('Button', {
                        props: {type: 'warning' ,size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.changeStatus(params.row,ACT_STATUS_CANCEL)
                          }
                        }
                      },'取消'),
                    ]);
                    break;
                  case ACT_STATUS_DRAFT : //草稿to取消，to编辑,to发布
                    return h('div', [
                      h('Button', {
                        props: {type: 'primary' ,size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.changeStatus(params.row,ACT_STATUS_PUBLISH)
                          }
                        }
                      },'发布'),
                      h('Button', {
                        props: {type: 'primary',size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.openAddModal(params.row)
                          }
                        }
                      }, '编辑'),
                      h('Button', {
                        props: {type: 'warning' ,size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.changeStatus(params.row,ACT_STATUS_CANCEL)
                          }
                        }
                      },'取消')
                    ]);
                    break;
                  default: return;
                }
              }
            }
          ],
          data: {},
          dataFilter:{
            page:1,
            pageSize:15 
          },
          removeObject:null,
          roles:null
        }
      },
      components:{
        AddActivity,UpdateActivity,DetailActivity
      },
      created(){
        this.aparId = this.$store.state.user.aparId;
        this.getData();
      },
      methods:{
        /**
         * @description 分页更换事件回调
         */
        pageChange(p){
          this.dataFilter.page = p;
          this.getData();
        },
        /**
         * @description 分页每页显示数量改变事件回调
         */
        pageSizeChange(p){
          this.dataFilter.pageSize = p;
          this.getData();
        },
        /**
         * @description 修改状态！！！
         * ->cancel
         * ->publish
         * ->
         */
        async changeStatus(obj,currentStatus){
          this.setting.loading = true;
          let req_msg = currentStatus==ACT_STATUS_CANCEL ? '已取消' : '已发布';
          try {
            let res = await post('/app/activity/statusChange/{uid}/{status}',{
              uid: obj.id,
              status: currentStatus
            })
            this.$Message.destroy();
            this.$Message.success(req_msg);
            if(currentStatus == ACT_STATUS_CANCEL){
              // this.data.records.splice(this.removeObject.index,1);
            }else{//currentStatus == ACT_STATUS_PUBLISH
              obj.status = ACT_STATUS_PUBLISH;
            }
          } catch (error) {
            this.$throw(error)
          }
          this.setting.loading = false;
        },
        /**
         * @description 获取活动列表
         */
        async getData(){
            this.setting.loading = true;
            try {
              let res = await post('/app/activity/list/aparId',{
                id:this.aparId,
                page:this.dataFilter.page,
                pageSize:this.dataFilter.pageSize
              })
              this.data = res.data;
            } catch (error) {
              this.$throw(error)
            }
            this.setting.loading = false;
        },
        /**
         * @description 获取回收站列表
         */
        async getCancelList(){
            try {
              let res = await post('/app/activity/list/cancel',{
                page:1,
                pageSize:1000
              })
              this.data = res.data;
            } catch (error) {
              this.$throw(error)
            }
        },
          /**
         * @description 打开模态窗口
         * @param uid 用户ID
         * @param type 打开类型
         */
        openAddModal(actiId){
            if(actiId==null){
              this.addActivityModal = true;
            }else {
              this.updateId = actiId;
              this.updateActivityModal = true;
            }
        },
        openDetailModal(activity){
          this.detailVO = activity;
          this.detailActivityModel = true;
        },
        /**
         * @description 关闭模态窗口
         * @param type 窗口类型
         * @param reload 是否重新加载数据
         */
        onModalCancel(type,reload = false){
          switch(type){
            case 'add':{
              this.addActivityModal = false;
            };break;
            case 'update':{
              this.updateActivityModal = false;
            };break;
            case 'detail':{
              this.detailActivityModel = false;
            };break;
          }
          if(reload) this.getData();
        },
        /**
         * @description 导出表格CSV
         */
        exportData(type){
          if (type === 1) {
            this.$refs.table.exportCsv({
              filename: '活动数据-'+new Date().getTime(),
              columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
              data: this.data
            });
          }
        }
      }
    }
</script>
