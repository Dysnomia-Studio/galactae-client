<?php
try {
	$srvusermng = new ServerUserManager();
} catch(Exception $e) {
	redirect('main-home');
}

try {
	$srvplnmng = new ServerPlanetManager();
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
	$user
);

$user['planetlist'] = [ $planet['address'] ];

// Share game-id to SQL server
$usrmngr->addUserGameData(
	$userData['id'],
	$user['id'],
	$dbname
);

// Ajout de la planet et de l'utilisateur in game
$srvusermng->updateUser($user);

$_SESSION['game_id'] = (string) $user['id'];

redirect('reload');