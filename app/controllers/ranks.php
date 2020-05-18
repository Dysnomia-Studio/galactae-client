<?php
$rkMngr = new RanksManager();
$allyRkMngr = new AllyRanksManager();

// URL Parameters
$type = (isset($_GET['type']))?(string)$_GET['type']:'';

if(!in_array($type, ['players', 'ally'])) {
	$type = 'players';
}

$pageDemandee = (isset($_GET['page']))?(int)$_GET['page']-1:-1;
$user = (isset($_GET['user']))?$_GET['user']:'';
$ally = (isset($_GET['ally']))?$_GET['ally']:'';

if($user === '' && $pageDemandee < 0) {
	$user = $userData['user_name'];
}
if($ally === '' && $pageDemandee < 0 && isset($userGameData['ally'])) {
	$ally = $userGameData['ally'];
}

$ally='Test';

$pageData['ranks'] = [];
$pageData['pageCount'] = 0;
$pageData['pageOuverte'] = 0;

$pageDemandee = ($pageDemandee < 0) ? 0 : $pageDemandee;

if($type === 'players') {
	if($user !== '') {
		$pageData['ranks'] = $rkMngr->getGlobalListByName($user);
		$pageData['pageOuverte'] = 1 + ((int) $pageData['ranks'][0]['rank'])/15;
	} else {
		$pageData['ranks'] = $rkMngr->getGlobalListByPage($pageDemandee);
		$pageData['pageOuverte'] = $pageDemandee + 1;
	}

	$pageData['pageCount'] = $rkMngr->getGlobalListPageCount();

} else if($type === 'ally') {
	if($ally !== '') {
		$pageData['ranks'] = $allyRkMngr->getGlobalListByName($ally);
		$pageData['pageOuverte'] = 1 + ((int) $pageData['ranks'][0]['rank'])/15;
	} else {
		$pageData['ranks'] = $allyRkMngr->getGlobalListByPage($pageDemandee);
		$pageData['pageOuverte'] = $pageDemandee + 1;
	}

	$pageData['pageCount'] = $allyRkMngr->getGlobalListPageCount();
	$pageData['pageName'] = 'allyRanks.php';
}