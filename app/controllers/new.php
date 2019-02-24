<?php
try {
	$srvusermng = new ServerUserManager($dburl);
} catch(Exception $e) {
	redirect('main-home');
}
$srvUserData = $srvusermng->getUserByName($dbname, $userData['user_name']);

try {
	$usermng = new UserManager();
} catch(Exception $e) {
	redirect('main-home');
}

if(isset($srvUserData['name'])) { // Autofix
	$usermng->updateUserGameData($userData['user_id'], $srvUserData['_id'], $dbname);

	$_SESSION['game_id'] = $srvUserData['_id'];

	redirect('reload');
}