<?php
class NewsManager extends MongoInterface {
	/**
	 * Gets the latest news number.
	 *
	 * @return     integer  The last news number.
	 */
	public function getLastNewsNumber() {
		$lastNews = $this->getCondContent('galactae','announces',
				['onGame' => 1]
		);

		$lastNewsNumber = 0;
		if(isset($lastNews[0])) {
			foreach($lastNews as $value) {
				$value = (array) $value;
				if($value['_id'] > $lastNewsNumber) {
					$lastNewsNumber = $value['_id'];
				}
			}
		}

		return $lastNewsNumber;
	}

	/**
	 * Gets all games news.
	 *
	 * @return     <array>  All games news.
	 */
	public function getAllGamesNews() {
		return $this->getCondContent('galactae','announces',
				['onGame' => 1]
		);
	}
}