module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-travis-matrix');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadTasks('tasks');
  grunt.loadTasks('test/tasks');

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
    open: {
      coverage: {
        path: 'coverage/coverage.html'
      }
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
    //travisMatrix: {
      //v4: {
        //test: function() {
          //return /^v4/.test(process.version);
        //},
        //tasks: ['mochacov:lcov', 'exec:codeclimate']
      //}
    //},
    //exec: {
      //codeclimate: 'codeclimate-test-reporter < coverage/coverage.lcov'
    //},
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
        options: {
          flatten: true
        },
        src: ['test/**/*.md'],
        dest: 'output'
      },
      fileObjForm: {
        options: {
          flatten: true
        },
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
        files: {
          'output/banana.html': 'test/fixtures/banana.md'
        }
      },
      withObjectWrapper: {
        options: {
          wrapper: {
            'test/fixtures/banana.md': 'test/fixtures/wrapper.html',
            'test/fixtures/apple.md': 'test/fixtures/another-wrapper.html'
          },
          flatten: true
        },
        files: {
          'output': ['test/fixtures/**/*.md']
        }
      },
      withObjectWrapperFilenames: {
        options: {
          wrapper: {
            banana: 'test/fixtures/wrapper.html',
            apple: 'test/fixtures/another-wrapper.html'
          },
          flatten: true
        },
        files: {
          'output': ['test/fixtures/**/*.md']
        }
      },
      withObjectWrapperStar: {
        options: {
          wrapper: {
            banana: 'test/fixtures/wrapper.html',
            '*': 'test/fixtures/another-wrapper.html'
          },
          flatten: true
        },
        files: {
          'output': ['test/fixtures/**/*.md']
        }
      },
      withoutFlatten: {
        files: {
          'output': ['test/fixtures/**/*.md']
        }
      },
      withEvent: {
        options: {
          event: 'foo'
        },
        files: {
          'output/banana.html': 'test/fixtures/banana.md'
        }
      },
      withConfig: {
        options: {
          config: 'bar',
          flatten: true
        },
        files: {
          'output': ['test/fixtures/**/*.md']
        }
      },
      withMarkyMarkOptions: {
        options: {
          mm: {
            postCompile: function(html) {
              return html.replace('banana', 'not-banana');
            }
          }
        },
        files: {
          'output/banana.html': ['test/fixtures/banana.md']
        }
      }
    }
  });
  
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('default', ['jshint:all', 'clean', 'mocha']);
  grunt.registerTask('coverage', ['mochacov:html']);
  grunt.registerTask('ci', ['jshint:all', 'mocha']);
};
