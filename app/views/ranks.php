<?php
$noscript=true;

$pageContent = '';

if($loadCache !== '') {
	$pageContent = file_get_contents($loadCache);
} else {
	ob_start();

	?>
	<style type="text/css">
		body {
			font-family: 'Titillium Web', sans-serif;
			cursor: url(<?php echo $cdnURL; ?>img/mouse_cursor.png), auto;
			color: white;
			background-color: transparent !important;
		}
		a {
			text-decoration: none;
		}
		a:hover {
			text-decoration: underline;
		}

		#ranks-page {
			margin-top: 1em;

			float: right;
		}
		.ranks-curr-page {
			font-weight: bold;
		}
	</style>
	<?php
	echo '<table style="width: 100%; text-align: center;">
		<tr>
			<th>Rang</th>
			<th>Noms</th>
			<th>Points</th>
			<th>Planetes</th>
			<th>Alliances</th>
		</tr>';

	foreach ($pageData['ranks'] as $player) {
		echo '
		<tr>
			<td>'.$player['rank'].'</td>
			<td class="rank-name">'.$player['name'].'</td>
			<td>'.$player['points'].'</td>
			<td>'.$player['planets'].'</td>';

		if(!isset($player['ally']) || $player['ally']==null) {
			echo '
			<td>-</td>';
		} else {
			echo '
			<td>'.$player['ally'].'</td>';
		}

		echo '
		</tr>';
	}
	echo '</table>';

	echo '<div id="ranks-page">Page: ';

	if($sector != '') {
		$sector = '&sector='.$sector;
	}

	for($i=0; $i<$pageData['pageCount']; $i++) {
		if($i > 0) {
			echo ' - ';
		}

		$currPage = ($i+1);
		if($currPage === $pageData['pageOuverte']) {
			$currPage = '<span class="ranks-curr-page">'.$currPage.'</span>';
		}

		echo '<a href="ranks.php?type='.$type.$sector.'&page='.($i+1).'">'.$currPage.'</a>';
	}
	echo '</div>';

	$pageContent = ob_get_contents(); // copie du contenu du tampon dans une chaîne
    ob_end_clean(); // effacement du contenu du tampon et arrêt de son fonctionnement
    
    file_put_contents($cache, $pageContent); // on écrit la chaîne précédemment récupérée ($pageContent) dans un fichier ($cache)
}

// Draw page !
$pageContent = str_replace('<td class="rank-name">'.$userData['user_name'].'</td>', '<td class="rank-name"><em>'.$userData['user_name'].'</em></td>', $pageContent);

echo $pageContent; // on affiche notre page :D*/