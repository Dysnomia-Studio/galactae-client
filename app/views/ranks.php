<?php
$noscript=true;
?>
<style type="text/css">
	body {
		font-family: 'Titillium Web', sans-serif;
		cursor: url(<?php echo $cdnURL; ?>img/mouse_cursor.png), auto;
		color: white;
		background-color: transparent !important;
	}
	a {
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
</style>
<?php
/**
 * @TODO: Do MVC !
 */

// Verif du client sur mongo
$manager = new MongoDB\Driver\Manager($config['mongoURL']);

/**
 * Cache Vars
 */
$_GET['type'] = (isset($_GET['type']))?(string)$_GET['type']:'';
$plyPerPage = 20;
$cache = '';
$cachePattern = '';
/* Which page to display ? */
$pageDemandee = (isset($_GET['page']))?(int)$_GET['page']-1:0;
if($pageDemandee < 0) { $pageDemandee = 0; }

$playerList = array();
$plyCount = 0;

switch ($_GET['type']) {
	case 'sector-players':
		$type = 'sector-players';
		$sector = '5-5';
		if(isset($_GET['sector'])) {
			$coordonnees = explode('-', $_GET['sector']);

			if(count($coordonnees) == 2) {
				if((int) $coordonnees[0] > 9) {
					$coordonnees[0] = 9;
				}
				if((int) $coordonnees[1] > 9) {
					$coordonnees[1] = 9;
				}
				if((int) $coordonnees[0] < 0) {
					$coordonnees[0] = 0;
				}
				if((int) $coordonnees[1] < 0) {
					$coordonnees[1] = 0;
				}

				$sector = $coordonnees[0].'-'.$coordonnees[1];
			}
		}

		// Get data from db
		$filter = array(
			'rank' => array(
				'$gt' => ($pageDemandee * $plyPerPage),
				'$lte' => (($pageDemandee + 1) * $plyPerPage)
			),
			'server_name' => $dbname,
			'sector' => $sector
		);
		$query = new MongoDB\Driver\Query($filter);
		$cursor = $manager->executeQuery('galactae.sectorranks', $query);
		$playerList = $cursor->toArray();

		$cmd = new MongoDB\Driver\Command(["count" => 'sectorranks', 
			"query" => array(
				'server_name' => $dbname,
				'sector' => $sector
			)]);
		$result = $manager->executeCommand('galactae', $cmd);
		$plyCount = json_decode(json_encode($result->toArray()[0]), true)['n'];

		$cache = DIR_CACHE.'ranks/'.$type.'-'.$sector.'-'.$pageDemandee.'.html';
		break;
	case 'galaxy-players':
	default:
		$type = 'galaxy-players';

		// Get data from db
		$filter = array(
			'rank' => array(
				'$gt' => ($pageDemandee * $plyPerPage),
				'$lte' => (($pageDemandee + 1) * $plyPerPage)
			),
			'server_name' => $dbname		
		);
		$query = new MongoDB\Driver\Query($filter);
		$cursor = $manager->executeQuery('galactae.globalranks', $query);
		$playerList = $cursor->toArray();

		$cmd = new MongoDB\Driver\Command(["count" => 'globalranks', "query" => array('server_name' => $dbname)]);
		$result = $manager->executeCommand('galactae', $cmd);
		$plyCount = json_decode(json_encode($result->toArray()[0]), true)['n'];

		$cache = DIR_CACHE.'ranks/'.$type.'-'.$pageDemandee.'.html';
		break;
}

$expire = time() - 600; // 10 min

/**
 * Cache Code
 */
if(file_exists($cache) && filemtime($cache) > $expire) {
	readfile($cache);
} else {
	/**
	 * Generate cache
	 */
	ob_start();

	function sortPlayers($a,$b) {
		$val1 = $a->rank;
		$val2 = $b->rank;

		if($val1 == $val2) {
			return 0;
		}

		return ($val1 < $val2) ? -1 : 1;
	}
	usort($playerList,"sortPlayers");

	echo '<table style="width: 100%; text-align: center;">
		<tr>
			<th>Rang</th>
			<th>Noms</th>
			<th>Points</th>
			<th>Planetes</th>
			<th>Alliance</th>
		</tr>';

	for($currPlayer=0; $currPlayer<count($playerList); $currPlayer++) {
		$player = json_decode(json_encode($playerList[$currPlayer]), true);
		echo '
		<tr>
			<td>'.($currPlayer + 1).'</td>';

			if(strtolower($player['name']) == strtolower($userData['user_name'])) {
				echo '<td><em>'.$player['name'].'</em></td>';
			} else {
				echo '<td>'.$player['name'].'</td>';
			}

			echo '<td>'.$player['points'].'</td>
			<td>'.$player['planets'].'</td>';

			if($player['ally']=='') {
				echo '<td>-</td>';
			} else {
			echo '<td>'.$player['ally'].'</td>';
			}

		echo '</tr>';
	}

	echo '</table>';

	if($plyCount>$plyPerPage) {
		echo 'Pages: ';
		$type = (!empty($type))?'type='.$type.'&':'';

		for($pagination=1; $pagination<=ceil($plyCount/$plyPerPage); $pagination++) {
			if($pagination != 1) { echo ' '; }
			if($pagination == ($pageNum + 1)) {
				echo '<b><a href="ranks.php?'.$type.'page='.$pagination.'">'.$pagination.'</a></b>';
			} else {
				echo '<a href="ranks.php?'.$type.'page='.$pagination.'">'.$pagination.'</a> ';
			}
		}
	}

	$pageContent = ob_get_contents(); // copie du contenu du tampon dans une chaîne
    ob_end_clean(); // effacement du contenu du tampon et arrêt de son fonctionnement
    
    file_put_contents($cache, $pageContent); // on écrit la chaîne précédemment récupérée ($pageContent) dans un fichier ($cache)

    echo $pageContent ; // on affiche notre page :D 
}
?>