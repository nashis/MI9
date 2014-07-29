exports.get = function(req, res) {
    // variable declaration
    var body = ''
            , respData = '{"error": "Could not decode request: JSON parsing failed"}'
            ;

    if (req.method === 'POST') {
        req.on('data', function(data) {
            body += data;

            // Abort connection for large data
            if (body.length > 1e6) {
                req.connection.destroy();
            }
        });

        req.on('end', function() {
            try {
                // variable declarartion
                var cnt = 0
                        , datum = ''
                        , payLoad = ''
                        , dataLen
                        , showData = ''
                        , showDatum = ''
                        , respDatum = []
                        ;

                // check for empty request body
                if (!body) {
                    return handleError('No data to parse.');
                }

                showData = JSON.parse(body)
                payLoad = showData.payload;
                // check for payload field
                if (!payLoad) {
                    return handleError('Payload field missing');
                }

                dataLen = payLoad.length;
                // check for payload not empty
                if (dataLen === 0) {
                    return handleError('Payload field present, but empty.');
                }

                // parse payload and populate response data based on criteria defined as
                // drm value true and episodeCnt more than 0
                for (; cnt < dataLen; cnt++) {
                    datum = payLoad[cnt];
                    if (datum.drm && datum.episodeCount) {
                        if ((datum.drm === true) && (parseInt(datum.episodeCount) > 0)) {
                            showDatum = {"image": "", "slug": "", "title": ""};
                            if (datum.image && datum.image.showImage) {
                                showDatum.image = datum.image.showImage;
                            }
                            if (datum.slug) {
                                showDatum.slug = datum.slug;
                            }
                            if (datum.title) {
                                showDatum.title = datum.title;
                            }

                            respDatum.push(showDatum);
                        }
                    }
                }

                respData = {"response": respDatum};
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(respData));
                res.end();
            } catch (e) {
                return handleError(e.message);
            }
        })
    } else {
        // All other methods, don't entertain
        res.end();
    }

    /*
     * Logs the error generated as part of the process, And
     * sets the appropriate header and content-type, and response body
     * @param:      string - error message to be logged
     * @return:     bool - false so that further processing is aborted
     */
    function handleError(msg) {
        console.log('API call failed with message: ' + msg);
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.write(respData);
        res.end();
        return false;
    }
}
