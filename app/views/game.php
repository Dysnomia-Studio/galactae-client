<script type="text/javascript">
	"use strict";
</script>
<script type="text/javascript">
		setGvars("<?= $userGameData['game_id'] ?>","<?= $userData['user_name'] ?>");
</script>
<?php /* Loading Overlay */ ?>
<div id="loading-overlay" style="/*display: none;*/">
	<div id="loading-overlay-back"></div>
	<svg id="loading-overlay-img" width="150px" height="150px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#0EC6C6" stroke-width="4" r="45" stroke-dasharray="212.05750411731105 72.68583470577035" transform="rotate(64 50 50)"></circle></svg>
	<div id="loading-overlay-text"><span id="loading-overlay-main"><?= GAME_LOADING; ?></span><br/>
		<div class="loading-overlay-bar loading-overlay-bar-primary">
			<div class="loading-overlay-bar-value">0%</div>
			<div class="loading-overlay-bar-content"></div>
		</div>
		<span id="loading-overlay-desc"><?= DEFAULT_LOAD; ?></span>
		<div class="loading-overlay-bar loading-overlay-bar-secondary">
			<div class="loading-overlay-bar-value">0/0</div>
			<div class="loading-overlay-bar-content"></div>
		</div>
	</div>
</div>
<?php /* Planet View */ ?>
<div id="planet">
	<?php /* Planet Back */ ?>
	<div id="planet-back">
		<div id="planet-back-bg"></div>
		<div id="planet-back-sphere">
			<div id="planet-back-content"></div>
			<div id="planet-back-halo"></div>
		</div>
	</div>

	<?php /* Current Planet */ ?>
	<div id="planet-current">
		<?php /* Buildings ( Details ) */ ?>
		<div id="building-area">
			<span type="button" id="building-quit" onclick="planetUI.buildPanelHide()">X</span>
			<h1 id="building-name"></h1>
			<h4 id="building-level"></h4>
			<div id="building-info">
				<img src="?" id="building-img" alt="building-img">
				<p id="building-desc"></p>
			</div>
			<div id="building-orders">
				<div id="building-cost">
					<h4><?= COST; ?></h4>
					<span class="building-cost-item" id="building-cost-iron">Fe <span id="building-cost-iron-val"></span></span>
					<span class="building-cost-item" id="building-cost-aluminium">Al <span id="building-cost-aluminium-val"></span></span>
					<span class="building-cost-item" id="building-cost-copper">Cu <span id="building-cost-copper-val"></span></span>
					<span class="building-cost-item" id="building-cost-titanium">Ti <span id="building-cost-titanium-val"></span></span>
					<br/>
					<span class="building-cost-item" id="building-cost-energy"><img src="<?= $cdnURL ?>img/ui/electricity.svg" alt="electricity" > <span id="building-cost-energy-val"></span></span>
					<span class="building-cost-item" id="building-cost-population"><img src="<?= $cdnURL ?>img/ui/population.png" alt="population"> <span id="building-cost-population-val"></span></span>
					<span class="building-cost-item" id="building-cost-time"><?= TIME; ?>: <span id="building-cost-time-val"></span></span>
				</div>
				<br id="building-bonus-br" />
				<div id="buildings-bonus">
					<h4 id="building-bonus-title"></h4>
					<span id="building-bonus">
						<span id="building-bonus-icon"></span>
						<span id="building-bonus-val">XXXt (+ XXt)</span>
					</span>
				</div>

				<span id="building-message"></span>
				<input type="button" id="building-upgrade" class="ui-large-button" value="UPGRADE">
			</div>
		</div>

		<?php /* Ground Building */ ?>
		<div class="building-ground">
			<span id="building-ground-title"><?= PLANET_BUILDING; ?></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/carriere.svg" class="building-list-building" id="carriere" onclick="planetUI.buildPanelOpen(0)" alt="carriere">
			<span id="lvl-carriere"></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/metallurgy.svg" class="building-list-building" id="metallurgy" onclick="planetUI.buildPanelOpen(1)" alt="metallurgy">
			<span id="lvl-metallurgy"></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/living.svg" class="building-list-building" id="living" onclick="planetUI.buildPanelOpen(2)" alt="living">
			<span id="lvl-living"></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/serre.svg" class="building-list-building" id="serre" onclick="planetUI.buildPanelOpen(3)" alt="serre">
			<span id="lvl-serre"></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/solar.svg" class="building-list-building" id="solar" onclick="planetUI.buildPanelOpen(4)" alt="solar">
			<span id="lvl-solar"></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/warehouse.svg" class="building-list-building" id="warehouse" onclick="planetUI.buildPanelOpen(5)" alt="warehouse">
			<span id="lvl-warehouse"></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/headquarter.svg" class="building-list-building" id="headquarter" onclick="planetUI.buildPanelOpen(6)" alt="headquarter">
			<span id="lvl-headquarter"></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/launchpad.svg" class="building-list-building" id="launchpad" onclick="planetUI.buildPanelOpen(7)" alt="launchpad">
			<span id="lvl-launchpad"></span>
			<img src="<?= $cdnURL ?>img/buildings/icons/research.svg" class="building-list-building" id="research" onclick="planetUI.buildPanelOpen(8)" alt="research">
			<span id="lvl-research"></span>
		</div>

		<?php /* Space Building */ ?>
		<div class="building-space">
			<span id="building-space-title"><?= ORBITAL_BUILDING; ?></span>
				<img src="<?= $cdnURL ?>img/buildings/icons/radar.svg" class="building-list-building" id="radar" onclick="planetUI.buildPanelOpen(9)" alt="radar">
				<span id="lvl-radar"></span>
				<img src="<?= $cdnURL ?>img/buildings/icons/tank.svg" class="building-list-building" id="tank" onclick="planetUI.buildPanelOpen(10)" alt="tank">
				<span id="lvl-tank"></span>
				<img src="<?= $cdnURL ?>img/buildings/icons/shipyard.svg" class="building-list-building" id="shipyard" onclick="planetUI.buildPanelOpen(11)" alt="shipyard">
				<span id="lvl-shipyard"></span>
				<img src="<?= $cdnURL ?>img/buildings/icons/trade.svg" class="building-list-building" id="trade" onclick="planetUI.buildPanelOpen(12)" alt="trade">
				<span id="lvl-trade"></span>
				<img src="<?= $cdnURL ?>img/buildings/icons/he3exp.svg" class="building-list-building" id="he3exp" onclick="planetUI.buildPanelOpen(13)" alt="he3exp">
				<span id="lvl-he3exp"></span>
		</div>
	</div>

	<?php /* Other planets */ ?>
	<div id="planet-other">
		<span id="planet-other-returnToSystem"><?= MAP_BACKTO_SYSTEM_MAP ?></span>
		<span id="planet-other-returnToCurrent"><?= MAP_BACKTO_PLANET ?></span>
		<div id="planet-other-infos">
			<span id="planet-other-address"><?= MAP_PLANET_INFO_ADRESS ?>: <span id="planet-other-address-data"></span></span><br/>
			<span id="planet-other-ally"><?= MAP_PLANET_INFO_ALLY ?>: <span id="planet-other-ally-data"></span></span><br/>
			<span id="planet-other-player"><?= MAP_PLANET_INFO_PLAYER ?>: <span id="planet-other-player-data"></span></span><br/>
			<span id="planet-other-planet"><?= MAP_PLANET_INFO_PLANET ?>: <span id="planet-other-planet-data"></span></span><br/>
			<span id="planet-other-points"><?= MAP_PLANET_INFO_POINTS ?>: <span id="planet-other-points-data"></span></span><br/><br/>
			<div id="planet-other-lastReports">
				<?= MAP_PLANET_INFO_LASTREPORTS ?>:
				<ul id="planet-other-lastReports-list"></ul>
			</div>
		</div>
	</div>
