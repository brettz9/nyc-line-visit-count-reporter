'use strict';

module.exports = {
  extends: [
    'ash-nazg/sauron',
    'plugin:node/recommended-script'
  ],
  env: {
    browser: false,
    es6: true
  },
  settings: {
    polyfills: [
    ]
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  overrides: [{
    files: ['test/**'],
    env: {
      browser: false,
      node: true,
      mocha: true
    },
    globals: {
      expect: true
    },
    rules: {
      // Browser only
      'compat/compat': 0,
      'import/no-commonjs': 0,
      'no-console': 0,
      'node/exports-style': 0
    }
  }],
  rules: {
    // Browser only
    'compat/compat': 0,
    'import/no-commonjs': 0,
    'import/unambiguous': 0,

    // For modules, we shouldn't need `window`
    'no-restricted-globals': ['error', 'window'],

    'no-console': 0
  }
};
