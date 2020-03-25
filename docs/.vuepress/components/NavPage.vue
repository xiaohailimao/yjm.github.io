
<template>
  <div class="wrapper">
    <div class="item-grid" v-for="(item, index) in data" :key="index">
      <h3>
        <b>{{item.title}}</b>
      </h3>
      <ul>
        <li v-for="(item, index) in item.linkData" :key="index">
          <a target="_blank" :href="item.url" :title="item.des" class="Link">
            <i :style="{backgroundImage:`url(${item.icon})`}"></i>
            <b>{{item.title}}</b>
            {{item.des}}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import links from "../link"
export default {
  name: "nav-page",
  data() {
    return {
      data: links
    };
  },
 
};
</script>
<style scoped>

.wrapper{
  min-width: 374px;
}
/*******************************************************************/
* {
  margin: 0px;
  padding: 0px;
  font-family: "PingFangSC-Regular", "Helvetica Neue", "Microsoft Yahei",
    "微软雅黑";
  word-wrap: break-word;
  table-layout: fixed;
  word-break: break-all;
  box-sizing: border-box;
  font-size: 12px;
}

img {
  border: 0px;
}

.lefter {
  float: left;
}
.righter {
  float: right;
}

ul li {
  list-style: none;
}

input,
select,
textarea {
  outline: 0;
}

h3 {
  margin: 0 12px;
  height: 56px;
  line-height: 54px;
  border-bottom: 2px rgba(0, 0, 0, 0.02) solid;
  color: #30333c;
}
h3 b {
  display: inline-block;
  border-bottom: 2px #30333c solid;
}
html,
body {
  height: 100%;

}
body {
  margin: 0 auto;
  background: #f1f2f9;
  color: #6b7386;
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

div {
  margin: auto;
}

/*******************************************************************/


.item-grid {
	margin-bottom:24px;
	max-width:1400px;
	background:#fff;
	border-radius:4px;
	padding:0 12px;
	overflow:hidden;
}
.item-grid ul {
	float:left;
	width:100%;
	padding-bottom:24px;
}
.item-grid ul li {
	position:relative;
	transition:.2s;
	float:left;
	width:calc(33.33% - 24px);
	width:-webkit-calc(25% - 24px);
	width:-moz-calc(25% - 24px);
	overflow:hidden;
	border-radius:4px;
	background:rgba(0,0,0,.02);
	margin:24px 12px 0 12px;
}
.item-grid ul li:hover {
	background:#F1F2F9;
}
.item-grid ul li:nth-of-type(12):after {
	border-bottom:2px #ddd solid;
}
.item-grid ul li a.Link {
	display:block;
	height:64px;
	line-height:18px;
	padding:14px 16px;
	color:#A1A7B7;
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
.item-grid ul li a.Link i {
	float:left;
	width:32px;
	height:32px;
	margin:2px 16px 0 0;
	border-radius:4px;
	background-position:center;
	background-repeat:no-repeat;
	background-size:32px;
	/* background-image:url("images/Icon-No-Link.png"); */
}
.item-grid ul li a.Link b {
	display:block;
	color:#30333C;
	transition:.2s;
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
.item-grid ul li a.Link:hover {
	color:#6B7386;
}
.item-grid ul li a.Link:hover b {
	color:#4588FF;
}
.item-grid ul li a.Link b u {
	display:none;
	text-decoration:none;
}
.item-grid ul li a.Link b u::after {
	display:inline-block;
	position:relative;
	top:-1px;
	color:#fff;
	background:#A1A7B7;
	padding:0 4px;
	border-radius:2px;
	transform:scale(.8);
	-webkit-transform:scale(.8);
	-moz-transform:scale(.8);
}
.item-grid ul li a.Link b u.EN::after {
	content:"EN";
}
.item-grid ul li a.Link b u.CN::after {
	content:"中文";
}
.item-grid ul li a.goto {
	transition:0s;
	position:absolute;
	display:inline-block;
	top:16px;
	right:8px;
	width:32px;
	height:32px;
	border-radius:4px;
	/* background:url("../../assets/img/Icon-Goto-Dark.png") center no-repeat #fafafa; */
	background-size:16px;
	box-shadow:0 0 8px 8px #fafafa;
}
.item-grid ul li:hover a.goto,.item-grid ul li a.goto:hover {
	/* background:url("../../assets/img/Icon-Goto-Dark.png") center no-repeat #F1F2F9; */
	background-size:16px;
	box-shadow:0 0 8px 8px #F1F2F9;
}
.item-grid ul li a.goto:hover {
	opacity:.8;
}
.item-grid ul li span.tags {
	display:none;
	margin:0 16px;
	float:left;
	width:calc(100% - 32px);
	width:-webkit-calc(100% - 32px);
	width:-moz-calc(100% - 32px);
	height:40px;
	line-height:40px;
	color:#A1A7B7;
	border-top:2px rgba(0,0,0,.02) solid;
}
.item-grid ul li span.tags a.a-tag {
	margin-right:8px;
	color:#A1A7B7;
}
.item-grid ul li span.tags a.a-tag:hover {
	color:#4588FF;
}

</style>