</div>
<?php /* Msg Popup */ ?>
<div id="messagePanel"></div>
<?php /* Top HUD */ ?>
<div id="hud-top">
	<div id="hud-top-left">
		<span id="hud-top-left-moveLeft">&#9664;</span>
		<span class="tooltip">
			<img height="15" src="<?= $cdnURL ?>img/ui/population.png" alt="population">
			<span class="nmb" id="population_nmb">1</span>
			<span class="tooltip-wrapper tooltip-wrapper-bottom">
				<span class="tooltip-content" id="population-tooltips">
					<?= POPULATION; ?><br/>
					<?= AVAILABLE; ?>: <span id="population-available">XXX</span><br/>
					<?= USED; ?>: <span id="population-used">XXX</span><br/>
					<?= TOTAL; ?>: <span id="population-total">XXX</span><br/>
				</span>
			</span>
		</span>

		<img height="15" src="<?= $cdnURL ?>img/ui/research.svg" alt="research">
		<span class="nmb" id="research_nmb">1</span>

		<img height="15" src="<?= $cdnURL ?>img/ui/moral.png" alt="moral">
		<span class="nmb" id="moral_nmb">1</span>

		<span class="tooltip">
			<img height="15" src="<?= $cdnURL ?>img/ui/electricity.svg" alt="electricity">
			<span class="nmb" id="electricity_nmb">1</span>
			<span class="tooltip-wrapper tooltip-wrapper-bottom">
				<span class="tooltip-content" id="electricity-tooltips">
					<?= ELECTRICITY; ?><br/>
					<?= AVAILABLE; ?>: <span id="electricity-available">XXX t</span><br/>
					<?= USED; ?>: <span id="electricity-used">XXX t</span><br/>
					<?= TOTAL; ?>: <span id="electricity-total">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span id="hud-top-left-moveRight">&#9654;</span>
	</div>

	<div id="hud-top-center">
		<img id="hud-settings" height="20" src="<?= $cdnURL ?>img/ui/settings.svg" alt="settings">
		<span id="hud-planet-prev" onclick="planetUI.prev();">&#9664;</span>
		<span id="hud-planet-name">SomeLongName</span>
		<span id="hud-planet-next" onclick="planetUI.next();">&#9654;</span>
		<img id="hud-gameMenu" height="15" src="<?= $cdnURL ?>img/ui/gameMenu.png" alt="gameMenu">
	</div>

	<div id="hud-top-right">
		<span id="hud-top-right-moveLeft">&#9664;</span>
		<span class="tooltip">
			<img height="20" src="<?= $cdnURL ?>img/ui/minerals.png" alt="minerals">
			<span class="nmb" id="minerals_nmb">1</span>
			<span class="tooltip-wrapper tooltip-wrapper-bottom">
				<span class="tooltip-content" id="minerals-tooltips">
					<?= MINERALS; ?><br/>
					<?= CAPACITY; ?>: <span id="minerals-cap">XXX t</span><br/>
					<?= PRODUCTION; ?>: <span id="minerals-prod">XXX t</span><br/>
					<?= CONSUMPTION; ?>: <span id="minerals-cons">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="tooltip">
			<span class="element">&sup3;He </span>
			<span class="nmb" id="he_nmb">1</span>
			<span class="tooltip-wrapper tooltip-wrapper-bottom">
				<span class="tooltip-content" id="he-tooltips">
					<?= HELIUM3; ?><br/>
					<?= CAPACITY; ?>: <span id="he-cap">XXX t</span><br/>
					<?= PRODUCTION; ?>: <span id="he-prod">XXX t</span><br/>
					<span id="he-fuel-distribute"><?= DISTRIBUTING_FUEL ?></span>
				</span>
			</span>
		</span>
		<span class="tooltip">
			<span class="element">Al </span>
			<span class="nmb" id="al_nmb">1</span>
			<span class="tooltip-wrapper tooltip-wrapper-bottom">
				<span class="tooltip-content" id="al-tooltips">
					<?= METAL_ALUMINIUM; ?><br/>
					<?= CAPACITY; ?>: <span id="al-cap">XXX t</span><br/>
					<?= PRODUCTION; ?>: <span id="al-prod">XXX t</span><br/>
					<?= IMPORTANCE; ?>: <span id="al-variety">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="tooltip">
			<span class="element" id="element_fe">Fe </span>
			<span class="nmb" id="fe_nmb">1</span>
			<span class="tooltip-wrapper tooltip-wrapper-bottom">
				<span class="tooltip-content" id="fe-tooltips">
					<?= METAL_IRON; ?><br/>
					<?= CAPACITY; ?>: <span id="fe-cap">XXX t</span><br/>
					<?= PRODUCTION; ?>: <span id="fe-prod">XXX t</span><br/>
					<?= IMPORTANCE; ?>: <span id="fe-variety">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="tooltip">
			<span class="element">Ti </span>
			<span class="nmb" id="ti_nmb">1</span>
			<span class="tooltip-wrapper tooltip-wrapper-bottom">
				<span class="tooltip-content" id="ti-tooltips">
					<?= METAL_TITANIUM; ?><br/>
					<?= CAPACITY; ?>: <span id="ti-cap">XXX t</span><br/>
					<?= PRODUCTION; ?>: <span id="ti-prod">XXX t</span><br/>
					<?= IMPORTANCE; ?>: <span id="ti-variety">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="tooltip">
			<span class="element">Cu </span>
			<span class="nmb" id="cu_nmb">1</span>
			<span class="tooltip-wrapper tooltip-wrapper-bottom">
				<span class="tooltip-content" id="cu-tooltips">
					<?= METAL_COPPER; ?><br/>
					<?= CAPACITY; ?>: <span id="cu-cap">XXX t</span><br/>
					<?= PRODUCTION; ?>: <span id="cu-prod">XXX t</span><br/>
					<?= IMPORTANCE; ?>: <span id="cu-variety">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span id="hud-top-right-moveRight">&#9654;</span>
	</div>
