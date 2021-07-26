# idcos-antd-theme

## 包内容：
- antd定制主题less文件：包含default主题。（未来可能会有dark主题）
- 自定义样式：定制主题无法覆盖的样式，在`override.less`中集中体现。


## How to use

安装：`npm install idcos-antd-theme -D`


修改需要自定义主题工程的webpack配置：

```javascript
//配置less-loader

module.exports = {
    module: {
        rules: [
            {
                // Preprocess 3rd party .css files located in node_modules
                test: /\.(css|less)$/,
                include: /node_modules/,
                use: [
                  'style-loader',
                  'css-loader',
                  {
                    loader: 'less-loader',
                    options: {
                      javascriptEnabled: true,
                      modifyVars: {
                        'hack': `true; @import "~idcos-antd-theme/default/default.less";`
                      }
                    }
                  }
                ]
              }
        ]
    }
}
```

加入自定义样式：

```javascript
//app.js
import 'idcos-antd-theme/default/override.less';
```

## 修改发布

1. 定制主题文件只能由设计同学修改，开发人员不可修改。
2. 自定义样式只能由开发同学修改。
3. 开发和设计均可以发布该包进行版本迭代。(`npm publish`)

## 注意事项

1. 发布前记得修改版本号。
2. 发布前要填写[changeLog](./changeLog.md)。

