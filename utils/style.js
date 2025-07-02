/**
 * @file style.js
 * @module utils/style
 * @description
 * Utilities for styling console output in the Meld CLI.
 */

import clc from 'cli-color'

/**
 * Styles for console output in the Meld CLI.
 * @constant
 * @type {object}
 */
const style = {
  highlight: clc.cyan,
  err: clc.red.bold,
  errHighlight: clc.yellow.bold
}

export default style
