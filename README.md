# Serverless Browserify Plugin

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

A [Serverless](https://serverless.com) v1.0 plugin that uses [Browserify](https://github.com/substack/node-browserify) to bundle your NodeJS Lambda functions.

Lambda's with less code start faster and run faster.  Lambda also has an account wide [deployment package size limit](http://docs.aws.amazon.com/lambda/latest/dg/limits.html).  Furthermore, [aws-sdk-js](https://github.com/aws/aws-sdk-js) now officially [supports browserify](https://github.com/aws/aws-sdk-js/issues/696).  I prefer Browserify over [webpack](https://webpack.github.io/) because I have found it supports more modules, optimizes better, and requires less configuration.   

## Install

From your serverless project run:
```
npm install serverless-plugin-browserify --save-dev
```

Add the plugin to your `serverless.yml` file and set `package.individually` to `true`:

```yaml
plugins:
  - serverless-plugin-browserify
package:
  individually: true
```

`package.individually` is required because it makes configuration more straight forward, and if you are not packaging individually size is not a concern of yours in the 1st place.

## Configure

The base config for browserify is read from the `custom.browserify` section of `serverless.yml`.  Most [browserify options](https://github.com/substack/node-browserify#browserifyfiles--opts) are supported but only a few are needed for common use cases, most are handled for you.  This plugin adds one special option `disable` which if `true` will bypass this plugin.

The base config can be over-ridden on a function by function basis.  Again `custom.browserify` is not required and should not even need to be defined in most cases.

```yaml
custom:
  browserify:
  
```

## Usage

## FAQ

- **Why is UglifyJS not built-in?** No ES6 support.  [Issue](https://github.com/mishoo/UglifyJS2/issues/448) been open since 2014.
- **My code is not bundling correctly** The bundled code is always stored in a tmp dir on your computer.  Set `SLS_DEBUG=true` then re-run your command to output the directory.  Fish Shell ex: `env SLS_DEBUG=true sls browserify`  

## Thanks

To [serverless-webpack](https://github.com/elastic-coders/serverless-webpack) for a serverless plugin implementation reference 