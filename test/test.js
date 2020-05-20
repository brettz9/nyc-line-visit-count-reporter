'use strict';

const {readdir: rd} = require('fs');
const {promisify} = require('util');
const {join} = require('path');
const {execFile: ef} = require('child_process');

const rmfr = require('rmfr');

const reporter = require('../src/index.js');

const execFile = promisify(ef);
const readdir = promisify(rd);

const mochaBin = join(__dirname, '../node_modules/.bin/mocha');
const nycBin = join(__dirname, '../node_modules/.bin/nyc');

describe('Binary', function () {
  this.timeout(30000);
  it('should get results', async function () {
    const {stdout, stderr} = await execFile(nycBin, [
      '--cwd', 'test/fixtures',
      '--reporter-options', '"maxItems=12"',
      '--reporter',
      '../../../src/index',
      mochaBin,
      '--require', 'chai/register-expect',
      'test/fixtures/test.js'
    ]);
    expect(stderr).to.equal('');
    console.log(JSON.stringify(stdout));
    expect(stdout).to.contain(
      '1 passing'
    ).and.to.contain(
      'runs a function'
    ).and.to.contain(
      'Visits: 1; 12:10-16; path: ./test/fixtures/a.js'
    );
  });

  it('should get file results with `outputFile`', async function () {
    const coveragePath = join(__dirname, 'fixtures/coverage');
    await rmfr(coveragePath);
    const {stdout, stderr} = await execFile(nycBin, [
      '--cwd', 'test/fixtures',
      '--reporter-options', '"maxItems=12,outputFile=coverage-lvc.json"',
      '--reporter',
      '../../../src/index',
      mochaBin,
      '--require', 'chai/register-expect',
      'test/fixtures/test.js'
    ]);
    expect(stderr).to.equal('');
    console.log(JSON.stringify(stdout));
    expect(stdout).to.contain(
      '1 passing'
    ).and.to.contain(
      'runs a function'
    ).and.to.not.contain(
      'Visits'
    );
    const coverageContents = await readdir(coveragePath);
    expect(coverageContents).to.have.lengthOf.above(0);
    await rmfr(coveragePath);
  });

  it('should get results (with absolute paths)', async function () {
    const {stdout, stderr} = await execFile(nycBin, [
      '--cwd', 'test/fixtures',
      '--reporter-options', '"maxItems=12,absolutePaths=true"',
      '--reporter',
      '../../../src/index',
      mochaBin,
      '--require', 'chai/register-expect',
      'test/fixtures/test.js'
    ]);
    expect(stderr).to.equal('');
    console.log(JSON.stringify(stdout));
    expect(stdout).to.contain(
      '1 passing'
    ).and.to.contain(
      'runs a function'
    ).and.to.contain(
      'Visits: 1; 12:10-16; path: '
    ).and.to.contain(
      // Absolute not relative
      '/test/fixtures/a.js'
    ).and.to.not.contain(
      './test/fixtures/a.js'
    );
  });

  it(
    'should get results (relying on object-based `reporter-options`)',
    async function () {
      const {stdout, stderr} = await execFile(nycBin, [
        '--cwd', 'test/fixtures',
        // '--reporter-options', '"maxItems=12"',
        '--reporter',
        '../../../src/index',
        mochaBin,
        '--require', 'chai/register-expect',
        'test/fixtures/test.js'
      ]);
      expect(stderr).to.equal('');
      console.log(JSON.stringify(stdout));
      expect(stdout).to.contain(
        '1 passing'
      ).and.to.contain(
        'runs a function'
      ).and.to.contain(
        'Visits: 1; 12:10-16; path: ./test/fixtures/a.js'
      );
    }
  );

  it('should get results with specific file', async function () {
    const {stdout, stderr} = await execFile(nycBin, [
      '--cwd', 'test/fixtures',
      '--reporter-options', '"maxItems=12,file=test/fixtures/a.js"',
      '--reporter',
      '../../../src/index',
      mochaBin,
      '--require', 'chai/register-expect',
      'test/fixtures/test.js'
    ]);
    expect(stderr).to.equal('');
    console.log(JSON.stringify(stdout));
    expect(stdout).to.contain(
      '1 passing'
    ).and.to.contain(
      'runs a function'
    ).and.to.contain(
      'Visits: 1; 12:10-16; path: ./test/fixtures/a.js'
    );
  });

  it(
    'should get results but ignore file reporting for a bad `file`',
    async function () {
      const {stdout, stderr} = await execFile(nycBin, [
        '--cwd', 'test/fixtures',
        '--reporter-options',
        '"maxItems=12,file=test/fixtures/non-existing.js"',
        '--reporter',
        '../../../src/index',
        mochaBin,
        '--require', 'chai/register-expect',
        'test/fixtures/test.js'
      ]);
      expect(stderr).to.equal('');
      console.log(JSON.stringify(stdout));
      expect(stdout).to.contain(
        '1 passing'
      ).and.to.contain(
        'runs a function'
      ).and.to.not.contain(
        'Visits'
      );
    }
  );

  it('should get results with `noAggregate`', async function () {
    const {stdout, stderr} = await execFile(nycBin, [
      '--cwd', 'test/fixtures',
      '--reporter-options', '"maxItems=12,noAggregate=1"',
      '--reporter',
      '../../../src/index',
      mochaBin,
      '--require', 'chai/register-expect',
      'test/fixtures/test.js'
    ]);
    expect(stderr).to.equal('');
    console.log(JSON.stringify(stdout));
    expect(stdout).to.contain(
      '1 passing'
    ).and.to.contain(
      'runs a function'
    ).and.to.contain(
      'Path: ./test/fixtures/a.js'
    ).and.to.contain(
      'Visits: 1; 12:10-16'
    );
  });
});

describe('Line Visit Count Reporter', function () {
  it('API', function () {
    expect(reporter).to.be.a('function');
  });
});
