module.exports = job;
job.Job = require('./lib/job');

function job(name, options) {
  return new job.Job(name, options);
}
