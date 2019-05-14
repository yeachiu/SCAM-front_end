<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>学生管理</span>
      </p>
      <div>
        <template>
          <Row>
            <Col span="15">
              <Button type="info" @click="openAddOrUpModal(null)"><Icon type="md-add"></Icon>&nbsp;添加学生</Button>
              <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
              <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
              <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx" style="display: inline-block;">
                <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">导入文件</Button>
              </Upload>
            </Col>
            <Col span="9">
              <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                <Button slot="append" icon="ios-search"></Button>
              </Input>
            </Col>
          </Row>
          <Table  ref="table"  class="margin-bottom-10" :columns="columns" 
              :loading="setting.loading"  :border="setting.showBorder" :data="data.records"></Table>
            <Page :total="data.total" class="tr" @on-change="pageChange":current.sync="data.current" :page-size="data.size"
            @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
        </template>
      </div>
    </Card>
    <AddStudent v-if="addStudentModal"  @cancel="onAddStudentModalCancel"/>
    <UpdateStudent v-if="updateStudentModal" :updateObject="updateObject" @cancel="onUpdateStudentModalCancel"/>
    <Modal v-model="removeModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提示</span>
      </p>
      <div style="text-align:center">
        <p>此操作为不可逆操作，是否确认删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="setting.loading" @click="remove">确认删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import AddStudent from './components/add.vue'
  import UpdateStudent from './components/update.vue'
  import { post } from '@/libs/axios-cfg'
  import excel from '@/libs/excel'
  export default {
    data () {
      return {
        addStudentModal:false,
        updateStudentModal:false,
        updateObject:null,
        removeModal:false,
        setting:{
            loading:true,
            showBorder:true
        },
        search:{
            type:'realName',
            value:''
        },
        
        columns: [
          {title: '学号', key: 'stuNum',sortable: true},
          {title: '姓名', key: 'realName',sortable: true},
          {title: '学院', key: 'institute', sortable:true,
            render: (h, params) => {
              return h('p',{},params.row.groupVO.institute)
            }
          },
          {title: '专业', key: 'profession', sortable:true,
            render: (h, params) => {
              return h('p',{},params.row.groupVO.profession)
            }
          },
          {title: '年级', key: 'period', sortable:true,
            render: (h, params) => {
              return h('p',{},params.row.groupVO.period)
            }
          },
          {title: '班级', sortable:true,width: 260,key:'className',
            render: (h, params) => {
              return h('p',{},params.row.groupVO.className)
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 160,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'primary',size: 'small'},
                  style: {marginRight: '5px'},
                  on:{
                    click:()=>{
                      this.openAddOrUpModal(params.row)
                    }
                  }
                }, '修改信息'),
                h('Button', {
                  props: {type: 'error',size: 'small'},
                  on:{
                    click:()=>{
                      this.removeObject = {
                        obj:params.row,
                        index:params.index
                      }
                      this.removeModal = true;
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        data: {},
        dataFilter:{
            page:1,
            pageSize:10
        },
        removeObject:null,
        allMember:null,
        /** 上传EXCEL */
        uploadLoading: false,
        progressPercent: 0,
        showProgress: false,
        showRemoveFile: false,
        file: null,
        tableData: [],
        tableTitle: [],
        tableLoading: false
      }
    },
    components: {
      AddStudent,UpdateStudent
    },
    created(){
      this.getData();
    },
    methods:{
      pageChange(p){
        this.dataFilter.page = p;
        this.getData();
      },
      pageSizeChange(p){
        this.dataFilter.pageSize = p;
        this.getData();
      },
      async remove(){
        this.removeModal = false;
        if(this.removeObject==null){
          this.$Message.warning("删除对象为空，无法继续执行！");
          return false;
        }
        this.setting.loading = true;
        try {
          let res = await post('/app/student/remove/{id}',null,{
            id: this.removeObject.obj.id
          })
          this.$Message.success("删除成功");
          this.data.records.splice(this.removeObject.index,1);
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false;
      },
      async getData(){
        this.setting.loading = true;
        try {
          let res = await post('/app/student/list',{
            page:this.dataFilter.page,
            pageSize:this.dataFilter.pageSize
          })
          this.data = res.data;
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false;
      },
      async openAddOrUpModal(obj,type = 'update'){
        if(obj===null){
          this.addStudentModal = true;
        }else if(type==='update'){
          this.updateObject = obj;
          this.updateStudentModal = true;
        }
      },
      onAddStudentModalCancel(up=false){
        this.addStudentModal = false;
        if(up) this.getData()
      },
      onUpdateStudentModalCancel(up=false){
        this.updateStudentModal = false;
        if(up) this.getData()
      },
      exportData(type){
        let exportInfo = this.data.records;
        exportInfo.forEach(ele => {
          ele.stuNum = ele.stuNum + ' ';
          ele.institute = ele.groupVO.institute;
          ele.profession = ele.groupVO.profession;
          ele.period = ele.groupVO.period;
          ele.className = ele.groupVO.className;
        });
        if (type === 1) {
          this.$refs.table.exportCsv({
            filename: '学生信息-'+new Date().getTime(),
            columns: this.columns.filter((col, index) => index > 0 && index < this.columns.length-2),
            data: this.exportInfo
          });
        }
      },
      /** 上传EXCEL */
      initUpload () {
        this.file = null
        this.showProgress = false
        this.loadingProgress = 0
        this.tableData = []
        this.tableTitle = []
      },
      handleUploadFile () {
        this.initUpload()
      },
      handleRemove () {
        this.initUpload()
        this.$Message.info('上传的文件已删除！')
      },
      handleBeforeUpload (file) {
        alert("功能开发中……")
        // const fileExt = file.name.split('.').pop().toLocaleLowerCase()
        // if (fileExt === 'xlsx' || fileExt === 'xls') {
        //   this.readFile(file)
        //   this.file = file
        // } else {
        //   this.$Notice.warning({
        //     title: '文件类型错误',
        //     desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        //   })
        // }
        // return false
      },
      // 读取文件
      readFile (file) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadstart = e => {
          this.uploadLoading = true
          this.tableLoading = true
          this.showProgress = true
        }
        reader.onprogress = e => {
          this.progressPercent = Math.round(e.loaded / e.total * 100)
        }
        reader.onerror = e => {
          this.$Message.error('文件读取出错')
        }
        reader.onload = e => {
          this.$Message.info('文件读取成功')
          const data = e.target.result
          const { header, results } = excel.read(data, 'array')
          const tableTitle = header.map(item => { return { title: item, key: item } })
          this.tableData = results
          this.tableTitle = tableTitle
          this.uploadLoading = false
          this.tableLoading = false
          this.showRemoveFile = true
        }
      },
    }
  }
</script>
