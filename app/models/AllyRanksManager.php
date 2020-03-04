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
		global $dbname;

		return ceil(
				$this->selectQuery('SELECT COUNT(*) as "allyCount" FROM "alliances_points"',
					[],
					true)['allyCount']
			/15);
	}

	public function getGlobalListByName($ally) {
		global $dbname;
		
		return $this->selectQuery('SELECT *, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "alliances_points"
			OFFSET GREATEST((
				SELECT rank FROM (
					SELECT name, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
					FROM "alliances_points"
				) ranksList WHERE name = :allyName
			) - 8, 0) LIMIT 15',
		[
			'allyName' => $ally
		]);
	}

	public function getGlobalListByPage($page) {
		global $dbname;
		
		return $this->selectQuery('SELECT *, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "alliances_points"
			OFFSET :beginRank LIMIT 15',
		[
			'beginRank' => $page*15
		]);
	}

	public function getSectorListPageCount($sector) {
		global $dbname;

		return ceil(
				$this->selectQuery('SELECT COUNT(*) as "allyCount"
					FROM "alliances_points_sector"
					WHERE sector = :sector',
				[
					'sector' => $sector
				],
				true)['allyCount']
			/15);
	}

	public function getSectorListByNameAndSector($allyName, $sector) {
		global $dbname;
		
		return $this->selectQuery('SELECT *, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "alliances_points_sector"
			WHERE sector = :sector
			OFFSET GREATEST((
				SELECT rank FROM (
					SELECT name, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
					FROM "alliances_points_sector"
					WHERE sector = :sector
				) ranksList WHERE name = :allyName
			) - 8, 0) LIMIT 15',
		[
			'allyName' => $allyName,
			'sector' => $sector
		]);
	}

	public function getSectorListByPage($page, $sector) {
		global $dbname;
		
		return $this->selectQuery('SELECT *, ROW_NUMBER() OVER(ORDER BY points DESC) AS rank
			FROM "alliances_points_sector"
			WHERE sector = :sector
			OFFSET :beginRank LIMIT 15',
		[
			'beginRank' => $page*15,
			'sector' => $sector
		]);
	}
}