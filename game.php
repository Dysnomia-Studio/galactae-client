<?php /* Loading Overlay */ ?>
<div id="loading-overlay">
	<div id="loading-overlay-back"></div>
	<img id="loading-overlay-img" src="img/load-gears.gif" alt="loading-overlay">
	<div id="loading-overlay-text"><?php echo GAME_LOADING; ?></div>
</div>
<?php /* Planet View */ ?>
<div id="planet-content">
	<?php /* Planet Back */ ?>
	<div id="planet-back">
		<div id="planet-back-bg"></div>
		<div id="planet-back-sphere">
			<div id="planet-back-content"></div>
			<div id="planet-back-halo"></div>
		</div>
	</div>
	<?php /* Buildings ( Details ) */ ?>
	<div id="building-area">	
		<h1 id="building-name"></h1>
		<p id="building-desc"></p>
		<div id="building-cost">
			<?php echo '<span id="building-cost-iron">'.METAL_IRON.' : <span id="building-cost-iron-val"></span></span>
			<span id="building-cost-aluminium">'.METAL_ALUMINIUM.' : <span id="building-cost-aluminium-val"></span></span>
			<span id="building-cost-copper">'.METAL_COPPER.' : <span id="building-cost-copper-val"></span></span>
			<span id="building-cost-titanium">'.METAL_TITANIUM.' : <span id="building-cost-titanium-val"></span></span>
			<span id="building-cost-energy">'.ENERGY.' : <span id="building-cost-energy-val"></span></span>
			<span id="building-cost-time">'.TIME.' : <span id="building-cost-time-val"></span></span>';
			?>
		</div>

		<span id="building-message"></span>
		<input type="button" id="building-upgrade" class="ui-large-button" value="<?php echo UPGRADE; ?>">
		
		<img src="?" id="building-img" alt="building-img">
		<input type="button" id="building-quit" value="X" onclick="ui.buildPanelHide()">
	</div>
	<?php /* Ground Building */ ?>
	<div class="build-tab">
		<p class="build-title"><?php echo PLANET_BUILDING; ?></p>
		<img src="img/buildings/tabs/0.png" class="build-tab-background" alt="building-tab">
		<?php
			$buildings = [
				"carriere",
				"metallurgy",
				"living",
				"serre",
				"solar",
				"warehouse",
				"headquarter",
				"launchpad",
				"research",

				"radar",
				"tank",
				"shipyard",
				"trade",
				"he3exp"
			];

			for($i=0; $i<9; $i++) {
				echo '<img src="img/buildings/icons/'.$buildings[$i].'1.png" class="build-tab-building" id="'.$buildings[$i].'" onclick="ui.buildPanelOpen('.$i.')" alt="'.$buildings[$i].'">
					<span id="lvl-'.$buildings[$i].'"></span>
					<img id="arrow-'.$buildings[$i].'" src="img/buildings/arrow.png" alt="can be build">';
			}
		?>
	</div>

	<?php /* Space Building */ ?>
	<div class="space-tab">
		<p class="space-title"><?php echo ORBITAL_BUILDING; ?></p>
		<img src="img/buildings/tabs/space-tab.png" class="space-tab-background" alt="space-tab">
		<?php
			for($i=9; $i<14; $i++) {
				echo '<img src="img/buildings/icons/'.$buildings[$i].'1.png" class="build-tab-building" id="'.$buildings[$i].'" onclick="ui.buildPanelOpen('.$i.')" alt="'.$buildings[$i].'">
					<span id="lvl-'.$buildings[$i].'"></span>
					<img id="arrow-'.$buildings[$i].'" src="img/buildings/arrow.png" alt="can be build">';
			}
		?>
	</div>
