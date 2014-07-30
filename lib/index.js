/**
 * Fastly API client.
 *
 * @package fastly
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var request = require('request');
var Q = require('q');

/**
 * Constructor
 */
function Fastly (apikey) {
    this.apikey = apikey || '';
}

/**
 * Adapter helper method.
 *
 * @param {string} Method
 * @param {string} URL
 * @param {params} Optional params to update.
 *
 * @return {Object}
 */
Fastly.prototype.request = function (method, url, params) {

    var deferred = Q.defer();
    var self = this;

    // Allow for optional update params.
    if (typeof params === 'function') {
        params = null;
    }

    // Construct headers
    var headers = { 'x-fastly-key': self.apikey };

    // HTTP request
    request({
        method: method,
        url: 'https://api.fastly.com' + url,
        headers: headers,
        form: params
    }, function (err, response, body) {
        
        if (err) return deferred.resolve(body); 
        if (response.statusCode < 200) return deferred.resolve(body);
        if (response.statusCode > 302) return deferred.resolve(body);

        if (response.headers['content-type'] === 'application/json') {
            try {
                body = JSON.parse(body);
            } catch (error) {
                return deferred.reject(error); 
            }
        }

        deferred.resolve(body);
    });
    
    return deferred.promise;
};

// -------------------------------------------------------

Fastly.prototype.purge = function (host, url) {
    return this.request('POST', '/purge/' + host + url);
};

Fastly.prototype.purgeAll = function (service) {
    var url = '/service/' + encodeURIComponent(service) + '/purge_all';
    return this.request('POST', url);
};

Fastly.prototype.purgeKey = function (service, key) {
    var url = '/service/' + encodeURIComponent(service) + '/purge/' + key;
    return this.request('POST', url);
};

Fastly.prototype.stats = function (service) {
    var url = '/service/' + encodeURIComponent(service) + '/stats/summary';
    return this.request('GET', url);
};

Fastly.prototype.stats = function (service) {
    var url = '/service/' + encodeURIComponent(service) + '/stats/summary';
    return this.request('GET', url);
};

Fastly.prototype.version = function (service) {
    var url = '/service/' + encodeURIComponent(service) + '/version';
    return this.request('GET', url);
};

// /service/service_id/version/number/clone
Fastly.prototype.versionClone = function (service, number) {
    var url = '/service/' + encodeURIComponent(service) + 
                '/version/' + number + '/clone';
    return this.request('PUT', url);
};


/**
 * Export
 */
module.exports = function (apikey) {
    return new Fastly(apikey);
};
