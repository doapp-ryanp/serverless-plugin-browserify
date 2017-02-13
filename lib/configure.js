'use strict';

const xtend = require('xtend'),
      union = require('lodash.union');

module.exports = {
  /**
   * Compute the base configuration
   */
  globalConfig() {
    if (process.env.SLS_DEBUG) {
      this.serverless.cli.log('SlsBrowserify::globalConfig');
    }

    const globalCustom = (this.serverless.service.custom && this.serverless.service.custom.browserify) || {};

    if (globalCustom.disable) {
      throw new this.serverless.classes.Error('custom.browserify.disable is true in serverless.yml', 'skip');
    }

    let globalDefault = {  //Browserify plugin config
      disable: false, //Not an official option, used as internal option to skip browserify
      exclude: [],    //Not an option, but will use for setting browserify.exclude() if defined in yml
      ignore:  [],    //Not an option, but will use for setting browserify.ignore() if defined in yml

      basedir:          this.serverless.config.servicePath,
      entries:          [],
      standalone:       'lambda',
      browserField:     false,  // Setup for node app (copy logic of --node in bin/args.js)
      builtins:         false,
      commondir:        false,
      ignoreMissing:    true,  // Do not fail on missing optional dependencies
      detectGlobals:    true,  // We don't care if its slower, we want more mods to work
      insertGlobalVars: {      // Handle process https://github.com/substack/node-browserify/issues/1277
        //__filename: insertGlobals.lets.__filename,
        //__dirname: insertGlobals.lets.__dirname,
        process: function() {
        },
      },
      debug:            false,
    };

    //Merge in global config
    this.globalBrowserifyConfig = xtend(globalDefault, globalCustom);

    if (this.serverless.service.package) {
      //Merge together package.exclude and custom.browserify.exclude
      if (this.serverless.service.package.exclude && this.serverless.service.package.exclude.length) {
        this.globalBrowserifyConfig.exclude = union(this.serverless.service.package.exclude, this.globalBrowserifyConfig.exclude);
      }
      //Save service package.include
      if (this.serverless.service.package.include && this.serverless.service.package.include.length) {
          this.globalBrowserifyConfig.include = this.serverless.service.package.include;
      }
    }

    if (process.env.SLS_DEBUG) {
      console.log('computed globalBrowserifyConfig', this.globalBrowserifyConfig);
    }
  },

  /**
   * Merge the global base configuration with given lambda function contextual configuration
   *
   * @param {string} functionName
   * @returns {*}
   */
  getFunctionConfig(functionName) {
    const functionObject         = this.serverless.service.getFunction(functionName);
    let functionBrowserifyConfig = xtend(this.globalBrowserifyConfig, functionObject.browserify || {});

    if (functionBrowserifyConfig.disable) {
      throw new this.serverless.classes.Error('browserify.disable is true on this function in serverless.yml', 'skip');
    }

    if (process.env.SLS_DEBUG) {
      console.log(`functionObject for ${functionName}`, functionObject);
    }

    if (!functionBrowserifyConfig.entries.length) {
      const bundleEntryPt              = functionObject.handler.split('.')[0] + '.js';
      functionBrowserifyConfig.entries = [bundleEntryPt];
    }

    if (functionObject.package) {
      //Merge together functions.FUNCTION.package.exclude and browserify exclude
      if (functionObject.package.exclude && functionObject.package.exclude.length) {
        functionBrowserifyConfig.exclude = union(functionBrowserifyConfig.exclude, functionObject.package.exclude);
      }
      //Merge together service and function includes
      if (functionObject.package.include && functionObject.package.include.length) {
        functionBrowserifyConfig.include = union(functionBrowserifyConfig.include, functionObject.package.include);
      }
    }

    if (process.env.SLS_DEBUG) {
      console.log('computed function BrowserifyConfig', functionBrowserifyConfig);
    }

    return functionBrowserifyConfig;
  }
};
