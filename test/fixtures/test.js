'use strict';

const a = require('./a.js');

describe('checks a file', function () {
  it('runs a function', function () {
    const result = a();
    expect(result).to.equal(5);
  });
});
