'use strict';

const {relative} = require('path');
const {ReportBase} = require('istanbul-lib-report');

/**
 * An nyc (Istanbul) reporter for highlighting visit counts of interest.
 * @extends ReportBase
 */
class LineVisitCountReport extends ReportBase {
  /**
   * @param {PlainObject} opts
   * @param {string} opts.file
   */
  constructor (opts) {
    super();
    let reporterOptions;
    if (typeof opts.reporterOptions === 'string') {
      opts.reporterOptions = [opts.reporterOptions];
    }
    if (Array.isArray(opts.reporterOptions)) {
      reporterOptions = {};
      opts.reporterOptions.forEach((optionString) => {
        const reporterOptionPairs = optionString.split(',');
        reporterOptionPairs.forEach((reporterOptionPair) => {
          const [optionKey, optionValue] = reporterOptionPair.split('=');
          reporterOptions[optionKey] = optionValue;
        });
      });
    } else {
      ({reporterOptions} = opts);
    }
    [
      ['absolutePaths', Boolean, false],
      ['aggregate', Boolean, true],
      ['maxItems', Number, 10],
      ['file', Array, []]
    ].forEach(([prop, type, deflt]) => {
      reporterOptions[prop] = {}.hasOwnProperty.call(reporterOptions, prop)
        ? (type === Array
          ? (Array.isArray(reporterOptions[prop])
            ? reporterOptions[prop]
            : reporterOptions[prop].split(','))
          : type(reporterOptions[prop]))
        : deflt;
    });

    this.reporterOptions = reporterOptions;

    this.file = opts.file || 'coverage-lvc.json';
  }

  /**
   * @param {Root} rOOt
   * @param {Context} context
   * @returns {void}
   */
  onStart (rOOt, context) {
    this.contentWriter = context.writer.writeFile(this.file);
  }

  /**
   * @param {Node} node
   * @returns {void}
   */
  onDetail (node) {
    const {
      path: absolutePath,
      statementMap, s
      // fnMap, f, branchMap, b
      // _coverageSchema, hash, contentHash
    } = node.getFileCoverage();

    /*
    cw.write('s: ' + JSON.stringify(s) + '\n\n');
    cw.write('statementMap: ' + JSON.stringify(statementMap) + '\n\n');

    cw.write('f: ' + JSON.stringify(f) + '\n\n');
    cw.write('fnMap: ' + JSON.stringify(fnMap) + '\n\n');

    cw.write('b: ' + JSON.stringify(b) + '\n\n');
    cw.write('branchMap: ' + JSON.stringify(branchMap) + '\n\n');
    */

    const cw = this.contentWriter;

    const {
      absolutePaths, maxItems, file, aggregate
    } = this.reporterOptions;

    const relativePath = relative(process.cwd(), absolutePath);

    if (file.length &&
      !file.includes(relativePath) &&
      !file.includes(absolutePath)
    ) {
      return;
    }

    if (!aggregate) {
      cw.write(
        `Path: ${
          absolutePaths ? absolutePath : `./${relativePath}`
        }\n\n`
      );
    }

    const sorted = Object.entries(s).sort(
      ([, visitCountA], [, visitCountB]) => {
        return visitCountA > visitCountB
          ? -1
          : visitCountA < visitCountB ? 1 : 0;
      }
    );

    sorted.slice(0, maxItems).forEach(([key, visitCount]) => {
      const {start, end} = statementMap[key];
      cw.write(`Visits: ${visitCount}; ${start.line}:${start.column}${
        start.line === end.line ? '' : `${start.line}`
      }-${end.column}\n\n`);
    });

    cw.println('');
  }

  /**
  * @returns {void}
  */
  onEnd () {
    const cw = this.contentWriter;
    cw.close();
  }
}

module.exports = LineVisitCountReport;
