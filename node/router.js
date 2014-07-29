// Add all modules
var url = require('url');

// parse the URL and make the appropriate controller call
exports.get = function (req, res) {
    req.requrl = url.parse(req.url, true);
    var path = req.requrl.pathname;
    if (path === '/') {
        require('./controllers/index').get(req, res);
    } else {
        require('./controllers/404').get(req, res);
    }
}

