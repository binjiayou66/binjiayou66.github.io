<a id="top" name="top"></a>

# Vue  





# Vue Cli

1. http://nodejs.cn/download/ 安装Node
2. npm install vue-cli -g  安装vue-cli
3. vue init <template-name> <project-name> 用模板初始化工程

template-name：webpack、webpack-simple、browserify、browserify-simple、simple

2. cd project-name
3. npm install 安装依赖包
4. npm run dev
5. 【package.json】【main.js】【App.vue】【router/index.js】







# Vue Router

1. 使用Vue Router的步骤
   1. 创建路由js，若vue cli初始化时选择了vue router，初始化后可以在router文件夹下找到index.js，可以直接使用该文件
   2. 将路由js配置到main.js中，若vue cli初始化时选择了vue router，这一步已经配置好了
   3. 创建组件xxx.vue
   4. 使用组件，<router-link>定义路由链接、<router-view>标签将对应组件内容渲染到视图中
   5. 将新建组件的path和component配置到路由js中
2. main.js中有导入代码“import router from './router'”
   1. 此句代码为导入router路径下index名称的js文件的简写形式，如果导入非index名称的js文件，要将js文件名写全
   2. 在./router/index.js中exprot default并未给Router对象命名，解释为，export default是无命名的，导入时决定名称
3. 动态路由
4. 嵌套路由





# VueX





# axios





# muse-ui





# vue-awesome-swiper





# vue-progressbar





# amfe-flexible





# ES6/7





# 附录

1. Sublime Text 3开发配置 - 安装Package Control
   1. 下载Package Control [https://packagecontrol.io/installation#Manual](https://packagecontrol.io/installation)
   2. Sublime Text -> Preferences -> Browser Packages -> Installed Packages -> 新建Package Control文件夹 -> 将下载来的Package Control文件放在新建文件夹下
   3. 重启Sublime，输入install package可以安装插件
2. Sublime Text 3修改/新增快捷键
   1. Sublime Text -> Preferences -> Key Bindings-User
   2. 添加一句 { "keys": ["Command+`"], "command": "toggle_side_bar" }
3. 技术栈外链接
   1. [vue](https://cn.vuejs.org/v2/guide/)
   2. [vue-router](https://router.vuejs.org/zh-cn/essentials/getting-started.html)
   3. [vuex](https://vuex.vuejs.org/zh-cn/getting-started.html)
   4. [axios（请求库）](https://github.com/axios/axios)
   5. [muse-ui（移动端UI库）](http://www.muse-ui.org/#/install)
   6. [vue-awesome-swiper（轮播图）](https://github.com/surmon-china/vue-awesome-swiper)
   7. [vue-progressbar（加载进度条）](https://github.com/hilongjw/vue-progressbar)
   8. [amfe-flexible（淘宝适配库）](https://github.com/amfe/lib-flexible)
   9. [mockjs（数据模拟）](http://mockjs.com/)
   10. [Material Icons（google图标库）](http://google.github.io/material-design-icons/)
   11. [Stylus（css预处理器）](https://github.com/stylus/stylus)
   12. [ES6/7（JS语法）](https://github.com/lukehoban/es6features)
   13. [ESlint（JS语法规范）](https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md)
4. 实战项目
   1. [vue2-echo](https://github.com/uncleLian/vue2-echo)
   2. [vue2-news](https://github.com/uncleLian/vue2-news)
   3. [vue2-health](https://github.com/uncleLian/vue2-health)
   4. [vue2-native](https://github.com/uncleLian/vue2-native)



