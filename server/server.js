var fs = require('fs')
  , httpProxy = require('http-proxy');

var http = require('http');
http.globalAgent.maxSockets = 1000;

if (fs.existsSync('../../yeswescore-api/server/conf.js')) {
  // configuration
  var Conf = require('../../yeswescore-api/server/conf.js');  
  httpProxy.createServer(function (req, res, proxy) {
    if (req.url.substr(0, 4) === "/v1/") {
      console.log('routing ' + req.url + ' to api.v1 (port:' + Conf.get("proxy.http.port.api.v1") + ')');
      // routing /v1/* => to v1 server
      proxy.proxyRequest(req, res, {
        host: Conf.get("proxy.http.targethost"),
        port: Conf.get("proxy.http.port.api.v1")
      });
    }
    else if (req.url.substr(0, 4) === "/v2/" || req.url.substr(0, 11) === '/bootstrap/') {
      console.log('routing ' + req.url + ' to api.v2 (port:' + Conf.get("proxy.http.port.api.default") +')');
      // routing /v2/* => to v2 server
      proxy.proxyRequest(req, res, {
        host: Conf.get("proxy.http.targethost"),
        port: Conf.get("proxy.http.port.api.default")
      });
    } else {
      console.log('routing ' + req.url + ' to local static server (port:' + Conf.get("www.http.static.port") +')');
      // routing /v2/* => to v2 server
      proxy.proxyRequest(req, res, {
        host: Conf.get("www.http.proxy.targethost") || "localhost",
        port: Conf.get("www.http.static.port") || "8080"
      });
    }
  }).listen(Conf.get("proxy.http.port"));
console.log('listening on port ' + Conf.get("proxy.http.port"));
} else {
  // spawning blank error page
  var http = require('http')
  http.createServer(function (req, res) {
    console.log('missing configuration file');
    // we do not give any info to the user
    res.writeHead(500);
    res.end('');
  }).listen(80);
}
