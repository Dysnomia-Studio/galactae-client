<?php
class ServerUserManager extends SQLInterface {

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
	 * Gets a user by name from server db
	 *
	 * @param      <string>  $srvName  The server name
	 * @param      <string>  $name     User name
	 *
	 * @return     <array>  User data
	 */
	public function getUserByName($name) {
		$data = $this->getCondContent('users',
			['name' => $name]
		);

		if(isset($data[0])) {
			$data = (array) $data[0];
		}

		return $data;
	}

	/**
	 * Creates an user model.
	 *
	 * @param      <type>  $name    User name
	 * @param      <type>  $choice  Government choice
	 *
	 * @return     array   User data
	 */
	public function createUserModel($name, $choice) {
		global $beginnerProtectionDuration;

		$this->addUser([
			'name' => $name,
			'gvt' => $choice,
			'ally' => null,
			'sid' => '-1',
			
			'planetlist' => '{}',

			'tutorials' => '{}',
			
			'beginnerProtectEnd' => ((time() + ($beginnerProtectionDuration * 24 * 60 * 60)) * 1000),

			'lastConnected' => 0,
			'lastAction' => 0,

			'points' => 47,
			'money' => 0,
			// Research
				'research' => '{"researchCenter": -1}',
				'lastResearchUpdate' => 0,
			// Bonus journalier
				'lastBonus' => 0,
				'dayBonusStreak' => 0,
				'dayBonusBest' => 0,
				
		]);

		return $this->getUserByName($name);
	}

	/**
	 * Adds an user to server database
	 *
	 * @param      <string>  $dbname  The server name
	 * @param      <array>  $user    User data
	 */
	public function addUser($user) {
		$this->addContent('users', [$user]);
	}


	public function updateUser($user) {
		$this->updateContent('users',
			$user,
			[ 'id' => $user['id'] ]
		);
	}
}