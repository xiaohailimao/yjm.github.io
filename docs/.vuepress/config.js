const lifecycleScript = process.env.npm_lifecycle_script
const BASE = lifecycleScript.includes('git') >0 ? "/yjm.github.io/" : "/"
module.exports = {
  "base": BASE,
  "title": "智宇星空",
  "description": "个人博客(笔记)",
  "dest": "blog",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "网址导航",
        "link": "/views/other/link",
        "icon": "reco-message"
      },
      {
        "text": "更多",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/Jameel01",
            "icon": "reco-github"
          },
          {
            "text": "时间线",
            "link": "/timeline/",
            "icon": "reco-date"
          },
        ]
      }
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "类别"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    // "friendLink": [
    //   {
    //     "title": "午后南杂",
    //     "desc": "Enjoy when you can, and endure when you must.",
    //     "email": "1156743527@qq.com",
    //     "link": "https://www.recoluan.com"
    //   },
    //   {
    //     "title": "vuepress-theme-reco",
    //     "desc": "A simple and beautiful vuepress Blog & Doc theme.",
    //     "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
    //     "link": "https://vuepress-theme-reco.recoluan.com"
    //   }
    // ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "sidebar": "auto",
    "lastUpdated": "Last Updated",
    "author": "智宇星空",
    "authorAvatar": "/avatar.jpg",
    "record": "京ICP备20009961号",
    "recordLink": "https://beian.miit.gov.cn/",
    "startYear": "2018"
  },
  "markdown": {
    "lineNumbers": true
  }
}