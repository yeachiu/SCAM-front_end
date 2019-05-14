<template>
  <div>
    <Row>
      <Col span="14">
        <!-- <Button type="info" to="./add"><Icon type="md-add"></Icon>&nbsp;创建活动</Button> -->
        <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加报名</Button>
        <Button :disabled="setting.loading" type="success" @click="refresh"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
        <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
      </Col>
      <Col span="10">
        <Select v-model="targetId" filterable>
          <Option v-for="item in activities" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
      </Col>
    </Row>
    <Row style="margin-top:20px;">
      <Col span="14" style="font-size:16px;color: #6b6868;padding: 5px 0;">
        <span style="margin: 0 20px;"><Icon type="md-flame" size="20" color="#ea6f5a"/>&nbsp;报名人数：{{targetData.length}}</span>
        <span><Icon type="md-checkbox-outline" size="20" color="#8a21d8"/>&nbsp;已签到：{{checkedNum}}</span>
      </Col>
      <Col span="10">
        <Input v-model="search.value" placeholder="输入名字查找参赛者" class="margin-bottom-10">
          <Button slot="append" icon="ios-search" @click="doSearch"></Button>
        </Input>
      </Col>
      <Col span="24">
        <Table ref="table"  class="margin-bottom-10"
          :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="targetData">
        </Table>
      </Col>
    </Row>
  </div>
</template>
<script> 
  import dayjs from 'dayjs'
  import { post } from '@/libs/axios-cfg'
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
        setting:{
          loading:true,
          showBorder:true
        },
        search:{
          type:'name',
          value:''
        },
        dataFilter:{
          page:1,
          pageSize:15 
        },
        activities:[],  //菜单列表
        targetId: '', // 当前活动ID
        targetData: [],   //  当前活动报名数据
        targetRules:[],   //表单规则
        columns:[],
        checkedNum:0
      }
    },
    components:{
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
      refresh(){
        this.getData();
        this.getFormRules();
        this.getSignupData();
      },
      doSearch(){
        alert("not ready, please wait")
      },
      /**
       * @description 获取列表
       */
      async getData(){
        //初始化变量
        this.setting.loading = true;
        try {
          let res = await post('/app/activity/list/status',{
            aparId: this.aparId,
            status: ACT_STATUS_PROCESS
          })
          this.activities = res.data;
          if(this.activities != null){
            this.targetId = this.activities[0].id;
          }
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false;
      },
      async getSignupData(){
        this.checkedNum = 0;
        this.setting.loading = true;
          try {
            let res = await post('/app/activity/signup/get/list/{actiId}',null,{
              actiId : this.targetId
            })
            let data = res.data;
            this.targetData = [];
            data.forEach(item => {
              item = JSON.parse(item);
              if(item.checkin){
                this.checkedNum ++;
              }
              this.targetData.push(item);
            })
            // console.info(this.targetData);
          } catch (error) {
            this.$throw(error)
          }
          this.setting.loading = false;
      },
      async getFormRules(){
        this.setting.loading = true;
          try {
            let res = await post('/app/activity/form/get/{id}',null,{
              id : this.targetId
            })
            this.targetRules = JSON.parse(res.data.rules);
            // console.info(this.targetRules);
            this.columns = [];
            let checkin = {};
            this.targetRules.forEach(item => {
              if(item.type == "hidden"){
                checkin = {
                  title : '签到',
                  key : item.field,
                  sortable: true,
                  render:(h,params)=>{
                    if(params.row.checkin == false){
                      return h('Button',{
                        props: {type: 'primary',size: 'small'},
                          style: {margin: '5px'},
                          on:{
                            click:()=>{
                              this.doCheckin(params.row);
                            }
                          }
                      },'签到')
                    }else{
                      return h('Button',{
                        props: {type: 'warning',size: 'small'},
                          style: {margin: '5px'},
                          on:{
                            click:()=>{
                              this.doCheckout(params.row);
                            }
                          }
                      },'取消')
                    }
                    
                  },
                }
              }else{
                let col = {
                  title : item.title,
                  key : item.field,
                  sortable: true
                };
                this.columns.push(col);
              }
              
            })
            this.columns.push(checkin);
          } catch (error) {
            this.$throw(error)
          }
          this.setting.loading = false;
      },
      doCheckin(obj){
        this.$Modal.confirm({
          title: obj.name + '同学',
          content: '<br><p>点击"确定"完成签到</p>',
          onOk: () => {
            this.AsyncCheckin(obj,true);
          },
        });
      },
      doCheckout(obj){
        this.$Modal.confirm({
          title: obj.name + '同学',
          content: '<br><p>确定取消该同学签到吗？</p>',
          onOk: () => {
            this.AsyncCheckin(obj,false);
          },
        });
      },
      async AsyncCheckin(obj,bool){
        this.setting.loading = true;
        obj.checkin = bool;
        let data = {
          actiId : obj.actiId,
          signupData : JSON.stringify(obj)
        };
        console.info(data)
        try {
          let res = await post('/app/activity/signup/checkin/',data)
          this.getSignupData();
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false;
      },
      /**
       * @description 导出表格CSV
       */
      exportData(type){
        let actiTitle = '活动《';
        this.activities.forEach(item => {
          if(item.id == this.targetId){
            actiTitle = actiTitle + item.title;
            return;
          }
        })
        if (type === 1) {
          this.$refs.table.exportCsv({
            filename: actiTitle + '》报名数据-' + new Date().getTime(),
            columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
            data: this.data
          });
        }
      }
    },
    watch:{
      targetId: function(newValue,oldValue){
        this.getFormRules();
        this.getSignupData();
      }
    }
  }
</script>
