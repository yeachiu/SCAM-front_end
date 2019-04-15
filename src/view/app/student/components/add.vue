<template>
  <div>
    <Modal v-model="show" title="添加部门" :mask-closable="false" :closable="false">
      <Form ref="modalForm" :model="data" :rules="ruls"
                  :label-width="80">
        <FormItem label="姓名" prop="realName">
          <Input v-model.trim="data.realName"></Input>
        </FormItem>
        <FormItem label="学号" prop="stuNum">
          <Input v-model.trim="data.stuNum"></Input>
        </FormItem>
        <FormItem label="专业" prop="dictId">
          <Select v-model="modal.data.dictId" style="width:200px">
            <Option v-for="item in dictList" :value="item.id" :key="item.id">{{ item.dictName }}</Option>
          </Select>
        </FormItem> 
        <FormItem label="年级">
          <InputNumber :max="2900" :min="1900" v-model.trim="data.period"></InputNumber>
        </FormItem>
        <FormItem label="班级">
          <InputNumber :max="99" :min="1" v-model.trim="data.whatClass" :formatter="value => `${value}班`"
            :parser="value => value.replace('班', '')"></InputNumber>
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
        realName: "",
        stuNum: "",
        dictId: "",
        period: dayjs().year(),
        classNum:1
      },
      ruls: {
        realName: [{ required: true, message: "姓名不能为空" }],
        stuNum: [{ required: true, message: "学号不能为空" }],
        dictId: [{ required: true, message: "请选择专业" }]
      },
      options: []
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
          let res = await post('/app/student/list')
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
              whatClass: item.whatClass
            };
          });
          this.options = list.filter(item => item.realName.toLowerCase().indexOf(query.toLowerCase()) > -1
            || item.whatClass.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }, 200);
      } else {
        this.options = [];
      }
    },
  }
};
</script>

