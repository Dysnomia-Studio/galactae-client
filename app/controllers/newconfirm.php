<?php
try {
	$srvusermng = new ServerUserManager($dburl);
} catch(Exception $e) {
	redirect('main-home');
}

try {
	$srvplnmng = new ServerPlanetManager($dburl);
} catch(Exception $e) {
	redirect('main-home');
}

try {
	$usrmngr = new UserManager();
} catch(Exception $e) {
	redirect('main-home');
}

$user = $srvusermng->createUserModel(
	$userData['user_name'], 
	$choice
);

$planet = $srvplnmng->createPlanetModel(
	$dbname,
	$user
);

$user['planetlist'] = [ (string) $planet['address'] ];

// Share game-id to SQL server
$usrmngr->addUserGameData(
	$userData['_id'], 
	$user['_id'], 
	$dbname
);

// Ajout de la planet et de l'utilisateur in game
$srvusermng->addUser($dbname, $user);
$srvplnmng->updatePlanet($dbname, $planet);

$_SESSION['game_id'] = (string) $user['_id'];

redirect('reload');
?>