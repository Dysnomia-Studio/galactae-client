<?php /* Loading Overlay */ ?>
<div id="loading-overlay">
	<div id="loading-overlay-text">Loading game ...</div>
	<img id="loading-overlay-img" src="img/load-gears.gif" alt="loading-overlay">
	<div id="loading-overlay-desc">Connecting to server ...</div>
</div>

<?php /* Planet View */ ?>
<div id="planet-content">
	<?php /* Msg Popup */ ?>
	<div id="messagePanel">
		
	</div>

	<?php /* Top HUD */ ?>
	<img id="hud-top-back" src="img/hud-top.png" alt="hud-top">
	<div id="hud-top">
		<div id="hud-top-left-content">
			<img height="20" src="img/population.png" alt="population"> <span class="nmb" id="population_nmb">1</span>
			<img height="20" src="img/research.png" alt="research"> <span class="nmb" id="research_nmb">1</span>
			<img height="20" src="img/moral.png" alt="moral"> <span class="nmb" id="moral_nmb">1</span>
			<span class="hud-top-tooltip">
				<img height="20" src="img/electricity.png" alt="electricity" > <span class="nmb" id="electricity_nmb">1</span>
				<span class="hud-top-tooltip-content">
					Production: XXX Kwh<br/>
					Consommation: XXX Kwh<br/>
				</span>
			</span>
		</div>
		<ul id="hud-top-center">
			<li id="hud-username"></li>
			<li id="hud-settings"><img height="20" src="img/settings.png" alt="settings"></li>
			<li id="hud-planet-prev">&#60;</li>
			<li id="hud-planet-name"><span class="planet-name-text"></span></li>
			<li id="hud-planet-next">&#62;</li>
			<li id="hud-user-money"><img height="20" src="img/money.png" alt="money"> <span class="nmb" id="money_nmb">1</span></li>
		</ul>
		<div id="hud-top-right-content">
			<span class="hud-top-tooltip">
				<img height="20" src="img/minerals.png" alt="minerals">
				<span class="nmb" id="minerals_nmb">1</span>
				<span class="hud-top-tooltip-content" id="minerals-tooltips">
					Capacité: <span id="minerals-cap">XXX t</span><br/>
					Production: <span id="minerals-prod">XXX t/h</span><br/>
					Consommation: <span id="minerals-cons">XXX t/h</span><br/>
				</span>
			</span>
			<span class="hud-top-tooltip">
				<span class="element">&sup3;He </span>
				<span class="nmb" id="he_nmb">1</span> 
				<span class="hud-top-tooltip-content" id="he-tooltips">
					Capacité: <span id="he-cap">XXX t</span><br/>
					Production: <span id="he-prod">XXX t/h</span><br/>
					Presence: <span id="he-variety">XXX t/h</span><br/>
				</span>
			</span>
			<span class="hud-top-tooltip">
				<span class="element">Al </span>
				<span class="nmb" id="aluminium_nmb">1</span>
				<span class="hud-top-tooltip-content" id="al-tooltips">
					Capacité: <span id="al-cap">XXX t</span><br/>
					Production: <span id="al-prod">XXX t/h</span><br/>
					Presence: <span id="al-variety">XXX t/h</span><br/>
				</span>
			</span>
			<span class="hud-top-tooltip">
				<span class="element" id="element_fe">Fe </span>
				<span class="nmb" id="iron_nmb">1</span> 
				<span class="hud-top-tooltip-content" id="fe-tooltips">
					Capacité: <span id="fe-cap">XXX t</span><br/>
					Production: <span id="fe-prod">XXX t/h</span><br/>
					Presence: <span id="fe-variety">XXX t/h</span><br/>
				</span>
			</span>
			<div class="hud-top-tooltip">
				<span class="element">Ti </span>
				<span class="nmb" id="titanium_nmb">1</span>
				<span class="hud-top-tooltip-content" id="ti-tooltips">
					Capacité: <span id="ti-cap">XXX t</span><br/>
					Production: <span id="ti-prod">XXX t/h</span><br/>
					Presence: <span id="ti-variety">XXX t/h</span><br/>
				</span>
			</div>
			<span class="hud-top-tooltip">
				<span class="element">Cu </span>
				<span class="nmb" id="copper_nmb">1</span>
				<span class="hud-top-tooltip-content" id="cu-tooltips">
					Capacité: <span id="cu-cap">XXX t</span><br/>
					Production: <span id="cu-prod">XXX t/h</span><br/>
					Presence: <span id="cu-variety">XXX t/h</span><br/>
				</span>
			</span>
		</div>
	</div>

	<?php /* ESC */ ?>
	<div id="settings-menu">
		<a href="#close-settings-tabs" id="close-settings-tabs">X</a><br/><br/>
		<a href="#settings-tabs"><?php echo SETTINGS; ?></a><br/><br/>
		<a href="https://***REMOVED***/portal.php"><?php echo PORTAL; ?></a><br/><br/>
		<a href="https://***REMOVED***/deconnexion.php"><?php echo DISCONNECT; ?></a>
	</div>

	<?php /* Buildings ( Details ) */ ?>
	<div id="building-area">	
		<h1 id="building-name">NOM DU BATIMENT</h1>
		<p id="building-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		<div id="building-cost">
		<?php echo '<span id="building-cost-iron">'.METAL_IRON.' : <span id="building-cost-iron-val"></span></span>
		<span id="building-cost-aluminium">'.METAL_ALUMINIUM.' : <span id="building-cost-aluminium-val"></span></span>
		<span id="building-cost-copper">'.METAL_COPPER.' : <span id="building-cost-copper-val"></span></span>
		<span id="building-cost-titanium">'.METAL_TITANIUM.' : <span id="building-cost-titanium-val"></span></span>
		<span id="building-cost-energy">'.ENERGY.' : <span id="building-cost-energy-val"></span></span>
		<span id="building-cost-time">'.TIME.' : <span id="building-cost-time-val"></span></span>';
		?>
		<input type="button" id="building-upgrade" value="<?php echo UPGRADE; ?>">
		</div>
		<img src="?" id="building-img" alt="building-img">
		<input type="button" id="building-quit" value="X" onclick="HideBuildPanel()">
	</div>

	<?php /* Ground Building */ ?>
	<div class="build-tab">
		<p class="build-title"><?php echo PLANET_BUILDING; ?></p>
		<img src="img/buildings-tabs/solar1.png" class="build-tab-building" id="solar" onclick="OpenBuildingPanel(4)" alt="solar">
		<span id="lvl-solar"></span>
		<img src="img/buildings-tabs/warehouse1.png" class="build-tab-building" id="warehouse"  onclick="OpenBuildingPanel(5)" alt="warehouse">
		<span id="lvl-warehouse"></span>
		<img src="img/buildings-tabs/tank1.png" class="build-tab-building" id="tank"  onclick="OpenBuildingPanel(6)" alt="tank">
		<span id="lvl-tank"></span>
		<img src="img/buildings-tabs/serre1.png" class="build-tab-building" id="serre"  onclick="OpenBuildingPanel(3)" alt="serre">
		<span id="lvl-serre"></span>
		<img src="img/buildings-tabs/living1.png" class="build-tab-building" id="living"  onclick="OpenBuildingPanel(2)" alt="living">
		<span id="lvl-living"></span>
		<img src="img/buildings-tabs/research1.png" class="build-tab-building" id="research"  onclick="OpenBuildingPanel(8)" alt="research">
		<span id="lvl-research"></span>
		<img src="img/buildings-tabs/metallurgy1.png" class="build-tab-building" id="metallurgy" height="70" onclick="OpenBuildingPanel(1)" alt="metallurgy">
		<span id="lvl-metallurgy"></span>
		<img src="img/buildings-tabs/launchpad1.png" class="build-tab-building" id="launchpad" height="70" onclick="OpenBuildingPanel(7)" alt="launchpad">
		<span id="lvl-launchpad"></span>
		<img src="img/buildings-tabs/carriere1.png" class="build-tab-building" id="carriere" width="70" onclick="OpenBuildingPanel(0)" alt="carriere">
		<span id="lvl-carriere"></span>
		<img src="img/buildings-tabs/0.png" class="build-tab-background" alt="building-tab">
	</div>

	<?php /* Space Building */ ?>
	<div class="space-tab">
		<p class="space-title"><?php echo ORBITAL_BUILDING; ?></p>
		<img src="img/buildings-tabs/space-tab.png" class="space-tab-background" alt="space-tab">
	</div>
