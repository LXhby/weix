// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  "extends": ["plugin:prettier/recommended"],
  // required to lint *.vue files
  plugins: [
    'html', 'prettier'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'no-multiple-empty-lines': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': 0,
    //空行最多不能超过100行
    "no-multiple-empty-lines": [0, { "max": 100 }],
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": 0,
    "no-multi-spaces": 1,//不能用多余的空格
  }
}
