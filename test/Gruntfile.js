module.exports = function(grunt) {
  console.log('child gruntfile');
  grunt.loadTasks('tasks');
  grunt.initConfig({
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
};
