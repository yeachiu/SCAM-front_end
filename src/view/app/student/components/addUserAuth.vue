<template>
  <div>
    <Modal v-model="show" title="添加学生信息" :mask-closable="false" :closable="false">
      <Form ref="modalForm" :model="data" :rules="rules"
                  :label-width="80">
        <FormItem label="用户" prop="uid">
          <Select v-model="data.uid" filterable remote :remote-method="findUnAuthUser" :loading="loading">
            <Option v-for="item in userlist" :value="item.id" :key="item.id">{{ item.username }}</Option>
          </Select>
        </FormItem>
        <FormItem label="学生" prop="stuId">
          <Select v-model="data.stuId" filterable remote :remote-method="findUnAuthStudent" :loading="loading">
            <Option v-for="item in studentList" :value="item.id" :key="item.id">{{item.className}} - {{item.realName}}</Option>
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
import dayjs from 'dayjs'

export default {
  data() {
    return {
      show: true,
      loading: false,
      data: {
        uid:'',
        stuId:''
      },
      rules: {
        uid: [{required: true, message: "请选择专业" }],
        stuId: [{ required: true, message: "请选择专业" }]
      },
      lists: [],
      userlist:[],
      studentList:[]
    };
  },
  props: {

  },
  created(){
   
  },
  methods: {
    async  findUnAuthUser (query) {
      if (query !== '') {
        this.loading = true;
        try {
          let res = await post('system/user/list/unauth')
          this.lists = res.data;
        } catch (error) {
          this.$throw(error)
        }
        setTimeout(() => {
          this.loading = false;
          const list = this.lists.map(item => {
             return {
              id: item.id,
              username: item.username
            };
          });
         
          list.forEach(ele => {
            if(ele.username.toLowerCase().indexOf(query.toLowerCase()) > -1 ){
              this.userlist.push(ele);  
            }
          });
          
            // return result;
          // }
          
        }, 200);
      } else {
        this.userlist = [];
      }
    },
    async  findUnAuthStudent (query) {
      if (query !== '') {
        this.loading = true;
        try {
          let res = await post('app/student/list/unauth')
          this.lists = res.data;
        } catch (error) {
          this.$throw(error)
        }
        setTimeout(() => {
          this.loading = false;
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
              this.studentList.push(ele);  
            }else if(ele.className.toLowerCase().indexOf(query.toLowerCase()) > -1){
              this.studentList.push(ele);
            }
          });
          
            // return result;
          // }
          
        }, 200);
      } else {
        this.studentList = [];
      }
    },
    /**
     * @description 关闭Modal
     * @param reload 是否重新加载数据
     */
    cancel(reload = false) {
      this.$emit("cancel", "add", reload);
    },
    /**
     * @description 确定按钮单击回调
     */
    ok() {
      this.$refs.modalForm.validate(valid => {
        if (valid) {
            let data = JSON.parse(JSON.stringify(this.data));
            this.add(data)
        }
      });
    },
    /**
     * @description 添加用户数据请求
     */
    async add(data){
      this.loading = true;
      try {
        let res = await post('system/user/auth/addByAdmin',data)
        this.$Message.destroy()
        this.$Message.success({
            content:"添加成功",
            duration: 1.5
        });
        this.cancel(true)
      } catch (error) {
        this.$throw(error)
      }
      this.loading = false;
    }
  }
};
</script>