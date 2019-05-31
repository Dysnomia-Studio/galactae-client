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
	</style>
	<?php
	echo '<table style="width: 100%; text-align: center;">
		<tr>
			<th>Rang</th>
			<th>Noms</th>
			<th>Points</th>
			<th>Planetes</th>
			<th>Alliance</th>
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

	$pageContent = ob_get_contents(); // copie du contenu du tampon dans une chaîne
    ob_end_clean(); // effacement du contenu du tampon et arrêt de son fonctionnement
    
    file_put_contents($cache, $pageContent); // on écrit la chaîne précédemment récupérée ($pageContent) dans un fichier ($cache)
}

// Draw page !
$pageContent = str_replace($userData['user_name'], '<em>'.$userData['user_name'].'</em>', $pageContent);

echo $pageContent; // on affiche notre page :D*/