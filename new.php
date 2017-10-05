<?php
// Verif du client sur mongo
$manager = new MongoDB\Driver\Manager($dburl );

$filter = ['name' => $_SESSION['username'] ];

$query = new MongoDB\Driver\Query($filter);
$cursor = $manager->executeQuery($dbname.'.users', $query);

$mongoData = $cursor->toArray();

if(!isset($mongoData['name'])) { // Verif d'existance du compte ( côté Mongo ) => Panel de choix de gvt
?>
<div id="gvt-choicelist">
	<div class="gvt-mainText">
		Bienvenue <?php echo $data['user_name']; ?> ! Quel type de dirigant êtes vous ?
	</div>
	<div class="gvt-choice">
		<h1>Président</h1>
		<div class="gvt-desc">
			<p>Il est la tête de proue de son parti politique depuis peu, mais il fait déjà parler de lui. Les foules s'assemblent rien qu'à l'énonciation de son nom, et il compte bien se servir de cet avantage pour accroitre son emprise sur la galaxie.
			<br/>
			Sa carrière lui a permis de savoir cerner les besoins des gens, et ainsi sous sa direction, le peuple est plus facilement satisfait.
			</p>
		</div>
		<span id="choosebtn1" class="gvt-choosebtn gvt-btn">Choisir !</span>
	</div>
	<div class="gvt-choice">
		<h1>PDG</h1>
		<div class="gvt-desc">
			<p>À la tête d'un conglomérat, il dirige ses planètes dans le but de toujours augmenter ses profits. Il lui a fallu faire des OPA chez ses concurrents afin de prendre le contrôle de sa planète, et cette expérience lui permettra d'en prendre d'autres ...<br/>
			Sa grande maîtrise des outils économiques va lui permettre d'éviter les taxes galactiques lors des échanges commerciaux</p>
		</div>
		<span id="choosebtn2" class="gvt-choosebtn gvt-btn">Choisir !</span>
	</div>
	<div class="gvt-choice">
		<h1>Empereur</h1>
		<div class="gvt-desc">
			<p>L'Empreur est le héros du peuple, il libère vailliamant les planètes sous le joug des tyrans. Un coup d'êtat après l'autre, il augmente son emprise sur la galaxie ...
			<br/>
			Il dirige d'une main de fer ses armées, ce qui lui permet une meilleur efficacité lors des combat</p>
		</div>
		<span id="choosebtn3" class="gvt-choosebtn gvt-btn">Choisir !</span>
	</div>

	<span id="gvt-confbtn" class="gvt-btn">Commencer l'aventure !</span>
</div>

<form method="post" action="index.php" id="choose">
	<input type="hidden" value="-1" id="choice" name="choice">
</form>

<script type="text/javascript">
	window.addEventListener('load',function() {
		var choice = document.getElementById('choice');
		var choice1 = document.getElementById('choosebtn1');
		var choice2 = document.getElementById('choosebtn2');
		var choice3 = document.getElementById('choosebtn3');
		var confirm = document.getElementById('gvt-confbtn');
		var form = document.getElementById('choose');

		function setActive(chx) {
			choice1.className = "gvt-choosebtn gvt-btn";
			choice2.className = "gvt-choosebtn gvt-btn";
			choice3.className = "gvt-choosebtn gvt-btn";

			switch(chx) {
				case 1:
					choice1.className = "gvt-choosebtn gvt-btn gvt-btn-active";
					choice.value = chx;
				break;
				case 2:
					choice2.className = "gvt-choosebtn gvt-btn gvt-btn-active";
					choice.value = chx;
				break;
				case 3:
					choice3.className = "gvt-choosebtn gvt-btn gvt-btn-active";
					choice.value = chx;
				break;
				default:
					// Do Nothing
			}
		}

		choice1.addEventListener('click',function() { setActive(1); });
		choice2.addEventListener('click',function() { setActive(2); });
		choice3.addEventListener('click',function() { setActive(3); });

		confirm.addEventListener('click',function() {
			form.submit();
		});
	});
</script>
<?php
} else { // Update du SQL (autofix)
	$db->updateContent('user_game_id',
			[["user_id",$data['user_id']]],
			[["game_id",$mongoData['_id']]]);

	$_SESSION['game_id'] = $mongoData['_id'];

	echo '<script> window.location.reload(); </script>';
}
?>