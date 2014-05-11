var fs     = require('fs');
var path   = require('path');
var assert = require('assert');

var read = fs.readFileSync;
var write = fs.writeFileSync;

var fixtures = path.join(__dirname, 'fixtures');

describe('Job', function() {

  var Job = require('..');
  var example = Job('name', 'Jenkins');

  it('job()', function() {

    // Pattern:
    //
    // - required args, positional argument, in order of importance.
    // - optional: Uses last arg options Hash

    example
      .description('A optionnaly rendered to **markdown** description')

      // Params

      .param('PERF_URLS', { description: 'bla bla', value: 'default value' })

      // JSON param
      //
      // Serialize the object into a JSON string in param default value

      .json('JSON_CONFIG', 'Optional desc', { data: 'blah' })

      // Timer config
      //
      // Usually a string following cron syntax

      .timer('H/30 * * * *')

      // Scripts
      //
      // Simply join() back into a multiline script

      .script('echo Some script', 'echo Second line', 'echo etc')

      // Script from file
      //
      // Define a job script using a local file
      //
      // Scripts must set the proper shebang line

      .file('./test/fixtures/file.sh')

      // Publishers
      //
      // They take raw input from workspace, optionally format them, and
      // publish / generate the results somewhere.

      .tap('*.tap', {
        // All tap plugin possible options: failIfNoResults,
        // outputTapToConsole etc.
      })

      .html('reports/*.html', {
        // Options
      })

      // Trigger downstream
      //
      // Could be useful to set up a build pipeline, and chaining
      // related job together

      .downstream('mailer, statsd_send', {

        // Used to pass parameters to downstream jobs
        //
        // Consider this as a default ?
        properties: [
          'UPSTREAM_BUILD_ID=$BUILD_ID',
          'UPSTREAM_BUILD_NUMBER=$BUILD_NUMBER',
          'UPSTREAM_BUILD_URL=$BUILD_URL',
          'UPSTREAM_JOB_NAME=$JOB_NAME',
          'UPSTREAM_DATA=$WORKSPACE/build.json',
          'UPSTREAM_WORKSPACE=$WORKSPACE',
        ],

        condition: 'ALWAYS'
      });


    console.error(example.inspect(2));
  });


  it('Job name required', function(done) {
    try {
      Job();
    } catch(e) {
      assert.equal(e.message, 'Job - Missing name');
      done();
    }
  });

  it('job#json', function() {
    var job = Job('name');
    var data = { bar: 'foo' };
    var orig = { bar: 'foo' };
    job.json('foo', data);

    data.refcheck = true;

    assert.deepEqual(job.json('foo'), {
      name: 'foo',
      desc: '',
      data: orig
    });

    job.json('foo', 'desc', {});

    assert.deepEqual(job.json('foo'), {
      name: 'foo',
      desc: 'desc',
      data: {}
    });

    assert.ok(job.json('foo'));
  });

  it('job#param', function() {
    var job = Job('name');

    job.param('foo', {});

    assert.deepEqual(job.param('foo'), {
      name: 'foo',
      description: '',
      value: ''
    });

    assert.ok(job.param('foo'));
  });

  it('job#script', function() {
    var job = Job('name');
    job.script('echo 1;', 'echo 2;', 'echo 3;')
    assert.equal(job.attributes.scripts[0], 'echo 1;\necho 2;\necho 3;\n');
  });

  it('job#file', function() {
    var job = Job('name');
    var file = path.join(fixtures, 'file.sh');
    job.file(file);

    assert.equal(job.attributes.scripts[0], read(file, 'utf8'));
  });

  describe('XML', function() {

    it('Job#xml', function() {
      var xml = example.xml();
      console.error(xml);
      write(path.join(fixtures, 'test.xml'), xml);
    });
  });

});
