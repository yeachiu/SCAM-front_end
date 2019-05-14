<template>
  <div>
    <Row>
      <Col span="14">
        <!-- <Button type="info" to="./add"><Icon type="md-add"></Icon>&nbsp;创建活动</Button> -->
        <Button type="info" @click="doAllocate"><Icon type="md-add"></Icon>&nbsp;提交分配</Button>
        <Button :disabled="setting.loading" type="success" @click="refresh"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
        <!-- <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button> -->
      </Col>
      <Col span="10">
        <Select v-model="targetId" filterable>
          <Option v-for="item in activities" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
      </Col>
    </Row>
    <Row style="margin-top:20px;">
      <Col span="24">
        <Table ref="table"  class="margin-bottom-10"
          :columns="ScoreColumns" :loading="setting.loading"  :border="setting.showBorder" :data="targetData">
        </Table>
      </Col>
    </Row>
    <Modal v-model="showAllocateModal" title="分配学分" :mask-closable="false" :closable="false" width="600">
      <Col span="24" style="font-size:16px;color: #6b6868;padding: 5px 0;">
        <span style="margin: 0 20px;"><Icon type="md-flame" size="20" color="#ea6f5a"/>&nbsp;{{targetActi.title}}{{targetScore.awardName}}</span>
      </Col>
      <Table ref="table"  class="margin-bottom-10"
        :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="checkedList">
      </Table>
      <div slot="footer">
        <Button type="default" :disabled="setting.loading" @click="cancel">取消</Button>
        <Button type="primary" :loading="setting.loading" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script> 
  import dayjs from 'dayjs'
  import { post } from '@/libs/axios-cfg'
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
        showAllocateModal:false,
        activities:[],  //菜单列表
        targetId: '', // 当前活动ID
        targetData: [],   //  当前活动学分数据
        checkedList:[],
        targetActi:{},
        targetScore:{},
        columns:[],
        ScoreColumns:[
          {
            title: '奖项名', 
            key: 'awardName'
          },
          {
            title: '学分', 
            key: 'awardScore'
          },
          {
            title: '名额', 
            key: 'awardNum'
          },
          {
            title: '名单', 
            width:300,
            render:(h,params)=>{
              let list = []
              if(params.row.allocateList!=null && params.row.allocateList.length>0){
                  params.row.allocateList.forEach(element => {
                      let join = h('Tag',{
                          props:{
                              color:"blue"
                          }
                      },element.name)
                      list.push(join)
                  });
                  return h('div',join)
              }
              return h('span','空')
            }  
          },
          {
            title: '添加', 
            width:80,
            render:(h,params)=>{
              return h('Button', {
                props: {type: 'success',size: 'small'},
                style: {margin: '5px'},
                on:{
                  click:()=>{
                    this.openAllocateModal(params.row)
                  }
                }
              }, '添加')
            }
          }
        ]
      }
    },
    components:{
    },
    created(){
      this.aparId = this.$store.state.user.aparId;
      this.targetId = this.$route.params.id;
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
            status: ACT_STATUS_COMPLETE
          })
          this.activities = res.data;
          if(this.activities != null && this.targetId != ''){
            
            if(this.targetId == ''){
              this.targetId = this.activities[0].id;
              this.targetActi = this.activities[0];
            }else{
              this.activities.forEach(acti => {
                if(acti.id == this.targetId){
                  this.targetActi = acti;
                  return;
                }
              })
            }
          }
          this.getScoreSettingData();
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false;
      },
      async getScoreSettingData(){
        this.checkedNum = 0;
        this.setting.loading = true;
          try {
            let res = await post('/app/score/get/actiId/{actiId}',null,{
              actiId : this.targetId
            })
            let data = res.data;
            // this.targetData = res.data;
            this.targetData = data.map(item => {
              return {
                id: item.id,
                actiId: item.aid,
                awardName: item.awardName,
                awardNum: item.awardNum,
                awardScore: item.awardScore,
                allocateList: []
              };
            });
            console.info(this.targetData);
          } catch (error) {
            this.$throw(error)
          }
          this.setting.loading = false;
      },
      openAllocateModal(){
        this.getSignupData();
        this.showAllocateModal = true;
      },
      doAllocate(){
        // this.$Modal.confirm({
        //   title: obj.name + '同学',
        //   content: '<br><p>点击"确定"完成签到</p>',
        //   onOk: () => {
        //     // this.AsyncCheckin(obj,true);
        //   },
        // });
        alert('功能待完善……')
      },
      async getSignupData(){
        this.checkedNum = 0;
        this.setting.loading = true;
          try {
            let res = await post('/app/activity/signup/get/list/{actiId}',null,{
              actiId : this.targetId
            })
            let data = res.data;
            this.checkedList = [];
            data.forEach(item => {
              item = JSON.parse(item);
              if(item.checkin){
                this.checkedList.push(item);
              }        
            })
            // console.info(this.checkedList);
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
            let selection = {
              type: 'selection',
              width: 60,
              align: 'center'
            };
            this.columns.push(selection);
            this.targetRules.forEach(item => {
              
              if(item.type != "hidden"){
                let col = {
                  title : item.title,
                  key : item.field,
                  sortable: true
                };
                this.columns.push(col);
              }
              
            })
          } catch (error) {
            this.$throw(error)
          }
          this.setting.loading = false;
      },

      /**
       * @description 关闭Modal
       * @param reload 是否重新加载数据
       */
      cancel() {
        this.showAllocateModal = false;
      },
      /**
       * @description 确定按钮单击回调
       */
      ok() {
        //长度与名额进行校验
        // this.templist 
        this.cancel();
      },
      /**
       * @description 导出表格CSV
       */
      exportData(type){
        if (type === 1) {
          this.$refs.table.exportCsv({
            filename: '报名数据-'+new Date().getTime(),
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
