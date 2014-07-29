// Handle invalid controller calls
exports.get = function(req, res) {
    console.log('Invalid controller call with path: ' + req.requrl.pathname);
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write("The page you are looking for can not be found on this server.");
    res.end();
}