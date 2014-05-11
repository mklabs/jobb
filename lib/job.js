
var prop = require('propo');

module.exports = Job;

function Job() {}

// props
var props = 'description param json timer script file tap html downstream'.split(' ');
props.forEach(prop(Job.prototype));
