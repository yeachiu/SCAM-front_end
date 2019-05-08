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
  },
  methods: {
    async getData(){
        this.loading = true;
        try {
          let res = await post('/app/group/list/format')
          this.datas = res.data;
          let checkeds = this.checkeds;
          this.checkedNodeSync(checkeds,this.datas)
        } catch (error) {
          this.$throw(error)
        }
        this.loading = false;
    },
    checkedNodeSync(checkeds,datas){
      if(datas.length < 1){
        this.getDatas
      }
      if(checkeds!=null && checkeds.length>0){   
        datas.forEach(r => {
          checkeds.forEach(c => {
            if(c.id === r.id){
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
      // console.log(nodes);
      // 去除半选节点
      let removeNodes = new Array();
      nodes.forEach(ele => {
        let isfull = true; 
        if(ele.children != null){
          // console.log("ele:" + ele.title)
          // ele.children.forEach(kid => {
          for(let kid of ele.children){
            if(kid.checked == false){
              // console.log("kid:" + kid.title)
              isfull = false;
            }
            break;
          }
        }
        if(!isfull){
          removeNodes.push(ele);
        }
      });
      // console.log(removeNodes);
      var set1 = new Set(removeNodes);
      var set2 = new Set(nodes);
      var subset = [];
      for (let item of set1) {
        if (!set2.has(item)) {
          subset.push(item);
        }
      }
      // console.info(subset);
      this.$emit('checkedNodes',nodes);
      this.$emit("cancel",false );
    }
  },
  mounted () {
    this.checkedNodes = this.$refs.tree.getCheckedNodes();
  },
};
</script>
