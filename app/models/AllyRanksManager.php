<?php
class AllyRanksManager extends SQLInterface {
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
				$this->selectQuery('SELECT COUNT(*) as "allyCount" FROM "alliances_ranks"',
					[],
					true)['allyCount']
			/15);
	}

	public function getGlobalListByName($ally) {
		return $this->selectQuery('SELECT *, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "alliances_ranks"
			OFFSET GREATEST((
				SELECT rank FROM (
					SELECT name, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
					FROM "alliances_ranks"
				) ranksList WHERE name = :allyName
			) - 8, 0) LIMIT 15',
		[
			'allyName' => $ally
		]);
	}

	public function getGlobalListByPage($page) {
		return $this->selectQuery('SELECT *, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "alliances_ranks"
			OFFSET :beginRank LIMIT 15',
		[
			'beginRank' => $page*15
		]);
	}
}