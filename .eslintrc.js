module.exports = {
  // 解析器，识别es6 中的新语法，不然箭头函数，async等识别成错误
  parser: 'babel-eslint',
  // 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true
  },
  parserOptions: {
    // ECMAScript版本，7为ES7
    ecmaVersion: 7,
    sourceType: 'module'
    // 使用额外的语言特性
    // ecmaFeatures: {
    //   impliedStrict: true,
    //   jsx: true,
    //   experimentalObjectRestSpread: true
    // }
  },
  // eslint-plugin-react 识别react 中的语法
  // eslint-plugin-import 识别 import/export 语法
  plugins: [ 'eslint-plugin-react', 'eslint-plugin-import' ],
  // 脚本在执行期间访问的额外的全局变量
  globals: {
    go: true,
    CodeMirror: true,
    $: true
  },
  rules: {
    // eslint rules
    // Possible Errors
    // 这些规则与 JavaScript 代码中可能的错误或逻辑错误有关

    'no-cond-assign': 2,
    // 控制判读错误

    'no-console': 1,

    'no-constant-condition': 2,
    // 禁止在条件中使用常量表达式

    'no-debugger': 2,

    'no-dupe-args': 2,
    // 函数参数不能重复

    'no-dupe-keys': 2,
    // 创建对象字面量时不允许键重复

    'no-duplicate-case': 2,
    // switch中的case标签不能重复

    'no-empty': 2,
    // 块语句中的内容不能为空

    'no-ex-assign': 2,
    // 禁止给catch语句中的异常参数赋值

    'no-extra-semi': 2,

    'no-func-assign': 2,
    // 禁止重复的函数声明

    'no-invalid-regexp': 2,
    // 禁止错误的正则

    'no-irregular-whitespace': 2,
    // 不能有不规则的空格

    'no-regex-spaces': 2,
    // 禁止在正则表达式字面量中使用多个空格

    'no-template-curly-in-string': 2,
    // 模板字符串检查

    'no-unexpected-multiline': 2,
    // 避免令人误解的多行表达式

    'valid-typeof': 2,

    // Best Practices
    // 这些规则是关于最佳实践的，帮助你避免一些问题

    // complexity: [2, 10],
    // 回路复杂度

    curly: [ 2, 'all' ],
    // 控制大括号的写法

    'no-lone-blocks': 2,
    // 禁止 不必要的块嵌套

    'no-multi-spaces': 2,

    'default-case': 2,
    // switch 语句要有 default

    'dot-location': [ 2, 'property' ],
    // 对象访问符的位置，换行的时候在行首

    'no-caller': 2,
    // 禁止使用arguments.caller或arguments.callee

    'no-div-regex': 2,
    // 不能使用看起来像触发的正则表达式

    'no-empty-function': 2,
    // 不能有空函数

    'no-extend-native': 2,

    'no-fallthrough': 2,
    // 禁止switch穿透

    'no-floating-decimal': 2,
    // 禁止省略浮点数中的0

    'no-proto': 2,

    'no-redeclare': 2,
    // 禁止重复声明变量

    'no-return-assign': [ 2, 'except-parens' ],
    // return 语句中不能有赋值表达式,但是可以在括号

    'no-self-assign': 2,
    // 不能自己给自己赋值

    'no-self-compare': 2,
    // 不能自身跟自身比较

    'no-sequences': 2,
    // 禁止使用逗号运算符

    'no-shadow-restricted-names': 2,
    // 严格模式中规定的限制标识符不能作为声明时的变量名使用

    'no-undef': 2,

    // Stylistic Issues
    // 关于风格指南的，而且是非常主观

    'array-bracket-spacing': [
      2,
      'always',
      { objectsInArrays: false, arraysInArrays: false, singleValue: false }
    ],
    // 强制数组方括号中使用一致的空格

    'comma-spacing': [ 2, { before: false, after: true }],
    // 逗号前不适用逗号，逗号后使用空格

    'func-call-spacing': [ 2, 'never' ],
    // 禁止在函数标识符和其调用之间有空

    'block-spacing': 2,
    // 禁止或强制在代码块中开括号前和闭括号后有空格

    'lines-around-comment': [
      2,
      { beforeBlockComment: true, afterBlockComment: false }
    ],
    // 要求在注释周围有空行,注释前有空行，注释后没

    'object-curly-spacing': [
      2,
      'always',
      { arraysInObjects: true, objectsInObjects: true }
    ],
    // 强制在花括号中使用一致的空格

    'key-spacing': [ 2, { beforeColon: false, afterColon: true }],
    // 强制在对象字面量的属性中键和值之间使用一致的间距

    'keyword-spacing': [ 2, { before: true, after: true }],
    // 强制关键字前后有空格

    'space-before-blocks': [ 2, 'always' ],
    // 强制在块之前使用一致的空格

    'space-in-parens': [ 2, 'never' ],
    // 强制在圆括号内使用一致的空格

    'space-infix-ops': 2,
    // 要求操作符周围有空格

    'brace-style': [ 2, '1tbs' ],
    // 强制在代码块中使用一致的大括号风格

    semi: [ 2, 'always' ],
    // 要求或禁止使用分号

    'semi-spacing': [ 2, { before: false, after: true }],
    // 分号前后的空格,

    // 'no-mixed-spaces-and-tabs': 2,
    // 不允许空格和 tab 混合缩进

    'comma-dangle': [ 2, 'never' ],
    // 不允许对象中出现结尾逗号

    indent: [ 2, 2 ],
    // 缩进 2

    'no-whitespace-before-property': 2,
    // 禁止属性前有空白

    // es6

    'arrow-spacing': [ 2, { before: true, after: true }],
    // 控制箭头函数左右箭头的间距

    'no-this-before-super': 2,
    // 禁止在构造函数中，在调用 super() 之前使用 this 或 super

    'no-const-assign': 2,
    // 禁止修改 const 声明的变量

    'no-dupe-class-members': 2,
    // 禁止类成员中出现重复的名称

    // React 风格

    'jsx-quotes': [ 2, 'prefer-single' ],
    // 强制在 JSX 属性中一致地使用单引号

    'react/jsx-boolean-value': [ 2, 'always' ],

    'react/jsx-closing-bracket-location': [ 2, 'line-aligned' ],

    'react/jsx-curly-spacing': [ 2, 'never' ],

    'react/jsx-indent-props': [ 2, 2 ],

    'react/jsx-no-duplicate-props': [ 'error', { ignoreCase: true }],
    // 没有重复的属性

    'react/jsx-no-undef': 2,
    // 不能使用未定义的组件

    'react/jsx-pascal-case': 2,
    // 对于定义的组件命名，用驼峰

    'react/no-deprecated': 2,
    // 检测已丢弃的方法

    'react/no-unknown-property': 2,
    // 检测未知的属性

    'react/require-render-return': 2,
    // render 函数要有 return

    // 'react/jsx-space-before-closing': [2, 'always'],

    'react/jsx-equals-spacing': [ 2, 'never' ],
    // 属性等号前后不要有空格

    'react/jsx-indent': [ 2, 2 ],

    'react/no-render-return-value': 2,

    'react/style-prop-object': 2,
    // 检测style 属性格式

    'react/prefer-es6-class': [ 2, 'always' ]
  }
};
