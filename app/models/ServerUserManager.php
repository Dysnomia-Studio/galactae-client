<?php
class ServerUserManager extends MongoInterface {
	public function getUserByName($srvName, $name) {
		$data = $this->getCondContent($srvName,'users',
			["name" => $name]
		);

		if(isset($data[0])) {
			$data = (array) $data[0];
		}

		return $data;
	}

	public function createUserModel($name, $choice) {
		global $beginnerProtectionDuration;
		
		return [
			"_id" => new MongoDB\BSON\ObjectID(),
			"name" => $name,
			"gvt" => $choice,
			"ally" => "",
			"sid" => "-1",
			
			// planetlist

			"currTutorial" => 0,
			
			"beginnerProtectEnd" => ((time() + ($beginnerProtectionDuration * 24 * 60 * 60)) * 1000),

			"lastConnected" => 0,
			"lastAction" => 0,

			"points" => 47,
			"money" => 0,
			// Research
				"research" => [],
				"lastResearchUpdate" => 0,
			// Bonus journalier
				"lastBonus" => 0,
				"dayBonusStreak" => 0,
				"dayBonusBest" => 0,
				
		];
	}

	public function addUser($dbname, $user) {
		$this->addContent($dbname, 'users', $user);
	}
}