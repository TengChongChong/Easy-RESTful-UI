<h1 align="center">Easy-RESTful</h1>

<div align="center">

</div>

- 预览: http://rest.easy-frame.top (admin/admin123)
- 文档: http://rest-doc.easy-frame.top/
- 更新日志: https://gitee.com/tcc/easy-restful-ui/blob/master/CHANGELOG.md
- 常见问题: http://rest-doc.easy-frame.top/front-end/faq.html
  
- Ant Design Pro: https://pro.antdv.com/
- Ant Design of Vue: https://www.antdv.com/docs/vue/introduce-cn/

## 下载
从 码云 仓库中直接安装最新的代码

```
$ git clone --depth=1 https://gitee.com/tcc/easy-restful-ui.git Easy-RESTful-UI
```
## 目录结构
```
├── public
│   └── logo.png             # LOGO
|   └── index.html           # Vue 入口模板
├── src
│   ├── api                  # Api ajax 等
│   ├── assets               # 本地静态资源
│   ├── config               # 项目基础配置，包含路由，全局设置
│   ├── components           # 业务通用组件
│   ├── core                 # 项目引导, 全局配置初始化，依赖包引入等
│   ├── layouts              # 布局
│   ├── router               # Vue-Router
│   ├── store                # Vuex
│   ├── utils                # 工具库
│   ├── locales              # 国际化资源
│   ├── less                 # 样式
│   ├── views                # 业务页面入口和常用模板
│   ├── App.vue              # Vue 模板入口
│   └── main.js              # Vue 入口 JS
│   └── permission.js        # 路由守卫(路由权限控制)
├── README.md
└── package.json
```
## 配置
打开文件`/Easy-RESTful-UI/.env.development`，修改以下配置
```yaml
# 后端服务访问地址
VUE_APP_API_BASE_URL=http://127.0.0.1
# 代码生成 - 前端项目路径（填写前端项目所在磁盘路径）
VUE_APP_FRONT_END_PATH=/Users/tengchong/workspaces/webStorm/vue/Easy-RESTful-UI
```
## 安装依赖
```
$ yarn install
```

> 如果网络状况不佳，可以设置 `yarn` 的 `npm` 加载源，如 `yarn config set registry https://registry.npm.taobao.org`

## 启动服务
```
$ yarn run serve
```
当控制台显示一下信息表示启动成功
```
 DONE  Compiled successfully in 1493ms                                                                                                                                                                                                                12:28:20 PM


  App running at:
  - Local:   http://localhost:8000/ 
  - Network: http://192.168.1.68:8000/

```
使用浏览器访问 [http://localhost:8080/](http://localhost:8080/ 'http://localhost:8080/')


预览
----
基于 [Ant Design Pro](https://pro.antdv.com/) 开发的 [Easy-RESTful](https://gitee.com/tcc/easy-restful-ui)
![输入图片说明](https://images.gitee.com/uploads/images/2021/0203/092455_d0991366_74191.png "huaban (14).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0203/092614_9e1b482a_74191.png "huaban (15).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0104/235932_23e99e0f_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0203/092848_7b684c7b_74191.png "huaban (16).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0203/093132_b5dc34ae_74191.png "huaban (17).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0104/235959_31c1787c_74191.png "huaban (7).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0105/000006_8ec910ef_74191.png "huaban (8).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0105/000020_b7c97590_74191.png "huaban (9).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222406_06a3e3e3_74191.png "huaban (5).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222415_0bea9627_74191.png "huaban (4).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222424_fb7166a9_74191.png "huaban (3).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0121/222432_045e0c21_74191.png "huaban (2).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0126/230417_a1baf63e_74191.png "huaban (7).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0126/230439_ca2c7446_74191.png "huaban (8).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0126/230531_f9a4d620_74191.png "huaban (9).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0126/230538_d45be860_74191.png "huaban (10).png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0126/230545_442f15c2_74191.png "huaban (11).png")