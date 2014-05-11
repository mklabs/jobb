var debug  = require('debug')('job');

var _       = require('underscore');
var fs      = require('fs');
var path    = require('path');
var prop    = require('propo');
var read    = fs.readFileSync;
var exists  = fs.existsSync;
var builder = require('xmlbuilder');

module.exports = Job;

function Job(name, options) {
  this.options = options || {};
  this.name = name;
  if (!this.name) throw new Error('Job - Missing name');

  this.attributes = {};
  this.attributes.scripts = [];
}

// props
var props = 'description param json timer script file tap html downstream'.split(' ');
props.forEach(prop(Job.prototype, {
  strategy: 'attr'
}));

// Json config

Job.prototype.json = function _json(name, desc, data) {
  var json = this.attributes.json || (this.attributes.json = {});

  if (!arguments.length) return json;
  if (arguments.length === 1) return json[name];

  if (!data) {
    data = desc;
    desc = null;
  }

  if (!name) throw new Error('Job#json - Missing name');

  var o = json[name] || {};
  o.name = name;
  o.desc = desc || '';
  o.data = _.clone(data);
  o.data = _.clone(data);

  this.attributes.json[name] = o;

  return this;
};

// Params

Job.prototype.param = function _param(name, options) {
  var param = this.attributes.param || (this.attributes.param = {});

  if (!arguments.length) return param;
  if (arguments.length === 1) return param[name];

  if (!name) throw new Error('Job#param - Missing name');
  if (!options) throw new Error('Job#param - Missing options');

  var o = param[name] || {};
  o.name = name;
  o.description = options.description || '';
  o.value = options.value || '';

  debug('Set param %s', name, o);
  this.attributes.param[name] = o;

  return this;
};

Job.prototype.script = function _script() {
  var args = [].slice.call(arguments);
  debug('Script', args);
  this.attributes.scripts.push(args.join('\n') + '\n');
  return this;
};

Job.prototype.file = function file(filename) {
  var args = [].slice.call(arguments);
  if (!exists(filename)) throw new Error('Cannot load ' + filename);
  this.attributes.scripts.push(read(filename, 'utf8'));
  return this;
};

// TODOs props


Job.prototype.tap = function tap() {
  return this;
};

Job.prototype.html = function html() {
  return this;
};

Job.prototype.downstream = function downstream() {
  return this;
};

Job.prototype.inspect = function(indent) {
  indent = indent || 0;
  return JSON.stringify(this.attributes, null, indent);
};

// Outputs

Job.prototype.xml =
Job.prototype.jenkins = function _xml(indent) {
  var params = this.param() || {};

  var data = { project: {} };
  var project = data.project;

  project.description = this.description();

  var props = project.properties = {};
  props['hudson.model.ParametersDefinitionProperty'] = {
    parameterDefinitions: Object.keys(params).reduce(function(res, param) {
      res.push({
        'hudson.model.StringParameterDefinition': {
          name: param,
          description: params[param].description,
          defaultValue: params[param].value
        }
      });
      return res;
    }, [])
  };

  var timer = this.timer();

  if (timer) {
    project.triggers = {};
    project.triggers['hudson.triggers.TimerTrigger'] = {
      spec: this.timer()
    };
  }

  var scripts = this.attributes.scripts || [];
  var builders = scripts.map(function(script) {
    return {
      'hudson.tasks.Shell': {
        command: _.escape(script)
      }
    };
  });


  if (builders.length) project.builders = builders;

  // .ele('repo', {'type': 'git'}, 'git://github.com/oozcitak/xmlbuilder-js.git')
  // .end({ pretty: true});

  // var body = xml.end({ pretty: true });
  // var xml = builder.create();
  return builder.create(data).end({ pretty: true });
};