</div>
<?php /* HUD Bottom */ ?>
<div id="hud-bottom">
	<div id="hud-bottom-left">
		<span class="tooltip">
			<a href="#map" id="hud-bottom-button-map"><img src="<?= $cdnURL ?>img/ui/map.svg" alt="map"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_MAP; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#researchs" id="hud-bottom-button-research"><img src="<?= $cdnURL ?>img/ui/researchs.svg" alt="researchs"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_RESEARCH; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#units" id="hud-bottom-button-units"><img src="<?= $cdnURL ?>img/ui/units.svg" alt="units"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_UNITS; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#fleets" id="hud-bottom-button-fleets"><img src="<?= $cdnURL ?>img/ui/fleets.png" alt="fleets"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_FLEETS; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#radar" id="hud-bottom-button-radar"><img src="<?= $cdnURL ?>img/ui/radar.svg" alt="radar"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_RADAR; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#ally" id="hud-bottom-button-ally"><img src="<?= $cdnURL ?>img/ui/ally.svg" alt="ally"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_ALLY; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#rapports" id="hud-bottom-button-rapports"><img src="<?= $cdnURL ?>img/ui/rapports.svg" alt="rapports"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_RAPPORTS; ?></span>
			</span>
		</span>
	</div>

	<div id="hud-bottom-hour">
		12:00:00
	</div>

	<div id="hud-bottom-right">
		<span class="tooltip">
			<a href="#quests" id="hud-bottom-button-quests"><img src="<?= $cdnURL ?>img/ui/quests.svg" alt="quests"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_QUEST; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#trade" id="hud-bottom-button-trade"><img src="<?= $cdnURL ?>img/ui/trade.svg" alt="trade"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_TRADE; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#ranks" id="hud-bottom-button-ranks"><img src="<?= $cdnURL ?>img/ui/ranks.svg" alt="ranks"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_RANKS; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="https://galactae.eu/profil" target="_blank" rel="noopener noreferrer" id="hud-bottom-button-profil"><img src="<?= $cdnURL ?>img/ui/profil.svg" alt="profil"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_PROFIL; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#messages" id="hud-bottom-button-messages"><img src="<?= $cdnURL ?>img/ui/messages.svg" alt="messages"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_MESSAGES; ?></span>
			</span>
		</span>
		<span class="tooltip">
			<a href="#chat" id="hud-bottom-button-chat"><img src="<?= $cdnURL ?>img/ui/chat.svg" alt="chat"></a>
			<span class="tooltip-wrapper tooltips-hud-bottom tooltip-wrapper-top">
				<span class="tooltip-content"><?= HUD_BOTTOM_CHAT; ?></span>
			</span>
		</span>
	</div>
</div>
<?php /* Main menu */ ?>
<div id="game-menu">
	<a href="https://galactae.eu/portal"><?= PORTAL; ?></a><br/>
	<a href="https://galactae.eu/profil"><?= PROFIL; ?></a><br/>
	<a href="https://galactae.eu/support"><?= SUPPORT; ?></a><br/>
	<a href="https://galactae.eu/deconnexion"><?= DISCONNECT; ?></a>
</div>
<?php /* Settings menu */ ?>
<div id="settings-menu" class="medium-panel">
	<ul id="settings-menu-choice" class="ul-choice-line"></ul>

	<ul id="settings-menu-panes"></ul>

	<input type="button" class="ui-small-button" id="settings-menu-cancel" value="<?= SETTINGS_CANCEL ?>">
	<input type="button" class="ui-small-button" id="settings-menu-save" value="<?= SETTINGS_VALIDATE ?>">
</div>
<?php /* Chat */ ?>
<div id="hud-chat">
	<ul id="hud-chat-channels" class="ul-choice-line">
		<li chatChannel="hud-chat-global" class="chatTab ul-choice-line-li-active"><span class="read">•&nbsp;</span><?= CHAT_GLOBAL; ?></li>
		<li chatChannel="hud-chat-trade" class="chatTab"><span class="read">•&nbsp;</span><?= CHAT_TRADE; ?></li>
		<li chatChannel="hud-chat-ally" class="chatTab"><span class="read">•&nbsp;</span><?= CHAT_ALLY; ?></li>
	</ul>
	<div id="hud-chat-global" class="chatContent"><ul class="chat_logs"><li><?= CHAT_WELCOME; ?></li></ul></div>
	<div id="hud-chat-trade" class="chatContent"><ul class="chat_logs"><li><?= CHAT_WELCOME; ?></li></ul></div>
	<div id="hud-chat-ally" class="chatContent"><ul class="chat_logs"><li><?= CHAT_WELCOME; ?></li></ul></div>
	<form action="#chat_text" method="post" id="chat_form">
		<input type="text" name="chat_message" id="chat_message" placeholder="Votre message..." size="50" autocomplete="off" />
		<a href="https://discord.gg/c8aARey" id="chat-voice" target="_blank" rel="noopener noreferrer"><img src="<?= $cdnURL ?>img/ui/chat-voice.svg" alt="voice"></a>
	</form>
