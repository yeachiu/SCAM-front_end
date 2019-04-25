<template>
  <div>
    <Table :columns="columns" :data="data">
      <template slot-scope="{ row, index }" slot="awardName">
        <Input type="text" v-model="editName" v-if="editIndex === index && row.awardName != '参与成功'" />
        <span v-else>{{ row.awardName }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="awardNum">
        <InputNumber :min="1" type="text" v-model="editNum"  v-if="editIndex === index && row.awardName != '参与成功'" />
        <span v-else>{{ ifBlank(row.awardNum) }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="awardScore">
        <InputNumber :min="0" :step="0.5" v-model="editScore" v-if="editIndex === index" />
        <span v-else>{{ row.awardScore }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
        <Button @click="handleSave(index)">保存</Button>
        <Button @click="cancel">取消</Button>
        </div>
        <div v-else>
        <ButtonGroup shape="circle">
          <Button @click="handleEdit(row, index)">操作</Button>
          <Button @click="handleRemove(index)" v-if="row.awardName != '参与成功'">删除</Button>
        </ButtonGroup>
        </div>
      </template>
    </Table>
    <Button icon="ios-add" type="dashed" @click="handleAdd" class="handleAdd">添加</Button>
    <Button type="primary" @click="handleUpdate" class="handleUpdate" v-if="isedit">提交更新</Button>
  </div> 
</template>
<script>
  import dayjs from 'dayjs'
  import { post } from '@/libs/axios-cfg'
  export default {
    data () {
      return {
        loading:false,
        columns: [
          {
            title: '奖项名',
            slot: 'awardName'
          },
          {
            title: '名额',
            slot: 'awardNum'
          },
          {
            title: '学分',
            slot: 'awardScore'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        defaultData: [
          {
            awardName: '参与成功',
            awardNum: '',
            awardScore: 1
          },
          {
            awardName: '一等奖',
            awardNum: 1,
            awardScore: 6
          },
          {
            awardName: '二等奖',
            awardNum: 2,
            awardScore: 4
          },
          {
            awardName: '三等奖',
            awardNum: 3,
            awardScore: 2
          },
        ],
        data:[],
        // 编辑
          editIndex: -1,  // 当前聚焦的输入框的行数
          editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
          editNum: '',  // 第二列输入框
          editScore: '',  // 第三列输入框
        isedit:false
      }
    },
    props: [
      'scoreData','actiId'
    ],
    created(){
      this.getData();
    },
    methods: {
      getData(){
        if(this.scoreData == null){  //新增活动
          this.data = this.defaultData;
        }else{
          this.data = this.scoreData;
          this.isedit = true;
        }
      },
      // //获取已存在活动的学分数据
      // async getScoreData(actiId){
      //   try {
      //     let res = post('app/activity/score/get/{id}',null,{
      //       id:actiId
      //     })
      //     this.data = res.data;
      //   } catch (error) {
      //     this.$throw(error);
      //   }
      // },

      // 添加条目
      handleAdd(){
        let addItem = {   //初始化数据
          awardName: '',
          awardNum: 1 ,
          awardScore: 1
        };
        this.data.push(addItem);
        let index = this.data.length - 1;
        this.handleEdit(addItem,index);
      },
      // 某行数据进入编辑状态
      handleEdit (row, index) {
        this.editName = row.awardName;
        this.editNum = row.awardNum;
        this.editScore = row.awardScore;
        this.editIndex = index;
      },
      // 保存
      handleSave (index) {
        if(this.editName == ''){
          this.$Message.error({
            content: '奖项名称不能为空喔！',
            duration: 3
          });
          return;
        }
        this.data[index].awardName = this.editName;
        this.data[index].awardNum = this.editNum;
        this.data[index].awardScore = this.editScore;
        this.editIndex = -1;  //  退出编辑
      },
      // 移除
      handleRemove(index) {
        this.data.splice(index,1);
      },
      //提交更新
      async handleUpdate(){
        console.log('要提交的数据：')
        console.info(this.data)
        // let data = JSON.stringify(this.data);
        this.loading = true;
        try {
          let res = await post('app/activity/score/update/{actiId}',this.data,{
            actiId:this.actiId
          })
          // 刷新数据
          this.$emit("refresh",this.actiId);
          this.$Message.success("活动的学分设置更新成功");
        } catch (error) {
          this.$throw(error);
        }
        this.loading = false;
      },
      // 取消
      cancel(){
        if(this.editName == ''){
          this.handleRemove(this.data.length - 1);
          return;
        }
        this.editIndex = -1;
      },
      // 空值处理
      ifBlank(num){
        if(num == ''){  return '--';   }
        return num;
      }
    },
    mounted(){
      // 事件监听，提交数据给父组件
      this.$on("submitScoreData",() => {
        console.log('score-setting-form提交数据:')
        console.info(this.data)
        this.$emit("submitData",this.data);
      })
      // 事件监听，监听父组件刷新方法
      this.$on("refreshData",() => {
        console.log('score-setting-form刷新数据:')
        // console.info(this.data)
        this.getData();
      })
    }
  }
</script>
<style>
  .handleAdd {
    width: 100%;
    border-radius: 0px;
  }
  .handleUpdate {
    width: 100%;
    margin-top: 20px;
  }
</style>
