<?php
var_dump($_GET);
if(!isset($_GET['n'])) {
	die();
}

echo "1";

$news_needed = htmlspecialchars(htmlentities($_GET['n']));

if(!is_int((int) $news_needed)) {
	die();
}

echo "2";

$newsList = $sqlDB->selectQuery(
	"SELECT * FROM announces WHERE onGame = 1 ORDER BY blog_id LIMIT :searched_id, 10",
	[ "searched_id" => ($news_needed - 10) ]);

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

echo "3";


/* Say to SQL server, we seen a newer news */
$newsList = $sqlDB->updateQuery(
	"UPDATE user_list SET lastViewedNews = :viewedNews  WHERE user_id = :user_id AND lastViewedNews < :viewedNews",
	[ "user_id" => $userData['user_id'],
	  "viewedNews" => $curr['blog_id'] ]);

/* Echo this news */
echo "<article>
	<h2>".$curr['blog_title_'.$_SESSION['lang']]."</h2>
	<i>".date("d/m/Y",$curr['blog_time'])."</i>
	<br/>
	<br/>
	<div class=\"devblog-description\">
		".$curr['blog_desc_'.$_SESSION['lang']]."
	</div>
</article>";

/* Prev/Next */
if($prev != -1) {
	echo '<a href="news.php?n='.$prev.'>'.OLDER_NEWS.'</a>';
}
if($prev != -1 && $next != -1) {
	echo " - ";
}
if($next != -1) {
	echo '<a href="news.php?n='.$prev.'>'.NEWER_NEWS.'</a>';
}