</div>
<?php /* Ranks */ ?>
<div id="hud-ranks" class="extra-large-panel">
	<ul class="ul-choice-line ranks-ul">
		<li choice="galaxy-players" id="ranks-galPly-button" class="ul-choice-line-li-active"><?= RANKS_GALAXY_PLAYER; ?></li>
		<li choice="sector-players" id="ranks-secPly-button"><?= RANKS_SECTOR_PLAYER; ?></li>
		<li choice="galaxy-ally" id="ranks-galAly-button"><?= RANKS_GALAXY_ALLY; ?></li>
		<li choice="sector-ally" id="ranks-secAly-button"><?= RANKS_SECTOR_ALLY; ?></li>
	</ul>

	<span id="hud-ranks-close">X</span>
	<iframe id="hud-ranks-frame" src="ranks.php" title="ranks list"></iframe>
</div>
<?php /* News */
if(!isset($userData['lastViewedNews']) || $userData['lastViewedNews'] < $lastNewsNumber) {
	echo '<div id="hud-news" class="extra-large-panel" style="display: block;">';
} else {
	echo '<div id="hud-news" class="extra-large-panel">';
}
?>
	<span id="news-close">X</span>
	<iframe id="news-frame" src="news.php?n=<?= $lastNewsNumber; ?>" title="news"></iframe>
</div>
<?php /* Map */ ?>
<div id="hud-map">
	<span id="map-close">X</span>
	<div id="map-back"><?= MAP_BACKTO_GLOBAL_MAP; ?></div>
	<div id="map-focus"><?= MAP_FOCUS_CURRENT_SYSTEM; ?></div>
	<div id="map-address"></div>
	<svg height="40000" width="50000" id="map-global">
		<defs>
			<radialGradient id="redDwarf" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#ff0a0b" offset="0"></stop>
				<stop stop-opacity="0.9" stop-color="#ff0a0b" offset="0.4"></stop>
				<stop stop-opacity="0.8" stop-color="#FB3637" offset="0.45"></stop>
				<stop stop-opacity="0" stop-color="#FB3637" offset="1"></stop>
			</radialGradient>
			<radialGradient id="redGiant" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#ff0a0b" offset="0"></stop>
				<stop stop-opacity="0.9" stop-color="#ff0a0b" offset="0.4"></stop>
				<stop stop-opacity="0.8" stop-color="#FB3637" offset="0.45"></stop>
				<stop stop-opacity="0" stop-color="#FB3637" offset="1"></stop>
			</radialGradient>
			<radialGradient id="redSuperGient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#ff0a0b" offset="0"></stop>
				<stop stop-opacity="0.9" stop-color="#ff0a0b" offset="0.4"></stop>
				<stop stop-opacity="0.8" stop-color="#FB3637" offset="0.45"></stop>
				<stop stop-opacity="0" stop-color="#FB3637" offset="1"></stop>
			</radialGradient>

			<radialGradient id="yellowDwarf" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#FB7209" offset="0"></stop>
				<stop stop-opacity="0.9" stop-color="#FFA03C" offset="0.4"></stop>
				<stop stop-opacity="0.8" stop-color="#FFA03C" offset="0.6"></stop>
				<stop stop-opacity="0" stop-color="#FFA03C" offset="1"></stop>
			</radialGradient>

			<radialGradient id="whiteDwarf" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#e6e3a0" offset="0"></stop>
				<stop stop-opacity="0.9" stop-color="#FFFFFF" offset="0.4"></stop>
				<stop stop-opacity="0.8" stop-color="#FFFFFF" offset="0.6"></stop>
				<stop stop-opacity="0" stop-color="#FFFFFF" offset="1"></stop>
			</radialGradient>

			<radialGradient id="brownDwarf" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#56351c" offset="0"></stop>
				<stop stop-opacity="0.9" stop-color="#56351c" offset="0.4"></stop>
				<stop stop-opacity="0.8" stop-color="#56351c" offset="0.6"></stop>
				<stop stop-opacity="0" stop-color="#FFA03C" offset="1"></stop>
			</radialGradient>

			<radialGradient id="blueWhiteGiant" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#85bbfc" offset="0"></stop>
				<stop stop-opacity="0.9" stop-color="#85bbfc" offset="0.5"></stop>
				<stop stop-opacity="0.8" stop-color="#91c3ff" offset="0.6"></stop>
				<stop stop-opacity="0" stop-color="#FFFFFF" offset="1"></stop>
			</radialGradient>

			<radialGradient id="blueGiant" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#45aaff" offset="0"></stop>
				<stop stop-opacity="0.9" stop-color="#45aaff" offset="0.5"></stop>
				<stop stop-opacity="0.8" stop-color="#505064" offset="0.75"></stop>
				<stop stop-opacity="0" stop-color="#505064" offset="1"></stop>
			</radialGradient>

			<radialGradient id="blackHole" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop stop-opacity="1" stop-color="#000" offset="0"></stop>
				<stop stop-opacity="0.6" stop-color="#000" offset="0.6"></stop>
				<stop stop-opacity="0.6" stop-color="#382c10" offset="0.8"></stop>
				<stop stop-opacity="0" stop-color="#8e6f27" offset="1"></stop>
			</radialGradient>
		</defs>
	</svg>
	<div id="map-system" class="opening view-2D">
        <div id="map-system-universeBack">
          <div id="map-system-galaxyBack">
            <div id="map-system-solarFront">
            </div>
            <div id="map-system-solarFront-list"></div>
            <div id="map-planet-menu">
            	<span id="map-planet-menu-planetname">Planet</span>
            	<span id="map-planet-menu-username">(user)</span>
            	<img id="map-planet-menu-infos" alt="planet informations" src="<?= $cdnURL ?>img/ui/planet-infos.svg">
            	<img id="map-planet-menu-move" alt="fleet moving" src="<?= $cdnURL ?>img/ui/fleet-move.svg">
            	<img id="map-planet-menu-attack" alt="attack planet" src="<?= $cdnURL ?>img/ui/fleet-attack.svg">
            	<img id="map-planet-menu-defend" alt="defend planet" src="<?= $cdnURL ?>img/ui/fleet-defend.svg">
            	<img id="map-planet-menu-spy" alt="spy planet" src="<?= $cdnURL ?>img/ui/planet-spy.svg">
            	<img id="map-planet-menu-trade" alt="trade with planet" src="<?= $cdnURL ?>img/ui/planet-trade.svg">
            </div>
          </div>
        </div>
    </div>

    <div id="map-move-panel" class="medium-panel">
    	<span id="map-move-panel-close">X</span>

    	<div id="map-move-panel-list">
    		<div id="map-move-panel-list-header"><?= FLEET ?>:</div>
    		<ul id="map-move-panel-list-ul"></ul>
    	</div>

    	<div id="map-move-panel-info">
    		<span id="map-move-panel-message">Deplacement vers <em>PlanetName</em> (<em>Joueur</em>)</span><br/>
    		<br/>
    		Temps: ~<span id="map-move-panel-time">12:34:56</span><br/>
    		&sup3;He: <span id="map-move-panel-fuel">12.34Kt (56% du reservoir)</span><br/>
    		<div id="map-move-panel-hangar-general">Hangar: <span id="map-move-panel-hangar">0/0</span></div><br/>
    	</div>

    	<input type="button" id="map-move-panel-move" name="map-move-panel-move" class="ui-large-button" value="Some move">
    </div>
