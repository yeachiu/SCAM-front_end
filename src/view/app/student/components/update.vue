<template>
  <div>
      <!-- 更新角色  -->
        <Modal v-model="showModal" title="更新学生信息" :loading="loading" :mask-closable="false" :width="800" :closable="false">
            <Form ref="updateStudent" :model="formData" :label-width="90" :rules="rules" style="width:80%;">
                <FormItem label="姓名" prop="realName">
                    <Input v-model.trim="formData.realName"></Input>
                </FormItem>
                <FormItem label="学号" prop="stuNum">
                    <Input v-model.trim="formData.stuNum"></Input>
                </FormItem>
                <FormItem label="专业" prop="dictId">
                <Select v-model="formData.dictId">
                    <Option v-for="item in dictList" :value="item.id" :key="item.id">{{ item.dictName }}</Option>
                </Select>
                </FormItem> 
                <FormItem label="年级">
                    <InputNumber :max="2900" :min="1900" v-model="formData.period"></InputNumber>
                </FormItem>
                <FormItem label="班级">
                    <InputNumber :max="99" :min="1" v-model="formData.whatClass" :formatter="value => `${value}班`"
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
    data(){
        return {
            formData: {
                realName: '',
                stuNum: '',
                dictId: '',
                period: dayjs().year(),
                whatClass:1
            },
            showModal:true,
            loading: false,
            rules: {
                realName: [{ required: true, message: "姓名不能为空" }],
                stuNum: [{ required: true, message: "学号不能为空" }],
                dictId: [{ required: true, message: "请选择专业" }]
            },
            dictList: [],
            isExist:true
        }
    },
    props:{
        updateObject:{
            type:Object,
            default:null
        }
    },
    created(){
        if(this.updateObject!=null){
            this.formData.realName = this.updateObject.realName;
            this.formData.stuNum = this.updateObject.stuNum;
            this.formData.dictId = this.updateObject.groupVO.profession;
            this.formData.period = this.updateObject.groupVO.period;
            this.formData.whatClass = this.updateObject.groupVO.whatClass;
        }
        this.getData();
    },
    methods:{
        async getData(){
        this.loading = true;
        try {
            let res = await post('system/dictionary/list/{dictCode}',null,{
                dictCode:'INSTITUTE'
            })
            this.dictList = res.data;
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
        },
      cancel(up=false){
          this.$emit('cancel',up);
      },
      ok(){
        // let groupList = this.$refs.tree.getCheckedNodes();
        this.$refs.updateStudent.validate((valid) => {
            if (valid) {
                // if(groupList.length<1){
                //     this.$Notice.destroy();
                //     this.$Notice.warning({
                //         title: '请至少选择一个用户分组',
                //         duration: 2
                //     });
                // }else{
                    let postObj = {
                        realName: this.formData.realName,
                        stuNum: this.formData.stuNum,
                        dictId: this.formData.dictId,
                        period: this.formData.period,
                        whatClass: this.formData.whatClass
                    }
                    this.isExistGroup(postObj);
                    if(this.isExist){
                        alert("进来了")
                        this.update(postObj)
                    }else{
                        this.cancel(true);
                    }
                     
                // }
            }
        })
      },
      async update(data){
        this.loading = true;
        try {
            let res = await post('/app/student/update/{id}',data,{
                id:this.updateObject.id
            })
            this.$Message.success("学生信息 "+data.realName+" 更新成功");
            this.cancel(true);
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
      },
      async isExistGroup(data){
        this.loading = true;      
        try {
            let res = await post('/app/group/exist',data)
            let bool = res.data;
            if(!bool){
                this.isExist = false;
                this.$Message.error("暂未有对应用户分组，请先添加");
                this.cancel(true);
            }
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
      }
  }
}
</script>

