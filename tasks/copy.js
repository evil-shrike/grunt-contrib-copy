/*!
 * grunt-files  
 * originally forked from grunt-contrib-copy (see README for details)
 *
 * Copyright (c) 2018 Sergei Dorogin (http://about.dorogin.com)
 * Credits for original `copy` task in grunt-contrib-copy:
 * Copyright (c) 2016 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/evil-shrike/grunt-files/blob/master/LICENSE-MIT
 */

'use strict';

module.exports = function(grunt) {
  var common = require('./common')(grunt);
  var path = require('path');
  var fs = require('fs');
  var chalk = require('chalk');
  var fileSyncCmp = require('file-sync-cmp');

  grunt.registerMultiTask('copy', 'Copy files.', function() {

    var options = this.options({
      encoding: grunt.file.defaultEncoding,
      timestamp: false,
      mode: false,
      forceOverwrite: false,
      skipExisting: false,
      removeSource: false
    });

    var copyOptions = {
      encoding: options.encoding,
      process: options.process,
      noProcess: options.noProcess
    };

    var syncTimestamp = function (src, dest) {
      var stat = fs.lstatSync(src);
      if (path.basename(src) !== path.basename(dest)) {
        return;
      }

      if (stat.isFile() && !fileSyncCmp.equalFiles(src, dest)) {
        return;
      }

      var fd = fs.openSync(dest, common.isWindows ? 'r+' : 'r');
      fs.futimesSync(fd, stat.atime, stat.mtime);
      fs.closeSync(fd);
    };

    var isExpandedPair;
    var dirs = {};
    var tally = {
      dirs: 0,
      files: 0,
      filesSkipped: 0
    };

    this.files.forEach(function(filePair) {
      isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(src) {
        src = common.unixifyPath(src);
        var dest = common.unixifyPath(filePair.dest);

        if (common.detectDestType(dest) === 'directory') {
          dest = isExpandedPair ? dest : path.join(dest, src);
        }

        if (grunt.file.isDir(src)) {
          grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
          grunt.file.mkdir(dest);
          if (options.mode !== false) {
            fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
          }

          if (options.timestamp) {
            dirs[dest] = src;
          }

          tally.dirs++;
        } else {
          if (options.skipExisting && grunt.file.exists(dest)) {
            tally.filesSkipped++;
          } else {
            grunt.verbose.writeln('Copying ' + chalk.cyan(src) + ' -> ' + chalk.cyan(dest));

            if (options.forceOverwrite && grunt.file.exists(dest)) {
              grunt.file.delete(dest, {force: true});
            }

            grunt.file.copy(src, dest, copyOptions);
            if (options.timestamp !== false) {
              syncTimestamp(src, dest);
            }
            if (options.mode !== false) {
              fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
            }
            tally.files++;

            if (options.removeSource) {
              grunt.file.delete(src);
            }
          }
        }
      });
    });

    if (options.timestamp) {
      Object.keys(dirs).sort(function (a, b) {
        return b.length - a.length;
      }).forEach(function (dest) {
        syncTimestamp(dirs[dest], dest);
      });
    }

    if (tally.dirs) {
      grunt.log.write('Created ' + chalk.cyan(tally.dirs.toString()) + (tally.dirs === 1 ? ' directory' : ' directories'));
    }

    if (tally.files) {
      grunt.log.write((tally.dirs ? ', copied ' : 'Copied ') + chalk.cyan(tally.files.toString()) + (tally.files === 1 ? ' file' : ' files'));
    }
    if (tally.filesSkipped) {
      grunt.log.write( (tally.files || tally.files ? ', skipped ' : 'Skipped ') + chalk.cyan(tally.filesSkipped.toString()) + (tally.filesSkipped === 1 ? ' file' : ' files'));
    }

    grunt.log.writeln();
  });

};
