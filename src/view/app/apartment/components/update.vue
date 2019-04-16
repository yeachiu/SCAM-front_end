<template>
  <div>
    <Modal v-model="show" title="更新部门信息"
            :mask-closable="false" :closable="false">
        <Form ref="modalForm" :model="data" :rules="ruls"
                    :label-width="80">
            <FormItem label="ID">
                <Input disabled v-model.trim="data.id"></Input>
            </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model.trim="data.name"></Input>
        </FormItem>
        <FormItem label="简介" prop="about">
          <Input v-model="data.about" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="管理员">
          <Select v-model="data.apartAdmin" filterable remote :remote-method="findAllStudent" :loading="loading" :placeholder="data.adminName">
            <Option v-for="(option, index) in options" :value="option.id" :key="index">{{option.className}} - {{option.realName}}</Option>
          </Select>
        </FormItem>
        </Form>
        <div slot="footer">
            <Button type="default" :disabled="loading" @click="cancel(false)">取消</Button>
            <Button type="primary" :loading="loading" @click="ok">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import { post } from '@/libs/axios-cfg'
export default {
  data() {
    return {
      show: true,
      loading: false,
      data: {
        id:0,
        name: '',
        about: '',
        apartAdmin: '',
        adminName:''
      },
      ruls: {
        name: [{ required: true, message: "部门名称不能为空" }],
        about: [{ required: true, message: "部门简介不能为空" }],
        apartAdmin: [{ required: true, message: "请选择一个部门管理员" }]
      },
      options:[]
    };
  },
  props: {
    updateObject:{
        type:String,
        default:{}
    }
  },
  created(){
    //   this.getApartmentInfo();
    if(this.updateObject != null){
        this.data.id = this.updateObject.id;
        this.data.name = this.updateObject.name;
        this.data.about = this.updateObject.about;
        // this.data.apartAdmin = this.updateObject.apartAdmin.id;
        this.data.adminName = this.updateObject.apartAdmin.realName;
    }
  },
  methods: {
    /**
     * @description 关闭Modal
     * @param reload 是否重新加载数据
     */
    cancel(reload = false) {
      this.$emit("cancel", "update", reload);
    },
    /**
     * @description 获取部门信息
     */
    async getApartmentInfo(){
        try {
            let res = await post('/app/apartment/get/id/{id}',null,{
                id:this.aparId
            })
            this.data = res.data.map(item => {
            return {
              id: item.id,
              name: item.name,
              about:item.about,
              apartAdmin: item.apartAdmin.id,
              adminName:item.apartAdmin.realName
            };
          });
        } catch (error) {
            this.$throw(error)
        }
    },
    /**
     * @description 确定按钮单击回调
     */
    ok() {
      this.$refs.modalForm.validate(valid => {
        if (valid) {
            let roles = []
            this.data.roles.forEach(el=>{
                roles.push(this.roles[el]);
            })
            let data = JSON.parse(JSON.stringify(this.data));
            data.roles = roles;
            this.update(data)
        }
      });
    },
    /**
     * @description 更新用户数据请求
     */
    async update(data){
        this.loading = true;
        try {
            let res = await post('/system/user/update/{id}',data,{
                id:this.data.id
            })
            this.$Message.success("用户 "+data.username+" 更新成功");
            this.cancel(true)
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
    },
    async  findAllStudent (query) {
      if (query !== '') {
        this.loading = true;
        try {
          let res = await post('/app/student/alllist')
          this.lists = res.data;
        } catch (error) {
          this.$throw(error)
        }
        setTimeout(() => {
          this.loading = false;
          this.options = [];
          const list = this.lists.map(item => {
            return {
              id: item.id,
              realName: item.realName,
              whatClass: item.groupVO.whatClass,
              className:item.groupVO.className
            };
          });
          list.forEach(ele => {
            if(ele.realName.toLowerCase().indexOf(query.toLowerCase()) > -1 ){
              this.options.push(ele);  
            }else if(ele.className.toLowerCase().indexOf(query.toLowerCase()) > -1){
              this.options.push(ele);
            }
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
  }
};
</script>
