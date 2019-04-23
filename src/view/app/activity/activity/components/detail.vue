<template>
  <div>
    <Modal ref="modal" v-model="activityData" draggable :width="800">
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
          <Col span="16" class="col">
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
                      <Avatar v-bind:src="checkAvatar(item.avatar)" size="small"/>&nbsp;{{item.realName}}
                    </span>
                    <span class="aa" v-else style="color:#969696;margin-right: 15px;">
                      <Avatar v-bind:src="checkAvatar(item.avatar)" size="small"/>&nbsp;{{item.realName}}
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
                  <!-- <Switch :disabled="disabled" />  v-model="isreview" -->
                  <Switch/>
                  <Button v-if="isreview" @click="doReview">进入审核</Button>
                </td>
              </tr>
            </table>
          </Col>
          <Col span="8" class="col">
            <div class="actiImg">
              <img v-bind:src="checkPath(activityData.pictureurl)" alt="活动配图">
              <img v-bind:src="'http://localhost:1000/upload' + activityData.pictureurl" alt="120" />
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
  </div>
</template>
<script>
import dayjs from 'dayjs'
import global_   from  '@/view/global.vue'
import { post , get } from '@/libs/axios-cfg'
export default {
  data() {
    return {
      loading: false,
      disabled:true,
      activityData:{},
      //   pictureUrl: '',
      //   title: 'zz获胜的防护服搜救zzzzzzzzzzzzzzz',
      //   description: 'zzzzzzzzzzzzzzzz仿vUI经济囧不是林小欧和熊咯哦11zzzzzzzzzzzzzzz',
      //   organizer:{
      //     id:'123d',name:'yguidiu'
      //   },
      //   address:'埃菲尔铁塔七楼三点钟方向',
      //   signUpTime: '2019-04-08 15:25:10',
      //   deadlineTime:'2019-04-08 15:25:10',
      //   startTime:'2019-04-08 15:25:10',
      //   endTime:'2019-04-08 15:25:10',
      //   limitQuota: 100,
      //   otherAdminlist: [
      //     {realName: "邱XX",stuNum: "1122344455",period:2015,profession:'信息系统',whatClass: "15信管1班"},
      //   ],
      //   isblackList: '1',
      //   isreview: '1',
      //   status:0,
      //   rules:'',
      // },
      createUser:{},
      isreview:false,
      infocus:false,
      insignup:false,
      grouplist: [],
      scoreData:''
    };
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
      console.info(this.createUser);
      this.loading = true;
      // try {
      //   let id = this.$route.params.actiId;
      //   let res = await post('/app/activity/detail/{id}')
      //   this.activityData = res.data;
      // } catch (error) {
      //   this.$throw(error);
      // }
      this.loading = false;
    },
    close(){
      this.$emit('cancel','detail');
    },
    dateformat(date){
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    },
    async checkPath(imgPath){
      let path = 	'http://localhost:1000/upload' + imgPath;
      try {
        let res = await get(path);
        return 'http://localhost:1000/upload' + imgPath;
      } catch (error) {
        return global_.public_img;
      }
      // var ImgObj = new Image();
      // ImgObj.src = 'http://localhost:1000/upload' + imgPath;
      // if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)){
      //   return imgPath;
      // } else {
      //   return global_.public_img;
      // }
    },
    checkAvatar(avatar){
      var ImgObj = new Image();
      ImgObj.src = 'http://localhost:1000/upload' + avatar;
      if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)){
        return imgPath;
      } else {
        return 'https://i.loli.net/2017/08/21/599a521472424.jpg';
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
    }
  },
  mounted() {}
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
