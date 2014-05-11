
# jobb

API to generate CI job configuration (Jenkins for now)

> wip


# TOC
   - [Job](#job)
     - [XML](#job-xml)
<a name=""></a>

<a name="job"></a>
# Job
job().

```js
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
```

Job name required.

```js
try {
  Job();
} catch(e) {
  assert.equal(e.message, 'Job - Missing name');
  done();
}
```

job#json.

```js
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
```

job#param.

```js
var job = Job('name');
job.param('foo', {});
assert.deepEqual(job.param('foo'), {
  name: 'foo',
  description: '',
  value: ''
});
assert.ok(job.param('foo'));
```

job#script.

```js
var job = Job('name');
job.script('echo 1;', 'echo 2;', 'echo 3;')
assert.equal(job.attributes.scripts[0], 'echo 1;\necho 2;\necho 3;\n');
```

job#file.

```js
var job = Job('name');
var file = path.join(fixtures, 'file.sh');
job.file(file);
assert.equal(job.attributes.scripts[0], read(file, 'utf8'));
```

<a name="job-xml"></a>
## XML
Job#xml.

```js
var xml = example.xml();
console.error(xml);
write(path.join(fixtures, 'test.xml'), xml);
```

