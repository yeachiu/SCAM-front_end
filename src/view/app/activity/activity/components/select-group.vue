<template>
  <div>
    <Modal v-model="show" title="活动开放对象"
            :mask-closable="false" :closable="false">
        <Tree ref="tree" :data="datas" show-checkbox></Tree>
        <div slot="footer">
            <Button type="default" :disabled="loading" @click="cancel">取消</Button>
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
      show:true,
      loading: false,
      datas: [],
      checkedNodes: []
    };
  },
  props: {
    aparId:String,
    checkeds:Array
  },
  created(){
    this.getData();
    let checkeds = this.checkeds;
    let datas = this.datas;
    alert(2333)
    console.info(datas);
    this.checkedNodeSync(checkeds,this.datas)
        
  },
  methods: {
    async getData(){
        this.loading = true;
        try {
          let res = await post('/app/group/list/format')
          this.datas = res.data;
        } catch (error) {
          this.$throw(error)
        }
        this.loading = false;
    },
    checkedNodeSync(checkeds,datas){
      if(datas.length < 1){
        this.getData();
      }
      if(checkeds!=null && checkeds.length>0){   
        datas.forEach(r => {
          alert(r.id) 
          checkeds.forEach(c => {
            alert(c.id) 
            if(c.id === r.id){
              alert(2333);
              r.checked = true;
            }
          });
          if(r.children!=null && r.children.length>0){
            this.checkedNodeSync(checkeds,r.children)
          }
        });        
      }
    },
    /**
     * @description 关闭Modal
     */
    cancel() {
      this.$emit("cancel", false);
    },
    /**
     * @description 确定按钮单击回调
     */
    ok() {
      let nodes = this.$refs.tree.getCheckedNodes();
      console.info(nodes);
      this.$emit('checkedNodes',nodes);
      this.$emit("cancel",false );
    }
  },
  mounted () {
    this.checkedNodes = this.$refs.tree.getCheckedNodes();
  },
};
</script>
