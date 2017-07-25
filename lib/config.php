<?php
/* Require */
require_once('init.php');

/* == Modules == */
$modules = [
'captcha' => false,
'canvas' => false,
'cookies' => false,
'encrypt' => false,
'forum' => false,
'hamburger' => false,
'lang' => true,
'mongodb' => false,
'payment' => false,
'sql' => true,
'sms' => false,
'users' => false
];

/* == Config == */
$main_config = [
'website-name' => 'Galactae: Space Age Rising',
'creation' => 2015,
'website-version' => 1,
'default-maxperpage' => 25,
'dev' => true
];

$sql_config = [
'host' => 'mysql',
'database' => 'galactae',
'username' => 'galactae',
'password' => '***REMOVED***'
];

$users_config = [
'username' => 'text',
'password' => 'password',
'mail' => 'text-mail',
'website' => 'text-website',
'born' => 'date',
'avatar' => 'image',
'signature' => 'text'
];

$captcha_config = [
'public-key' => 'NULL',
'private-key' => 'NULL'
];

//                 0      1      2        3           4          5
$rank_config = [BANNED,VISITOR,MEMBER,MODERATOR,ADMINISTRATOR,FOUNDER];

LoadIt();
?>