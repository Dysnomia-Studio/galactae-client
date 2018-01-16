<?php
include_once('lib/init.php');
include_once('gvars.php'); 
?>
<link rel="shortcut icon" type="image/png" href="<?php echo $cdnURL; ?>img/favicon.png"/>
<link rel="stylesheet" media="screen" type="text/css" title="Design" href="<?php echo $cdnURL; ?>css/style.css"/>
<?php
if(isset($mongoDB)) { //Maybe we don't have mongo connection ...
	// No PHPSESSID
	if(!(isset($_COOKIE['galactae-phpsessid']))) {
		echo '<script> window.location="https://galactae.eu/login"; </script>';
		die();
	}

	// Get User Data
	$sess_data = $mongoDB->getCondContent('galactae','sessions',
			['user_session_uid' => $_COOKIE['galactae-phpsessid']]
	); 
	
	if(isset($sess_data[0])) {
		$sess_data = (array) $sess_data[0];
	}
	
	if(isset($sess_data['user_id']) && isset($sess_data['user_session_expiration']) && ((int) $sess_data['user_session_expiration'] > time())) {
		if(!isset($sess_data['user_agent']) || $sess_data['user_agent'] != $_SERVER['HTTP_USER_AGENT']) {
			echo '<script> window.location="https://galactae.eu/login"; </script>';
			die();
		}

		$mongoDB->updateContent('galactae','sessions',
			['user_session_uid' => $_COOKIE['galactae-phpsessid']],
			[ '$set' => [
				 	'user_session_expiration' => (time()+2678400),
					'user_session_lang' => $lang->getLanguage()
				]
			]		
		);
	} else {
	    echo '<script> window.location="https://galactae.eu/login"; </script>';
		die();
	}

	$userData = $mongoDB->getCondContent('galactae','users',
		["_id" => $sess_data['user_id']]
	);

	if(isset($userData[0])) {
		$userData = (array) $userData[0];
	}

	if(!isset($userData['user_name'])) { // Verif d'existance du compte SQL
	    echo '<script> window.location="https://galactae.eu/login"; </script>';
		die();
	}

	// SQL Get Server Data
	$srv_data = $mongoDB->getCondContent('galactae','servers',
		["server_name" => $dbname]
	);

	if(isset($srv_data[0])) {
		$srv_data = (array) $srv_data[0];
	}

	if(!isset($srv_data['server_maintenance']) || $srv_data['server_maintenance']==1) {
		$userPrivileges = $mongoDB->getCondContent('galactae','privileges',[
			"_id" => $userData['_id'],
			"server_name" => $dbname
		]);

		if(isset($userPrivileges[0])) {
			$userPrivileges = (array) $userPrivileges[0];
		}

		if(!isset($userPrivileges['user_whitelist']) || ((int) $userPrivileges['user_whitelist']!=1)) {
			echo '<script> window.location="https://galactae.eu/portal"; </script>';
			//@ADD: Message - Serveur en maintenance
			die();
		}
	}

	// SQL Get User game id Data
	$data2 = $mongoDB->getCondContent('galactae','game_ids',[
		"_id" => $userData['_id'],
		"server_name" => $dbname
		]);

	if(isset($data2[0])) {
		$data2 = (array) $data2[0];
	}

	// Create account if needed
	if(!isset($data2['game_id']) || $data2['game_id']=="-1") { // Verif d'existance du compte ( côté SQL )
	    if(isset($_POST['choice'])) {
			$choice = (int) $_POST['choice'];
		} else {
			$choice = 0;
		}

		if($choice > 0 && $choice < 4) {  // Traitement
			include_once('newconfirm.php');
		} else { // Choix
			include_once('new.php');
		}
	} else { // Play !
		$currentpage = explode("?",$_SERVER['REQUEST_URI'])[0];
		// Strtolower
		$currentname = strtolower($currentpage);
		// Strip .* et /
		$currentname = str_replace(".php", "", $currentname);
		$currentname = str_replace(".html", "", $currentname);
		$currentname = str_replace(".htm", "", $currentname);
		$currentname = str_replace("/", "", $currentname);

		/* Whitelist of other files */
		if($currentname=="ranks") {
			include_once('ranks.php');
			die();
		} elseif($currentname=="news") {
			include_once('news.php');
			die();
		}

	   	echo '
			<script type="text/javascript" src="'.$cdnURL.'js/cookies.js"></script>
			<script type="text/javascript">
					setGvars("'.$data2['game_id'].'","'.$userData['user_name'].'");
			</script>';
		include_once('game.php');
	}
} else { // SQL Connect Check end
	echo '<script> window.location="https://galactae.eu"; </script>';
	die();
}
?>