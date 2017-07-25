<style type="text/css">
	@import url('https://fonts.googleapis.com/css?family=Titillium+Web');

	body {
		font-family: 'Titillium Web', sans-serif;
		cursor: url(../../img/mouse_cursor.png), auto;
		color: white;
	}
</style>

<?php
$serverIP = "***REMOVED***";

// Verif du client sur mongo
$manager = new MongoDB\Driver\Manager($serverIP);

// Get data from db
$filter = array();
$query = new MongoDB\Driver\Query($filter);
$cursor = $manager->executeQuery('spacegame.users', $query);
$playerList = $cursor->toArray();

$plyNum = count($playerList);

// To array
for ($i=0; $i < $plyNum; $i++) { 
	$playerList[$i] = json_decode(json_encode($playerList[$i]), true);
}

/**
 * Trier par points
 */
function cmp($a,$b) {
	$val1 = $a['points'];
	$val2 = $b['points'];

	if($val1 == $val2) {
		return 0;
	}

	return ($val1 > $val2) ? -1 : 1;
}
usort($playerList,"cmp")
?>
<table style="width: 100%; text-align: center;">
<tr>
	<th>Rang</th>
	<th>Noms</th>
	<th>Points</th>
	<th>Planetes</th>
	<th>Alliance</th>
</tr>
<?php
for ($i=0; $i < $plyNum; $i++) { 
	if($playerList[$i]["points"]<1) { break; }
	echo "
	<tr>
		<td>".($i + 1)."</td>
		<td>".$playerList[$i]["name"]."</td>
		<td>".$playerList[$i]["points"]."</td>
		<td>".count($playerList[$i]["planetlist"])."</td>";

		if($playerList[$i]["ally"]=="") {
			echo "<td>-</td>";
		} else {
		echo "<td>".$playerList[$i]["ally"]."</td>";
		}

	echo "</tr>";
}
?>
</table>
