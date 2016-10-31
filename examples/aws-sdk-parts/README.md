# AWS SDK Parts Example

As of AWS SDK `v2.6.0` their monolithic code design has been decoupled into [individually usable service classes](https://github.com/aws/aws-sdk-js/issues/696#issuecomment-257350083).

In addition to producing super small code sizes (with the help of browserify). This functionality will allow you to stay up to date with the most recent aws-sdk-js without paying a performance penalty.

## What does this example show me?

That you can use the `serverless-plugin-browserify` to produce super small node code, bringing in only the modlues you use WITHOUT tons of configuration.
 
This example also showcaes this plugin's integration with serverless `package.include/exclude`.

## Usage

from `aws-sdk-parts` dir run `npm install`.  Then run `env SLS_DEBUG=true sls browserify -f usersList`.  I use [FishShell](https://fishshell.com), change this cmd for however your shell sets env vars.

The output will tell you a directory where the bundled zip file was put.  Extract it and inspect.
