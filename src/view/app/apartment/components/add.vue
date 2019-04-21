<template>
  <div>
    <Modal v-model="show" title="添加部门" :mask-closable="false" :closable="false">
      <Form ref="modalForm" :model="data" :rules="ruls"
                  :label-width="80">
        <FormItem label="名称" prop="name">
          <Input v-model.trim="data.name"></Input>
        </FormItem>
        <FormItem label="职能简介" prop="about">
          <Input v-model="data.about" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="管理员">
          <Select v-model="data.apartAdmin" filterable remote :remote-method="findAllStudent" :loading="loading">
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
        name: "",
        about: "",
        apartAdmin: "",
      },
      ruls: {
        name: [{ required: true, message: "部门名称不能为空" }],
        about: [{ required: true, message: "部门简介不能为空" }],
        apartAdmin: [{ required: true, message: "请选择一个部门管理员" }]
      },
      options: [],
      lists: []
    };
  },
  props: {
    
  },
  methods: {
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
        let res = await post('/app/apartment/add',data)
        this.$Message.success("部门 "+data.name+" 添加成功");
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
          let res = await post('/system/user/auth/list/already/exmember')
          this.lists = res.data;
        } catch (error) {
          this.$throw(error)
        }
        setTimeout(() => {
          this.options = [];
          this.loading = false;
          const list = this.lists.map(item => {
            return {
              id: item.id,
              realName: item.realName,
              whatClass: item.whatClass,
              className:item.className
            };
          });
         
          list.forEach(ele => {
            if(ele.realName.toLowerCase().indexOf(query.toLowerCase()) > -1 ){
              this.options.push(ele);  
            }else if(ele.className.toLowerCase().indexOf(query.toLowerCase()) > -1){
              this.options.push(ele);
            }
          });
          
            // return result;
          // }
          
        }, 200);
      } else {
        this.options = [];
      }
    },
    
  }
};
</script>
