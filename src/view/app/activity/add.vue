<template>
  <div>
    <Card :bordered="false" dis-hover>
      <p slot="title">
        <Steps :current="current" style="margin-left: 10%;">
          <Step title="基本信息" icon="ios-person"></Step>
          <Step title="报名表单" icon="ios-camera"></Step>
          <Step title="学分配置" icon="ios-mail"></Step>
      </Steps>
      </p>   
      <Card :bordered="false" v-show = "current == 0"  dis-hover>
        <BaseForm ref="baseForm" :apartmentId="apartmentId" :user="user" v-on:submitData="cacheBaseData" class="TabContent"/>
      </Card>
      <Card :bordered="false" v-show = "current == 1"  dis-hover>
        <SignupForm ref="signupForm" v-on:submitData="cacheSignupData" class="TabContent"/>
      </Card>
      <Card :bordered="false" v-show = "current == 2"  dis-hover style="min-height:400px;">
        <ScoreSettingForm ref="scoreForm" v-on:submitData="cacheScoreData" class="TabContent"/>
      </Card>
      <div id="button-group">
        <template v-if="current == 2">
          <Button type="primary" @click="prev">上一步</Button>
          <Button type="primary" @click="save(0)">存为草稿</Button>
          <Button type="primary" @click="save(1)">保存发布</Button>
        </template>
        <template v-else>
          <Button type="primary" @click="prev">上一步</Button>
          <Button type="primary" @click="next">下一步</Button>
        </template>
      </div>
    </Card>
  </div>
</template>
<script>
import { post } from '@/libs/axios-cfg'
import BaseForm from '@/view/app/activity/components/base-form.vue'
import SignupForm from '@/view/app/activity/components/signup-form.vue'
import ScoreSettingForm from '@/view/app/activity/components/score-setting-form.vue'
export default {
  data () {
    return {
      current: 0,
      finalDatas:{
        baseData:null,
        signupData:null,
        scoreData:null
      },
      apartmentId:'',
      user:null
    }
  },
  components:{
    BaseForm,SignupForm,ScoreSettingForm
  },
  methods: {
    next () {
      if (this.current == 2) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    prev () {
      if (this.current == 0) {
        this.current = 0;
      } else {
        this.current -= 1;
      }
    },
    save(type){
      this.$refs.baseForm.$emit("submitBaseData");
      this.$refs.signupForm.$emit("submitSignupData");
      this.$refs.scoreForm.$emit("submitScoreData");
    },
    cacheBaseData(val){
      console.log("乖宝贝^3^");
      this.finalDatas.baseData = val;
      console.info(this.finalDatas);
    },
    cacheSignupData(val){
      console.log("乖宝贝^3^");
      this.finalDatas.signupData = val;
      console.info(this.finalDatas);
    }, 
    cacheScoreData(val){
      console.log("乖宝贝^3^");
      this.finalDatas.scoreData = val;
      console.info(this.finalDatas);
    }    
  }
}
</script>
<style>
  .step-bar{
    width: 100%;
    text-align: center;
  }
  #button-group{
    width: 100%;
    text-align: center;
  }
  #button-group button{
    margin-right:7% !important; 
  }
  .TabContent {
    margin:0 auto;
  }
</style>

