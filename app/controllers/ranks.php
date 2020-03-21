<?php
$rkMngr = new RanksManager();
$allyRkMngr = new AllyRanksManager();

// URL Parameters
$type = (isset($_GET['type']))?(string)$_GET['type']:'';

if(!in_array($type, ['galaxy-players', 'galaxy-ally', 'sector-players', 'sector-ally'])) {
	$type = 'galaxy-players';
}

$pageDemandee = (isset($_GET['page']))?(int)$_GET['page']-1:-1;
$user = (isset($_GET['user']))?$_GET['user']:'';
$ally = (isset($_GET['ally']))?$_GET['ally']:'';

$sector = (isset($_GET['sector']))?$_GET['sector']:'4-4';
$sectorCoords = explode('-', $sector);
if(count($sectorCoords) != 2 ||
	intval($sectorCoords[0]) < 0 ||
	intval($sectorCoords[0]) > 9 ||
	intval($sectorCoords[1]) < 0 ||
	intval($sectorCoords[1]) > 9) {

	$sector = '4-4';
}

if(explode('-', $type)[0] !== 'sector') {
	$sector = '';
}

if($user === '' && $pageDemandee < 0) {
	$user = $userData['user_name'];
}
if($ally === '' && $pageDemandee < 0 && isset($userGameData['ally'])) {
	$ally = $userGameData['ally'];
}

// Cache
$cache = DIR_CACHE.'ranks-'.$type;
if($pageDemandee >= 0) {
	$cache .= '-page'.$pageDemandee;
}
if($user != '') {
	$cache .= '-user'.$user;
}
if($ally != '') {
	$cache .= '-ally'.$ally;
}
if($sector != '') {
	$cache .= '-sector'.$sector;
}
$cache .= '.html';

$expire = time() - 600; // 10 min

$loadCache = '';
$pageData['ranks'] = [];
$pageData['pageCount'] = 0;
$pageData['pageOuverte'] = 0;

$pageDemandee = ($pageDemandee < 0) ? 0 : $pageDemandee;

if(file_exists($cache) && filemtime($cache) > $expire) {
	$loadCache = $cache;
} else {
	if($type === 'galaxy-players') {
		if($user !== '') {
			$pageData['ranks'] = $rkMngr->getGlobalListByName($user);
			$pageData['pageOuverte'] = 1 + ((int) $pageData['ranks'][0]['rank'])/15;
		} else {
			$pageData['ranks'] = $rkMngr->getGlobalListByPage($pageDemandee);
			$pageData['pageOuverte'] = $pageDemandee + 1;
		}

		$pageData['pageCount'] = $rkMngr->getGlobalListPageCount();

	} else if($type === 'sector-players') {
		if($user !== '') {
			$pageData['ranks'] = $rkMngr->getSectorListByNameAndSector($user, $sector);
			$pageData['pageOuverte'] = 1 + ((int) $pageData['ranks'][0]['rank'])/15;
		} else {
			$pageData['ranks'] = $rkMngr->getSectorListByPage($pageDemandee, $sector);
			$pageData['pageOuverte'] = $pageDemandee + 1;
		}

		$pageData['pageCount'] = $rkMngr->getSectorListPageCount($sector);

	} else if($type === 'galaxy-ally') {
		if($ally !== '') {
			$pageData['ranks'] = $allyRkMngr->getGlobalListByName($user);
			$pageData['pageOuverte'] = 1 + ((int) $pageData['ranks'][0]['rank'])/15;
		} else {
			$pageData['ranks'] = $allyRkMngr->getGlobalListByPage($pageDemandee);
			$pageData['pageOuverte'] = $pageDemandee + 1;
		}

		$pageData['pageCount'] = $allyRkMngr->getGlobalListPageCount();
		$pageData['pageName'] = 'allyRanks.php';

	} else if($type === 'sector-ally') {
		if($ally !== '') {
			$pageData['ranks'] = $allyRkMngr->getSectorListByNameAndSector($user, $sector);
			$pageData['pageOuverte'] = 1 + ((int) $pageData['ranks'][0]['rank'])/15;
		} else {
			$pageData['ranks'] = $allyRkMngr->getSectorListByPage($pageDemandee, $sector);
			$pageData['pageOuverte'] = $pageDemandee + 1;
		}

		$pageData['pageCount'] = $allyRkMngr->getSectorListPageCount($sector);
		$pageData['pageName'] = 'allyRanks.php';
	}
}