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
	a {
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
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
$plyPerPage = 20;

switch ($_GET['type']) {
	case 'sector-players':
		$type = "sector-players";
		$sector = "5-5";
		if(isset($_GET['sector'])) {
			$coordonnees = explode("-", $_GET['type']);

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
		$filter = array();
		$query = new MongoDB\Driver\Query($filter);
		$cursor = $manager->executeQuery($dbname.'.users', $query);
		$playerTmpList = $cursor->toArray();
		$playerList = array();

		foreach ($playerTmpList as $player) {
			$player = json_decode(json_encode($player), true);
			var_dump($player["sectorPointsAddresses"];
			if(!isset($player["sectorPointsAddresses"])) { continue; }
			for($i=0; $i<count($player["sectorPointsAddresses"]); $i++) {
				if($player["sectorPointsAddresses"][$i] == $sector) {
					array_push($playerList, [
						"name" => $player["name"],
						"points" => $player["sectorPointsValue"][$i],
						"planets" => $player["sectorPointsPcount"][$i]
					]);

					break;
				}
			}
		}

		$plyNum = count($playerList);

		$pageCount = ceil($plyNum / $plyPerPage);
		/* Which page to display ? */
		$pageDemandee = (isset($_GET['page']))?(int)$_GET['page']:1;
		if($pageDemandee < 1) { $pageDemandee = 1; } 
		elseif($pageDemandee > $pageCount) { $pageDemandee = $pageCount; }

		$cache = 'cache/ranks/'.$type.'-'.$sector.'-'.$pageDemandee.'.html';
		break;
	case 'galaxy-players':
	default:
		$type = "galaxy-players";

		// Get data from db
		$filter = array();
		$query = new MongoDB\Driver\Query($filter);
		$cursor = $manager->executeQuery($dbname.'.users', $query);
		$playerList = $cursor->toArray();

		$plyNum = count($playerList);

		$pageCount = ceil($plyNum / $plyPerPage);
		/* Which page to display ? */
		$pageDemandee = (isset($_GET['page']))?(int)$_GET['page']:1;
		if($pageDemandee < 1) { $pageDemandee = 1; } 
		elseif($pageDemandee > $pageCount) { $pageDemandee = $pageCount; }

		$cache = 'cache/ranks/'.$type.'-'.$pageDemandee.'.html';
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
		break;
	}

	/**
	 * Trier par points
	 */
	usort($playerList,"sortPlayers");


	/**
	 * Generate cache
	 */
	for($pageNum=0; $pageNum<$pageCount; $pageNum++) {
		$base = $pageNum * $plyPerPage;
		$cache = 'cache/ranks/'.$type.'-'.($pageNum+1).'.html';

		ob_start();

		echo "<table style=\"width: 100%; text-align: center;\">
			<tr>
				<th>Rang</th>
				<th>Noms</th>
				<th>Points</th>
				<th>Planetes</th>
				<th>Alliance</th>
			</tr>";

		for($currPlayer=$base; $currPlayer<($base + $plyPerPage) && $currPlayer<$plyNum; $currPlayer++) {
			echo "
			<tr>
				<td>".($currPlayer + 1)."</td>
				<td>".$playerList[$currPlayer]["name"]."</td>
				<td>".$playerList[$currPlayer]["points"]."</td>
				<td>".count($playerList[$currPlayer]["planetlist"])."</td>";

				if($playerList[$currPlayer]["ally"]=="") {
					echo "<td>-</td>";
				} else {
				echo "<td>".$playerList[$currPlayer]["ally"]."</td>";
				}

			echo "</tr>";
		}

		echo "</table>";

		if($pageCount>1) {
			echo "Page: ";
			for($pagination=1; $pagination<=$pageCount; $pagination++) {
				if($pagination != 1) { echo " "; }
				if($pagination == ($pageNum + 1)) {
					echo '<b><a href="ranks.php?page='.$pagination.'">'.$pagination.'</a></b>';
				} else {
					echo '<a href="ranks.php?page='.$pagination.'">'.$pagination.'</a> ';
				}
			}
		}

		$pageContent = ob_get_contents(); // copie du contenu du tampon dans une chaîne
        ob_end_clean(); // effacement du contenu du tampon et arrêt de son fonctionnement
        
        file_put_contents($cache, $pageContent); // on écrit la chaîne précédemment récupérée ($pageContent) dans un fichier ($cache)

        if($pageNum == $pageDemandee) {
        	echo $pageContent ; // on affiche notre page :D 
        }
	}
}
?>