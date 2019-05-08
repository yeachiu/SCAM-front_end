<template>
  <div>
    <Form :model="formItem"  :rules="ruleValidate" :label-width="120">
      <FormItem label="配图">
        <div class="foreView"  v-if="uploadImg.url">
          <img :src="uploadImg.url">
          <div class="upload-img-cover">
            <Icon type="ios-eye-outline" @click.native="showBigImg = true"></Icon>
            <Icon type="ios-trash-outline" @click.native="uploadImg = {}"></Icon>
          </div>
        </div>
        <div class="foreView" v-else>
          <Icon type="ios-camera" size="20"></Icon>
        </div>
        <Upload
          v-model="picture"
          ref="upload"
          :show-upload-list="false"
          :before-upload="handleUpload"
          :on-success="uploadSuccess"
          type="drag"
          action="http://localhost:1000/upload"
          name="file"
          style="display: inline-block;width:158px;">
          <div style="width: 158px;height:40px;line-height: 40px;">
            <span>上传活动封面</span>
          </div>
        </Upload>
        <Modal title="查看大图" v-model="showBigImg">
        <img :src="uploadImg.url" style="width: 100%">
        </Modal>
      </FormItem>
      <FormItem label="标题" prop="title">
        <Input v-model="formItem.title" placeholder="输入活动标题..." ></Input>
      </FormItem>
      <FormItem label="描述" prop="description">
        <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="地址" prop="address">
        <Input v-model="formItem.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="报名时间" prop="datetimeSignup">
        <DatePicker v-model="formItem.datetimeSignup" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" @on-change="changeSignupDate"
          placeholder="选择报名时间段" style="width: 300px"></DatePicker>
      </FormItem>
      <FormItem label="活动时间" prop="datetimeAct">
        <DatePicker v-model="formItem.datetimeAct" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" @on-change="changeActDate"
          placeholder="活动时间" style="width: 300px"></DatePicker>
      </FormItem>
      <FormItem label="名额限制">
        <InputNumber v-model="formItem.limitQuota" :max="500" :min="1"></InputNumber>
      </FormItem>
      <FormItem label="其他管理员">
        <!-- filterable remote :remote-method="findByApartmentId" :loading="loading" -->
        <Select v-model="formItem.otherAdmin" multiple >
          <Option v-for="option in options1" :value="option.id" :key="option.id">{{option.realName}}</Option>
        </Select>
      </FormItem>
      <!-- <FormItem label="启用黑名单">
        <RadioGroup v-model="formItem.isblacklist">
          <Radio label="0">启用</Radio>
          <Radio label="1">不启用</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem label="报名是否需要审核">
        <RadioGroup v-model="formItem.isreview">
          <Radio label="0">需要</Radio>
          <Radio label="1">不需要</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="活动面向对象">
        <Button type="info" @click="selectGroupModal = true"><Icon type="md-add"></Icon>&nbsp;添加分组</Button>
        <Tag v-for="item in formItem.groupId" :key="item.id" closable @on-close="handleClose">{{item.title}}</Tag>
      </FormItem>
    </Form>
    <SelectGroup v-if="selectGroupModal" :aparId="apartmentId" :checkeds="formItem.groupId" v-on:checkedNodes="getNodes" @cancel="onModalCancel"></SelectGroup>
    <Button type="primary" @click="handleUpdate" class="handleUpdate" v-if="isedit">提交更新</Button>
  </div>
