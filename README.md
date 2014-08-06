A [Fastly](http://www.fastly.com) API client for Node.js

[![Build Status](https://travis-ci.org/commuterjoy/fastly.png?branch=master)](https://travis-ci.org/commuterjoy/fastly)

### Installation

This repo is a fork of the one currently installed in NPM, so you'll need to to install it from the tagged tarball,

```bash
npm install https://github.com/commuterjoy/fastly/archive/v2.1.0.tar.gz
```

### Basic Use

A simple use of the API looks like this,

```javascript
var fastly = require('fastly')('your-api-key')('your-service-id');

fastly
    .getVersions()
    .then(function (res) {
        var lastVersion = JSON.parse(res).pop().number;
        console.log('Latest version number is ' + lastVersion);
    })
    .catch(function (err) {
        throw new Error(err);
    })
```

The API is promise-based, so methods can be chained together like so,

```javascript
var fastly = require('fastly')('your-api-key')('your-service-id');
var Q = require('q');
var version;

fastly
    .getVersions()
    .then(function (res) {
        // extract a version number
        version = JSON.parse(res).pop().number;
        return fastly.request('GET', '/service/'+service+'/version/'+version+'/vcl');
    })
    .then(function (res) {
        return Q.all(
            JSON.parse(res).map(function (vcl) {
                return fastly.request('GET', '/service/'+service+'/version/'+version+'/vcl/'+vcl.name);
            })
        )
    })
    .then(function (res) {
        // the VCLs
    })
    .catch(function (err) {
        throw new Error(err);
    })
```


### Helper Methods

The fastly module also includes a few limited "helper" methods that make working with common API resources a bit simpler:

<table width="100%">
    <tr>
        <th width="20%">Method</td>
        <th width="75%">Example</td>
        <th width="5%"></td>
    </tr>
    <tr>
        <td>purge</td>
        <td><pre lang="javascript"><code>fastly.purge('host.com', '/index.html');</code></pre></td>
        <td><a href="http://www.fastly.com/docs/api#purge">Link</a></td>
    </tr>
    <tr>
        <td>purgeAll</td>
        <td><pre lang="javascript"><code>fastly.purgeAll('myServiceId');</code></pre></td>
        <td><a href="http://www.fastly.com/docs/api#purge">Link</a></td>
    </tr>
    <tr>
        <td>purgeKey</td>
        <td><pre lang="javascript"><code>fastly.purgeKey('myServiceId', 'key');</code></pre></td>
        <td><a href="http://www.fastly.com/docs/api#purge">Link</a></td>
    </tr>
    <tr>
        <td>stats</td>
        <td><pre lang="javascript"><code>fastly.stats('myServiceId');</code></pre></td>
        <td><a href="http://www.fastly.com/docs/api#stats">Link</a></td>
    </tr>
</table>

### Testing

```bash
npm test
```
