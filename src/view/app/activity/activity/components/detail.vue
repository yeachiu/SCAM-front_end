<template>
  <div>
    <Modal ref="modal" v-model="detailActivityModel" scrollable :width="900" :mask-closable="false">
      <div>
        <h2 class="actiTitle">{{activityData.title}}</h2>
        <div class="actiContent">
          <!-- 活动基本信息 -->
          <div v-if="turnto == 'base'">
            <Row>
              <!-- 基本信息 -->
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
              <!-- 活动配图 -->
              <Col span="8" class="col">
                <div class="actiImg">
                  <img v-bind:src="activityData.pictureurl" alt="活动配图" v-if="checkPath(activityData.pictureurl)"/>
                  <img v-bind:src="global_.public_img" alt="活动配图" v-else>
                </div>
              </Col>
              <!-- 侧边操作栏 -->
              <Col span="2" class="col">
                <div class="side-button-bar">
                  <button class="side-button" @click="edit(turnto)"><span>编辑</span></button>
                  <button class="side-button" @click="signupDetail"><span>表单</span></button>
                  <button class="side-button" @click="scoreDeatil"><span>学分</span></button>
                </div>
              </Col>
            </Row>
            <p class="tt"><Icon type="ios-paper" />详情</p>
            <p class="description">{{activityData.description}}</p>
          </div>  
          <!-- 活动报名表信息 -->
          <div v-if="turnto == 'signup'">
            <div style="margin-bottom: 20px;">
              <Button size="small" @click="turnto = 'base'">返回</Button>
              <Button size="small" @click="getSignupFormData(activityData.id)">刷新</Button>
            </div>
            <form-create :rule="rules" style="margin:0 auto"></form-create>
          </div>
          <!-- 活动学分信息 -->
          <div v-if="turnto == 'score'">
            <div style="margin-bottom: 20px;">
              <Button size="small" @click="turnto = 'base'">返回</Button>
              <Button size="small" @click="getScoreData(activityData.id)">刷新</Button>
            </div>
            <!-- <Table :columns="columns" :data="scoreSetting"></Table> -->
            <ScoreSettingForm ref="scoreForm" v-bind="$attrs" :scoreData="scoreSetting" :actiId="activityData.id" v-on:refresh="getScoreData"/>
            <!-- <ScoreSettingForm ref="scoreForm" v-bind="$attrs" v-on="$listeners"/> -->
          </div>
        </div>
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
import ScoreSettingForm from '@/view/app/activity/activity/components/score-setting-form.vue'
export default {
  data() {
    return {
      actiId:'',
      loading: false,
      disabled:true,
      detailActivityModel:true,
      activityData:{},
      createUser:{},
      isreview:false,
      turnto:'base',     //路由显示哪部分内容:base.signup.score
      scoreSetting:[], 
      columns: [    //学分表格
        {
          title: '奖项名',
          key: 'awardName'
        },
        {
          title: '名额',
          key: 'awardNum'
        },
        {
          title: '学分',
          key: 'awardScore'
        }
      ], 
      rules:'',     //报名表单规则
    };
  },
  components:{
    ScoreSettingForm
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
    // 初始化数据
    async getData(){
      this.activityData = this.data;
      this.data.otherAdmin.forEach(item => {
        if(item.id === this.data.createUser){
          this.createUser = item;
        }
      }); 
      if(this.data.isreview == 0){
        this.isreview = true;
      };
      this.getScoreData(this.data.id);
      this.getSignupFormData(this.data.id);
    },
    // 关闭本窗口
    close(){
      this.$emit('cancel','detail');
    },
    // 时间数据处理
    dateformat(date){
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    },
    // 图片有效性检查
    async checkPath(imgPath){      
      try {
        let res = await get(imgPath);
        return true;
      } catch (error) {
        return false;
      }
    },
    // 头像加载不成功时触发
    fixAvatar(adminId){
      this.activityData.otherAdmin.forEach(ele => {
        if(ele.id === adminId){
          ele.avatar = 'https://i.loli.net/2017/08/21/599a521472424.jpg';
        }
      })
    },
    // 代码转义
    getStateName(state,type){
      switch (type){
        case 'acti':
          return global_.getStateName(state,global_.actiStatus);
        case 'auth':
          return global_.getStateName(state,global_.authStatus);
      }		
    },
    // 进入报名审核
    doReview(){
      // 涉及路由传参
      // this.$router.push("");
    },

    edit(type){
      let actiId = this.data.id;
      switch(type){
        case 'base':
          this.$router.push({name:'activity_update_base',params:{'actiId':actiId}});
          break;
        case 'signup':
          this.$router.push({name:'activity_update_signup',params:{'actiId':actiId}});
          break;
        case 'score':
          this.$router.push({name:'activity_update_score',params:{'actiId':actiId}});
          break;
      }
    },
    signupDetail(){
      let actiId = this.data.id;
      this.getSignupFormData(actiId);
      this.turnto = 'signup';
    },
    scoreDeatil(){
      let actiId = this.data.id;
      this.getScoreData(actiId);
      this.turnto = 'score';
      // console.info(this.scoreSetting)
    },
    //获取已存在活动的报名表数据
      async getSignupFormData(actiId){
        if(actiId == ''){   // 数据失效，返回列表页
          this.$router.push({name: 'activity_manage'});
        }
        this.loading = true;
        try {
          let res = await post('app/activity/signup/get/{id}',null,{
            id:actiId
          })
          this.rules = res.data;
        } catch (error) {
          this.$throw(error);
        }
        this.loading = false;
      },
    //获取已存在活动的学分数据
      async getScoreData(actiId){  
        actiId = String(actiId);
        if(actiId == ''){   // 数据失效，返回列表页
          this.$router.push({name: 'activity_manage'});
        }
        this.loading = true;
        try {
          let res = await post('app/activity/score/get/{id}',null,{
            id:actiId
          })
          this.scoreSetting = res.data;
        } catch (error) {
          this.$throw(error);
        }
        this.loading = false;
        // 通知子组件刷新数据
        this.$refs.scoreForm.$emit("refreshData");
        
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
    },
    // change (status) {
    //   this.$Message.info('开关状态：' + status);
    // },
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
