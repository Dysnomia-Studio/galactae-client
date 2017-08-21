<?php
include_once('lib/init.php');
include_once('gvars.php'); 
?>
<link rel="shortcut icon" type="image/png" href="<?php echo $cdnURL; ?>img/favicon.png"/>
<link rel="stylesheet" media="screen" type="text/css" title="Design" href="<?php echo $cdnURL; ?>css/style.css"/>
<?php
if(isset($db)) { //Maybe we don't have SQL connection ...
	// No PHPSESSID
	if(!(isset($_COOKIE['galactae-phpsessid']))) {
		echo '<script> window.location="https://galactae.elanis.eu/login"; </script>';
	}

	// SQL Get Data
	$data = $db->getCondContent("users",[
		["session_id",$_COOKIE['galactae-phpsessid'],"str"]
		],0,1,"user_id");

	if($data!=false && isset($data[0])) {
		$data = $data[0];
	}
	
	if(!isset($data['user_name'])) { // Verif d'existance du compte SQL
	    echo '<script> window.location="https://galactae.elanis.eu/login"; </script>';
	}

	// Lvl Check
	if($data['user_lvl']<2) { // Verif du niveau
		echo '<script> window.location="https://galactae.elanis.eu"; </script>';
	}

	// SQL Get Data
	$data2 = $db->getCondContent("game_id",[
		["id",$data['user_id'],"int"],
		["server_name",$dbname,"str"]
		],0,1,"id");

	if($data2!=false && isset($data2[0])) {
		$data2 = $data2[0];
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
	   	echo '
			<script type="text/javascript" src="'.$cdnURL.'js/cookies.js"></script>
			<script type="text/javascript">
					setGvars("'.$data2['game_id'].'","'.$data['user_name'].'");
			</script>';
		include_once('game.php');
	}
} else { // SQL Connect Check end
	echo '<script> window.location="https://galactae.elanis.eu"; </script>';
}
?>