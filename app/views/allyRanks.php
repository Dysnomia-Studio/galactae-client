<?php
$noscript=true;
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
		<th>Membres</th>
	</tr>';

foreach ($pageData['ranks'] as $ally) {
	echo '
	<tr>
		<td>'.$ally['rank'].'</td>
		<td class="rank-name">'.$ally['name'].'</td>
		<td>'.number_format($ally['points'], 0, ',', ' ').'</td>
		<td>'.$ally['planetscount'].'</td>
		<td>'.$ally['memberscount'].'</td>
	</tr>';
}
echo '</table>';

echo '<div id="ranks-page">Page: ';

for($i=0; $i<$pageData['pageCount']; $i++) {
	if($i > 0) {
		echo ' - ';
	}

	$currPage = ($i+1);
	if($currPage === $pageData['pageOuverte']) {
		$currPage = '<span class="ranks-curr-page">'.$currPage.'</span>';
	}

	echo '<a href="ranks.php?type='.$type.'&page='.($i+1).'">'.$currPage.'</a>';
}
echo '</div>';