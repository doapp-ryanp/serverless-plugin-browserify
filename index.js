'use strict';

const BbPromise = require('bluebird');

const validate  = require('./lib/validate'),
      configure = require('./lib/configure'),
      bundle    = require('./lib/bundle');

class SlsBrowserify {
  constructor(serverless, options) {
    this.serverless             = serverless;
    this.options                = options;
    this.globalBrowserifyConfig = {};

    Object.assign(
      this,
      validate,
      configure,
      bundle
    );

    this.commands = {
      browserify: {
        usage:           'Bundle NodeJS lambda with Browserify',
        lifecycleEvents: [
          'validate',
          'bundle',
        ],
        options:         {
          out:      {
            usage:    'Path to output directory',
            shortcut: 'o',
          },
          function: {
            usage:    'Name of the function',
            shortcut: 'f',
            required: true,
          },
        },
        commands:        {},
      },
    };

    this.hooks = {
      //Handle `sls deploy`
      'before:deploy:createDeploymentArtifacts': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.globalConfig)
        .then(() => {
          const functionNames = this.serverless.service.getAllFunctions();
          const bundleQueue   = functionNames.map(functionName => {
            return this.bundle(functionName);
          });

          return BbPromise.all(bundleQueue);
        })
        .catch(handleSkip),

      //Handle `sls deploy function`
      'before:deploy:function:packageFunction': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.globalConfig)
        .then(() => this.bundle(this.options.function))
        .catch(handleSkip),

      //Handle `sls browserify`
      'browserify:validate': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.globalConfig)
        .then(() => this.bundle(this.options.function))
        .catch(handleSkip),
    };
  }
}

function handleSkip(e) {
  if ('skip' != e.statusCode) { //User explicitly chose to skip this function's browserification
    throw e;
  } else {
    this.serverless.cli.log(`WARNING: ${e.message} SKIPPING bundling`);
  }
}

module.exports = SlsBrowserify;
