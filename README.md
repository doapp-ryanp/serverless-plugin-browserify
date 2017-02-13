# Serverless Browserify Plugin

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

A [Serverless](https://serverless.com) v1.0 plugin that uses [Browserify](https://github.com/substack/node-browserify) to bundle your NodeJS Lambda functions.

**Why?** Lambda's with smaller code start and run faster.  Lambda also has an account wide [deployment package size limit](http://docs.aws.amazon.com/lambda/latest/dg/limits.html).  

[aws-sdk-js](https://github.com/aws/aws-sdk-js) now officially [supports browserify](https://github.com/aws/aws-sdk-js/issues/696).  Read more about why this kicks ass [on my blog](https://rynop.wordpress.com/2016/11/01/aws-sdk-for-javascript-now-fully-componentized/).

With the example `package.json` and javascript code below, the default packaging for NodeJs lambdas in Serverless produces a zip file that is **11.3 MB**, because it blindly includes all of `node_modules` in the zip.

This plugin with 2 lines of configuration produces a zip file that is **400KB!**

```
...
  "dependencies": {
    "aws-sdk": "^2.6.12",
    "moment": "^2.15.2",
    "request": "^2.75.0",
    "rxjs": "^5.0.0-rc.1"
  },
...
```  

```javascript
const Rx      = require('rxjs/Rx');
const request = require('request');
...
```

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

For most use cases you should **NOT** need to do any configuration.  If you are a code ninja, read on.

The base config for browserify is read from the `custom.browserify` section of `serverless.yml`.  All [browserify options](https://github.com/substack/node-browserify#browserifyfiles--opts) are supported (most are auto configured by this plugin).  This plugin adds one special option `disable` which if `true` will bypass this plugin.

The base config can be over-ridden on a function by function basis.  Again `custom.browserify` is not required and should not even need to be defined in most cases.

```yaml
custom:
  browserify:
    #any option defined in https://github.com/substack/node-browserify#browserifyfiles--opts

functions:
    usersGet:
      name: ${self:provider.stage}-${self:service}-pageGet
      description: get user
      handler: users/handler.hello      
      browserify:
        noParse:
          - ./someBig.json  #browserify can't optimize json, will take long time to parse for nothing      
```

**Note:** `package.include` can be used with this plugin.  All other options can be handled by leveraging [browserify options](https://github.com/substack/node-browserify#browserifyfiles--opts) in your `serverless.yml` custom `browserify` section. 

## Usage

When this plugin is enabled, and `package.individually` is `true`, running `serverless deploy` and `serverless deploy -f <funcName>` will automatically browserify your node lambda code.

If you want to see output of bundled file or zip simply set `SLS_DEBUG`.  Ex (using [Fish Shell](https://fishshell.com)): `env SLS_DEBUG=true sls deploy function -v -f usersGet`

Also check out the [examples](./examples) directory

### Bundle only

Run `serverless browserify -f <functionName>`.  You can optionally dictate where the bundling output dir is by using the `-o` flag. Ex: `sls browserify -o /tmp/test -f pageUpdate`.

## FAQ

- **Should I use Webpack instead of this plugin?** I prefer Browserify over [webpack](https://webpack.github.io/) because I have found it supports more modules, optimizes better, and requires less configuration.
- **Why is UglifyJS not built-in?** No ES6 support.  [Issue](https://github.com/mishoo/UglifyJS2/issues/448) been open since 2014.
- **My code is not bundling correctly** The bundled code is always stored in a tmp dir on your computer.  Set `SLS_DEBUG=true` then re-run your command to output the directory.  Fish Shell ex: `env SLS_DEBUG=true sls browserify`  
