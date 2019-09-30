const themeConfig = require("./themeConfig")
module.exports = {
    base: "/yjm.github.io/",
    plugins:['@vuepress/back-to-top'],
    title: '智宇星空',
    description: '前端学习资料',
    dest:"./dist",
    head: [
        ['link', {
            rel: 'icon',
            href: 'favicon.ico'
        }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    themeConfig: themeConfig
}