</div>
<?php /* Fleet */ ?>
<div id="hud-fleet" class="extra-large-panel">
	<span id="fleet-close">X</span>

	<ul class="ul-choice-line fleet-ul1">
		<li id="fleet-build-button" class="ul-choice-line-li-active"><?= FLEET_BUILD; ?></li>
		<li id="fleet-orbit-button"><?= FLEET_ORBIT; ?></li>
		<li id="fleet-move-button"><?= FLEET_MOVE; ?></li>
		<li id="fleet-out-button"><?= FLEET_OUT; ?></li>
		<li id="fleet-tactics-button"><?= FLEET_TACTICS; ?></li>
	</ul>
	<?php /* Fleet Building */ ?>
	<div id="fleet-build">
		<ul id="fleet-build-choice" class="ul-choice-line fleet-ul2">
			<li shipType="SHIP_ALL" id="fleet-build-all-button" class="ul-choice-line-li-active"><?= FLEET_BUILD_ALL; ?></li>
			<li shipType="SHIP_DEF" id="fleet-build-defense-button"><?= FLEET_BUILD_DEF; ?></li>
			<li shipType="SHIP_FIGHTER" id="fleet-build-fighter-button"><?= FLEET_BUILD_FIGHTER; ?></li>
			<li shipType="SHIP_BATTLECRUISER" id="fleet-build-cruisader-button"><?= FLEET_BUILD_CUISADER; ?></li>
			<li shipType="SHIP_CUIRASSE" id="fleet-build-cuirasse-button"><?= FLEET_BUILD_CUIRASSE; ?></li>
			<li shipType="SHIP_CORVET" id="fleet-build-corvette-button"><?= FLEET_BUILD_CORVET; ?></li>
			<li shipType="SHIP_CARRIER" id="fleet-build-carrier-button"><?= FLEET_BUILD_CARRIER; ?></li>
		</ul>
		<div id="fleet-build-content">
			<h2 id="fleet-build-list-empty"><?= FLEET_NO_MODEL; ?></h2>
			<table id="fleet-build-list" class="unit-list-table" aria-describedby="Unit list">
				<thead>
					<tr>
						<th id="fleet-build-list-type-name"><?= FLEET_BUILD_NAME; // Le nom du vaisseau 					 ?></th>
						<th id="fleet-build-list-type-shipType"><?= FLEET_BUILD_TYPE; // Le type de vaisseau 				 ?></th>
						<th id="fleet-build-list-type-shipShape"><?= FLEET_BUILD_SHAPE; // La forme du vaisseau 				 ?></th>
						<th id="fleet-build-list-type-note"><?= FLEET_BUILD_NOTE; // Sa note estimée par le systeme		 ?></th>
					</tr>
				</thead>
				<tbody id="fleet-build-list-tbody"></tbody>
			</table>

			<div id="fleet-build-info">
				<input type="button" id="fleet-build-create" name="fleet-build-new-model" class="ui-large-button" value="<?= FLEET_BUILD_CREATE; ?>">

				<div id="fleet-build-stat">
					<span id="fleet-build-name"></span><img id="fleet-build-rename" alt="rename unit model" src="<?= $cdnURL ?>img/ui/rename.svg"><br /><br />
					<?= '<div id="fleet-build-stat-attack"><u>'.SHIP_WEAPONS.' :</u> <span id="fleet-build-stat-attack-val"></span></div>
					<div id="fleet-build-stat-shield"><u>'.SHIP_SHIELD.' :</u> <span id="fleet-build-stat-shield-val"></span></div>
					<div id="fleet-build-stat-speed"><u>'.SHIP_SPEEDS.'</u>
						<div id="fleet-build-stat-subspeed">'.SHIP_SUBSPEED.' : <span id="fleet-build-stat-subspeed-val"></span></div>
						<div id="fleet-build-stat-supspeed">'.SHIP_SUPSPEED.' : <span id="fleet-build-stat-supspeed-val"></span></div>
					</div>
					<div id="fleet-build-stat-miss">'.SHIP_MISS_CHANCE.' : <span id="fleet-build-stat-miss-val"></span></div>
					<div id="fleet-build-stat-fcap">'.SHIP_FCAP.' : <span id="fleet-build-stat-fcap-val"></span></div>
					<div id="fleet-build-stat-fweight">'.SHIP_FWEIGHT.' : <span id="fleet-build-stat-fweight-val"></span></div>
					<div id="fleet-build-stat-note">'.FLEET_BUILD_NOTE.' : <span id="fleet-build-stat-note-val"></span></div>'; ?>
				</div>
	
				<div id="fleet-build-buttons">
					<img id="fleet-build-type-copy" src="<?= $cdnURL ?>img/ui/copy.svg" alt="copy">
					<img id="fleet-build-openPanel" src="<?= $cdnURL ?>img/ui/build.svg" alt="build">
					<img id="fleet-build-type-delete" src="<?= $cdnURL ?>img/ui/delete.svg" alt="delete">
					<br/>
					<span id="fleet-build-desc">Build unit</span>
				</div>

				<span id="fleet-build-message" style="display: block;"></span>
			</div>
		</div>
	</div>
	<?php /* Fleet Orbit */ ?>
	<div id="fleet-orbit" class="fleet-tab extra-large-panel-tab"></div>
	<?php /* Fleet Moves */ ?>
	<div id="fleet-move" class="fleet-tab extra-large-panel-tab"></div>
	<?php /* Fleet Out */ ?>
	<div id="fleet-out" class="fleet-tab extra-large-panel-tab"></div>
	<?php /* Tactics */ ?>
	<div id="fleet-tactics" class="fleet-tab extra-large-panel-tab">
		<div class="text-center fleet-tactics-header">
			<input type="button" class="ui-large-button" id="fleet-tactics-new" value="<?= TACTIC_NEW ?>">
		</div>
		<div id="fleets-tactics-content"></div>
	</div>
