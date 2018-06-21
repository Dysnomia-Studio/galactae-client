<?php
function redirect($page) {
	switch ($page) {
		case 'reload':
			echo '<script> window.location.reload(); </script>';
			break;
		case 'main-home':
			echo '<script> window.location="https://galactae.eu"; </script>';
			break;
		case 'login':
			echo '<script> window.location="https://galactae.eu/login"; </script>';
			break;
		case 'maintenance':
			echo '<script> window.location="https://galactae.eu/portal?kickmsg=MAINTENANCE_ONGOING"; </script>';
			break;
		default:
			break;
	}

	die();
}
?>
