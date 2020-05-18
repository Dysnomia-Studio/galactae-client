<?php
class RanksManager extends SQLInterface {
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
	
	public function getGlobalListPageCount() {
		return ceil(
				$this->selectQuery('SELECT COUNT(*) as "plyCount"
					FROM "player_ranks"',
				[],
				true)['plyCount']
			/15);
	}

	public function getGlobalListByName($player) {
		
		return $this->selectQuery('SELECT name, points, planets, ally, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "player_ranks"
			OFFSET GREATEST((
				SELECT rank FROM (
					SELECT name, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
					FROM "player_ranks"
				) ranksList WHERE name = :userName
			) - 8, 0) LIMIT 15',
		[
			'userName' => $player
		]);
	}

	public function getGlobalListByPage($page) {
		global $dbname;
		
		return $this->selectQuery('SELECT name, points, planets, ally, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "player_ranks"
			OFFSET :beginRank LIMIT 15',
		[
			'beginRank' => $page*15
		]);
	}

	public function getGlobalListByGameIdAndServer($gameId) {
		
		return $this->selectQuery('SELECT name, points, planets, ally, (
				SELECT rank FROM (
					SELECT game_id, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
					FROM "player_ranks"
				) ranksList WHERE game_id = :game_id
			) AS rank
			FROM "player_ranks"
			WHERE game_id = :game_id',
		[
			'game_id' => $gameId
		]);
	}
}