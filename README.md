<div align="center"><h1 align="center">iDCOS Web Boilerplate</h1></div>
<div align="center">基于社区解决方案 <a href="https://github.com/react-boilerplate/react-boilerplate">react-boilerplate</a>，结合公司业务实际和开发习惯做了部分修改的通用前端工程脚手架</div>
<br />

<div align="center">
  <sub>Created by <a href="#">iDCOS FETeam</a>
</div>

## 特性
- 快捷生成模板
  - 可以通过 `npm run generate` 命令（后跟参数）来快速生成 components, containers, routes, selectors和sagas以及一些tests文件

- webpack
  - 将部分公用且不易变动的模块抽取为vendor.js文件

- Lint
  - 使用 `eslint-config-idcos` 由公司前端团队制定和维护，保障代码风格检查的统一性。

- ESNext
  - 支持ES最新语法特性，包括但不限于模板字符串、对象解构、箭头函数等。

- CSS Modules
  - 默认使用Less和模块化CSS，规避了全局选择器的命名冲突，便于高质量CSS代码的编写和维护。

- And-Design
  - 不再以`<script>`和`<link>`方式引入，使用官方推荐的按需加载的方式引入

## 新增
- Fetch层加入MD5加签逻辑，做防篡改使用。（可选）
- 增加生成健康检查JSON脚本（`npm run create:ver`）
- 增加ErrorBoundary，对外暴露为withEb的HOC，防止错误向上冒泡导致页面崩溃。
- 支持micro-frontend，目前使用的是蚂蚁提供的qiankun(基于single-spa)。

## 子应用相关
- 增加 bootstrap mount unmount 生命周期钩子，可按需求修改，或增加其他钩子
- 本工程 server 部分允许跨域，具体部署时需 Nginx 或其他工具配合修改
- 本工程路由改为 browserRouter ，具体部署时需配合 Nginx 或其他工具将请求重映射至 / 地址
- webpack base 部分增加 qiankun 所需 library jsonP publicPath 等配置
- 由于采用微前端架构，路由前缀及打包前缀都使用 package.json 中的 name 字段

## 开发向导

1.  确保机器已安装 Node>=8.15.1, npm>5。
2.  克隆模板工程到本地 `git clone git@gitlab.idcos.com:Common/idcos-web-boilerplate.git`。
3.  进入工程文件夹: `cd idcos-web-boilerplate`。
4.  执行 `npm i` 安装所需依赖。
5.  执行 `npm start` 来启动项目.

## 相关文档

- [**react-boilerplate**](https://github.com/react-boilerplate/react-boilerplate): A highly scalable, offline-first foundation with the best developer experience and a focus on performance and best practices.
- [**webpack**](https://webpack.js.org/): A static module bundler for modern JavaScript applications.
- [**ESLint**](https://eslint.org/): Find and fix problems in your JavaScript code.
- [**Ant Design**](https://ant.design/index-cn): 一套企业级UI设计语言和React组件库。
- [**Less**](http://lesscss.org/): It's CSS, with just a little more.
- [**Qiankun**](https://qiankun.umijs.org/): Probably the most complete micro-frontends solution you ever met 🧐.

## 贡献者

> [http://gitlab.idcos.com/Common/idcos-web-boilerplate/-/project_members](http://gitlab.idcos.com/Common/idcos-web-boilerplate/-/project_members)

## 变更日志
---

### Release/0.0.1
`2020-09-26`
- 模板项目初始化，配置antd，qiankun。

### Release/0.0.2
`2020-11-18`
- 更新部分npm包。
- 重新打包vendor文件。
- 去除无用的依赖。
- 更新`eslint-config-idcos`。
- 优化错误页面和404页面。
- 从`redux-injectors`包中导入`injectReducer`和`injectSaga`,删除原有的redux utils。
- 移除`image-webpack-loader`,因网络原因，该loader会导致npm install卡住。
