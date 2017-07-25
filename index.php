<?php
include_once('lib/config.php'); 

if(isset($_SESSION['game_id'])) {
	setcookie ( "galactae-account-id", $_SESSION['game_id'], time()+60*60*24*7,"/", ".***REMOVED***",true, false);
	setcookie ( "galactae-account-id", $_SESSION['game_id'], time()+60*60*24*7,"/", "***REMOVED***",true, false);
}

// No Username and/or Id
if(!isset($_COOKIE['galactae-account-username']) ||$_COOKIE['galactae-account-username']=="" || !isset($_COOKIE['galactae-account-bid']) ||$_COOKIE['galactae-account-bid']=="") {
	header('Location: https://***REMOVED***');
}

if(isset($db)) { //Maybe we don't have SQL connection ...
	// SQL Get Data
	$data = $db->getCondContent("users",[
		["user_name",strtolower($_COOKIE['galactae-account-username']),"str"],
		["user_id",intval($_COOKIE['galactae-account-bid']),"int"]
		],0,1,"user_id");

	if($data!=false&&isset($data[0])) {
		$data = $data[0];
	}
	
	if(!isset($data['user_name'])) { // Verif d'existance du compte SQL
		header('Location: https://***REMOVED***');
	}

	// Check user datas
	$_SESSION['level'] = $data['user_lvl'];
	$_SESSION['game_id'] = $data['game_id'];

	// Lvl Check
	if($_SESSION['level']<2) { // Verif du niveau
		header('Location: https://***REMOVED***');
	}

	if(isset($_POST['choice'])) {
		$choice = (int) $_POST['choice'];
	} else {
		$choice = 0;
	}

	// Create account if needed
	if((!isset($_SESSION['game_id']) || $_SESSION['game_id']=="" || $_SESSION['game_id']=="-1")) { // Verif d'existance du compte ( côté SQL )
		if($choice > 0 && $choice < 4) {  // Traitement
			include_once('newconfirm.php');
		} else { // Choix
			include_once('new.php');
		}
	} else { // Play !
		include_once('game.php');
	}
} else { // SQL Connect Check end
	header('Location: https://***REMOVED***');
}
?>