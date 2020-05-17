'use strict';

const reporter = require('../src/index.js');

describe('Line Visit Count Reporter', function () {
  it('API', function () {
    expect(reporter).to.be.a('function');
  });
});
