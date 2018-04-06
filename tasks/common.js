/*!
 * grunt-files  
 *
 * Copyright (c) 2018 Sergei Dorogin (http://about.dorogin.com)
 * Licensed under the MIT license.
 * https://github.com/evil-shrike/grunt-files/blob/master/LICENSE-MIT
 */

'use strict';

module.exports = function(grunt) {
  var isWindows = process.platform === 'win32';

  function unixifyPath (filepath) {
    if (isWindows) {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  }

  function detectDestType (dest) {
    if (grunt.util._.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  }

  return {
    unixifyPath: unixifyPath,
    detectDestType: detectDestType,
    isWindows: isWindows
  };
};