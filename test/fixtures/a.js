'use strict';

/**
 * @param {Integer} num
 * @returns {Integer}
 */
function inc (num) {
  return num + 1;
}

module.exports = function () {
  let i = inc(5);
  i = inc(i);
  return i;
};
