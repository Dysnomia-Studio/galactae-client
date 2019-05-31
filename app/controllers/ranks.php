<?php 
$rkMngr = new RanksManager();

// URL Parameters
$type = (isset($_GET['type']))?(string)$_GET['type']:'';

if(!in_array($type, ['galaxy-players', 'galaxy-ally', 'sector-players', 'sector-ally'])) {
	$type = 'galaxy-players';
}

$pageDemandee = (isset($_GET['page']))?(int)$_GET['page']-1:-1;
$user = (isset($_GET['user']))?$_GET['user']:'';

if($user === '' && $pageDemandee < 0) {
	$user = $userData['user_name'];
}

// Cache
$cache = DIR_CACHE.'ranks-'.$type;
if($pageDemandee >= 0) {
	$cache .= '-page'.$pageDemandee;
}
if($user != '') {
	$cache .= '-user'.$user;
}
$cache .= '.html';

$expire = time() - 600; // 10 min

$loadCache = '';
$pageData['ranks'] = [];

if(file_exists($cache) && filemtime($cache) > $expire) {
	$loadCache = $cache;
} else {
	if($type === 'galaxy-players' && !isset($_GET['page'])) {
		$pageData['ranks'] = $rkMngr->getGlobalListByName($userData['user_name']);
	} else {
		// @TODO
	}
}