</div>

<div id="fleet-type-create" class="large-panel">
	<form id="fleet-type-create-form">
		<span id="fleet-type-create-close">X</span>

		<select id="fleet-type-create-shipType" class="ui-large-select" onchange="units.changeShipType();"></select>
		<select id="fleet-type-create-shipShape" class="ui-large-select" onchange="units.changeShipShape();"></select>
		<input type="text" id="fleet-type-create-name" placeholder="<?= SHIP_NAME; ?>" class="ui-large-button" required/>

		<svg id="fleet-type-create-schematic" viewBox="0 0 800 450" preserveAspectRatio="none"></svg>
		<div id="fleet-type-create-selects"></div>

		<div id="fleet-type-create-stat">
				<?= '<div id="fleet-type-create-stat-subspeed">'.SHIP_SUBSPEED.' : <span id="fleet-type-create-stat-subspeed-val"></span><br /></div>
			<div id="fleet-type-create-stat-supspeed">'.SHIP_SUPSPEED.' : <span id="fleet-type-create-stat-supspeed-val"></span><br /></div>
			<div id="fleet-type-create-stat-miss">'.SHIP_MISS_CHANCE.' : <span id="fleet-type-create-stat-miss-val"></span><br /></div>
			<div id="fleet-type-create-stat-fcap">'.SHIP_FCAP.' : <span id="fleet-type-create-stat-fcap-val"></span><br /></div>
			<div id="fleet-type-create-stat-fweight">'.SHIP_FWEIGHT.' : <span id="fleet-type-create-stat-fweight-val"></span><br /></div>
			<div id="fleet-type-create-stat-note">'.FLEET_BUILD_NOTE.' : <span id="fleet-type-create-stat-note-val"></span><br /></div>'; ?>
		</div>

		<input type="submit" id="fleet-type-create-submit" class="ui-large-button" value="<?= FLEET_CREATE; ?>">
	</form>
</div>

<div id="fleet-type-rename" class="small-panel">
	<span id="fleet-type-rename-close" class="small-panel-close">X</span>
	<p>Nouveau nom pour <span id="fleet-type-rename-name">SHIPNAME</span></p>
	<input id="fleet-type-rename-newName" class="ui-large-button small-panel-text" type="text" placeholder="Nouveau nom">
	<input id="fleet-type-rename-submit" class="ui-large-button small-panel-submit" type="submit" value="Renommer">
</div>

<div id="fleet-ship-build" class="medium-panel">
	<span id="fleet-ship-build-close">X</span>
	<div class="fleet-ship-build-cost">
		<h4><?= FLEET_TOTAL_COST; ?></h4>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-iron">Fe <span id="fleet-ship-build-cost-iron-val">XXXt</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-aluminium">Al <span id="fleet-ship-build-cost-aluminium-val">XXXt</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-copper">Cu <span id="fleet-ship-build-cost-copper-val">XXXt</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-titanium">Ti <span id="fleet-ship-build-cost-titanium-val">XXXt</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-population"><img src="<?= $cdnURL ?>img/ui/population.png" alt="population"> <span id="fleet-ship-build-cost-population-val">XXXM (+XXX.XK)</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-time"><?= TIME; ?>: <span id="fleet-ship-build-cost-time-val">00:00:00</span></p>
	</div>

	<span id="fleet-ship-build-name">This isn't a ship name</span>

	<script type="text/javascript">
		const unitBuildSelectHeader = '<option id="-2" selected disabled><?= FLEET; ?></option>';
		const unitBuildSelectNew = '<option id="-1"><?= NEW_FLEET; ?></option>';
		const fleetListHeader = '<thead><tr>'
						+ '<th id="fleet-build-list-type-name"><?= FLEET_BUILD_NAME; // Le nom du vaisseau 					 ?></th>'
						+ '<th id="fleet-build-list-type-shipType"><?= FLEET_BUILD_TYPE; // Le type de vaisseau 				 ?></th>'
						+ '<th id="fleet-build-list-type-shipShape"><?= FLEET_BUILD_SHAPE; // La forme du vaisseau 				 ?></th>'
						+ '<th id="fleet-build-list-type-note"><?= FLEET_BUILD_COUNT; // Sa note estimée par le systeme		 ?></th>'
						+ '<th style="color: transparent;">_</th></tr></thead>'; // On est obligé d'avoir du contenu sur chaque colonne pour que le design ne bug pas
	</script>
	
	<select id="fleet-ship-build-fleetSelect" class="ui-large-button">
		<option id="-2" selected disabled><?= FLEET; ?></option>
		<option id="-1"><?= NEW_FLEET; ?></option>
	</select>
	<input type="number" name="fleet-ship-build-count" id="fleet-ship-build-count" class="ui-large-button">
	<input type="button" id="fleet-ship-build-upgrade" class="ui-large-button" value="<?= BUILD; ?>">
</div>
<div id="fleet-newFleet-panel" class="small-panel">
	<span id="fleet-newFleet-panel-close" class="small-panel-close">X</span>
	<input id="fleet-newFleet-name" class="ui-large-button" type="text" placeholder="<?= FLEET_NAME; ?>">
	<input id="fleet-newFleet-submit" class="ui-large-button" type="submit" placeholder="<?= CONFIRM; ?>">
</div>

