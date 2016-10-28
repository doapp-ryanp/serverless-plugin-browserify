# Serverless Browserify Plugin

THIS PLUGIN IS NOT YET READY.

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

A [Serverless](https://serverless.com) v1.0 plugin that uses [Browserify](https://github.com/substack/node-browserify) to bundle your NodeJS Lambda functions.

Lambda's with less code start faster and run faster.  Lambda also has an account wide [deployment package size limit](http://docs.aws.amazon.com/lambda/latest/dg/limits.html).  Furthermore, [aws-sdk-js](https://github.com/aws/aws-sdk-js) now officially [supports browserify](https://github.com/aws/aws-sdk-js/issues/696).  I prefer Browserify over [webpack](https://webpack.github.io/) because I have found it supports more modules, optimizes better, and requires less configuration.   
## TODO

-  smart include/exclude
-  fig out a way to override default packaging so does not have to be done 2x
-  try to standardize deploy process, https://github.com/serverless/serverless/pull/2561 starts to address this but my gut is there needs to be some serious re-work in the core

With the example `package.json` and javascript code below, the default packaging for NodeJs lambdas in Serverless produces a zip file that is **11.3 MB**, because it blindly includes all of `node_modules` in the zip.

This plugin with 2 lines of configuration produces a zip file that is **400KB!**

```
  "dependencies": {
    "aws-sdk": "^2.6.12",
    "moment": "^2.15.2",
    "request": "^2.75.0",
    "rxjs": "^5.0.0-rc.1"
  },
```  

Lambda code: 

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
        exclude:
          - ./someBig.json  #browserify can't optimize json, will take long time to parse for nothing
      package:
        include:
          - ./someBig.json  #but we want the json file to be included in the resulting zip      
        exclude:
          - ./someBig.json  #this plugin will union browserify.exclude and this directive
```

## Usage

When this plugin is enabled, and `package.individually` is `true`, running `serverless deploy` and `serverless deploy -f <funcName>` will automatically browserify your node lambda code.

If you want to see output of bundled file or zip simply set `SLS_DEBUG`.  Ex (using [Fish Shell](https://fishshell.com)): `env SLS_DEBUG=true sls deploy function -v -f usersGet`

Also check out the [examples](./examples) directory

## FAQ

- **Why is UglifyJS not built-in?** No ES6 support.  [Issue](https://github.com/mishoo/UglifyJS2/issues/448) been open since 2014.
- **My code is not bundling correctly** The bundled code is always stored in a tmp dir on your computer.  Set `SLS_DEBUG=true` then re-run your command to output the directory.  Fish Shell ex: `env SLS_DEBUG=true sls browserify`  
