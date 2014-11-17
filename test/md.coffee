expect = require('indeed').expect
grunt = require 'grunt'
path = require 'path'
root = path.resolve(__dirname, '..')
parent = root + '/Gruntfile.js'
child = __dirname + '/Gruntfile.js'

describe 'md', ->
  afterEach (done) -> grunt.tasks ['clean'], { gruntfile: parent }, done
  When (done) -> grunt.tasks ['md:expandForm'], { gruntfile: child, base: root }, done
  Then -> 1
