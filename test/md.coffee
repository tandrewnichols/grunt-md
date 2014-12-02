expect = require('indeed').expect
cover = require 'cover-child-process'
cp = require 'child_process'
fs = require 'fs'
cheerio = require 'cheerio'

describe 'md', ->
  beforeEach -> @cp = new cover.ChildProcess(new cover.Blanket())
  afterEach (done) -> cp.spawn('grunt', ['clean']).on 'close', -> done()
  Given -> @spawn = (task) -> @cp.spawn('node', ['./node_modules/.bin/grunt', 'md:' + task], { stdio: 'inherit' })

  context 'expand form', ->
    When (done) -> @spawn('expandForm').on 'close', -> done()
    And (done) -> fs.readdir './output/fixtures', (err, @fixtures) => done()
    And (done) -> fs.readdir './output/more-fixtures', (err, @moreFixtures) => done()
    Then ->
      expect.chain(@fixtures).to.deep.equal([ 'apple.html', 'banana.html' ])
        .And.also(@moreFixtures).to.deep.equal([ 'mango.html', 'pear.html' ]).test()

  context 'src/dest form', ->
    When (done) -> @spawn('srcDestForm').on 'close', -> done()
    And (done) -> fs.readdir './output', (err, @files) => done()
    Then -> expect(@files).to.deep.equal [ 'apple.html', 'banana.html', 'mango.html', 'pear.html' ]

      