</div>
<?php /* Chat */ ?>
<div id="hud-chat">
	<ul id="hud-chat-channels">
		<li title="hud-chat-global" class="chatTab chatActive"><?php echo CHAT_GLOBAL; ?></li>
		<li title="hud-chat-trade" class="chatTab"><?php echo CHAT_TRADE; ?></li>
		<li title="hud-chat-ally" class="chatTab"><?php echo CHAT_ALLY; ?></li>
	</ul>
	<div id="hud-chat-global" class="chatContent">
		<ul class="chat_logs">
			<li><?php echo CHAT_WELCOME; ?></li>
		</ul>
	</div>
	<div id="hud-chat-trade" class="chatContent">
		<ul class="chat_logs">
			<li><?php echo CHAT_WELCOME; ?></li>
		</ul>
	</div>
	<div id="hud-chat-ally" class="chatContent">
		<ul class="chat_logs">
			<li><?php echo CHAT_WELCOME; ?></li>
		</ul>
	</div>
	<form action="game.php" method="post" id="chat_form">
		<input type="text" name="chat_message" id="chat_message" placeholder="Votre message..." size="50" autocomplete="off" autofocus />
	</form>
</div>
<?php /* Buttons */ ?>
<span id="map-button"><?php echo HUD_MAP; ?></span>
<span id="chat-button"><?php echo HUD_CHAT; ?></span>
<span id="research-button"><?php echo HUD_RESEARCH; ?></span>
<span id="moves-button"><?php echo HUD_MOVES; ?></span>

