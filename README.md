# vue-chat

> A  Vue.js project using quasar-framework

### 技术栈

**vue全家桶 + quasar-cli + socket.io + koa + mongoDB**

### 项目结构

```bash
|—— src              前端相关代码
|—— server           后端相关代码
...                  其他
|—— quasar.conf.js   quasar框架主要配置
```

### 说明

- 灵感来源于一个react课程，自己用 vue 和 quasar-cli  (一个非常丰富的UI组件库)重构了该项目。
- 这是一个求职和招聘人员的简单聊天的app应用。[演示地址](http://chat.haledeng.com)

### 安装和启动

```b
# 安装前端依赖和启动前端服务
yarn install && quasar dev

# 安装后端依赖和启动后端服务
cd server
yarn install && yarn serve

# 前端生产环境代码打包
quasar build
```

### 图片

![](http://p5j8134h3.bkt.clouddn.com/quasar-chat-show.png)





