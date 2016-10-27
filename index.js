'use strict';

const BbPromise = require('bluebird');

const validate  = require('./lib/validate'),
      configure = require('./lib/configure'),
      // const compile = require('./lib/compile');
      cleanup   = require('./lib/cleanup');
// const run = require('./lib/run');
// const serve = require('./lib/serve');
// const packExternalModules = require('./lib/packExternalModules');

class SlsBrowserify {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options    = options;

    Object.assign(
      this,
      validate,
      configure
      // compile,
      // cleanup,
      // run,
      // serve,
      // packExternalModules
    );

    this.commands = {
      browserify: {
        usage:           'Bundle NodeJS lambda with Browserify',
        lifecycleEvents: [
          'validate',
          'compile',
        ],
        options:         {
          out: {
            usage:    'Path to output directory',
            shortcut: 'o',
          },
        },
        commands:        {
          // invoke: {
          //   usage:           'Run a function locally from the webpack output bundle',
          //   lifecycleEvents: [
          //     'invoke',
          //   ],
          //   options:         {
          //     function: {
          //       usage:    'Name of the function',
          //       shortcut: 'f',
          //       required: true,
          //     },
          //     path:     {
          //       usage:    'Path to JSON file holding input data',
          //       shortcut: 'p',
          //     },
          //   },
          // },
          // watch:  {
          //   usage:           'Run a function from the webpack output bundle every time the source is changed',
          //   lifecycleEvents: [
          //     'watch',
          //   ],
          //   options:         {
          //     function: {
          //       usage:    'Name of the function',
          //       shortcut: 'f',
          //       required: true,
          //     },
          //     path:     {
          //       usage:    'Path to JSON file holding input data',
          //       shortcut: 'p',
          //     },
          //   },
          // },
          // serve:  {
          //   usage:           'Simulate the API Gateway and serves lambdas locally',
          //   lifecycleEvents: [
          //     'serve',
          //   ],
          //   options:         {
          //     port: {
          //       usage:    'The local server port',
          //       shortcut: 'p',
          //     },
          //   },
          // },
        },
      },
    };

    this.hooks = {
      'before:deploy:createDeploymentArtifacts': () => BbPromise.bind(this)
        .then(this.validate),
      // .then(this.compile)
      // .then(this.packExternalModules),

      'before:deploy:function:deploy': () => BbPromise.bind(this)
        .then(this.validate),

      'after:deploy:createDeploymentArtifacts': () => BbPromise.bind(this)
        .then(this.cleanup),

      'browserify:validate': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.configure)
        .catch((e)=> {
          if ('skip' != e.statusCode) {
            throw e;
          } else {
            console.error(e.message, 'SKIPPING bundling');
          }
        }),
      //
      // 'webpack:compile': () => BbPromise.bind(this)
      //   .then(this.compile)
      //   .then(this.packExternalModules),
      //
      // 'webpack:invoke:invoke': () => BbPromise.bind(this)
      //   .then(this.validate)
      //   .then(this.compile)
      //   .then(this.run)
      //   .then(out => this.serverless.cli.consoleLog(out)),
      //
      // 'webpack:watch:watch': () => BbPromise.bind(this)
      //   .then(this.validate)
      //   .then(this.watch),
      //
      // 'webpack:serve:serve': () => BbPromise.bind(this)
      //   .then(this.validate)
      //   .then(this.serve),
    };
  }
}

module.exports = SlsBrowserify;
