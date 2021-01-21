[English](./README.md) | 简体中文

<h1 align="center">Easy-RESTful</h1>

<div align="center">

[![License](https://img.shields.io/npm/l/package.json.svg?style=flat)](https://github.com/vueComponent/ant-design-vue-pro/blob/master/LICENSE)
[![Release](https://img.shields.io/github/release/vueComponent/ant-design-vue-pro.svg?style=flat)](https://github.com/vueComponent/ant-design-vue-pro/releases/latest)
[![Travis branch](https://travis-ci.org/vueComponent/ant-design-vue-pro.svg?branch=master)](https://travis-ci.org/vueComponent/ant-design-vue-pro)

</div>

- Ant Design Pro: https://pro.antdv.com/
- Ant Design of Vue: https://www.antdv.com/docs/vue/introduce-cn/
  
- 预览: http://rest.easy-frame.top (admin/admin123)
- 文档: https://rest-doc.easy-frame.top
- 更新日志: https://gitee.com/tcc/easy-restful-ui/blob/master/CHANGELOG.md
- 常见问题: https://rest-doc.easy-frame.top/faq


Overview
----

基于 [Ant Design Pro](https://pro.antdv.com/) 开发的 [Easy-RESTful](https://gitee.com/tcc/easy-restful-ui)
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222316_2510773b_74191.png "huaban (6).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0104/235932_23e99e0f_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0104/235941_baf33ff4_74191.png "huaban (5).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0104/235950_b078c99e_74191.png "huaban (6).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0104/235959_31c1787c_74191.png "huaban (7).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0105/000006_8ec910ef_74191.png "huaban (8).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0105/000020_b7c97590_74191.png "huaban (9).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222406_06a3e3e3_74191.png "huaban (5).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222415_0bea9627_74191.png "huaban (4).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222424_fb7166a9_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222432_045e0c21_74191.png "huaban (2).png")

环境和依赖
----

- node
- yarn
- webpack
- eslint
- @vue/cli ~3
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Easy-RESTful Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现

> 请注意，我们强烈建议本项目使用 [Yarn](https://yarnpkg.com/) 包管理工具，这样可以与本项目演示站所加载完全相同的依赖版本 (yarn.lock) 。由于我们没有对依赖进行强制的版本控制，采用非 yarn 包管理进行引入时，可能由于 Pro 所依赖的库已经升级版本而引入了新版本所导致的问题。作者可能会由于时间问题无法及时排查而导致您采用本项目作为基项目而出现问题。



项目下载和运行
----

- 拉取项目代码
```bash
git clone https://gitee.com/tcc/easy-restful-ui.git
cd easy-restful-ui
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```



其他说明
----

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请确保你所使用的 vue-cli 是新版，并且已经学习 cli 官方文档使用教程

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码, `vue.config.js` 下的 `lintOnSave` 值改为 `false`

- 组件按需加载 `/src/main.js` L14 相关代码 `import './core/lazy_use'` / `import './core/use'`

## 浏览器兼容

Modern browsers and IE10.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| IE10, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |