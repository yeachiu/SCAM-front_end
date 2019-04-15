<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>分组管理</span>
      </p>
      <div>
        <template>
          <Row>
              <Col span="15"  class="margin-bottom-10">
                  <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加分组</Button>
                  <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
              </Col>
          </Row> 
           <Table :columns="columns" :data="datas">
            <template slot-scope="{ row, index }" slot="className">
              <Input type="text" v-model="editName" v-if="editIndex === index" />
              <span v-else>{{ row.className }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <div v-if="editIndex === index">
                <Button @click="handleSave(index)" size="small">保存</Button>
                <Button @click="editIndex = -1" size="small">取消</Button>
              </div>
              <div v-else>
                <Button @click="handleEdit(row, index)" size="small">操作</Button>
                <Button @click="handleRemove(row,index)" size="small" type="error" >删除</Button>
              </div>
            </template>
          </Table>
        </template>
      </div>
    </Card>
    <Modal v-model="modal.show" :title="modal.title" @on-ok="addOK"
          :mask-closable="false">
      <Form :model="modal.data" :label-width="100" style="width:80%;">
        <FormItem label="名称">
          <Input v-model.trim="modal.data.name"></Input>
        </FormItem>
        <FormItem label="专业">
          <Select v-model="modal.data.dictId">
            <Option v-for="item in dictList" :value="item.id" :key="item.id">{{ item.dictName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="年级">
          <InputNumber :max="2900" :min="1900" v-model.trim="modal.data.period"></InputNumber>
        </FormItem>
        <FormItem label="班级数">
          <InputNumber :max="10" :min="1" v-model.trim="modal.data.classNum"></InputNumber>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="removeModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提示</span>
      </p>
      <div style="text-align:center">
        <p>此操作为不可逆操作，是否确认删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="remove">确认删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { post } from '@/libs/axios-cfg'
  import dayjs from 'dayjs'
  export default {
    data () {
      return {
        removeModal:false,
        setting:{
            loading:true,
            showBorder:true
        },
        datas: [],
        columns: [
            {
              title:'ID',
              key:'id'
            },
            {
              title:'分组名称',
              slot:'className',
              sortable: true
            },
            {
              title:'所属学院',
              key:'institute',
              sortable: true
            },
            {
              title:'专业',
              key:'profession',
              sortable: true
            },
            {
              title:'年级',
              key:'period',
              sortable: true
            },
            {
              title:'班级',
              key:'whatClass',
            },
            {
              title: '操作',
              slot: 'action',
              width: 150,
              align: 'center'
          }
        ],
        editIndex: -1,  // 当前聚焦的输入框的行数
        editName: '',
        dictList:[],
        modal:{
          show:false,
          title:'添加分组',
          data:{
            id:'',
            name:'',
            dictId:'',
            period: dayjs().year(),
            classNum:1
          }
        },
        removeObject:null
      }
    },
    created(){
        this.getData();
    },
    methods:{
        async getData(){
            this.setting.loading = true;
            try {
                let res1 = await post('/app/group/list')
                this.datas = res1.data;
                console.info(res1.data)
                let res2 = await post('system/dictionary/list/{dictCode}',null,{
                  dictCode:'INSTITUTE'
                })
                this.dictList = res2.data;
            } catch (error) {
                this.$throw(error)
            }
            this.setting.loading = false;
        },
        async addOK(){
            this.$Message.loading({
                content:"分组添加中...",
                duration:0
            })
            try {
                await post('/app/group/add',this.modal.data)
                this.getData(false)
                this.$Message.destroy()
                this.$Message.success({
                    content:"分组添加成功",
                    duration: 1.5
                });
            } catch (error) {
                this.$throw(error)
            }
        },
        async editOk(data){
          this.$Message.loading({
              content:"分组更新中...",
              duration:1.5
          })
          try {
              await post('/app/group/update/{id}',data,{
                  id:data.id
              })
              this.$Message.destroy()
              this.$Message.success({
                  content:"资源更新成功",
                  duration: 1.5
              });
          } catch (error) {
              this.$throw(error)
          }
        },
        async remove(){
            this.setting.loading = true;
            this.$Message.loading({
                content:"资源删除中...",
                duration:1.5
            })
            try {
                await post('/app/group/remove/{id}',null,{
                    id:this.removeObject
                })
                this.getData(false)
                this.$Message.destroy()
                this.$Message.success({
                    content:"资源删除成功",
                    duration: 1.5
                });
            } catch (error) {
                this.$throw(error)
            }
            this.setting.loading = false;
            this.removeModal = false;
        },
        openAddModal(parent=null){
            // this.modal.data = {
            //   id:'',
            //   name:'',
            //   dictName:'',
            //   period:dayjs().year(),
            //   whatClass:0
            // }
            console.log(this.modal.data)
            this.modal.show = true;
        },
        handleEdit (row, index) {
          this.editName = row.className;
          this.editIndex = index;
        },
        handleSave (index) {
          this.datas[index].className = this.editName;
          this.editIndex = -1;
          this.editOk(this.datas[index]);
        },
        handleRemove (row,index) {
          this.removeModal = true;
          this.removeObject = row.id;
        }
    }
  }
</script>
