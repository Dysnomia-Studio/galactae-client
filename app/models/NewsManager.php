<?php
class ServerListManager extends MongoInterface {
	public function getLastNewsNumber() {
		echo "0";
		$lastNews = $this->getCondContent('galactae','announces',
				['onGame' => 1]
		);

		echo "1";

		$lastNewsNumber = 0;
		if(isset($lastNews[0])) {
			foreach($lastNews as $key => $value) {
				$value = (array) $value;
				if($value['_id'] > $max) {
					$lastNewsNumber = $value['_id'];
				}
			}
		}

		echo "2";

		return $lastNewsNumber;
	}
}