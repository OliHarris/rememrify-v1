<?php

// Part 1 - get token
$client_id = '<insert your spotify app client id>'; 
$client_secret = '<insert your spotify app client secret>'; 

$curl1 = curl_init();
curl_setopt($curl1, CURLOPT_URL,            'https://accounts.spotify.com/api/token' );
curl_setopt($curl1, CURLOPT_RETURNTRANSFER, 1 );
curl_setopt($curl1, CURLOPT_POST,           1 );
curl_setopt($curl1, CURLOPT_POSTFIELDS,     'grant_type=client_credentials' ); 
curl_setopt($curl1, CURLOPT_HTTPHEADER,     array('Authorization: Basic '.base64_encode($client_id.':'.$client_secret))); 

$result = curl_exec($curl1);
curl_close($curl1);
$result = json_decode($result, true);
$token = $result['access_token'];

// Part 2 - use token to retrieve data
$curl2 = curl_init();
curl_setopt ($curl2, CURLOPT_URL, $_POST["spotify_url"]);
curl_setopt($curl2, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl2, CURLOPT_HTTPHEADER, array("Authorization: Bearer ".$token));

$data = curl_exec($curl2);
curl_close($curl2);
echo $data;
?>