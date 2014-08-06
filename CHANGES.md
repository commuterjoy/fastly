
- Service ID is passed on requiring the module.
- Many of the fastly methods are designed to be chained together, resulting in
  deeply nested callbacks. Promises offer a cleaner interface.
- Test suite needs to be more comprehensive.
- Using fastly.request() results in a lot of string interpolation, which is hard
  to read. I think all the API end points deserve their own API, Eg.

Instead of, 

    fastly.request('PUT', '/service/' + service + '/version/' + lastVersion + '/clone');

We can do this,

    fastly.cloneVersion(n); // returns a promise to clone the given VCL 

This also makes is easier to create convenience methods, 
    
    fastly.cloneLatestVersion(); 
    fastly.cloneActiveVersion();
    ...

