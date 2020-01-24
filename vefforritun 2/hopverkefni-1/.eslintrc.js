module.exports = {
  extends: 'airbnb-base',
  env: {
    node: true,
    mocha: true,
  },
  rules: {
    'no-await-in-loop': 0,
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'linebreak-style': 0,
  }
};
