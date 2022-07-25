module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020
  },
  env: {
    browser: false,
    node: true,
    es6: true
  },
  plugins: ['prettier'],

  extends: ['plugin:node/recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': ['error']
  }
}
