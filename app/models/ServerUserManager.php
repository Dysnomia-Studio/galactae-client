<?php
class ServerUserManager extends MongoInterface {
	public function getServerByName($srvName, $name) {
		$data = $this->getCondContent($srvName,'users',
			["name" => $name]
		);

		if(isset($data[0])) {
			$data = (array) $data[0];
		}

		return $data;
	}
}