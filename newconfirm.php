<?php
// Create new mongo user
$manager = new MongoDB\Driver\Manager("***REMOVED***");

// Prepare vars
$users_gameId = new MongoDB\BSON\ObjectID();

$user = [
	"_id" => $users_gameId,
	"name" => $data['user_name'],
	"lvl" => $data['user_lvl'],
	"gvt" => $choice
];

$planet = [
"_id" => new MongoDB\BSON\ObjectID(),
"name" => "Planète de ".$data['user_name'],
"owner" => $users_gameId,
"resources" => [ 100, 42, 100, 100, 100, 100 ],
"groundBuilding" => [ 1, 1, 1, 1, 1, 1, 1, 1, 1],
"planetType" => 0,
"nextBuilding" => -1,
"nextBuildingTime" => -1,
"lastResourcesUpdate" => time()*1000
];

$user['planetlist'] = [new MongoDB\BSON\ObjectID($planet['_id'])];

// Prepare query for user
$bulkUsers = new MongoDB\Driver\BulkWrite(['ordered' => true]);
$bulkUsers->insert($user);

// Prepare query for planet
$bulkPlanets = new MongoDB\Driver\BulkWrite(['ordered' => true]);
$bulkPlanets->insert($planet);

$manager->executeBulkWrite('spacegame.users', $bulkUsers);
$manager->executeBulkWrite('spacegame.planets', $bulkPlanets);

// Share game-id to SQL server
$db->updateContent('users',
	[ ["game_id",$users_gameId,"str"] ],
	[ ["user_id",$data['user_id'],"str"] ]);

$_SESSION['game_id'] = $users_gameId;

// Then we reload the page ...
header('Location: index.php');
?>