<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>成员管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15">
                            <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加成员</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
                        </Col>
                        <Col span="9">
                            <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                                <Button slot="append" icon="ios-search"></Button>
                            </Input>
                        </Col>
                    </Row>
                    <Table ref="table"  class="margin-bottom-10"
                         :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="data"></Table>
                </template>
            </div>
        </Card>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="setting.loading" @click="removeMember">确认删除</Button>
            </div>
        </Modal>
        <AddMember v-if="addMemberModal" :aparId="aparId" @cancel="onModalCancel"/>
    </div>
</template>
<script>
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    import AddMember from './components/addMember.vue'
    export default {
        data () {
            return {
                aparId:'',
                addMemberModal:false,
                removeModal:false,
                setting:{
                    loading:true,
                    showBorder:true
                },
                search:{
                    type:'name',
                    value:''
                },
                columns: [
                    {
                      title: '学号', 
                      key: 'stuNum',
                      render:(h,params)=>{  
                        return h('span',params.row.member.stuNum)
                      },
                      sortable: true
                    },
                    {
                      title: '姓名', 
                      key: 'realName',
                      render:(h,params)=>{
                        return h('span',params.row.member.realName)
                      },
                      sortable: true
                    },
                    {
                      title: '班级',
                      key: 'className',
                      render:(h,params)=>{
                        return h('span',params.row.member.className)
                      },
                      sortable: true
                    },
                    {
                        title: '跟进的活动',
                        key: 'activities', 
                        width: 250,
                        render:(h,params)=>{
                            let activities = []
                            if(params.row.activities!=null && params.row.activities.length>0){
                                params.row.activities.forEach(element => {
                                    let acti = h('Tag',{
                                        props:{
                                            color:"blue"
                                        }
                                    },element.title)
                                    activities.push(acti)
                                });
                                return h('div',activities)
                            }
                            return h('span','空')
                        }
                    },
                    {
                        title: '加入日期',
                        key: 'createTime',
                        render:(h,params)=>{
                            return h('span',dayjs(params.row.createTime).format('YYYY年MM月DD日 HH:mm:ss'))
                        },
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            // if(params.row.isadmin == 1){
                                return h('div', [
                                    // h('Button', {
                                    //     props: {type: 'primary',size: 'small'},
                                    //     style: {marginRight: '5px'},
                                    //     on:{
                                    //         click:()=>{
                                    //             this.openAddModal(params.row.id)
                                    //         }
                                    //     }
                                    // }, '修改'),
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
                            // }
                        }
                    }
                ],
                data: [],
                dataFilter:{
                    page:1,
                    pageSize:10
                },
                removeObject:null,
                roles:null
            }
        },
        components:{
            AddMember
        },
        created(){
          this.aparId = this.$store.state.user.aparId;
          this.getData();
        },
        methods:{
             /**
             * @description 删除成员
             */
            async removeMember(){
                this.removeModal = false;
                if(this.removeObject==null){
                    this.$Message.warning("删除对象为空，无法继续执行！");
                    return false;
                }
                this.setting.loading = true;
                try {
                    let res = await post('/app/apartment/member/remove/{id}',null,{
                        id: this.removeObject.obj.id
                    })
                    this.$Message.success("删除成功");
                    this.data.splice(this.removeObject.index,1);
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            /**
             * @description 获取成员列表
             */
            async getData(){
                this.setting.loading = true;
                try {
                    let res = await post('/app/apartment/member/list/{id}',null,{
                        id:this.aparId
                    })
                    this.data = res.data;
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
             /**
             * @description 打开模态窗口
             * @param uid 成员ID
             * @param type 打开类型
             */
            openAddModal(uid){
              if(uid==null){
                this.addMemberModal = true;
              }              
            },
            /**
             * @description 关闭模态窗口
             * @param type 窗口类型
             * @param reload 是否重新加载数据
             */
            onModalCancel(reload = false){
                this.addMemberModal = false;
                if(reload) this.getData();
            },
            /**
             * @description 导出表格CSV
             */
            exportData(type){
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '成员数据-'+new Date().getTime(),
                        columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
                        data: this.data
                    });
                }
            }
        }
    }
</script>
