expect = require('indeed').expect
cover = require 'cover-child-process'
cp = require 'child_process'
fs = require 'fs'
cheerio = require 'cheerio'

describe 'md', ->
  beforeEach -> @cp = new cover.ChildProcess(new cover.Blanket())
  afterEach (done) -> cp.spawn('grunt', ['clean']).on 'close', -> done()
  Given -> @spawn = (task) -> @cp.spawn('node', ['./node_modules/.bin/grunt', 'md:' + task], { stdio: 'inherit' })
  Given -> @read = (file, done) -> fs.readFile "./output/#{file}.html", (err, html) =>
    this[file] = cheerio.load html
    done()

  context 'expand file format', ->
    When (done) -> @spawn('expandForm').on 'close', -> done()
    And (done) -> fs.readdir './output/fixtures', (err, @fixtures) => done()
    And (done) -> fs.readdir './output/more-fixtures', (err, @moreFixtures) => done()
    Then ->
      expect.chain(@fixtures).to.deep.equal([ 'apple.html', 'banana.html' ])
        .And.also(@moreFixtures).to.deep.equal([ 'mango.html', 'pear.html' ]).test()

  context 'src/dest file format', ->
    When (done) -> @spawn('srcDestForm').on 'close', -> done()
    And (done) -> fs.readdir './output', (err, @files) => done()
    Then -> expect(@files).to.deep.equal [ 'apple.html', 'banana.html', 'mango.html', 'pear.html' ]

  context 'file obj file format', ->
    When (done) -> @spawn('fileObjForm').on 'close', -> done()
    And (done) -> fs.readdir './output/fixtures', (err, @fixtures) => done()
    And (done) -> fs.readdir './output/more-fixtures', (err, @moreFixtures) => done()
    Then ->
      expect.chain(@fixtures).to.deep.equal(['apple.html', 'banana.html'])
        .And.also(@moreFixtures).to.deep.equal(['mango.html', 'pear.html']).test()
      
  context 'no dest specified', ->
    When (done) -> @spawn('noDest').on 'close', -> done()
    Then -> expect(fs.existsSync('./output')).to.be.false()
    
  context 'with a wrapper', ->
    When (done) -> @spawn('withWrapper').on 'close', -> done()
    And (done) -> @read 'banana', done
    Then -> expect(@banana('.bar #banana').text()).to.equal 'Banana'

  context 'with a wrapper object', ->
    When (done) -> @spawn('withObjectWrapper').on 'close', -> done()
    And (done) -> @read 'banana', done
    And (done) -> @read 'apple', done
    Then ->
      expect.chain(@banana('.bar #banana').text()).to.equal('Banana')
        .And.also(@apple('#bar #apple').text()).to.equal('Apple')

  context 'with a wrapper object with only filenames', ->
    When (done) -> @spawn('withObjectWrapperFilenames').on 'close', -> done()
    And (done) -> @read 'banana', done
    And (done) -> @read 'apple', done
    Then ->
      expect.chain(@banana('.bar #banana').text()).to.equal('Banana')
        .And.also(@apple('#bar #apple').text()).to.equal('Apple')

  context 'with a wrapper object with a wildcard', ->
    When (done) -> @spawn('withObjectWrapperStar').on 'close', -> done()
    And (done) -> @read 'banana', done
    And (done) -> @read 'apple', done
    Then ->
      expect.chain(@banana('.bar #banana').text()).to.equal('Banana')
        .And.also(@apple('#bar #apple').text()).to.equal('Apple')

  context 'do not flatten structure', ->
    When (done) -> @spawn('withoutFlatten').on 'close', -> done()
    Then -> expect(fs.existsSync('./output/test/fixtures/apple.html')).to.be.true()

  context 'event', ->
    When (done) -> @spawn('withEvent').on 'close', -> done()
    And (done) -> fs.readFile './output/event.json', 'utf8', (err, json) =>
      @json = JSON.parse json
      done()
    Then ->
      expect.chain(@json.filename).to.equal('banana')
        .And.also(@json.dest).to.equal('output/banana.html').test()

  context 'config', ->
    When (done) -> @cp.spawn('node', ['./node_modules/.bin/grunt', 'md:withConfig', 'bar'], { stdio: 'inherit' }).on 'close', -> done()
    And (done) -> fs.readFile './output/config.json', 'utf8', (err, json) =>
      @json = JSON.parse json
      done()
    Then ->
      expect.chain(@json.banana.filename).to.equal('banana')
        .And.also(@json.apple.filename).to.equal('apple').test()

  context 'with marky mark options', ->
    When (done) -> @spawn('withMarkyMarkOptions').on 'close', -> done()
    And (done) -> @read 'banana', done
    Then -> expect(@banana('#not-banana').text()).to.equal 'Banana'
