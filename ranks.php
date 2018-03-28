<?php
$noscript=true;
include_once('gvars.php');
?>
<style type="text/css">
	@import url('https://fonts.googleapis.com/css?family=Titillium+Web');

	body {
		font-family: 'Titillium Web', sans-serif;
		cursor: url(<?php echo $cdnURL; ?>img/mouse_cursor.png), auto;
		color: white;
		background-color: transparent !important;
	}
</style>

<?php
// Verif du client sur mongo
$manager = new MongoDB\Driver\Manager($dburl);

function sortPlayers($a,$b) {
	$val1 = $a['points'];
	$val2 = $b['points'];

	if($val1 == $val2) {
		return 0;
	}

	return ($val1 > $val2) ? -1 : 1;
}

/**
 * Cache Vars
 */
$_GET['type'] = (isset($_GET['type']))?(string)$_GET['type']:"";

switch ($_GET['type']) {
	/*case 'sector-players':
		$type = "galaxy-players";
		break;*/
	case 'galaxy-players':
	default:
		$type = "galaxy-players";

		// Get data from db
		$filter = array();
		$query = new MongoDB\Driver\Query($filter);
		$cursor = $manager->executeQuery($dbname.'.users', $query);
		$playerList = $cursor->toArray();

		$plyNum = count($playerList);
		break;
}

$plyPerPage = 20;
$pageCount = ceil($plyNum / $plyPerPage);
/* Which page to display ? */
$page = (isset($_GET['page']))?(int)$_GET['page']:1;
if($page < 1) { $page = 1; } 
elseif($page > $pageCount) { $page = $pageCount; }

$cache = 'cache/ranks/'.$type.'-'.$page.'.html';
$expire = time() - 600; // 10 min

/**
 * Cache Code
 */
if(file_exists($cache) && filemtime($cache) > $expire) {
	readfile($cache);
} else {
	/**
	 * Check and sort players
	 */
	switch ($type) {
		case 'galaxy-players':
		default:
			// Refresh user points
			

			// To array
			for ($i=0; $i < $plyNum; $i++) { 
				$playerList[$i] = json_decode(json_encode($playerList[$i]), true);
			}

			/**
			 * Trier par points
			 */
			usort($playerList,"sortPlayers");
		break;
	}

	/**
	 * Generate cache
	 */
	for($page=0; $page<$pageCount; $page++) {
		$base = $page * $plyPerPage;
		$cache = 'cache/ranks/'.$type.'-'.($page+1).'.html';

		ob_start();

		echo "<table style=\"width: 100%; text-align: center;\">
			<tr>
				<th>Rang</th>
				<th>Noms</th>
				<th>Points</th>
				<th>Planetes</th>
				<th>Alliance</th>
			</tr>";

		for($j=0; $j<$plyPerPage; $j++) {
			$curr = $base + $j;
			if($curr>($plyNum-1)) { break; }
			echo "
			<tr>
				<td>".($curr + 1)."</td>
				<td>".$playerList[$curr]["name"]."</td>
				<td>".$playerList[$curr]["points"]."</td>
				<td>".count($playerList[$curr]["planetlist"])."</td>";

				if($playerList[$curr]["ally"]=="") {
					echo "<td>-</td>";
				} else {
				echo "<td>".$playerList[$curr]["ally"]."</td>";
				}

			echo "</tr>";
		}

		echo "</table>";

		if($pageCount>1) {
			echo "Page: ";
			for($pagination=0; $pagination<$pageCount; $pagination++) {
				if($pagination != 0) { echo " "; }
				if($pagination == $page) {
					echo '<b><a href="ranks.php?page='.$i.'">'.$i.'</a></b>';
				} else {
					echo '<a href="ranks.php?page='.$i.'">'.$i.'</a> ';
				}
			}
		}

		$page = ob_get_contents(); // copie du contenu du tampon dans une chaîne
        ob_end_clean(); // effacement du contenu du tampon et arrêt de son fonctionnement
        
        file_put_contents($cache, $page); // on écrit la chaîne précédemment récupérée ($page) dans un fichier ($cache)

        echo $page ; // on affiche notre page :D 
	}
}
?>