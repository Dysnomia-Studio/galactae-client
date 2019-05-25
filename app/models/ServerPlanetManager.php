<?php
class ServerPlanetManager extends SQLInterface {


	/**
	 * Get a planet from db and reserve it to current user
	 *
	 * @param      <array>  $user        User data
	 *
	 * @return     <array>  Planet data
	 */
	public function getAvailablePlanet($user) {
		$this->updateContent(
			'planets',
			[ 'owner' => $user['id'] ],
			[ 'owner' => '000000000000000000000001' ]
		);

		return json_decode(json_encode(
			$this->getCondContent(
				'planets',
				[ 'owner' => $user['id'] ]
			)[0]
		), true);
	}

	/**
	 * Creates a planet model.
	 *
	 * @param      <string>  $serverName  The server name
	 * @param      <array>  $user        User data
	 *
	 * @return     <array>  A new planet owned by current user (its data)
	 */
	public function createPlanetModel($serverName, $user) {
		$planet = $this->getAvailablePlanet($user);

		unset($planet['owner']);

		return array_merge(
			$planet
				, [
				// General informations
					// _id
					'name' => 'Planète de '.$user['name'], //@ADD: Translation
					// address
					'owner' => $user['id'],
					'points' => 47,

				// Geographic informations
					// orbitDist
					// orbitDuration
					// galacticPos
					//'planetType' => 0,


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

	/**
	 * Updates a planet in database
	 *
	 * @param      <string>  $dbname  The server name
	 * @param      <array>  $planet  Planet data
	 */
	public function updatePlanet($dbname, $planet) {
		$this->updateContent('planets',
			[ 'id' => $planet['id'] ],
			$planet
		);
	}
}