</div>
<?php /* Msg Popup */ ?>
<div id="messagePanel-div"><span id="messagePanel"></span></div>
<?php /* Top HUD */ ?>
<div id="hud-top">
	<img id="hud-top-back" src="img/ui/hud-top.png" alt="hud-top">
	<div id="hud-top-left-content">
		<img height="20" src="img/ui/population.png" alt="population"> <span class="nmb" id="population_nmb">1</span>
		<img height="20" src="img/ui/research.png" alt="research"> <span class="nmb" id="research_nmb">1</span>
		<img height="20" src="img/ui/moral.png" alt="moral"> <span class="nmb" id="moral_nmb">1</span>
		<span class="hud-top-tooltip">
			<img height="20" src="img/ui/electricity.png" alt="electricity" > <span class="nmb" id="electricity_nmb">1</span>
			<span class="hud-top-tooltip-content">
				Production: <span id="electricity-prod">XXX Kwh</span><br/>
				Consommation: <span id="electricity-cons">XXX Kwh</span><br/>
			</span>
		</span>
	</div>
	<ul id="hud-top-center">
		<li id="hud-username"><a href="https://galactae.elanis.eu/profil" target="_blank"><?php echo $_COOKIE['galactae-account-username'];?></a></li>
		<li id="hud-settings"><img height="20" src="img/ui/settings.png" alt="settings"></li>
		<li id="hud-planet-prev" onclick="planet.prev();">&#60;</li>
		<li id="hud-planet-name"><span class="planet-name-text"></span></li>
		<li id="hud-planet-next" onclick="planet.next();">&#62;</li>
		<li id="hud-user-money"><img height="20" src="img/ui/money.png" alt="money"> <span class="nmb" id="money_nmb">1</span></li>
	</ul>
	<div id="hud-top-right-content">
		<?php
			$topRightContent = [
				// Nom | Symbole | Capacite | Production | Consommation | Taux de presence
				["minerals",'<img height="20" src="img/ui/minerals.png" alt="minerals">',1,1,1,0],
				["he",'<span class="element">&sup3;He </span>',1,1,0,0],
				["al",'<span class="element">Al </span>',1,1,0,1],
				["fe",'<span class="element" id="element_fe">Fe </span>',1,1,0,1],
				["ti",'<span class="element">Ti </span>',1,1,0,1],
				["cu",'<span class="element">Cu </span>',1,1,0,1]
			];

		for($i=0; $i<count($topRightContent); $i++) {
			echo '
			<span class="hud-top-tooltip">
				'.$topRightContent[$i][1].'
				<span class="nmb" id="'.$topRightContent[$i][0].'_nmb">1</span>
				<span class="hud-top-tooltip-content" id="'.$topRightContent[$i][0].'-tooltips">';

			if($topRightContent[$i][2]) { echo 'Capacité: <span id="'.$topRightContent[$i][0].'-cap">XXX t</span><br/>'; }
			if($topRightContent[$i][3]) { echo 'Production: <span id="'.$topRightContent[$i][0].'-prod">XXX t</span><br/>'; }
			if($topRightContent[$i][4]) { echo 'Consommation: <span id="'.$topRightContent[$i][0].'-cons">XXX t</span><br/>'; }
			if($topRightContent[$i][5]) { echo 'Presence: <span id="'.$topRightContent[$i][0].'-variety">XXX t</span><br/>'; }

			echo'</span></span>';
		}
		?>
	</div>
</div>
<?php /* ESC */ ?>
<div id="settings-menu">
	<br/>
	<a href="#close-settings-tabs" id="close-settings-tabs">X</a><br/>
	<a href="#settings-tabs"><?php echo SETTINGS; ?></a><br/>
	<a href="https://galactae.elanis.eu/portal"><?php echo PORTAL; ?></a><br/>
	<a href="https://galactae.elanis.eu/deconnexion"><?php echo DISCONNECT; ?></a>
</div>
<?php /* Chat */ ?>
<div id="hud-chat">
	<ul id="hud-chat-channels" class="ul-choice-line">
		<li chatChannel="hud-chat-global" class="chatTab ul-choice-line-li-active"><?php echo CHAT_GLOBAL; ?></li>
		<li chatChannel="hud-chat-trade" class="chatTab"><?php echo CHAT_TRADE; ?></li>
		<li chatChannel="hud-chat-ally" class="chatTab"><?php echo CHAT_ALLY; ?></li>
	</ul>
	<div id="hud-chat-global" class="chatContent"><ul class="chat_logs"><li><?php echo CHAT_WELCOME; ?></li></ul></div>
	<div id="hud-chat-trade" class="chatContent"><ul class="chat_logs"><li><?php echo CHAT_WELCOME; ?></li></ul></div>
	<div id="hud-chat-ally" class="chatContent"><ul class="chat_logs"><li><?php echo CHAT_WELCOME; ?></li></ul></div>
	<form action="game.php" method="post" id="chat_form">
		<input type="text" name="chat_message" id="chat_message" placeholder="Votre message..." size="50" autocomplete="off" />
	</form>
