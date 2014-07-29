// node code to get the server up and running
// serving requests on port 8080
var server
        , httpIP = 'localhost'
        , httpPort = 8080
        , http = require('http')
        ;

// route all requests through router
var server = http.createServer(function(req, res) {
    require('./router').get(req, res);
});

server.listen(httpPort, httpIP);
console.log('listening to http://' + httpIP + ':' + httpPort);
