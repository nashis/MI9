<?php

// set the header to send JSON response here
header('Content-Type: application/json');

// define all constants here
const INVALID_JSON_HEADER = 'Invalid request format';
const INVALID_JSON_RESPONSE = '{"error": "Could not decode request: JSON parsing failed"}';

// Actual work begins here
try {
    // check if POST data is set or not
    if (!isset($HTTP_RAW_POST_DATA)) {
        handleError("Post data not set.");
    }

    $reqData = json_decode($HTTP_RAW_POST_DATA);

    // check for any error while parsing JSON
    if (json_last_error() !== JSON_ERROR_NONE) {
        handleError("parsing JSON data failed.");
    }

    // Check for payload field in request
    if (!isset($reqData->payload)) {
        handleError("Payload missing.");
    }

    $payLoad = $reqData->payload;

    // Make sure payload is not empty
    if (empty($payLoad)) {
        handleError("Payload present and empty.");
    }

    $respData = Array();
    foreach ($payLoad as $key => $data) {
        if (!empty($data)) {
            if (isset($data->drm) && isset($data->episodeCount) && is_int($data->episodeCount)) {
                if (($data->drm === true) && ($data->episodeCount > 0)) {
                    // Initialize or reset so that we have default values for all fields
                    $datum = Array('image' => '', 'slug' => '', 'title' => '');
                    if (isset($data->image->showImage)) {
                        $datum['image'] = $data->image->showImage;
                    }

                    if (isset($data->slug)) {
                        $datum['slug'] = $data->slug;
                    }

                    if (isset($data->title)) {
                        $datum['title'] = $data->title;
                    }
                    array_push($respData, $datum);
                }
            }
        }
    }

    // Format to JSON and echo
    echo print_r(json_encode(Array("response" => $respData), JSON_UNESCAPED_SLASHES), 1);
} catch (Exception $e) {
    handleError($e->getMessage());
}

// Handle error during the execution of the parsing process
function handleError($msg) {
    error_log($msg);
    http_response_code(400);
    echo INVALID_JSON_RESPONSE;
    exit();
}
