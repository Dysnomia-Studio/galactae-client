<?php 
$cdnURL = "./cdn/";
$dburl = "***REMOVED***";
$dbname = "galactae-00";
$serverName = "dev";
$beginnerProtectionDuration = 7;

if(!isset($noscript)) {
?>
<script type="text/javascript" src="<?= $cdnURL ?>js/cookies.js"></script>
<script type="text/javascript">
	let userData = {
		username: "",
		id: "",
		pid: getCookie('galactae-account-pid'),
		money: 0,
		gvt: 1,
		research: {}
	};

	let gameServer = "00-srv.galactae.eu";
	let cdnURL = "<?php echo $cdnURL; ?>";
	let serverName = "<?php echo $serverName; ?>";

	function setGvars(id,user) {
		userData.username = user;
		userData.id = id;
	}
</script>
<?php 
}
?>