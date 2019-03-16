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
        <BaseForm :aparementId="apartmentId" :user="user"/>
      </Card>
      <Card :bordered="false" v-show = "current == 1"  dis-hover>
        <SignupForm/>
      </Card>
      <Card :bordered="false" v-show = "current == 2"  dis-hover>
        <p slot="title">表单三</p>
        <p>yuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu</p>
      </Card>
      <div id="button-group">
        <template v-if="current == 2">
          <Button type="primary" @click="prev">上一步</Button>
          <Button type="primary" @click="draft">存为草稿</Button>
          <Button type="primary" @click="publish">保存发布</Button>
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
export default {
  data () {
    return {
      current: 0,
    }
  },
  components:{
    BaseForm
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
    draft(){
     alert("保存为草稿"); 
    },
    publish(){
      alert("保存并发布");
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
</style>

