<template>
  <div>
    <Modal ref="modal" v-model="detailActivityModel" scrollable :width="900" :mask-closable="false">
      <div>
        <h2 class="actiTitle">{{activityData.title}}
          <span class="star" @click="changeFocus">
            <Icon type="ios-star-outline" v-if="infocus" title="关注活动"/>
            <Icon type="md-star" color="#ffac2d" v-else title="取消关注"/>
          </span>   
          <span class="signupButton" @click="changeSignup" v-if="activityData.status > 1">
            <Button v-if="insignup">报名</Button>
            <Button v-else>取消报名</Button>
          </span>        
        </h2>
        <div class="actiContent">
          <Row>
          <Col span="14" class="col">
            <table>
              <tr><td colspan="2">
                <p style="padding: 0px 10px 10px;">
                <span>{{createUser.realName}}&nbsp;创建于&nbsp;{{dateformat(activityData.createTime)}} </span>
                <span style="margin-left:15px;"><Icon type="md-flame" color="#ea6f5a"/>&nbsp;活动{{getStateName(activityData.status,'acti')}}</span>
                <span style="margin-left:15px;"><Icon type="md-flame" color="#ea6f5a"/>&nbsp;已报名：{{ activityData.memberNow + ' / ' + activityData.limitQuota }}</span>
                </p>
              </td></tr>
              <tr>
                <td><span class="tt"><Icon type="md-contacts" />&nbsp;主办方</span>&nbsp;</td>
                <td><span class="cc">{{activityData.organizer.name}}</span></td>
              </tr>
              <tr>
                <td><span class="tt"><Icon type="ios-pin-outline" />&nbsp;地点</span>&nbsp;</td>
                <td><span class="cc">{{activityData.address}}</span></td>
              </tr>
              <tr>
                <td><span class="tt"><Icon type="md-time" />&nbsp;报名时间</span>&nbsp;</td>
                <td><span class="cc">{{dateformat(activityData.signupTime)}} -- {{dateformat(activityData.deadlineTime)}}</span></td>
              </tr>
              <tr>
                <td><span class="tt"><Icon type="md-alarm" />&nbsp;活动时间</span>&nbsp;</td>
                <td><span class="cc"> {{dateformat(activityData.startTime)}} -- {{dateformat(activityData.endTime)}}</span></td>
              </tr>
              <tr>
                <td><span class="tt"><Icon type="md-people"/>&nbsp;活动管理员</span>&nbsp;</td>
                <td>
                  <Poptip v-for="item in activityData.otherAdmin" trigger="hover" >
                    <span class="aa" v-if="item.id === activityData.createUser" style="color:#797979;margin-right: 15px;">
                      <Avatar v-bind:src="item.avatar"  @on-error="fixAvatar(item.id)" size="small" />&nbsp;{{item.realName}}
                    </span>
                    <span class="aa" v-else style="color:#969696;margin-right: 15px;">
                      <Avatar v-bind:src="item.avatar"  @on-error="fixAvatar(item.id)" size="small"/>&nbsp;{{item.realName}}
                    </span>
                    <div slot="content" >
                      <p >{{ item.realName }}({{item.username}})</p>
                      <!-- <p>学号 : {{ item.stuNum }}</p>
                      <p>年级 : {{ item.period }}级</p>
                      <p>专业 : {{ item.profession }}</p>
                      <p>班级 : {{ item.whatClass }}</p> -->
                    </div>
                  </Poptip>
                </td>
              </tr>
              <tr>
                <td><span class="tt"><Icon type="md-people"/>&nbsp;活动对象</span>&nbsp;</td>
                <td>
                  <ul style="margin: 10px 15px;">
                    <li class="aa" v-for="item in activityData.grouplimit">{{item.name}}</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td><span class="tt"><Icon type="md-checkmark-circle-outline" />&nbsp;报名审核</span>&nbsp;</td>
                <td>
                  <i-switch v-model="isreview" :disabled="disabled" style="margin-right:20px;">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </i-switch>
                  <Button v-if="isreview" @click="doReview" size="small">进入审核</Button>
                </td>
              </tr>
            </table>
          </Col>
          <Col span="8" class="col">
            <div class="actiImg">
              <img v-bind:src="activityData.pictureurl" alt="活动配图" v-if="checkPath(activityData.pictureurl)"/>
              <img v-bind:src="global_.public_img" alt="活动配图" v-else>
            </div>
          </Col>
          <Col span="2" class="col">
            <div class="side-button-bar">
              <button class="side-button" @click="edit"><span>编辑</span></button>
              <button class="side-button" @click="signupDetail"><span>表单</span></button>
              <button class="side-button" @click="scoreDeatil"><span>学分</span></button>
            </div>
          </Col>
          </Row>
        </div>
        <p class="tt"><Icon type="ios-paper" />详情</p>
        <p class="description">{{activityData.description}}</p>
      </div>
      <div slot="footer">
        <Button type="info"  @click="close">关闭</Button>
      </div>
    </Modal>
    <ScoreDetail v-if="showScoreDeatilModal" :activityData="datafordetail"  @cancel="onModalCancel" />
    <SignupFormDetail v-if="showSignupFormDeatilModal" :activityData="datafordetail"  @cancel="onModalCancel" />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import global_   from  '@/view/global.vue'
