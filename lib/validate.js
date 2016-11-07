'use strict';

module.exports.validate = function() {
  if (process.env.SLS_DEBUG) {
    this.serverless.cli.log('SlsBrowserify::validate');
  }

  if (!this.serverless.service.provider.runtime || -1 == this.serverless.service.provider.runtime.indexOf('nodejs')) {
    throw new this.serverless.classes.Error('Browserify plugin only works against nodejs runtimes');
  }

  if (!this.serverless.service.package || !this.serverless.service.package.individually) {
    throw new this.serverless.classes.Error('Browserify plugin only works when packaging functions individually. package.individually must be true in serverless.yml', 'skip');
  }
};
