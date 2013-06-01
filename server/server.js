var fs = require('fs')
  , httpProxy = require('http-proxy');

if (fs.existsSync('../../yeswescore-server/server/conf.js')) {
  var Conf = require('../../yeswescore-server/server/conf.js');
  
  httpProxy.createServer(function (req, res, proxy) {
    console.log(req);
    proxy.proxyRequest(req, res, {
      host: Conf.get("proxy.http.targethost"),
      port: Conf.get("http.port")
    });
  }).listen(Conf.get("proxy.http.port"));
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