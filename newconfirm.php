<?php
// Create new mongo user
$manager = new MongoDB\Driver\Manager($dburl);

// Prepare vars
$users_gameId = new MongoDB\BSON\ObjectID();

$user = [
	"_id" => $users_gameId,
	"name" => $data['user_name'],
	"lvl" => $data['user_lvl'],
	"gvt" => $choice,
	"ally" => "",
	"sid" => "-1",
	"lastConnected" => 0,
	"dayBonusStreak" => 0,
	"dayBonusBest" => 0,
	"lastBonus" => 0
];

$planet = [
	"_id" => new MongoDB\BSON\ObjectID(),
	"name" => "Planète de ".$data['user_name'],
	"owner" => $users_gameId,
	"resources" => [ 100, 42, 100, 100, 100, 100 ],
	"Buildings" => [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
	"planetType" => 0,
	"nextBuilding" => -1,
	"nextBuildingTime" => -1,
	"lastResourcesUpdate" => time()*1000,
	"currResearch" => ""
];

$user['planetlist'] = [new MongoDB\BSON\ObjectID($planet['_id'])];

// Prepare query for user
$bulkUsers = new MongoDB\Driver\BulkWrite(['ordered' => true]);
$bulkUsers->insert($user);

// Prepare query for planet
$bulkPlanets = new MongoDB\Driver\BulkWrite(['ordered' => true]);
$bulkPlanets->insert($planet);

$manager->executeBulkWrite($dbname.'.users', $bulkUsers);
$manager->executeBulkWrite($dbname.'.planets', $bulkPlanets);

// Share game-id to SQL server
$db->addContent('game_id',[
		["id",$data['user_id']],
		["game_id",$users_gameId],
		["server_name",$dbname]
	]);

$_SESSION['game_id'] = $users_gameId;

// Then we reload the page ...
echo '<script> window.location.reload(); </script>';
?>