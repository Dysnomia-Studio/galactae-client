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
}