'use strict';

const {relative} = require('path');
const {ReportBase} = require('istanbul-lib-report');

const sorter = ([, visitCountA], [, visitCountB]) => {
  return visitCountA > visitCountB
    ? -1
    : visitCountA < visitCountB ? 1 : 0;
};

/**
* @typedef {PlainObject} ReporterOptions
* @property {string} file
* @property {boolean} absolutePaths
* @property {boolean} noAggregate
* @property {Integer} maxItems
* @property {string} outputFile
*/

/**
 * An nyc (Istanbul) reporter for highlighting visit counts of interest.
 * @extends ReportBase
 */
class LineVisitCountReport extends ReportBase {
  /**
   * @param {PlainObject} opts
   * @param {string} opts.file
   * @param {ReporterOptions[]|ReporterOptions} opts.reporterOptions
   */
  constructor (opts) {
    super();
    let reporterOptions;
    if (Array.isArray(opts.reporterOptions)) {
      reporterOptions = {};
      opts.reporterOptions.forEach((optionString) => {
        // This seems only necessary for our tests
        if (typeof optionString === 'object') {
          Object.entries(optionString).forEach(([optionKey, optionValue]) => {
            reporterOptions[optionKey] = optionValue;
          });
          return;
        }
        const reporterOptionPairs = optionString.split(',');
        reporterOptionPairs.forEach((reporterOptionPair) => {
          const [optionKey, optionValue] = reporterOptionPair.split('=');
          reporterOptions[optionKey] = optionValue;
        });
      });
    } else {
      ({reporterOptions = {}} = opts);
    }
    const stringToBoolean = (option) => {
      return option === 'true'
        ? true
        : option === 'false'
          ? false
          : Boolean(Number.parseInt(option));
    };
    [
      ['absolutePaths', stringToBoolean, false],
      ['noAggregate', stringToBoolean, false],
      ['maxItems', Number, 10],
      ['file', (option) => {
        return Array.isArray(option)
          ? option
          : option.split(';');
      }, []],
      ['outputFile', String, null]
    ].forEach(([prop, type, deflt]) => {
      reporterOptions[prop] = {}.hasOwnProperty.call(reporterOptions, prop)
        ? type(reporterOptions[prop])
        : deflt;
    });

    this.reporterOptions = reporterOptions;

    // Pass `"-"` or `null` to use console writer and can apparently only
    //  be relative to coverage directory
    this.file = opts.file ||
      // `opts.file` seems the programmatic way, but we want user control,
      //  so we add our own `outputFile`
      reporterOptions.outputFile || null; // 'coverage-lvc.json';

    if (!this.reporterOptions.noAggregate) {
      this.aggregatedResults = [];
    }
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
   * @param {Context} context
   * @returns {void}
   */
  /*
  onSummary (node, context) {
    // return this.onDetail(node, context);
  }
  */

  /**
   * @param {Node} node
   * @param {Context} context
   * @returns {void}
   */
  onDetail (node, context) {
    const {
      path: absolutePath,
      statementMap,
      s: statementKeyToCount
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
      absolutePaths, maxItems, file, noAggregate
    } = this.reporterOptions;

    const relativePath = relative(process.cwd(), absolutePath);

    if (file.length &&
      !file.includes(relativePath) &&
      !file.includes(absolutePath)
    ) {
      return;
    }

    const path = absolutePaths ? absolutePath : `./${relativePath}`;
    const statementKeyToCountEntries = Object.entries(statementKeyToCount);

    if (!noAggregate) {
      this.aggregatedResults.push(
        ...statementKeyToCountEntries.map(([key, visitCount]) => {
          return [key, visitCount, path, statementMap];
        })
      );
    } else {
      cw.write(`Path: ${path}\n\n`);
      statementKeyToCountEntries
        .sort(sorter)
        .slice(0, maxItems)
        .forEach(([key, visitCount]) => {
          const {start, end} = statementMap[key];
          cw.write(`Visits: ${visitCount}; ${start.line}:${start.column}${
            start.line === end.line ? '-' : `-${end.line}:`
          }${end.column}\n\n`);
        });
    }

    cw.println('');
  }

  /**
  * @returns {void}
  */
  onEnd () {
    const cw = this.contentWriter;
    const {maxItems} = this.reporterOptions;
    if (this.aggregatedResults) {
      this.aggregatedResults.sort(sorter).slice(0, maxItems).forEach(
        ([key, visitCount, path, statementMap]) => {
          const {start, end} = statementMap[key];
          cw.write(`Visits: ${visitCount}; ${start.line}:${start.column}${
            start.line === end.line ? '-' : `-${end.line}`
          }${end.column}; path: ${path}\n\n`);
        }
      );
    }
    cw.close();
  }
}

module.exports = LineVisitCountReport;
