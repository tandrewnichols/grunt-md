var async = require('async');
var mm = require('marky-mark');
var fs = require('fs-extra');
var _ = require('lodash');
var chalk = require('chalk');
var path = require('path');

module.exports = function(grunt) {
  grunt.registerMultiTask('md', 'Compile markdown files with yml view context into html', function() {
    var done = this.async();
    var options = this.options({
      mm: {}
    });

    async.reduce(this.files, [], function(memo, file, next) {
      var dest = file.dest ? file.dest.replace('.md', '.html') : '';
      mm.parseFiles(file.src, options.mm, function(err, markedObj) {
        if (err) {
          return next(err);
        }

        markedObj.forEach(function(obj, i) {
          if (dest && dest.split('/').pop().indexOf('.') === -1) {
            var thisDest = dest + '/' + (options.flatten ? obj.filename + '.html' : file.src[i].replace('.md', '.html'));
            obj.dest = path.normalize(thisDest);
          } else {
            obj.dest = dest;
          }
          obj.origPath = file.src[i];
        });

        next(null, memo.concat(markedObj));
      });
    }, function(err, markedObjs) {
      if (err) {
        return grunt.fail.fatal(err);
      }

      async.each(markedObjs, function(obj, next) {
        if (options.config) {
          grunt.config.set(options.config + '.' + obj.filename, obj);
        }

        if (options.event) {
          grunt.event.emit(options.event, obj);
        }

        if (obj.dest) {
          var html = obj.content;
          if (options.wrapper) {
            var wrapper = options.wrapper;
            if (_.isPlainObject(wrapper)) {
              wrapper = wrapper[obj.origPath] || wrapper[obj.filename] || wrapper['*'];
            } else if (typeof wrapper !== 'string') {
              grunt.log.warn('Wrapper type not supported: options.wrapper must be an object or a string.');
              next();
            }
            fs.readFile(wrapper, 'utf8', function(err, wrap) {
              html = _.template(wrap, _.extend({}, obj.meta, { content: html }));
              fs.outputFile(obj.dest, html, next);
            });
          } else {
            fs.outputFile(obj.dest, html, next);
          }
        } else {
          next();
        }
      }, function(err) {
        if (err) {
          grunt.fail.fatal(err);
        } else {
          grunt.log.writeln(chalk.green(markedObjs.length, 'files compiled'));
        }
        done();
      });
    });
  });
};
