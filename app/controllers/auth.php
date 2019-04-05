<?php
if($pageData['pageName'] != "news.php" && $pageData['pageName'] != "ranks.php") {
	$pageData['pageName'] = "";
}

try {
	$usermng = new UserManager();
} catch(Exception $e) {
	redirect('main-home');
}

// No PHPSESSID
if(!(isset($_COOKIE['galactae-phpsessid']))) {
	redirect('login');
}

// Check session
$session_data = $usermng->getUserBySession($_COOKIE['galactae-phpsessid']);

$browser = new Browser();
if(isset($session_data['user_id'],
		$session_data['user_session_expiration'],
		$session_data['user_agent'])
		&& ((int) $session_data['user_session_expiration'] > time()
		&& $session_data['user_agent'] == $browser->getPlatform().'-'.$browser->getBrowser())) {

	$usermng->updateUserSession();
} else {
	redirect('login');
}

// Verif d'existance du compte sur la BDD Principale
$userData = $usermng->getGlobalUserById($session_data['user_id']);
if(!isset($userData['user_name'])) {
	redirect('login');
}

// Check on-server privileges
try {
	$servermng = new ServerListManager();
} catch(Exception $e) {
	redirect('main-home');
}
$srv_data = $servermng->getServerByName($dbname);

if(!isset($srv_data['server_maintenance']) || $srv_data['server_maintenance']) {

	$userPrivileges = $usermng->getUserPrivileges($userData['id'], $dbname);

	if(!isset($userPrivileges['user_whitelist']) || ((int) $userPrivileges['user_whitelist']!=1)) {
			redirect('maintenance');
	}
}

// Verif d'existance du compte de jeu par rapport a l'id global
$userGameData = $usermng->getUserGameData($userData['id'], $dbname);

if(!isset($userGameData['game_id']) || $userGameData['game_id']=="-1") {
	if(isset($_POST['choice'])) {
		$choice = (int) $_POST['choice'];
	} else {
		$choice = 0;
	}

	if($choice > 0 && $choice < 4) {  // Traitement
		$pageData['pageName'] = 'newconfirm.php';
	} else { // Choix
		$pageData['pageName'] = 'new.php';
	}
} else if($pageData['pageName'] == "") {
	$pageData['pageName'] = 'game.php';
}