<?php /* Map */ ?>
<div id="hud-map">	
	<canvas id="map" width="1920" height="940"></canvas>
</div>

<?php /* Game Version & Copyright */ ?>
<div id="game-version">Alpha-0.2.0-rev.170227a<br />Created By Elanis - Copyright 2016</div>

<?php /* Libs */ ?>
<script type="text/javascript" src="./lib/js/jquery.min.js"></script>
<script type="text/javascript" src="./lib/js/socket.min.js"></script>
<?php /* Language adaptation @ADD TO LANG LIBRARY */ ?>
<?php /* Cookies' Life */ ?>
<script type="text/javascript" src="./lib/js/cookies.js"></script>
<?php /* Init Client Vars */ ?>
<script type="text/javascript" src="./lib/js/global_vars.js"></script>
<?php /* Init Client Classes */ ?>
<script type="text/javascript" src="./lib/js/client.js"></script>
<script type="text/javascript" src="./lib/js/chat.js"></script>
<script type="text/javascript" src="./lib/js/planet.js"></script>
<script type="text/javascript" src="./lib/js/websockets.js"></script>
<script type="text/javascript" src="./lib/js/solarMap.js"></script>
<script type="text/javascript" src="./lib/js/ui.js"></script>
<?php /* Launch Game ! */ ?>
<script type="text/javascript" src="./lib/js/load.js"></script>
</body>
<?php /* Block Portrait Screens */ ?>
<div id="portrait-warn"><h1><?php echo PORTRAIT_ERROR; ?></h1></div>