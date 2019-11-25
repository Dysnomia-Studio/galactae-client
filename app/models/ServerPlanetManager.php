<?php
class ServerPlanetManager extends SQLInterface {
	
	public function __construct() {
		global $config;

		$host 		= $config['SQLCredentialsGameServer']['host'];
		$db 		= $config['SQLCredentialsGameServer']['db'];
		$id 		= $config['SQLCredentialsGameServer']['id'];
		$password 	= $config['SQLCredentialsGameServer']['password'];
		$driver 	= $config['SQLCredentialsGameServer']['driver'];
		$port 		= $config['SQLCredentialsGameServer']['port'];

		SQLInterface::__construct($host,$db,$id,$password,$driver,$port);
	}

	/**
	 * Get a planet from db and reserve it to current user
	 *
	 * @param      <array>  $user        User data
	 *
	 * @return     <array>  Planet data
	 */
	public function getAvailablePlanet($user) {
		$this->updateQuery('UPDATE planets
			SET owner = :owner
			WHERE address = (SELECT address FROM(SELECT (((5 - "galacticPos"[1])*(5 - "galacticPos"[1])) + ((5 - "galacticPos"[2])*(5 - "galacticPos"[2]))) as distanceToCenter,
			address
			FROM planets
			WHERE "owner" = \'00000000-0000-0000-0000-000000000001\'
			ORDER BY distanceToCenter
			LIMIT 1) as distanceOrdered )',
		[ 'owner' => $user['id'] ]);

		return $this->getCondContent(
				'planets',
				[ 'owner' => $user['id'] ]
			)[0];
	}

	/**
	 * Creates a planet model.
	 *
	 * @param      <array>  $user        User data
	 *
	 * @return     <array>  A new planet owned by current user (its data)
	 */
	public function createPlanetModel($user) {
		$planet = $this->getAvailablePlanet($user);

		return [
				// General informations
					'id' => $planet['id'],
					'name' => 'Planète de '.$user['name'], //@ADD: Translation
					'address' => $planet['address'],
					// owner
					'points' => 44,

				// Geographic informations
					// orbitDist
					// orbitDuration
					// galacticPos
					// planetType


				// Buildings
					'Buildings' => '{1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0}',
					'nextBuilding' => -1,
					'nextBuildingTime' => -1,

				// Resources
					'resources' => '{100, 0, 350, 500, 40, 100}',
					'lastResourcesUpdate' => time()*1000,

				// Units
					'unitBuildingCount' => -1,
					'unitBuildingEndTime'  => -1,
					'lastUnitUpdate' => time()*1000,

				// Misc
					'currResearch' => '',
			];
	}

	/**
	 * Updates a planet in database
	 *
	 * @param      <string>  $dbname  The server name
	 * @param      <array>  $planet  Planet data
	 */
	public function updatePlanet($planet) {
		$this->updateContent('planets',
			$planet,
			[ 'id' => $planet['id'] ]
		);
	}
}