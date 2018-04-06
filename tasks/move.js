/*!
 * grunt-files  
 *
 * Copyright (c) 2018 Sergei Dorogin (http://about.dorogin.com)
 * Licensed under the MIT license.
 * https://github.com/evil-shrike/grunt-files/blob/master/LICENSE-MIT
 */

'use strict';

module.exports = function(grunt) {
  var common = require('./common')(grunt);
  var path = require('path');
  var fs = require('fs');
  var chalk = require('chalk');
  var rimraf = require('rimraf');

  function _moveFile (srcpath, destpath) {
    var nowrite = grunt.option('no-write');
    grunt.verbose.write((nowrite ? 'Not actually moving ' : 'Moving ') + srcpath + '...');
    // Create path, if necessary.
    grunt.file.mkdir(path.dirname(destpath));
    try {
      // Actually write file.
      if (!nowrite) {
        fs.renameSync(srcpath, destpath);
      }
      grunt.verbose.ok();
      return true;
    } catch (e) {
      grunt.verbose.error();
      throw grunt.util.error('Unable to move "' + srcpath + '" file to "' + destpath + '" (Error code: ' + e.code + ').', e);
    }
  }

  function moveFile (srcpath, destpath, options) {
    if (grunt.file.isDir(srcpath)) {
      // Move a directory, recursively.
      // Explicitly create new dest directory.
      grunt.file.mkdir(destpath);
      // Iterate over all sub-files/dirs, recursing.
      fs.readdirSync(srcpath).forEach(function(filepath) {
        _moveFile(path.join(srcpath, filepath), path.join(destpath, filepath));
      });
      // TODO:
      if (options.removeEmptySrcDirs) {
        var children = fs.readdirSync(srcpath);
        grunt.log.writeln(srcpath + ': ' + children);
        if (fs.readdirSync(srcpath).length === 0) {
          // remove empty src dir
          rimraf.sync(srcpath);
        }        
      }
    } else {
      // Move a single file.
      _moveFile(srcpath, destpath);
    }
  }

  grunt.registerMultiTask('move', 'Move/rename files.', function() {
    var options = this.options({
      forceOverwrite: false,
      skipExisting: false,
      filter: undefined,
      //TODO:
      removeEmptySrcDirs: false
    });

    var moveOptions = {
      removeEmptySrcDirs: options.removeEmptySrcDirs
    };

    var tally = {
      dirs: 0,
      files: 0,
      filesSkipped: 0
    };

    function shouldSkip (src, dest) {
      if (options.filter) {
        if (options.filter(src, dest)) {
          return true;
        }
      }
      return options.skipExisting && grunt.file.exists(dest);
    }

    this.files.forEach(function(filePair) {
      var isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(src) {
        src = common.unixifyPath(src);
        var dest = common.unixifyPath(filePair.dest);

        if (common.detectDestType(dest) === 'directory') {
          dest = isExpandedPair ? dest : path.join(dest, src);
        }

        if (grunt.file.isDir(src)) {
          grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
          grunt.file.mkdir(dest);

          tally.dirs++;
        } else {
          if (shouldSkip(src, dest)) {
            tally.filesSkipped++;
          } else {
            grunt.verbose.writeln('Moving ' + chalk.cyan(src) + ' -> ' + chalk.cyan(dest));

            if (options.forceOverwrite && grunt.file.exists(dest)) {
              grunt.file.delete(dest, {force: true});
            }

            moveFile(src, dest, moveOptions);

            tally.files++;
          }
        }
      });
    });

    if (tally.dirs) {
      grunt.log.write('Created ' + chalk.cyan(tally.dirs.toString()) + (tally.dirs === 1 ? ' directory' : ' directories'));
    }

    if (tally.files) {
      grunt.log.write((tally.dirs ? ', moved ' : 'Moved ') + chalk.cyan(tally.files.toString()) + (tally.files === 1 ? ' file' : ' files'));
    }
    if (tally.filesSkipped) {
      grunt.log.write( (tally.files || tally.files ? ', skipped ' : 'Skipped ') + chalk.cyan(tally.filesSkipped.toString()) + (tally.filesSkipped === 1 ? ' file' : ' files'));
    }

    grunt.log.writeln();
  });

};