</div>
<?php /* Ranks */ ?>
<div id="hud-ranks">
	<span id="hud-ranks-close">X</span>
	<iframe id="hud-ranks-frame" src="ranks.php"></iframe>
</div>
<?php /* Buttons */ ?>
<div id="hud-buttons">
	<span id="map-button"><?php echo HUD_MAP; ?></span>
	<span id="chat-button"><?php echo HUD_CHAT; ?></span>
	<span id="fleet-button"><?php echo HUD_FLEET; ?></span>
	<span id="ranks-button"><?php echo HUD_RANKS; ?></span>
	<span id="research-button"><?php echo HUD_RESEARCH; ?></span>
</div>
<?php /* Map */ ?>
<div id="hud-map">	
	<h1 style="text-align: center; color: white;">Bientôt Disponible ...</h1>
</div>
<?php /* Fleet */ ?>
<div id="hud-fleet">
	<span id="hud-fleet-close">X</span>

	<ul class="ul-choice-line fleet-ul1">
		<li id="fleet-build-button" class="ul-choice-line-li-active"><?php echo FLEET_BUILD; ?></li>
		<li id="fleet-orbit-button"><?php echo FLEET_ORBIT; ?></li>
		<li id="fleet-move-button"><?php echo FLEET_MOVE; ?></li>
		<li id="fleet-out-button"><?php echo FLEET_OUT; ?></li>
	</ul>
	<?php /* Fleet Building */ ?>
	<div id="fleet-build">
		<ul id="fleet-build-choice" class="ul-choice-line fleet-ul2">
			<li shipType="-1" id="fleet-build-all-button" class="ul-choice-line-li-active"><?php echo FLEET_BUILD_ALL; ?></li>
			<li shipType="0" id="fleet-build-defense-button"><?php echo FLEET_BUILD_DEF; ?></li>
			<li shipType="1" id="fleet-build-fighter-button"><?php echo FLEET_BUILD_FIGHTER; ?></li>
			<li shipType="2" id="fleet-build-cruisader-button"><?php echo FLEET_BUILD_CUISADER; ?></li>
			<li shipType="3" id="fleet-build-cuirasse-button"><?php echo FLEET_BUILD_CUIRASSE; ?></li>
			<li shipType="4" id="fleet-build-corvette-button"><?php echo FLEET_BUILD_CORVET; ?></li>
			<li shipType="5" id="fleet-build-carrier-button"><?php echo FLEET_BUILD_CARRIER; ?></li>
		</ul>
		<div id="fleet-build-content">
			<h2 id="fleet-build-list-empty">Vous n'avez encore aucun modèle</h2>
			<table id="fleet-build-list">
				<thead>
					<tr>
						<th><?php echo FLEET_BUILD_NAME; // Le nom du vaisseau 					?></th>
						<th><?php echo FLEET_BUILD_TYPE; // Le type de vaisseau 				?></th>
						<th><?php echo FLEET_BUILD_NOTE; // Sa note estimée par le systeme		?></th>
						<th><?php echo FLEET_BUILD_N_OWN; // Le nombre de ces vaisseaux possédés?></th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>

			<div id="fleet-build-info">
				<input type="button" id="fleet-build-create" name="fleet-build-new-model" class="ui-large-button" value="<?php echo FLEET_BUILD_CREATE; ?>">

				<div id="fleet-build-cost">
					<?php echo '<span id="fleet-build-stat-attack">'.SHIP_ATTACK.' : <span id="fleet-build-stat-attack-val"></span></span><br />
					<span id="fleet-build-stat-shield">'.SHIP_SHIELD.' : <span id="fleet-build-stat-shield-val"></span></span><br />
					<span id="fleet-build-stat-role">'.SHIP_ROLE.' : <span id="fleet-build-stat-role-val"></span></span><br />
					<span id="fleet-build-stat-propulsion">'.SHIP_PROPULSION.' : <span id="fleet-build-stat-propulsion-val"></span></span><br />
					<span id="fleet-build-stat-miss">'.SHIP_MISS_CHANCE.' : <span id="fleet-build-stat-note-miss"></span></span><br />
					<span id="fleet-build-stat-note">'.FLEET_BUILD_NOTE.' : <span id="fleet-build-stat-note-val"></span></span><br />';
					?>
				</div>

				<span id="fleet-build-message"></span>
				<input type="button" id="fleet-build-upgrade" class="ui-large-button" value="<?php echo BUILD; ?>">	
			</div>
		</div>
	</div>
	<?php /* Fleet Orbit */ ?>
	<div id="fleet-orbit">
		<h1 style="text-align: center; color: white;">Bientôt Disponible ...</h1>
	</div>
	<?php /* Fleet Moves */ ?>
	<div id="fleet-move">
		<h1 style="text-align: center; color: white;">Bientôt Disponible ...</h1>
	</div>
	<?php /* Fleet Out */ ?>
	<div id="fleet-out">
		<h1 style="text-align: center; color: white;">Bientôt Disponible ...</h1>
	</div>
