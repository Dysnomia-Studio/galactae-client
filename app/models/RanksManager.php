<?php
class RanksManager extends SQLInterface {
	public function getGlobalListByName($player) {
		global $dbname;
		
		return $this->selectQuery('SELECT name, points, planets, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "globalRanks"
			WHERE server_name = :serverName
			OFFSET GREATEST((
				SELECT rank FROM (
					SELECT name, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
					FROM "globalRanks"
				) ranksList WHERE name = :userName
			) - 5, 0) LIMIT 10', 
		[
			'serverName' => $dbname,
			'userName' => $player
		]);
	}
}