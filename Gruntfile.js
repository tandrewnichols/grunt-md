module.exports = function(grunt) {
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
        require: 'coffee-script/register',
        timeout: 5000
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
    },
    md: {
      expandForm: {
        files: [
          {
            expand: true,
            cwd: 'test/fixtures',
            src: '**/*.md',
            dest: 'output/fixtures'
          },
          {
            expand: true,
            cwd: 'test/more-fixtures',
            src: '**/*.md',
            dest: 'output/more-fixtures'
          }
        ]
      },
      srcDestForm: {
        src: ['test/**/*.md'],
        dest: 'output'
      },
      fileObjForm: {
        files: {
          'output/fixtures': ['test/fixtures/**/*.md'],
          'output/more-fixtures': ['test/more-fixtures/**/*.md']
        }
      },
      noDest: {
        src: ['test/**/*.md']
      },
      withWrapper: {
        options: {
          wrapper: 'test/fixtures/wrapper.html'
        },
        'test/banana.html': 'test/fixtures/banana.md'
      },
      withObjectWrapper: {
        options: {
          wrapper: {
            banana: 'test/fixtures/wrapper.html',
            apple: 'test/fixtures/another-wrapper.html'
          }
        },
        output: ['test/fixtures/**/*.md']
      },
      withoutFlatten: {
        options: {
          flatten: false
        },
        output: ['test/fixtures/**/*.md']
      },
      withEvent: {
        options: {
          event: 'foo'
        },
        'test/banana.html': 'test/fixtures/banana.md'
      },
      withConfig: {
        options: {
          config: 'foo'
        },
        output: ['test/fixtures/**/*.md']
      },
      withMarkyMarkOptions: {
        options: {
          mm: {
            postCompile: function(html) {
              return html.replace('banana', 'not-banana');
            }
          }
        },
        output: ['test/fixtures/**/*.md']
      }
    }
  });
  
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('default', ['jshint:all', 'clean', 'mocha']);
  grunt.registerTask('coverage', ['mochacov:html']);
  grunt.registerTask('ci', ['jshint:all', 'mocha', 'travis']);
};
