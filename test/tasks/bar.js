var fs = require('fs-extra');

module.exports = function(grunt) {
  grunt.registerTask('bar', function() {
    fs.outputFileSync('./output/config.json', JSON.stringify(grunt.config.get('bar'), null, 2));
  });
};