</template>
<script>
import { post } from '@/libs/axios-cfg'
import SelectGroup from './select-group.vue'
import dayjs from 'dayjs'
export default {
  data(){
    const validateDate = (rule,value,callback) =>  {
      if (value === null) {
        callback(new Error('Please select the DateTime'));
      }
      value.forEach((r,index)=>{
        if(r === ""){
          callback(new Error('Please select the DateTime'));
        }
      })
      callback();
    };
    return{
      formItem: {
        pictureUrl: '',
        title: '',
        description: '',
        address: '', //  地点
        datetimeSignup: [],
        datetimeAct: [],
        limitQuota: 100,
        otherAdmin: [],
        isblacklist: '1',
        isreview: '1',
        groupId: [],
      },
      ruleValidate:{
        title:[
          {required:true,message:'活动标题不能为空', trigger:'blur'}
        ],
        description:[
          {required:true,message:'活动描述不能为空', trigger:'blur'}
        ],
        address:[
          {required:true,message:'活动地点不能为空', trigger:'blur'}
        ],
        datetimeSignup:[
          {required:true,validator:validateDate, trigger:'blur'}
        ],
        datetimeAct:[
          {required:true,validator:validateDate, trigger:'blur'}
        ]
      },
      picture:{},
      uploadImg: {},
      showBigImg: false,
      loading: false,
      options1:[],
      list: [],
      selectGroupModal:false,
      apartmentId:'',
      // 编辑模式
      editData:{},
      updateData:{},
      isedit:false
    }
  },
  props: [
    'actiId','aparId'
  ],
  components:{
    SelectGroup
  },
  created() {
    this.getData();
  },
  methods: {
    async getData(){
      // 【编辑模式】
      if(typeof(this.actiId) != "undefined" && this.actiId != ''){
        this.isedit = true;
        this.loading = true;
        try {
          let res = await post('app/activity/get/{id}',null,{
            id:this.actiId
          })
          let data = res.data;
          let datetimeSignup = [data.signupTime, data.deadlineTime];
          let datetimeAct = [data.startTime, data.endTime];
          let otherAdmin = data.otherAdmin;
          let admins = new Array();
          otherAdmin.forEach(ele => {
            admins.push(ele.id);
          });
          this.formItem = {
            pictureUrl: data.pictureUrl,
            title: data.title,
            description: data.description,
            address: data.address, //  地点
            datetimeSignup: datetimeSignup,
            datetimeAct: datetimeAct,
            limitQuota: data.limitQuota,
            otherAdmin: admins,
            // isblacklist: '1',
            isreview: String(data.isreview),
            groupId: data.grouplimit,
          };

          this.apartmentId = data.organizerId;
          this.uploadImg.url = this.formItem.pictureUrl;

        } catch (error) {
          this.$throw(error);
        }
        this.loading = false;
      }else{
        this.apartmentId = this.aparId;
      }
      this.findByApartmentId();
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg、jpeg 或 png 的图片文件。',
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。',
      });
    },
    /* 文件上传前执行的方法 */
    handleUpload(file) {
      //文件格式、大小的校验
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
        this.handleFormatError(file);
      } else if (file.size > 2 * 1024 * 1024) {
        this.handleMaxSize(file);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.uploadImg = {
              url: reader.result,
              file,
          };
        };
        this.formItem.picture = file;

      }
      return true;
    },
    uploadSuccess(response, file, fileList){
      this.formItem.pictureUrl = "/" + response.data;
    },
    getNodes(val){
      this.formItem.groupId = val;
    },
    async  findByApartmentId (query) {
      this.loading = true;
      try {
        let res = await post('/app/apartment/member/list/exadmin/{id}',null,{
          id: this.apartmentId
        })
        this.options1 = res.data;
      } catch (error) {
        this.$throw(error)
      }
      this.loading = false;
    },
    openModal(){
      this.selectGroupModal=true;
    },
    /**
     * @description 关闭模态窗口
     */
    onModalCancel(){
      this.selectGroupModal=false;
    },
    /**
     * @description 移除分组
     */
    handleClose (event, name) {
      const index = this.formItem.groupId.indexOf(name);
      this.formItem.groupId.splice(index, 1);
    },
    changeSignupDate(date){
      this.formItem.datetimeSignup = date;
    },
    changeActDate(date){
      this.formItem.datetimeAct = date;
    },
    //提交更新
      async handleUpdate(){
        let ids = new Array();
        if(this.formItem.groupId != null && this.formItem.groupId.length > 0){
          // 拼接分组ID
          this.formItem.groupId.forEach(ele => {
            if(ele.id != null){
              ids.push(ele.id);
            }
          });
        }
        this.updateData = {
          title : this.formItem.title,
          description : this.formItem.description,
          address : this.formItem.address,
          pictureUrl : this.formItem.pictureUrl,
          signupTime : new Date(this.formItem.datetimeSignup[0]),
          deadlineTime : new Date(this.formItem.datetimeSignup[1]),
          startTime : new Date(this.formItem.datetimeAct[0]),
          endTime : new Date(this.formItem.datetimeAct[1]),
          limitQuota : this.formItem.limitQuota,
          isreview : new Number(this.formItem.isreview),
          otherAdmin : String(this.formItem.otherAdmin),
          groupId : String(ids)
        };
        this.loading = true;
        try {
          let res = await post('app/activity/update/{actiId}',this.updateData,{
            actiId:this.actiId
          })
          this.$Message.success("活动数据更新成功");
        } catch (error) {
          this.$throw(error);
        }
        this.loading = false;
         // 刷新数据
          this.$emit("refresh",this.actiId);
      },
  },
  mounted(){
    this.$on('submitBaseData',()=>{
      this.$emit("submitData",this.formItem);
    })
  }
}
</script>
<style>
  .foreView{
    display: inline-block;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .foreView img{
    width: 100%;
    height: 100%;
  }
  .upload-img-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .foreView:hover .upload-img-cover{
    display: block;
  }
  .upload-img-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
  .ivu-upload-drag {
    border-radius: 40px;
  }
  .handleUpdate {
    width: 100%;
    margin-top: 20px;
  }
</style>

