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
    this.reporterOptions = opts.reporterOptions;

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
      path, statementMap, s
      // fnMap, f, branchMap, b
      // _coverageSchema, hash, contentHash
    } = node.getFileCoverage();
    const cw = this.contentWriter;

    const {
      absolutePaths = false,
      maxItems = 10
    } = this.reporterOptions;

    cw.write(
      `Path: ${
        absolutePaths ? path : `./${relative(process.cwd(), path)}`
      }\n\n`
    );

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

    /*
    cw.write('s: ' + JSON.stringify(s) + '\n\n');
    cw.write('statementMap: ' + JSON.stringify(statementMap) + '\n\n');

    cw.write('f: ' + JSON.stringify(f) + '\n\n');
    cw.write('fnMap: ' + JSON.stringify(fnMap) + '\n\n');

    cw.write('b: ' + JSON.stringify(b) + '\n\n');
    cw.write('branchMap: ' + JSON.stringify(branchMap) + '\n\n');
    */

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
