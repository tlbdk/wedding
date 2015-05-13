<?php

function jwt_decode_header($header) {
    if($elements = explode(" ", $_SERVER["HTTP_AUTHORIZATION"])) {
        if($elements[0] === "Bearer") {
            $token = jwt_decode($elements[1], "12345678", "http://localhost/app/frontend/");
            return $token;
        } else {
            return [ "error" => "Not a Bearer token" ];
        }
    } else {
        return [ "error" => "No Authorization header set" ]; 
    }
}

function jwt_decode($jwt, $key, $aud = null) {
    if(substr_count($jwt, '.') !== 2) {
        return [ "error" => 'Not a valid JWT token as it does not contain two dots' ];
    }

    // Disassemble token and deserialize JSON
    $elements = explode('.', $jwt);
    $header = json_decode(base64url_decode($elements[0]), true, 2, JSON_BIGINT_AS_STRING);
    $body = json_decode(base64url_decode($elements[1]), true, 2, JSON_BIGINT_AS_STRING);
    $signature = base64url_decode($elements[2]);
    $base64_token = $elements[0].".".$elements[1];
    
    // HASH validation
    if(substr($header['alg'], 0, 2) === "HS") {
        $checksignature = jwt_sign($base64_token, $header['alg'], $key);
        if($signature === false || $checksignature === false || !strcmp_timesafe($signature, $checksignature)) {
            $body["error"] = "Validation failed";
            return $body;
        }

    // Priv/Pub key validation
    } elseif(substr($header['alg'], 0, 2) === "RS") {
        if($header['alg'] === "RS256") {
            if(!openssl_verify($base64_token, $signature, $key, "SHA256")) {
                $body["error"] = "Validation failed";
                return $body;
            }

        } else {
            $body["error"] = "Unknown algorithm used";
            return $body;
        }

    } else {
        $body["error"] = "Unknown algorithm used";
        return $body;
    }

    // Validate body
    if(isset($aud) && (!isset($body['aud']) || $aud != $body['aud'])) {
        $body["error"] = "Audience not set in token or did not match : $aud";
        return $body;
    }
    if(isset($body['nbf']) && $body['nbf'] >= time()) {
        $body["error"] = "Token is not valid yet";
        return $body;
    }
    if(isset($body['exp']) && $body['exp'] <= time()) {
        $body["error"] = "Token has expired";
        return $body;
    }

    return $body;
}

function jwt_encode($header, $body, $key) {
    // Encode header and body
    $base64_token = base64url_encode(json_encode($header)) . "." . base64url_encode(json_encode($body));
    // Sign token and assemble the final jwt
    return $base64_token . "." . base64url_encode(jwt_sign($base64_token, $header['alg'], $key));
}

function jwt_sign($base64_token, $algo, $key) {
    switch($algo) {
    case 'HS256':
        return hash_hmac("SHA256", $base64_token, $key, true);
    case 'HS384':
        return hash_hmac("SHA384", $base64_token, $key, true);
    case 'HS512':
        return hash_hmac("SHA512", $base64_token, $key, true);
    case 'RS256':
        $signature = '';
        $success = openssl_sign($base64_token, $signature, $key, "SHA256");
        return $signature;
    default:
        return false;
    }
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

function strcmp_timesafe($a, $b) {
    if (!is_string($a) || !is_string($b)) {
        return false;
    }

    $len = strlen($a);
    if ($len !== strlen($b)) {
        return false;
    }

    $status = 0;
    for ($i = 0; $i < $len; $i++) {
        $status |= ord($a[$i]) ^ ord($b[$i]);
    }
    return $status === 0;
}
