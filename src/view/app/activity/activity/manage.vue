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
        <DetailActivity v-if="detailActivityModel" :editBaseForm="editBaseForm" :data="detailVO" @cancel="onModalCancel" @reEditBaseForm="reEditBaseForm"/>
        <Modal v-model="editBaseFormModel" scrollable :width="900" :mask-closable="false">
          <div style="margin-bottom: 20px;">
            <Button size="small" @click="editBaseFormModel = false">返回</Button>
            <Button size="small" @click="refreshBaseForm">刷新</Button>
          </div>
          <BaseForm ref="baseForm" :actiId="actiIdToEdit" />
          <div slot="footer">
            <Button type="info"  @click="editBaseFormModel = false">关闭</Button>
          </div>
        </Modal>
    </div>
</template>
<script> 
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    import AddActivity from './components/add.vue'
    import UpdateActivity from './components/update.vue'
    import DetailActivity from './components/detail.vue'
    import BaseForm from '@/view/app/activity/activity/components/base-form.vue'
    /** 活动状态 **/
    let ACT_STATUS_DRAFT = 1;   //草稿
    let ACT_STATUS_PUBLISH = 2;   //已发布
    let ACT_STATUS_PROCESS = 3;   //进行中
    let ACT_STATUS_COMPLETE = 4;   //已完成
    let ACT_STATUS_DONE = 5;
    let ACT_STATUS_CANCEL = 0;  //已取消
    export default {
      data () {
        return {
          aparId:'',
          actiIdToEdit:'',
          addActivityModal:false,
          updateActivityModal:false,
          detailActivityModel:false,
          editBaseFormModel:false,
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
            {
              title:'详情',
              width:60,
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
              width:80, 
              render:(h,params)=>{
                let value;
                switch ( params.row.status){
                  case ACT_STATUS_PUBLISH : value = '已发布';break;
                  case ACT_STATUS_PROCESS : value = '进行中';break;
                  case ACT_STATUS_COMPLETE : value = '已完成';break;
                  case ACT_STATUS_CANCEL : value = '已取消';break;
                  case ACT_STATUS_DONE : value = '已结束';break;
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
              title: '报名时间',
              key: 'signupTime',
              width: 160,
              render:(h,params)=>{
                return h('span',dayjs(params.row.signupTime).format('YYYY-MM-DD HH:mm:ss') + ' / ' + dayjs(params.row.deadlineTime).format('YYYY-MM-DD HH:mm:ss'))
              },
              sortable: true
            },
            {
              title: '活动时间',
              key: 'activityTime',
              width: 160,
              render:(h,params)=>{
                return h('span',dayjs(params.row.startTime).format('YYYY-MM-DD HH:mm:ss') + ' / ' + dayjs(params.row.endTime).format('YYYY-MM-DD HH:mm:ss'))
              },
              sortable: true
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
              width:200,
              align: 'center',
              render: (h, params) => {
                let type,value,currentStatus;
                switch ( params.row.status){
                  case ACT_STATUS_PUBLISH : //已发布to草稿，to取消，to编辑
                    return h('div', [
                      h('Button', {
                        props: {type: 'primary',size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.openEditModal(params.row)
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
                  case ACT_STATUS_PROCESS: //已发布to草稿，to取消，to编辑
                    return h('div', [
                      h('Button', {
                        props: {type: 'primary',size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.openEditModal(params.row)
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
                            this.openEditModal(params.row)
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
                  case  ACT_STATUS_COMPLETE:
                    return h('div', [
                      h('Button', {
                        props: {type: 'warning' ,size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.linkToScore(params.row.id)
                          }
                        }
                      },'评奖'),
                      h('Button', {
                        props: {type: 'info' ,size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                          click:()=>{
                            this.changeStatus(params.row,ACT_STATUS_CANCEL)
                          }
                        }
                      },'取消')
                    ]);
                    break;
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
          roles:null,
          editBaseForm:false
        }
      },
      components:{
        AddActivity,UpdateActivity,DetailActivity,BaseForm
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
          let data = {
            aid : obj.id,
            status : currentStatus
          }
          try {
            let res = await post('/app/activity/statusChange',data);
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
          this.getData();
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
        openEditModal(acti){
          this.actiIdToEdit = acti.id;
          this.editBaseFormModel = true;
        },
        /**
         * @description 关闭模态窗口
         * @param type 窗口类型
         * @param reload 是否重新加载数据
         */
        onModalCancel(type,reload = flase){
          switch(type){
            case 'add':{
              this.addActivityModal = false;
              this.getData();
            };break;
            case 'update':{
              this.updateActivityModal = false;
              this.getData();
            };break;
            case 'detail':{
              this.detailActivityModel = false;
            };break;
          }
          // if(reload) this.getData();
        },
        reEditBaseForm(val){
          this.editBaseForm = val;
        },
        refreshBaseForm(){
          this.$refs.baseForm.getData();
        }, 
        linkToScore(actiId){
          this.$router.push({
            path: `score/${actiId}`,
          })
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
