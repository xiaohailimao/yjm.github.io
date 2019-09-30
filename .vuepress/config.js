module.exports = {
    base: "/yjm.github.io/",
    plugins:['@vuepress/back-to-top'],
    title: '智宇星空',
    description: '前端学习资料',
    head: [
        ['link', {
            rel: 'icon',
            href: 'favicon.ico'
        }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    themeConfig: {
        // sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        lastUpdated: '更新时间', // 文档更新时间：每个文件git最后提交的时间
        nav: [
            {
                text: '前端笔记',
                link: "/notes/VUE/"
            },
            {
                text: "资源导航",
                link: "/doc/"
            },
            {
                text: 'GitHub',
                link: "https://github.com/Jameel01"
            }
        ],
        sidebar: [
            {
                title: "vue",
                collapsable: false,
                children: [
                    '/notes/VUE/',
                    '/notes/VUE/optimize',
                    '/notes/VUE/vuecli',
                    '/notes/VUE/VUEX/',
                ]
            },
            {
                title: "React",
                collapsable: false,
                children: [
                    '/notes/REACT/',
                    '/notes/REACT/render',
                    '/notes/REACT/ReactApi',
                    '/notes/REACT/Redux',
                    '/notes/REACT/Taro',

                ]
            },
            {
                title: "JS",
                collapsable: false,
                children: [
                    '/notes/JS/',
                    '/notes/JS/JavaScript-1',
                    '/notes/JS/es6',
                    '/notes/JS/es5',
                ]
            },
            {
                title: "TypeScript 常用语法",
                collapsable: false,
                children: [
                    '/notes/typescript/type',
                    '/notes/typescript/declare',
                    '/notes/typescript/interface',
                    '/notes/typescript/class',
                    '/notes/typescript/function',
                    '/notes/typescript/generic',
                    '/notes/typescript/inference',
                    '/notes/typescript/advance'
                ]
            },
           
            {
                title: "DOM",
                collapsable: false,
                children: [
                    '/notes/DOM/',

                ]
            },
            {
                title: "CSS",
                collapsable: false,
                children: [
                    '/notes/CSS/',
                    '/notes/CSS/shapes/',
                    '/notes/CSS/sass'
                ]
            },
            {
                title: "webpack",
                collapsable: false,
                children: [
                    '/notes/WEBPACK/',

                ]
            },
            {
                title: "IOS问题库",
                collapsable: false,
                children: [
                    '/notes/IOS/',

                ]
            },
            {
                title: "浏览器",
                collapsable: false,
                children: [
                    '/notes/window/',
                    '/notes/window/HTTP/',
                ]
            },
            {
                title: "RegExp",
                collapsable: false,
                children: [
                    '/notes/REGEXP/',

                ]
            },
            {
                title: "git",
                collapsable: false,
                children: [
                    '/notes/GIT/',
                    '/notes/GIT/gitflow',
                ]
            },
            {
                title: "其他",
                collapsable: false,
                children: [
                    '/notes/OTHER/',
                    '/notes/OTHER/NPM'
                ]
            },
            
        ]
    }
}