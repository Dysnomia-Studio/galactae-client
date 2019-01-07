<?php
$noscript=true;

if(!isset($_GET['n'])) {
	die();
}

$news_needed = htmlspecialchars(htmlentities($_GET['n']));

if(!is_int((int) $news_needed)) {
	die();
}

$news_needed = (int) $news_needed;

$cache = DIR_CACHE.'news-'.$news_needed.'.html';

/* Say to db server, we seen a newer news */
if(!isset($userData['lastViewedNews']) || $userData['lastViewedNews'] < $news_needed) {
	$userMngr = new UserManager();
	$userMngr->updateUserLastNews($userData['_id'], $news_needed);
}

if(file_exists($cache)) {
	readfile($cache);
} else {
	ob_start();
	?>
	<style type="text/css">
		body {
			font-family: 'Titillium Web', sans-serif;
			cursor: url(<?php echo $cdnURL; ?>img/mouse_cursor.png), auto;
			color: white;
			background-color: transparent !important;

			padding: 2em;
		}

		h2 {
			text-align: center;
		}

		img {
			max-width: calc(100vw - 4em);
		}

		.older {
			float: left;
		}
		.newer {
			float: right;
		}
	</style>

	<?php
	$newsMng = new NewsManager();
	$newsList = $newsMng->getAllGamesNews();
	
	$curr = [];
	$next = -1;
	$prev = -1;
	$found = false;
	foreach ($newsList as $key => $value) {
		$value = (array) $value;

		if($found) {
			$next = $value['_id'];
			break;
		}

		if($curr != []) { $prev = $curr['_id']; }
		
		$curr = $value;

		if($curr["_id"] == $news_needed) { $found = true; }
	}

	if($curr == [] || !isset($curr['blog_title_'.$_SESSION['lang']])) {
		die();
	}

	/* Echo this news */
	echo "<article>
		<h2>".$curr['blog_title_'.$_SESSION['lang']]."</h2>
		<i>".date("d/m/Y",$curr['blog_time'])."</i>
		<br/>
		<br/>
		<div class=\"devblog-description\">
			".$curr['blog_desc_'.$_SESSION['lang']]."
		</div>
	</article><br/><br/>";

	/* Prev/Next */
	if($prev != -1) {
		echo '<a class="older" href="news.php?n='.$prev.'">'.OLDER_NEWS.'</a>';
	}
	if($next != -1) {
		echo '<a class="newer" href="news.php?n='.$next.'">'.NEWER_NEWS.'</a>';
	}

	$page = ob_get_contents(); // copie du contenu du tampon dans une chaîne
    ob_end_clean(); // effacement du contenu du tampon et arrêt de son fonctionnement
    
    file_put_contents($cache, $page); // on écrit la chaîne précédemment récupérée ($page) dans un fichier ($cache)

    echo $page ; // on affiche notre page :D
}
?>