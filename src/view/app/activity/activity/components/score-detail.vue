<template>
  <div>
    <Modal ref="modal" v-model="show" scrollable :width="800" :mask-closable="false">
      <div>
        <h2 class="actiTitle">{{data.title}}</h2>
        <p style="padding: 0px 10px 10px;">
          <span>{{data.realName}}&nbsp;创建于&nbsp;{{dateformat(data.createTime)}} </span>
          <span style="margin-left:15px;"><Icon type="md-flame" color="#ea6f5a"/>&nbsp;活动{{getStateName(data.status,'acti')}}</span>
          <span style="margin-left:15px;"><Icon type="md-flame" color="#ea6f5a"/>&nbsp;已报名：{{ data.memberNow + ' / ' + data.limitQuota }}</span>
        </p>
        <div class="actiContent">
          <ScoreSettingForm ref="scoreForm" v-on:submitData="submitAndSave" :actiId="data.id"/>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" :disabled="loading" @click="close">取消</Button>
        <Button type="primary" :loading="loading" @click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import global_   from  '@/view/global.vue'
import { post , get } from '@/libs/axios-cfg'
import ScoreSettingForm from '@/view/app/activity/activity/components/score-setting-form.vue'
export default {
  data() {
    return {
      show:true,
      loading: false,
      data:{},
      scoreData:''
    };
  },
  props: {
    activityData:{
      type : Object,
      default : {}
    }
  },
  components:{
    ScoreSettingForm
  },
  created(){
    this.getData();
    // console.log('score-detail:activityData:')
    // console.info(this.activityData)
  },
  methods: {
    async getData(){
      this.activityData = this.data;
    },
    // 日期数据处理
    dateformat(date){
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    },
    close(){
      //关闭此窗口
      this.$emit('cancel','score');
    },
    // 更新活动学分设置数据
    async save(){
      // console.log('score-detail请求数据---')
      // 触发子组件的监听事件
      this.$refs.scoreForm.$emit("submitScoreData");
      this.show = false;
        
    },
    async submitAndSave(val) {
      // console.log('score-detail收到数据：')
      // console.info(val)
      let data = JSON.stringify(val);
      try {
        let res = post('app/activity/score/update/{id}',data,{
          id:this.activityData.id
        })
        this.$Message.success("活动 "+data.title+" 的学分设置更新成功");
      } catch (error) {
        this.$throw(error);
      }
    },
    getStateName(state,type){
      switch (type){
        case 'acti':
          return global_.getStateName(state,global_.actiStatus);
        case 'auth':
          return global_.getStateName(state,global_.authStatus);
      }		
    },
    
  },
  watch:{
    show:function(newvalue,oldvalue){
      if(!newvalue){
        this.close();
      }
    }
  },
  mounted() {

  }
};
</script>
<style>
  .actiTitle {
    margin: 20px 10px;
    display: inherit;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    color: #2b85e4;
  }
  .tt {
    font-size: 14px;
    font-weight: bold;
    line-height: 30px;
    margin: 0 10px;
    display: inline-block;
    width: 120px;
  }
  .tt .ivu-icon {
    font-size: 24px;
    margin-right: 10px;
  }
</style>
