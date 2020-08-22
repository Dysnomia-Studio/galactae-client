<?php
$debut = round(microtime(true) * 1000);
?>
<!DOCTYPE html>
<!--
	Code by Elanis
	Copyright 2016-<?= date('Y') ?>
	Don't copy this without permission
	I hope this code is readable.
-->
<html lang="<?= $lang->getLanguage(); ?>">
	<head>
		<?php
		include_once('gvars.php');

		include_once(DIR_CTRL.'redirect.php');
		include_once(DIR_CTRL.'auth.php');
		?>

		<title>Galactae: Space Age Dawn</title>
		<meta charset="UTF-8">
		<!-- On prepare le charset , les mots clés , le fichier css et l'icone du site -->
		<meta name="keywords" content="">
		<meta name="description" content="" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">

		<link rel="shortcut icon" type="image/png" href="<?php echo $cdnURL; ?>img/favicon.png"/>
		<link rel="stylesheet" media="screen" type="text/css" title="Design" href="<?php echo $cdnURL; ?>css/style.css"/>
		<link href="https://fonts.googleapis.com/css?family=Titillium+Web" rel="stylesheet">
		<meta name="theme-color" content="#0b1012"></head>

		<?php $lang->drawCached(); ?>
	</head>
	<body>
		<?php
			include_once(FILE_CONFIG);

			include_once(DIR_VIEW.'jsTranslation.php');

			if(file_exists(DIR_VIEW.$pageData['pageName']) || file_exists(DIR_CTRL.$pageData['pageName'])) {

				if(file_exists(DIR_CTRL.$pageData['pageName'])) {
					include(DIR_CTRL.$pageData['pageName']);
				}

				if(file_exists(DIR_VIEW.$pageData['pageName'])) {
					include(DIR_VIEW.$pageData['pageName']);
				} else {
					include(DIR_VIEW.'game.php');
				}
			} else {
					include(DIR_VIEW.'game.php');
			}
		?>
	</body>
	<!-- Page generated in <?= (round(microtime(true) * 1000) - $debut) ?> ms -->
</html>