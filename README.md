# grunt-files v1.0.0

> Copy and move files and folders



## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-files --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-files');
```

### Overview

This plugin is a forked version of official [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy) plugin (with `copy` task).  

Original plugin was submitted by [Chris Talkington](http://christalkington.com/).
All credits for `copy` task go to him.

The plugin was forked at [v1.0.0](https://github.com/gruntjs/grunt-contrib-copy/releases/tag/v1.0.0) version of grunt-contrib-copy.

The plugin (`grunt-files`) contains two tasks: `copy` and `move`. `copy` is almost the same as in original plugin with the several additions:

* added option `forceOverwrite`
* added option `skipExisting`
* added option `removeSource`

See [Options](#copy-task) for details.

Addiionally plugin provides `move` task for moving files and folder with the same logic as `copy` task.

>Special note about the fork. I'm not fully sure that it was correct to fork and re-release original work as a new pluging. But it seems MIT license should allow it. Anyway if you think it is not correct, unfair or impolite please let me know - create an issue with your thought. I just needed a Grunt task for moving files with the same logic that is in grunt-contrib-copy. 

Other move/rename tasks out there:
* [grunt-move](https://www.npmjs.com/package/grunt-move) - it doesn't support glob pattens  
* [grunt-contrib-rename](https://www.npmjs.com/package/grunt-contrib-rename) (despite its name it's not an official plugin from Grunt Team - [bad naming](https://gruntjs.com/creating-plugins#naming-your-task)) - it doesn't support glob pattens



## Copy task
_Run this task with the `grunt copy` command._

Task copies files and folder.

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
### Options

#### process
Type: `Function(content, srcpath)`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

*`processContent` has been renamed to `process` and the option name will be removed in the future.*

#### noProcess
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

*`processContentExclude` has been renamed to `noProcess` and the option name will be removed in the future.*

#### encoding
Type: `String`  
Default: `grunt.file.defaultEncoding`

The file encoding to copy files with.

#### mode
Type: `Boolean` or `String`  
Default: `false`

Whether to copy or set the destination file and directory permissions.
Set to `true` to copy the existing file and directories permissions.
Or set to the mode, i.e.: `0644`, that copied files will be set to.

#### timestamp
Type: `Boolean`  
Default: `false`

Whether to preserve the timestamp attributes(`atime` and `mtime`) when copying files. Set to `true` to preserve files timestamp. But timestamp will *not* be preserved when the file contents or name are changed during copying.

###### forceOverwrite
Type: `Boolean`  
Default: `false`

Normally `copy` task will fail to overwrite readonly files. This option make it to overwrite existing readonly files.

###### skipExisting
Type: `Boolean`  
Default: `false`

If specified then existing files will not be overwritten (by default `copy` task overwrites existing files).

###### removeSource
Type: `Boolean`  
Default: `false`

If specified then copied files will be deleted (i.e. moved instead of copied effectively - see also `move` task). Note that skipped to copy files won't be deleted.

### Usage Examples

```js
copy: {
  main: {
    files: [
      // includes files within path
      {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

      // includes files within path and its sub-directories
      {expand: true, src: ['path/**'], dest: 'dest/'},

      // makes all src relative to cwd
      {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

      // flattens results to a single level
      {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
    ],
  },
},
```

This task supports all the file mapping format Grunt supports. Please read [Globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) and [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for additional details.

Here are some additional examples, given the following file tree:
```shell
$ tree -I node_modules
.
├── Gruntfile.js
└── src
    ├── a
    └── subdir
        └── b

2 directories, 3 files
```

**Copy a single file tree:**
```js
copy: {
  main: {
    expand: true,
    src: 'src/*',
    dest: 'dest/',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Created 1 directories, copied 1 files

Done, without errors.
$ tree -I node_modules
.
├── Gruntfile.js
├── dest
│   └── src
│       ├── a
│       └── subdir
└── src
    ├── a
    └── subdir
        └── b

5 directories, 4 files
```

**Copying without full path:**
```js
copy: {
  main: {
    expand: true,
    cwd: 'src',
    src: '**',
    dest: 'dest/',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Created 2 directories, copied 2 files

Done, without errors.
$ tree -I node_modules
.
├── Gruntfile.js
├── dest
│   ├── a
│   └── subdir
│       └── b
└── src
    ├── a
    └── subdir
        └── b

5 directories, 5 files
```

**Flattening the filepath output:**

```js
copy: {
  main: {
    expand: true,
    cwd: 'src/',
    src: '**',
    dest: 'dest/',
    flatten: true,
    filter: 'isFile',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Copied 2 files

Done, without errors.
$ tree -I node_modules
.
├── Gruntfile.js
├── dest
│   ├── a
│   └── b
└── src
    ├── a
    └── subdir
        └── b

3 directories, 5 files
```


**Copy and modify a file:**

To change the contents of a file as it is copied, set an `options.process` function as follows:

```js
copy: {
  main: {
    src: 'src/a',
    dest: 'src/a.bak',
    options: {
      process: function (content, srcpath) {
        return content.replace(/[sad ]/g, '_');
      },
    },
  },
},
```

Here all occurrences of the letters "s", "a" and "d", as well as all spaces, will be changed to underlines in "a.bak". Of course, you are not limited to just using regex replacements.

To process all files in a directory, the `process` function is used in exactly the same way.

NOTE: If `process` is not working, be aware it was called `processContent` in v0.4.1 and earlier.


##### Troubleshooting

By default, if a file or directory is not found it is quietly ignored. If the file should exist, and non-existence generates an error, then add `nonull:true`. For instance, this Gruntfile.js entry:

```js
copy: {
  main: {
    nonull: true,
    src: 'not-there',
    dest: 'create-me',
  },
},
```

gives this output:

```shell
$ grunt copy
Running "copy:main" (copy) task
Warning: Unable to read "not-there" file (Error code: ENOENT). Use --force to continue.

Aborted due to warnings.
```



## Move task
_Run this task with the `grunt move` command._

Task moves files and folder.

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
### Options

###### forceOverwrite
Type: `Boolean`  
Default: `false`

Normally `move` task will fail to overwrite readonly files. This option make it to overwrite existing readonly files.

###### skipExisting
Type: `Boolean`  
Default: `false`

If specified then existing files will not be overwritten (by default `move` task overwrites existing files).



## Release History

 * 2018-04-06   v1.0.0   forked grunt-contrib-copy [object Object] Create move task

---

Task submitted by [Sergei Dorogin](http://about.dorogin.com)

*This file was generated on Fri Apr 06 2018 22:13:07.*
