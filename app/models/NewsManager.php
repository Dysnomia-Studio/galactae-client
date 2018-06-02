<?php
class NewsManager extends MongoInterface {
	public function getLastNewsNumber() {
		$lastNews = $this->getCondContent('galactae','announces',
				['onGame' => 1]
		);

		$lastNewsNumber = 0;
		if(isset($lastNews[0])) {
			foreach($lastNews as $key => $value) {
				$value = (array) $value;
				if($value['_id'] > $max) {
					$lastNewsNumber = $value['_id'];
				}
			}
		}

		return $lastNewsNumber;
	}

	public function getAllGamesNews() {
		$gameNews = $this->getCondContent('galactae','announces',
				['onGame' => 1]
		);
		
		return $gameNews;
	}
}