<template>
  <div class="demo-block">
    <button @click="show=true">显示弹框</button>
    <div class="container" v-if="show" @click="show=false">
      <div class="dialog">
        <div class="center">弹框站位内容</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"vertical-align",
  data(){
    return {
      show:false
    }
  }
}
</script>
<style  scoped>
.demo-block {
  height: 300px;
  position: relative;
}
.container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center; /* 水平居中对齐 */
  /*  
        1.x中心点位置在container的上边缘
        2.高度为100%宽度为0的伪元素和x中心点对齐
        3.css默认左上方排列对齐，x中心和伪元素一起下移半个容器高度，此时x中心点在容器的垂直中心线上
        4.这里借助伪元素创建了一个和外部容器一样高的宽度为 0 的 inline- block 元素。有种“幽灵空白节点”的感觉
    */
  font-size: 0;
  white-space: nowrap;
  overflow: auto;
}
.container::after {
  content: "";
  display: inline-block;
  height: 90%;
  vertical-align: middle; /* 垂直居中对齐 */
}
.dialog {
  display: inline-block;
  vertical-align: middle; /* 垂直居中对齐 */
  text-align: left;
  font-size: 14px;
  white-space: normal;
  background: #fff;
  border-radius: 6px;
}
.center {
  height: 100px;
  width: 200px;
  padding: 10px;
}
</style>