import { post , get } from '@/libs/axios-cfg'
import SignupFormDetail from './signup-form-detail.vue'
import ScoreDetail from './score-detail.vue'
export default {
  data() {
    return {
      loading: false,
      disabled:true,
      detailActivityModel:true,
      activityData:{},
      createUser:{},
      isreview:false,
      infocus:false,
      insignup:false,
      grouplist: [],
      showScoreDeatilModal:false,
      showSignupFormDeatilModal:false,
      scoreData:'',
    };
  },
  components:{
    SignupFormDetail,ScoreDetail
  },
  props: {
    data:{
      type:Object,
      default:{}
    } 
  },
  created(){
    this.getData();
  },
  methods: {
    async getData(){
      this.activityData = this.data;
      this.data.otherAdmin.forEach(item => {
        if(item.id === this.data.createUser){
          this.createUser = item;
        }
      }); 
      if(this.data.isreview == 0){
        this.isreview = true;
      }
    },
    close(){
      this.$emit('cancel','detail');
    },
    dateformat(date){
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    },
    async checkPath(imgPath){      
      try {
        let res = await get(imgPath);
        return true;
      } catch (error) {
        return false;
      }
    },
    fixAvatar(adminId){
      this.activityData.otherAdmin.forEach(ele => {
        if(ele.id === adminId){
          ele.avatar = 'https://i.loli.net/2017/08/21/599a521472424.jpg';
        }
      })
    },
    getStateName(state,type){
      switch (type){
        case 'acti':
          return global_.getStateName(state,global_.actiStatus);
        case 'auth':
          return global_.getStateName(state,global_.authStatus);
      }		
    },
    async isFocus(actiId){
      this.loading = true;
      try {
        let userId = this.$store.state.user.userId;
        let res = await post('/app/focus/checkState/{actiId}/{userId}')
        this.infocus = res.data;
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    doReview(){
      
    },
    change (status) {
      this.$Message.info('开关状态：' + status);
    },
    edit(){

    },
    signupDetail(){
      //向子组件传值
      this.showSignupFormDeatilModal = true;
      this.datafordetail = this.data;
    },
    scoreDeatil(){
      //向子组件传值
      this.showScoreDeatilModal = true;
      this.datafordetail = this.data;
    },
    async changeFocus(){
      this.infocus = this.infocus ? false : true;
      this.loading = true;
      try {
        let userId = this.$store.state.user.userId;
        let res = await post('/app/focus/changeState/{actiId}/{userId}',null,this.infocus);
        // this.$Message.destroy()
        // this.$Message.success({
        //   content:"关注",
        //   duration: 1
        // });
        this.infocus = res.data;
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    async isSignup(actiId){
      this.loading = true;
      try {
        let userId = this.$store.state.user.userId;
        let res = await post('/app/signup/checkState/{actiId}/{userId}')
        this.insignup = res.data;
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    async changeSignup(){
      this.insignup = this.insignup ? false : true;
      this.loading = true;
      try {
        let userId = this.$store.state.user.userId;
        let res = await post('/app/signup/changeState/{actiId}/{userId}',null,this.insignup);
        // this.$Message.destroy()
        // this.$Message.success({
        //   content:"关注",
        //   duration: 1
        // });
        this.insignup = res.data;
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    /**
     * @description 关闭模态窗口
     * @param type 窗口类型
     * @param reload 是否重新加载数据
     */
    onModalCancel(type,reload = false){
      switch(type){
        case 'score':{
          this.showScoreDeatilModal = false;
        };break;
        case 'singupForm':{
          this.showSignupFormDeatilModal = false;
        };break;
      }
      if(reload) this.getData();
    }
  },
  watch:{
    detailActivityModel:function(newvalue,oldvalue){
      if(!newvalue){
        this.close();
      }
    }
  },
  mounted() {}
};
</script>
<style>
  .side-button-bar {
    text-align: center;
    padding: 20px 0;
  }
  .side-button{
    width: 55%;
    padding: 21px 0 5px 0;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    color: #515a6e;
    background-color: #fff;
    border-color: #dcdee2;
    margin-bottom: 20px;
    border-radius: 3px;
    font-size: 14px;
  }
  .side-button:hover {
    color: #57a3f3;
    background-color: white;
    border-color: #57a3f3;
  }
  .side-button:focus {
    webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  }
  .side-button span {
    writing-mode: vertical-rl;
    letter-spacing: 10px;
    vertical-align: middle;
  }
  .actiTitle {
    margin: 20px 10px;
    display: inherit;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    color: #2b85e4;
  }
  .star {
    /* color: #ffac2d; */
    font-size: 24px;
    cursor: pointer;
    margin-left: 20px;
  }
  .signupButton {
    margin-left: 12px;
  }
  .actiContent {
    
  }
  .description {
    margin: 5px 10px 8px;
    font-size: 13px;
    line-height: 24px;
    color: #999;
    padding-left: 30px;
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
  .actiImg {
    width: 100%;
  }
  .actiImg img {
    max-height: 200px;
    width: 100%;
  }
</style>