</div>
<?php /* Researchs */ ?>
<div id="hud-research">
	<span id="hud-research-close">X</span>
	<svg id="hud-research-links" width="10000px" height="10000px"></svg>
</div>
<?php /* Bonus quotidien */ ?>
<div id="day-bonus">
	<h1><?php echo DAY_BONUS_TITLE; ?></h1>
	<h3><?php echo DAY; ?> <span id="day-bonus-current"></span> - <?php echo DAY_BEST; ?> <span id="day-bonus-best"></span></h3>
	<p id="day-bonus-choice"><?php echo DAY_BONUS_CHOICE; ?>
	<table id="day-bonus-desc"></table>
	<span id="day-bonus-confirm"><?php echo DAY_BONUS_CONFIRM; ?></span>
	<span id="day-bonus-later"><?php echo DAY_BONUS_LATER; ?></span>
</div>
<?php /* Game Version & Copyright */ ?>
<div id="game-version">Alpha-0.3.2-rev.170611d<br />Created By Elanis - Copyright 2016-<?php echo date("Y"); ?></div>
<?php /* Libs */ ?>
<script type="text/javascript" src="./lib/js/jquery.min.js"></script>
<script type="text/javascript" src="./lib/js/socket.min.js"></script>
<script type="text/javascript" src="./lib/js/css_globe_perspectivetransform.js"></script>
<?php /* Cookies' Life */ ?>
<script type="text/javascript" src="./lib/js/cookies.js"></script>
<?php /* Client Global Vars */ ?>
<script type="text/javascript" src="./lib/js/gvars.js"></script>
<?php /* Client Classes */ ?>
<script type="text/javascript" src="./lib/js/chat.js"></script>
<script type="text/javascript" src="./lib/js/map.js"></script>
<script type="text/javascript" src="./lib/js/misc.js"></script>
<script type="text/javascript" src="./lib/js/planet.js"></script>
<script type="text/javascript" src="./lib/js/planetback.js"></script>
<script type="text/javascript" src="./lib/js/research.js"></script>
<script type="text/javascript" src="./lib/js/settings.js"></script>
<script type="text/javascript" src="./lib/js/ui.js"></script>
<script type="text/javascript" src="./lib/js/units.js"></script>
<script type="text/javascript" src="./lib/js/websockets.js"></script>
<?php /* Launch Game ! */ ?>
<script type="text/javascript" src="./lib/js/load.js"></script>
</body>
<?php /* Block Portrait Screens */ ?>
<div id="portrait-warn"><h1><?php echo PORTRAIT_ERROR; ?></h1></div>