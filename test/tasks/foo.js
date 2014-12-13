var fs = require('fs-extra');

module.exports = function(grunt) {
  grunt.event.on('foo', function(obj) {
    fs.outputFile('./output/event.json', JSON.stringify(obj, null, 2));
  });
};
