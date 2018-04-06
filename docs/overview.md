# Overview

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
