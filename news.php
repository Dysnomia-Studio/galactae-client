<?php
$noscript=true;
include_once('gvars.php');

if(!isset($_GET['n'])) {
	die();
}

$news_needed = htmlspecialchars(htmlentities($_GET['n']));

if(!is_int((int) $news_needed)) {
	die();
}

$cache = 'cache/news-'.$news_needed.'.html';
$expire = time() - 600; // 10 min

/* Say to SQL server, we seen a newer news */
$newsList = $sqlDB->updateQuery(
	"UPDATE user_list SET lastViewedNews = :viewedNews  WHERE user_id = :user_id AND lastViewedNews < :viewedNews",
	[ "user_id" => $userData['user_id'],
	  "viewedNews" => $news_needed ]);

if(file_exists($cache) && filemtime($cache) > $expire) {
	readfile($cache);
} else {
	ob_start();
	?>
	<style type="text/css">
		@import url('https://fonts.googleapis.com/css?family=Titillium+Web');

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
	$limit = ($news_needed<10)?0:($news_needed - 10);

	$newsList = $sqlDB->selectQuery(
		"SELECT * FROM announces WHERE onGame = 1 ORDER BY blog_id LIMIT :searched_id, 10",
		[ "searched_id" => $limit ]);

	$prev = -1;
	$curr = [];
	$next = -1;

	/* Search the needed elements */
	foreach ($newsList as $key => $news) {
		if($news['blog_id'] < $news_needed) {
			$prev = $news['blog_id'];
		} elseif ($news['blog_id'] == $news_needed) {
			$curr = $news;
		} else {
			$next = $news['blog_id'];
			break; // Stop it, we got all
		}
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