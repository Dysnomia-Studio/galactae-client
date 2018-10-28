<?php
class ServerPlanetManager extends MongoInterface {
	public function getAvailablePlanet($serverName, $user) {
		$this->updateContent(
			$serverName,
			'planets',
			[ 'owner' => new MongoDB\BSON\ObjectID('000000000000000000000001') ],
			[ '$set' => [ 'owner' => $user['_id'] ] ],	
			[ 'multi' => false ]
		);

		return json_decode(json_encode(
			$this->getCondContent(
				$serverName,
				'planets',
				[ 'owner' => $user['_id'] ]
			)[0]
		), true);
	}

	public function createPlanetModel($serverName, $user) {
		$planet = $this->getAvailablePlanet($serverName, $user);

		unset($planet['owner']);

		return array_merge(
			$planet
				, [
				// General informations
					// _id
					'name' => 'Planète de '.$user['name'], //@ADD: Translation
					// address
					'owner' => $user['_id'],
					'points' => 47,

				// Geographic informations
					// orbitDist
					// orbitDuration
					// galacticPos
					'planetType' => 0,


				// Buildings
					'Buildings' => [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
					'nextBuilding' => -1,
					'nextBuildingTime' => -1,

				// Resources
					'resources' => [ 100, 42, 100, 100, 100, 100 ],
					'lastResourcesUpdate' => time()*1000,

				// Units
					'unitBuildingID' => '-1',
					'unitBuildingCount' => -1,
					'unitBuildingEndTime'  => -1,
					'lastUnitUpdate' => time()*1000,

				// Misc
					'currResearch' => '',
			]
		);
	}

	public function updatePlanet($dbname, $planet) {
		$this->updateContent($dbname,'planets',
			['_id' => new MongoDB\BSON\ObjectID($planet['_id'])],
			[ '$set' => $planet ]		
		);
	}
}