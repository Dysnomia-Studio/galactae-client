<?php
// Verif du client sur mongo
$manager = new MongoDB\Driver\Manager("***REMOVED***");

$filter = ['name' => $_COOKIE['galactae-account-username'] ];

$query = new MongoDB\Driver\Query($filter);
$cursor = $manager->executeQuery('spacegame.users', $query);

$mongoData = array();

foreach ($cursor as $document) {
    foreach ($document as $key => $value) {
    	$mongoData[$key] = $value;
    }
    break;
}

if(!isset($mongoData['name'])) { // Verif d'existance du compte ( côté Mongo ) => Panel de choix de gvt
?>
<div id="gvt-choicelist">
	<div class="gvt-choice">
		<h1>Président</h1>
		<p>En tant que président, vous êtes représentant de votre parti politique. Vous prenez le contrôle des planètes où votre parti a été élu officiellement (enfin presque).</p>

		<span id="choosebtn1" class="gvt-choosebtn gvt-btn">Choisir !</span>
	</div>
	<div class="gvt-choice">
		<h1>PDG</h1>
		<p>Le PDG d'un conglomérat dirige son entreprise et les planètes possedées par celle-ci. Votre conglomérat pourra agrandir son influence en achetant des planètes, en respectant plus ou moins les lois.</p>

		<span id="choosebtn2" class="gvt-choosebtn gvt-btn">Choisir !</span>
	</div>
	<div class="gvt-choice">
		<h1>Empereur</h1>
		<p>L'Empreur est le héros du peuple, il libère vailliamant les planètes sous le joug des tyrans, les révolutions populaires sont la voix d'accession au pouvoir de l'empereur. Et bien sûr, l'empreur n'a jamais tord ...</p>

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

			choice.value = chx;

			switch(chx) {
				case 1:
					choice1.className = "gvt-choosebtn gvt-btn gvt-btn-active";
				break;
				case 2:
					choice2.className = "gvt-choosebtn gvt-btn gvt-btn-active";
				break;
				case 3:
					choice3.className = "gvt-choosebtn gvt-btn gvt-btn-active";
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
	$db->updateContent('users',
			["user_name",$_COOKIE['galactae-account-username']],
			["game_id",$mongoData['_id']]);

	$_SESSION['game_id'] = $mongoData['_id'];

	header('Location: index.php');
}
?>