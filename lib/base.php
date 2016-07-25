<?php session_start(); ?>
<!DOCTYPE html>
<!-- 
	Code by Elanis
	2016
	Don't copy this without permission
	I hope this code is readable.
-->
<?php
if(isset($_POST['langue'])) {

if($_POST['langue']=="Francais") { $_SESSION['lang'] =""; }
if($_POST['langue']=="English") { $_SESSION['lang'] ="en"; }
if($_POST['langue']=="Deutsch") { $_SESSION['lang'] ="de"; }

}

if(!isset($_SESSION['lang'])) { $_SESSION['lang']=""; }

//PHP INCLUDE
include_once('./lib/php/lang.php');
?>
<html lang="<?php echo ($_SESSION['lang']!="")?$_SESSION['lang']:"fr"; ?>">
<head>
	<!-- Title -->
	<title>SpaceGame</title>
	<!-- Meta -->
	<meta charset="UTF-8">
	<meta name="keywords" content="<?php echo META_KEYWORDS; ?>">
	<meta name="description" content="<?php echo META_DESC; ?>" />
	<meta name="author" content="Elanis">
	<!-- CSS INCLUDE -->
	<link rel="shortcut icon" type="image/png" href="./img/favicon.png"/>
	<link rel="stylesheet" media="screen" type="text/css" title="Design" href="./lib/css/style.css"/>

	<!-- JAVASCRIPT INCLUDE -->
	<!-- JQuery Lib -->
    <script src="lib/js/jquery.min.js"></script>
    <!-- SocketIo -->
	<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
    <!-- Game Init -->
    <script src="lib/js/calculate.js"></script>
	<script>
	var loadPercent = 0;
	var serverip = "***REMOVED***";
	<?php echo 'var userData = {name:"'.$_SESSION['username'].'" ,id: "'.$_SESSION['id'].'" ,lvl: '.$_SESSION['lvl']; ?>, RandomToken: token() };

	var planetContent;

	<?php echo PLANET_BUILDING_CONTENT; //Text for planet building windows ?> 

	$(document).ready(function(){
		$('#loading-overlay-desc').text('Retrieving planet infos ...');
	});
	</script>
    <!-- Game Librairies -->
    <script src="lib/js/general.js"></script>
    <script src="lib/js/resources.js"></script>
    <script src="lib/js/socket.js"></script>
    <script src="lib/js/draw.js"></script>
    <script src="lib/js/chat.js"></script>
    <script src="lib/js/canvas.js"></script>
</head>

<body>
    <div id="loading-overlay">
    	<div id="loading-overlay-text">Loading game ...</div>
    	<img id="loading-overlay-img" src="../../img/load-gears.gif" alt="loading-overlay">
    	<div id="loading-overlay-desc">Connecting to server ...</div>
    </div>