<template>
  <div>
    <Row>
      <Col span="15">
        <!-- <Button type="info" to="./add"><Icon type="md-add"></Icon>&nbsp;创建活动</Button> -->
        <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加报名</Button>
        <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
        <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
      </Col>
      <Col span="9">
        <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
          <Button slot="append" icon="ios-search"></Button>
        </Input>
      </Col>
    </Row>
    <Row>
      <Col span="6">
        <Menu theme="light" :active-name="targetId">
          <MenuGroup title="活动">
            <MenuItem v-for="item in activities" :name="item.id" :key="item.id" >
              <span @click="changeTargetId(item.id)">
                <Icon type="ios-flag-outline" />
                {{item.title}}
              </span>
            </MenuItem>
          </MenuGroup>
        </Menu>
      </Col>
      <Col span="18">
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
          type:'title',
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
        columns:[]
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
      /**
       * @description 获取列表
       */
      async getData(){
        this.setting.loading = true;
        try {
          let res = await post('/app/activity/list/status',{
            aparId: this.aparId,
            status: ACT_STATUS_PUBLISH
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
      changeTargetId(actiId){
        this.targetId = actiId;
      },
      async getSignupData(){
        this.setting.loading = true;
          try {
            let res = await post('/app/activity/signup/get/list/{actiId}',null,{
              actiId : this.targetId
            })
            let data = res.data;
            this.targetData = [];
            data.forEach(item => {
              this.targetData.push(JSON.parse(item))
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
            this.columns = [];
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
