<template>
  <div>
    <Row class="container">
      <Col span="15">
        <div class="mainCard">
          <div class="title"><p class="name">{{apartmentData.name}}</p></div>                 
          <div class="meta">
            <span style="margin: 0 5px;">成员：{{apartmentData.member.length}}</span>
            <span><a target="_blank" v-bind:href="linkToActitity">活动：{{apartmentData.activityNum}}</a></span>    
          </div>
        </div>
        <Row class="memlist">
          <Col :xs="24" :sm="12" :md="12" :lg="12" v-for="(mem,index) in apartmentData.member" :key='index' class="memItem">
            <Row>
              <Col span="6"><Avatar shape="square" style="color: #f56a00;background-color: #fde3cf">U</Avatar></Col>
              <Col span="16">
                <div class="title"><h5>{{mem.realName}}</h5></div>
                <div class="meta">
                  <p>class: {{mem.whatClass}}</p>
                  <p>stuNumber: {{mem.stuNum}}</p>
                  <p>phone: {{mem.phone}}</p>  
                </div>                         
              </Col>
            </Row>
          </Col>    
        </Row>
      </Col>
      <Col span="8" class="aside">
        <p class="title">
            <span>部门介绍</span>
            <span class="editIntro" @click="edit(0)"><Icon type="ios-brush-outline"/>编辑</span>
        </p>    
        <div class="description js-description">
          <p v-if="isEditAbout==false">{{apartmentData.about}}</p>
          <div v-if="isEditAbout==true">
            <Input v-model="newAbout" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="margin-bottom:10px;"></Input> 
            <Button size="small" type="primary" @click="editSave(newAbout,0)">保存</Button>
            <Button size="small" style="margin-left: 8px" @click="cancel(0)">取消</Button>
          </div>
        </div>
        <p class="title">
          <span>管理员</span>
          <span class="editIntro" @click="edit(1)"><Icon type="ios-brush-outline"/>编辑</span>
        </p>
        <div class="admin">
            <Row>
                <Col span="6"><Avatar shape="square" icon="ios-person" size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg"/></Col>
                <Col span="16">
                    <div class="name"><h5>{{apartmentData.admin.realName}}</h5></div>
                    <div class="meta">
                        <p>class: {{apartmentData.admin.whatClass}}</p>
                        <p>stuNumber: {{apartmentData.admin.stuNum}}</p>
                        <p>phone: {{apartmentData.admin.phone}}</p>
                    </div>
                </Col>
            </Row>
        </div>
        <div v-if="isEditAdmin==true">
          <Select v-model="newAdminId" filterable style="margin:10px 0;">
            <Option v-for="item in apartmentData.member" :value="item.id" :key="item.id">{{ item.realName }}</Option>
          </Select>
          <Button size="small" type="primary" @click="editSave(newAdminId,1)">保存</Button>
          <Button size="small" style="margin-left: 8px" @click="cancel(1)">取消</Button>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    let NEWABOUT = 0;
    let NEWADMIN = 1;
    export default {
      data () {
        return {
          apartmentData:{
            id:'111111',
            name:'舒雪吉部门',
            admin:{
              id:'11111233',realName:'部门管理员',whatClass:'15信息管理1班',stuNum:'1562852555545',phone:'12356489611'
            },
            about:'huodongjianjieh这是部门简介',
            activityNum:10,
            member:[
              {id:'1111111233',realName:'邱XX',whatClass:'15信息管理1班',stuNum:'1562852555545',phone:'12356489611'},
              {id:'1111111333',realName:'陈XX',whatClass:'15信息管理1班',stuNum:'1562852555534',phone:'12356489658'},
              {id:'1111111433',realName:'刘XX',whatClass:'15信息管理1班',stuNum:'1562852555586',phone:'12356489532'},
              {id:'11111233',realName:'部门管理员',whatClass:'15信息管理1班',stuNum:'1562852555545',phone:'12356489611'}
            ]
          },
          linkToUser:'',
          linkToActitity:'/app/activity/manage',
          isEditAbout:false,
          isEditAdmin:false,
          newAbout:'',
          newAdminId:''
        }
      },
      components:{
      },
      created(){
        this.getData();
      },
      methods:{
        getData(){
            //用户主页路径
            this.linkToUser = '/my/' + this.apartmentData.apartAdmin;
        },
        edit(type){
          switch(type){
            case NEWABOUT:
              this.newAbout = this.apartmentData.about;
              this.isEditAbout = true;
              break;
            case NEWADMIN:
              this.newAdminId = this.apartmentData.admin.id;
              this.isEditAdmin = true;
              break;
          }   
        },
        cancel(type){
          switch(type){
            case NEWABOUT:
              this.newAbout = this.apartmentData.about;
              this.isEditAbout = false;
              break;
            case NEWADMIN:
              this.newAdminId = this.apartmentData.admin.id;
              this.isEditAdmin = false;
              break;
          }
          
          
        },
        async editSave(data,type){   
          this.loading = true;
          switch (type) {
            case NEWABOUT:
              try {
                let res = await post('/app/apartment/update/about/{id}',data,{
                    id:this.apartmentData.id
                })
                this.apartmentData.about = data;
                this.$Message.success(" 内容更新成功");
                this.cancel();
              } catch (error) {
                this.$throw(error)
              }
              break;
            case NEWADMIN:
              try {
                let res = await post('/app/apartment/update/admin/{id}/{uid}',null,{
                    id:this.apartmentData.id,
                    uid:data
                })
                this.apartmentData.admin = data;
                this.$Message.success(" 管理员更新成功");
                this.cancel();
              } catch (error) {
                this.$throw(error)
              }
              break;
          }
          
          this.loading = false;
          
        }
      }
    }
</script>
<style>
  .container {
    width: 960px;
    margin: 0 auto;
  }
  .mainCard {
    border-bottom: 1px solid #f0f0f0;
    word-wrap: break-word;
    margin-bottom: 35px;
    padding: 0 0 10px 5px;
  } 
  .mainCard .title {
    padding: 20px 0px 0 10px;
  }
  .mainCard .title .name {
    display: inline;
    font-size: 21px;
    font-weight: 700;
    vertical-align: middle;
  }
  .mainCard .meta {
    margin-top: 10px;
    font-size: 14px;
    color: #969696;
    padding-left: 10px;
  }
  .mainCard .subtitle {
    
  }
  .meta {
    color: #c3c3c3;
  }
  .meta span {
     margin: 0 5px;
  }
  .memItem {
    padding: 25px 0;
    border-bottom: 1px dotted #ddd;
  }
  .aside {
    padding: 20px 0 0 20px;
  }
  .aside .title {
    /* float: left; */
    margin-bottom: 10px;
    font-size: 14px;
    color: #969696;
  }
  .aside .description {
    position: relative;
    margin-bottom: 20px;
    padding: 0 0 16px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
    clear: both;
    word-break: break-word!important;
    word-break: break-all;
}
.main-footer-center {
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
}

.editIntro {
    cursor: pointer;
    color: #999;
    float: right;
}
</style>
