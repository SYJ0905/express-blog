module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'prefer-destructuring': 'off',
    'no-alert': 'off',
  },
};
