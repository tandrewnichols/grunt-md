module.exports = function(grunt) {
  console.log('parent gruntfile');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-travis-matrix');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadTasks('tasks');

  grunt.initConfig({
    clean: {
      output: 'output'
    },
    jshint: {
      all: ['tasks/*.js'],
      options: {
        reporter: require('jshint-stylish'),
        eqeqeq: true,
        es3: true,
        indent: 2,
        newcap: true,
        quotmark: 'single'
      },
    },
    mochacov: {
      lcov: {
        options: {
          reporter: 'mocha-lcov-reporter',
          instrument: true,
          ui: 'mocha-given',
          require: 'coffee-script/register',
          output: 'coverage/coverage.lcov'
        },
        src: ['test/**/*.coffee'],
      },
      html: {
        options: {
          reporter: 'html-cov',
          ui: 'mocha-given',
          require: 'coffee-script/register',
          output: 'coverage/coverage.html'
        },
        src: ['test/**/*.coffee']
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        ui: 'mocha-given',
        require: 'coffee-script/register'
      },
      test: {
        src: ['test/**/*.coffee']
      }
    },
    travis: {
      options: {
        targets: [
          {
            test: '{{ version }}',
            when: 'v0.10',
            tasks: ['mochacov:lcov', 'matrix:v0.10']
          }
        ]
      }
    },
    matrix: {
      'v0.10': 'codeclimate < coverage/coverage.lcov'
    }
  });
  
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('default', ['jshint:all', 'clean', 'mocha']);
  grunt.registerTask('coverage', ['mochacov:html']);
  grunt.registerTask('ci', ['jshint:all', 'mocha', 'travis']);
};
