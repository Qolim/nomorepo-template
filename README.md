# 使用 lerna + yarn workspace 搭建 nomorepo 工作流方案

## 项目场景

- 主项目 app，子项目 app-ui、app-util。app 依赖 app-ui,app-util，且开发 app 的过程中需要同时开发 app-ui 和 app-util。

- app 和 app-ui，app-util 开发中通过 npm link 连接，三个包有大量共同第三方依赖。

## 痛点

- 同时着手多个项目，需要在多个项目之间不断切换，维护和使用多套构建脚本，时间和精力消耗过大。

- npm link 操作不够友好，相同依赖需要额外进行打包配置，多个 node_modules 管理不方便，依赖版本的控制也较为繁琐。

## lerna

- Lerna 是一种工具针对使用 git 和 npm 管理多软件包代码仓库的工作流程进行优化。

- lerna 优化后的项目结构。

```

| ｜-packages
| ｜ ｜-app
| ｜ ｜ ｜-node_modules
| ｜ ｜ ｜-package.json
| ｜ ｜-app-ui
| ｜ ｜ ｜-node_modules
| ｜ ｜ ｜-package.json
| ｜ ｜-app-util
| ｜ ｜ ｜-node_modules
| ｜ ｜ ｜ package.json
| ｜-package.json
| ｜-lerna.json

```

- 通过 lerna 提供的命令可以全局对所有包进行管理（link、安装、构建、发布等待）。

#### lerna 虽然解决了全局管理多个包的问题，但是每个包仍然有自己的 node_modules。没有彻底解决多个包之间相同依赖管理的问题

## yarn workspace

- yarn 提供了一个 workspace 的方案，用于解决同个项目下多个包的 node_modules 问题。

- yarn workspace 优化后的项目结构。

```

  | ｜-node_modules
  | ｜-packages
  | ｜ ｜-app
  | ｜ ｜ ｜-node_modules // 并不会实际将依赖下载到该目录，所有依赖实际 link 到顶层 node_modules
  | ｜ ｜ ｜-package.json
  | ｜ ｜-app-ui
  | ｜ ｜ ｜-node_modules // 同上
  | ｜ ｜ ｜-package.json
  | ｜ ｜-app-util
  | ｜ ｜ ｜-node_modules // 同上
  | ｜ ｜ ｜ package.json
  | ｜-package.json
  | ｜-lerna.json

```

- yarn workspace 实际将所有依赖下载到顶层一个 node_modules 中，各个子项目通过连接到顶层 node_modules 实现全局共享 node_nodules。

## demo 实现

- 版本 lerna@4.0.0 yarn@1.22.10

- 创建全局结构

```javascript
  mkdir project && cd project && yarn init -y && yarn add lerna -D && lerna init
```

- 配置 package.json lerna.json

```javascript

  /** package.json */
  {
    "private": true,
    "workspaces": [
      "packages/*"
    ],
  }

  /** lerna.json */
  {
    "useWorkspaces": true,
    "npmClient": "yarn"
  }

```

- 创建项目

```javascript

  /** 创建目录 */
  cd packages && mkdir app && mkdir app-ui && mkdir app-util

  /** 初始化 */
  cd app && yarn init -y && cd ../app-ui && yarn init -y && cd ../app-util && yarn init -y

```

- 将 app-ui，app-util 加入 app 的依赖项

```javascript

  /** lerna一次只能安装一个包 */
  lerna add app-ui --scope=app && lerna add app-util --scope=app

```

- 各个项目所需第三方依赖在各自项目目录下使用 yarn 安装(或者使用 lerna 进行安装，详见文章底部跳转的 lerna 指令集页面)

- 全局依赖关联

```javascript

  /** 根目录 */
  yarn install

```

- 全局脚本配置

```javascript

  /** ./packages/app/package.sjon */
  {
    "scripts": {
      "build": "...",
      "dev":"..."
    },
  }

   /** ./packages/app-ui/package.sjon */
  {
    "scripts": {
      "build": "...",
    },
  }

   /** ./packages/app-util/package.sjon */
  {
    "scripts": {
      "build": "...",
    },
  }

  /** ./package.json */
  {
    "scripts": {
      "dev": "npm run build:app-ui & npm run build:app-util & lerna run --scope=app dev",
      "build:app": "npm run build:app-ui & npm run build:app-util & lerna run --scope=app build",
      "build:app-ui": "lerna run --scope=app-ui build",
      "build:app-util": "lerna run --scope=app-util build"
    },
  }

```

- 全局 git 管理、包版本(发布)管理待续。。。

## 相关文档

- [lerna 指令集](http://www.febeacon.com/lerna-docs-zh-cn/routes/commands/)

- [yarn workspace](https://classic.yarnpkg.com/en/docs/workspaces)