<div id="fleet-rename" class="small-panel">
	<span id="fleet-rename-close" class="small-panel-close">X</span>
	<p><?= FLEET_NEWNAME ?> <span id="fleet-rename-name">FLEETNAME</span></p>
	<input id="fleet-rename-newName" class="ui-large-button small-panel-text" type="text" placeholder="Nouveau nom">
	<input id="fleet-rename-submit" class="ui-large-button small-panel-submit" type="submit" value="Renommer">
</div>
<div id="fleet-units-transfer-panel" class="small-panel">
	<span id="fleet-units-transfer-close" class="small-panel-close">X</span>
	<p><?= FLEET_TRANSFER_TYPE ?> <span id="fleet-units-transfer-name">SHIPNAME</span> <?= FLEET_TRANSFER_TO ?> :</p>
	<select id="fleet-units-transfer-fleetSelect" class="ui-large-button small-panel-select">
		<option id="-2" selected disabled><?= FLEET; ?></option>
		<option id="-1"><?= NEW_FLEET; ?></option>
	</select>
	<input id="fleet-units-transfer-unitCount" class="ui-large-button small-panel-text" type="number" placeholder="Nombre:">
	<input id="fleet-units-transfer-submit" class="ui-large-button small-panel-submit" type="submit" value="<?= CONFIRM; ?>">
</div>
<div id="fleet-merge-panel" class="small-panel">
	<span id="fleet-merge-panel-close" class="small-panel-close">X</span>
	<p><?= FLEET_TRANSFERALL_TYPE ?> <span id="fleet-merge-name">FLEETNAME</span> <?= FLEET_TRANSFER_TO ?>:</p>
	<select id="fleet-merge-fleetSelect" class="ui-large-button small-panel-select">
		<option id="-2" selected disabled><?= FLEET; ?></option>
		<option id="-1"><?= NEW_FLEET; ?></option>
	</select>
	<input id="fleet-merge-submit" class="ui-large-button small-panel-submit" type="submit" placeholder="<?= CONFIRM; ?>">
</div>
<div id="fleet-transferFuel-panel" class="small-panel">
	<span id="fleet-transferFuel-close" class="small-panel-close">X</span>
	<p><?= FLEET_TRANSFERFUEL_FROM ?> <span id="fleet-transferFuel-name">FLEETNAME</span> vers :</p>
	<select id="fleet-transferFuel-fleetSelect" class="ui-large-button small-panel-select">
		<option id="-2" selected disabled><?= FLEET; ?></option>
		<option id="-1"><?= NEW_FLEET; ?></option>
	</select>
	<input id="fleet-transferFuel-fuelCount" class="ui-large-button small-panel-text" type="number" placeholder="Nombre:">
	<input id="fleet-transferFuel-submit" class="ui-large-button small-panel-submit" type="submit" value="<?= CONFIRM; ?>">
</div>

<div id="fleet-assignTactic-panel" class="small-panel">
	<span id="fleet-assignTactic-panel-close" class="small-panel-close">X</span>
	<p><?= FLEET_ASSIGN_TACTIC ?> <span id="fleet-assignTactic-name">FLEETNAME</span>:</p>
	<select id="fleet-assignTactic-tacticSelect" class="ui-large-button small-panel-select">
		<option value="-2" id="-2" selected disabled><?= TACTIC; ?></option>
		<option value="-1" id="-1"><?= DEFAULT_TACTIC; ?></option>
	</select>
	<input id="fleet-assignTactic-submit" class="ui-large-button small-panel-submit" type="submit" placeholder="<?= CONFIRM; ?>">
</div>

<div id="fleet-tacticsManager-panel" class="large-panel">
	<span id="fleet-tacticsManager-close" class="close-button">X</span>

	<ul id="fleet-tacticsManager-orderList">
		
	</ul>
	<input type="button" id="fleet-tacticsManager-addOrder" class="ui-medium-button" value="<?= FLEET_TACTIC_ADD_ORDER ?>">

	<div id="fleet-tacticsManager-orderEditor">
		<label for="fleet-tacticsManager-unitType"><?= FLEET_UNIT_TYPE ?></label>
		<select id="fleet-tacticsManager-unitType" name="fleet-tacticsManager-unitType" class="ui-large-select">
			// GENERER OPTION
		</select>
		<br/>

		<label for="fleet-tacticsManager-unitTarget"><?= FLEET_UNIT_TARGET ?></label>
		<select id="fleet-tacticsManager-unitTarget" name="fleet-tacticsManager-unitType" class="ui-large-select">
			// GENERER OPTION
		</select>
		<br/>

		<label for="fleet-tacticsManager-priorityLevel"><?= FLEET_PRIORITY ?></label>
		<input type="number" id="fleet-tacticsManager-priorityLevel" name="fleet-tacticsManager-priorityLevel" min="1" max="100" class="ui-large-input" value="0">
		<br/>


		<input type="button" id="fleet-tacticsManager-deleteOrder" name="fleet-tacticsManager-deleteOrder" class="ui-large-button" value="<?= FLEET_TACTIC_DELETE_ORDER ?>">
		<input type="button" id="fleet-tacticsManager-saveOrder" name="fleet-tacticsManager-saveOrder" class="ui-large-button" value="<?= FLEET_TACTIC_SAVE_ORDER ?>">

		<hr/>

		<input type="text" id="fleet-tacticsManager-tacticName" name="fleet-tacticsManager-tacticName" class="ui-large-input" placeholder="<?= FLEET_TACTIC_NAME ?>">
		<input type="button" id="fleet-tacticsManager-tacticSave" name="fleet-tacticsManager-tacticSave" class="ui-large-button" value="<?= FLEET_TACTIC_SAVE ?>">
	</div>

</div>

<?php /* Researchs */ ?>
<div id="hud-research">
	<span id="research-close">X</span>
	<div id="research-content">
		<svg id="research-links" width="10000px" height="10000px"></svg>
	</div>
</div>

<?php /* Tutorials */ ?>
<div id="tutorial-panel" class="large-panel">
	<div id="tutorial-panel-content">
		<h2 id="tutorial-panel-title"></h2>
		<span id="tutorial-panel-desc"></span>
		<ul id="tutorial-panel-objectives"></ul>
		<input type="button" id="tutorial-panel-ok" class="ui-large-button" value="Ok">
	</div>
</div>

