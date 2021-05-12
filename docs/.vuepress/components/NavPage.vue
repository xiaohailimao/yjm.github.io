
<template>
  <div class="wrapper">
    <el-row v-for="(item, index) in data" :key="index" :gutter="20" class="row">
      <h3>
        <b>{{ item.title }}</b>
      </h3>

      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        v-for="(item, index) in item.linkData"
        :key="index"
        class="col"
      >
        <a target="_blank" :href="item.url" :title="item.des" class="Link">
          <i :style="{ backgroundImage: `url(${item.icon})` }"></i>
          <b>{{ item.title }}</b>
          {{ item.des }}
        </a>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import links from "../link";
import Row from "element-ui/lib/row"
import Col from "element-ui/lib/col"
import "element-ui/lib/theme-chalk/row.css";
import "element-ui/lib/theme-chalk/col.css";
import Vue from "vue";
Vue.use(Row).use(Col);
export default {
  name: "nav-page",
  data() {
    return {
      data: links,
    };
  },
};
</script>
<style scoped>
.wrapper {
  font-size: 12px;
  font-family: "PingFangSC-Regular", "Helvetica Neue", "Microsoft Yahei",
    "微软雅黑";
  background: #f1f2f9;
  color: #6b7386;
}
/*******************************************************************/

img {
  border: 0px;
}

.lefter {
  float: left;
}
.righter {
  float: right;
}

h3 {
  margin: 0 12px 10px;
  line-height: 54px;
  border-bottom: 2px rgba(0, 0, 0, 0.02) solid;
  color: #30333c;
  font-size: 12px;
}
h3 b {
  display: inline-block;
  border-bottom: 2px #30333c solid;
}

a {
  color: #30333c;
  text-decoration: none;
  transition: 0.2s;
}
a:hover {
  color: #4588ff;
}
/*******************************************************************/

.col {
  margin-bottom: 10px;
}
.row {
  margin-bottom: 24px;
  background: #fff;
  border-radius: 4px;
}

.col .Link {
  overflow: hidden;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
}
.col .Link:hover {
  background: #f1f2f9;
}
.col a.Link {
  display: block;
  /* height: 64px; */
  line-height: 18px;
  padding: 14px 16px;
  color: #a1a7b7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col a.Link i {
  float: left;
  width: 32px;
  height: 32px;
  margin: 2px 16px 0 0;
  border-radius: 4px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 32px;
}
.col a.Link b {
  display: block;
  color: #30333c;
  transition: 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col a.Link:hover {
  color: #6b7386;
}
.col a.Link:hover b {
  color: #4588ff;
}
.col a.Link b u {
  display: none;
  text-decoration: none;
}
.col a.Link b u::after {
  display: inline-block;
  position: relative;
  top: -1px;
  color: #fff;
  background: #a1a7b7;
  padding: 0 4px;
  border-radius: 2px;
  transform: scale(0.8);
}

.col a.goto {
  transition: 0s;
  position: absolute;
  display: inline-block;
  top: 16px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-size: 16px;
  box-shadow: 0 0 8px 8px #fafafa;
}
.col:hover a.goto,
.col a.goto:hover {
  background-size: 16px;
  box-shadow: 0 0 8px 8px #f1f2f9;
}
.col a.goto:hover {
  opacity: 0.8;
}
.col span.tags {
  display: none;
  margin: 0 16px;
  float: left;
  width: calc(100% - 32px);
  height: 40px;
  line-height: 40px;
  color: #a1a7b7;
  border-top: 2px rgba(0, 0, 0, 0.02) solid;
}
.col span.tags a.a-tag {
  margin-right: 8px;
  color: #a1a7b7;
}
.col span.tags a.a-tag:hover {
  color: #4588ff;
}
</style>
