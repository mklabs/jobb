
describe('Job', function() {

  var job = require('..');

  it('job()', function() {

    // Pattern:
    //
    // - required args, positional argument, in order of importance.
    // - optional: Uses last arg options Hash


    job('name')
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

      .file('./script.js')
      .file('./script.sh')

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

  });

});
