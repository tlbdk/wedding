<?php

echo generateRandomString(8)."\n";

function generateRandomString($length = 10) {
    return substr(str_shuffle("0123456789abcdefghjkmnopqrstuvwxyz"), 0, $length);
}