<?php /* Bonus quotidien */ ?>
<div id="day-bonus" class="large-panel">
	<h1><?= DAY_BONUS_TITLE; ?></h1>
	<h3><?= DAY; ?> <span id="day-bonus-current"></span> - <?= DAY_BEST; ?> <span id="day-bonus-best"></span></h3>
	<p id="day-bonus-choice"><?= DAY_BONUS_CHOICE; ?>
	<table id="day-bonus-desc" aria-describedby="Daily bonus description"></table>
	<span id="day-bonus-confirm"><?= DAY_BONUS_CONFIRM; ?></span>
	<span id="day-bonus-later"><?= DAY_BONUS_LATER; ?></span>
</div>
<?php /* Notifications */ ?>
<div id="notifications-panel">
	<span id="notifications-closeAll">☒</span>
</div>
<?php /* Rapports */ ?>
<div id="report-panel" class="extra-large-panel">
	<a id="report-panel-close" class="close-button">X</a>
	<div id="report-list-container" class="report-panel-container">
		<table id="report-list-buttons">
			<tr>
				<td><input type="checkbox" class="ui-medium-button" id="report-list-select-all" /></td>
				<td><input type="button" class="ui-medium-button" id="report-list-mark-read" value="<?= MARK_AS_READ ?>" /></td>
				<td><input type="button" class="ui-medium-button" id="report-list-mark-unread" value="<?= MARK_AS_UNREAD ?>" /></td>
				<td><input type="button" class="ui-medium-button" id="report-list-delete" value="<?= DELETE ?>" /></td>
			</tr>
		</table>

		<table id="report-list" class="report-panel-table">
		</table>
	</div>

	<div id="report-preview-container" class="report-panel-container">
		<span id="report-preview-back">←</span>

		<table id="report-preview-buttons">
			<tr>
				<td><input type="button" class="ui-medium-button" id="report-preview-mark-unread" value="<?= MARK_AS_UNREAD ?>" /></td>
				<td><input type="button" class="ui-medium-button" id="report-preview-delete" value="<?= DELETE ?>" /></td>
			</tr>
		</table>

		<table id="report-preview" class="report-panel-table">
			<tr>
				<td id="report-preview-atk"></td>
				<td id="report-preview-def"></td>
			</tr>
			<tr>
				<td id="report-preview-status" class="text-center" colspan="2"></td>
			</tr>
			<tr>
				<td id="report-details-atk"></td>
				<td id="report-details-def"></td>
			</tr>
		</table>
	</div>
</div>

<?php /* Alliances */ ?>
<div id="alliances-panel" class="extra-large-panel">
	<span id="alliances-close" class="close-button">X</span>
	<ul id="alliances-panel-menu" class="ul-choice-line">
		<li id="alliances-panel-info-button" class="ul-choice-line-li-active"><?= ALLY_INFOS ?></li>
		<li id="alliances-panel-members-button"><?= ALLY_MEMBERS ?></li>
		<li id="alliances-panel-newMembers-button"><?= ALLY_NEW_PLAYERS ?></li>
		<li id="alliances-panel-diplomacy-button"><?= ALLY_DIPLOMACY ?></li>
	</ul>

	<div id="alliances-panel-info" class="alliances-tab extra-large-panel-tab">
		<table>
			<tr>
				<th scope="row"><?= ALLY_NAME ?></th>
				<td id="alliances-panel-info-name"></td>
			</tr>

			<tr>
				<th scope="row"><?= ALLY_DESC ?></th>
				<td id="alliances-panel-info-desc"></td>
			</tr>

			<tr>
				<th scope="row"><?= ALLY_MEMBERS ?>:</th>
				<td id="alliances-panel-info-membersCount"></td>
			</tr>

			<!-- @TODO: modify button -->
			<!-- @TODO: quit / delete button -->
		</table>
	</div>
	<div id="alliances-panel-members" class="alliances-tab extra-large-panel-tab">
		<table>
			<thead>
				<tr>
					<th><?= ALLY_MEMBERS_PLAYER_NAME ?></th>
					<th><?= ALLY_MEMBERS_PERMS_FOUNDER ?></th>
					<th><?= ALLY_MEMBERS_PERMS_LEADER ?></th>
					<th><?= ALLY_MEMBERS_PERMS_DIPLOMACY ?></th>
				</tr>
			</thead>

			<tbody id="alliances-panel-members-list">
				
			</tbody>
		</table>

		<!-- @TODO: save button -->
	</div>
	<div id="alliances-panel-newMembers" class="alliances-tab extra-large-panel-tab">
		newMembers
	</div>
	<div id="alliances-panel-diplomacy" class="alliances-tab extra-large-panel-tab">
		diplomacy
	</div>
</div>

<?php /* Game Version & Copyright */ ?>
<div id="game-version"><?= file_get_contents($cdnURL.'version.txt'); ?> - <a href="https://bugs.dysnomia.studio/projects/galactae/" target="_blank" rel="noopener noreferrer">Bug Tracker</a><br /><?= CREATED_BY; ?> <a href="https://dysnomia.studio/" target="_blank" rel="noopener noreferrer">Dysnomia</a> - Copyright 2016-<?= date("Y"); ?></div>
<?php /* Libs */ ?>
<script type="text/javascript" src="<?= $cdnURL ?>js/readyEvent.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/details-polyfill.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/remove-polyfill.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/socket.min.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/css_globe_perspectivetransform.js"></script>
<?php /* Client Classes */ ?>

<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/Buildings.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/DependencyEngine.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/Fleets.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/GameMap.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/Reports.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/Research.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/Resources.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/Tutorials.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/_shared/Units.js"></script>

<script type="text/javascript" src="<?= $cdnURL ?>js/Alliances.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/Buildings.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/calcConstants.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/chat.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/DependencyEngine.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/Fleets.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/GameMap.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/map.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/misc.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/notifications.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/planetback.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/planetUI.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/Reports.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/research.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/Resources.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/settings.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/tactics.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/trade.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/Tutorials.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/ui.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/units.js"></script>
<script type="text/javascript" src="<?= $cdnURL ?>js/websockets.js"></script>
<?php /* Launch Game ! */ ?>
<script type="text/javascript" src="<?= $cdnURL ?>js/load.js"></script>
</body>
<?php /* Block Portrait Screens */ include(DIR_VIEW.'/portraitWarn.php');