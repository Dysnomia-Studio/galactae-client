<?php /* Loading Overlay */ ?>
<div id="loading-overlay">
	<div id="loading-overlay-back"></div>
	<img id="loading-overlay-img" src="<?php echo $cdnURL; ?>img/load-gears.gif" alt="loading-overlay">
	<div id="loading-overlay-text"><?php echo GAME_LOADING; ?><br/>
		<span id="loading-overlay-desc"><?php echo DEFAULT_LOAD; ?></span>
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
			<span type="button" id="building-quit" onclick="planet.buildPanelHide()">X</span>	
			<h1 id="building-name"></h1>
			<h4 id="building-level"></h4>
			<div id="building-info">	
				<img src="?" id="building-img" alt="building-img">
				<p id="building-desc"></p>
			</div>
			<div id="building-orders">
				<div id="building-cost">
					<h4><?php echo COST; ?></h4>
					<span class="building-cost-item" id="building-cost-iron">Fe <span id="building-cost-iron-val"></span></span>
					<span class="building-cost-item" id="building-cost-aluminium">Al <span id="building-cost-aluminium-val"></span></span>
					<span class="building-cost-item" id="building-cost-copper">Cu <span id="building-cost-copper-val"></span></span>
					<span class="building-cost-item" id="building-cost-titanium">Ti <span id="building-cost-titanium-val"></span></span>
					<br/>
					<span class="building-cost-item" id="building-cost-energy"><img src="./cdn/img/ui/electricity.png" alt="electricity" > <span id="building-cost-energy-val"></span></span>
					<span class="building-cost-item" id="building-cost-population"><img src="./cdn/img/ui/population.png" alt="population"> <span id="building-cost-population-val"></span></span>
					<span class="building-cost-item" id="building-cost-time"><?php echo TIME; ?>: <span id="building-cost-time-val"></span></span>
				</div>
				<br/>
				<div id="buildings-bonus">
					<h4 id="building-bonus-title"></h4>
					<span id="building-bonus">
						<span id="building-bonus-icon"></span>
						<span id="building-bonus-val">XXXt (+ XXt <?php echo AT_NEXT_LVL; ?>)</span>
					</span>
				</div>

				<span id="building-message"></span>
				<input type="button" id="building-upgrade" class="ui-large-button" value="<?php echo UPGRADE; ?>">
			</div>
		</div>

		<?php /* Ground Building */ ?>
		<div class="building-ground">
			<span id="building-ground-title"><?php echo PLANET_BUILDING; ?></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/carriere.svg" class="building-list-building" id="carriere" onclick="planet.buildPanelOpen(0)" alt="carriere">
			<span id="lvl-carriere"></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/metallurgy.svg" class="building-list-building" id="metallurgy" onclick="planet.buildPanelOpen(1)" alt="metallurgy">
			<span id="lvl-metallurgy"></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/living.svg" class="building-list-building" id="living" onclick="planet.buildPanelOpen(2)" alt="living">
			<span id="lvl-living"></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/serre.svg" class="building-list-building" id="serre" onclick="planet.buildPanelOpen(3)" alt="serre">
			<span id="lvl-serre"></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/solar.svg" class="building-list-building" id="solar" onclick="planet.buildPanelOpen(4)" alt="solar">
			<span id="lvl-solar"></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/warehouse.svg" class="building-list-building" id="warehouse" onclick="planet.buildPanelOpen(5)" alt="warehouse">
			<span id="lvl-warehouse"></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/headquarter.svg" class="building-list-building" id="headquarter" onclick="planet.buildPanelOpen(6)" alt="headquarter">
			<span id="lvl-headquarter"></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/launchpad.svg" class="building-list-building" id="launchpad" onclick="planet.buildPanelOpen(7)" alt="launchpad">
			<span id="lvl-launchpad"></span>
			<img src="<?php echo $cdnURL; ?>img/buildings/icons/research.svg" class="building-list-building" id="research" onclick="planet.buildPanelOpen(8)" alt="research">
			<span id="lvl-research"></span>
		</div>

		<?php /* Space Building */ ?>
		<div class="building-space">
			<span id="building-space-title"><?php echo ORBITAL_BUILDING; ?></span>
				<img src="<?php echo $cdnURL; ?>img/buildings/icons/radar.svg" class="building-list-building" id="radar" onclick="planet.buildPanelOpen(9)" alt="radar">
				<span id="lvl-radar"></span>
				<img src="<?php echo $cdnURL; ?>img/buildings/icons/tank.svg" class="building-list-building" id="tank" onclick="planet.buildPanelOpen(10)" alt="tank">
				<span id="lvl-tank"></span>
				<img src="<?php echo $cdnURL; ?>img/buildings/icons/shipyard.svg" class="building-list-building" id="shipyard" onclick="planet.buildPanelOpen(11)" alt="shipyard">
				<span id="lvl-shipyard"></span>
				<img src="<?php echo $cdnURL; ?>img/buildings/icons/trade.svg" class="building-list-building" id="trade" onclick="planet.buildPanelOpen(12)" alt="trade">
				<span id="lvl-trade"></span>
				<img src="<?php echo $cdnURL; ?>img/buildings/icons/he3exp.svg" class="building-list-building" id="he3exp" onclick="planet.buildPanelOpen(13)" alt="he3exp">
				<span id="lvl-he3exp"></span>
		</div>
	</div>

	<?php /* Other planets */ ?>
	<div id="planet-other">

	</div>
</div>
<?php /* Msg Popup */ ?>
<div id="messagePanel"></div>
<?php /* Top HUD */ ?>
<div id="hud-top">
	<div id="hud-top-left">
		<span id="hud-top-left-moveLeft">&#9664;</span>
		<span class="hud-top-tooltip">
			<img height="15" src="<?php echo $cdnURL; ?>img/ui/population.png" alt="population">
			<span class="nmb" id="population_nmb">1</span>
			<span class="hud-top-tooltip-wrapper">
				<span class="hud-top-tooltip-content" id="population-tooltips">
					<?php echo POPULATION; ?><br/>
					<?php echo AVAILABLE; ?>: <span id="population-available">XXX</span><br/>
					<?php echo USED; ?>: <span id="population-used">XXX</span><br/>
					<?php echo TOTAL; ?>: <span id="population-total">XXX</span><br/>
				</span>
			</span>
		</span>

		<img height="15" src="<?php echo $cdnURL; ?>img/ui/research.png" alt="research">
		<span class="nmb" id="research_nmb">1</span>

		<img height="15" src="<?php echo $cdnURL; ?>img/ui/moral.png" alt="moral">
		<span class="nmb" id="moral_nmb">1</span>

		<span class="hud-top-tooltip">
			<img height="15" src="<?php echo $cdnURL; ?>img/ui/electricity.png" alt="electricity">
			<span class="nmb" id="electricity_nmb">1</span>
			<span class="hud-top-tooltip-wrapper">
				<span class="hud-top-tooltip-content" id="electricity-tooltips">
					<?php echo ELECTRICITY; ?><br/>
					<?php echo AVAILABLE; ?>: <span id="electricity-available">XXX t</span><br/>
					<?php echo USED; ?>: <span id="electricity-used">XXX t</span><br/>
					<?php echo TOTAL; ?>: <span id="electricity-total">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span id="hud-top-left-moveRight">&#9654;</span>
	</div>

	<div id="hud-top-center">
		<img id="hud-settings" height="20" src="<?php echo $cdnURL; ?>img/ui/settings.png" alt="settings">
		<span id="hud-planet-prev" onclick="planet.prev();">&#9664;</span>
		<span id="hud-planet-name">SomeLongName</span>
		<span id="hud-planet-next" onclick="planet.next();">&#9654;</span>
	</div>

	<div id="hud-top-right">
		<span id="hud-top-right-moveLeft">&#9664;</span>
		<span class="hud-top-tooltip">
			<img height="20" src="<?php echo $cdnURL; ?>img/ui/minerals.png" alt="minerals">
			<span class="nmb" id="minerals_nmb">1</span>
			<span class="hud-top-tooltip-wrapper">
				<span class="hud-top-tooltip-content" id="minerals-tooltips">
					<?php echo MINERALS; ?><br/>
					<?php echo CAPACITY; ?>: <span id="minerals-cap">XXX t</span><br/>
					<?php echo PRODUCTION; ?>: <span id="minerals-prod">XXX t</span><br/>
					<?php echo CONSUMPTION; ?>: <span id="minerals-cons">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="hud-top-tooltip">
			<span class="element">&sup3;He </span>
			<span class="nmb" id="he_nmb">1</span>
			<span class="hud-top-tooltip-wrapper">
				<span class="hud-top-tooltip-content" id="he-tooltips">
					<?php echo HELIUM3; ?><br/>
					<?php echo CAPACITY; ?>: <span id="he-cap">XXX t</span><br/>
					<?php echo PRODUCTION; ?>: <span id="he-prod">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="hud-top-tooltip">
			<span class="element">Al </span>
			<span class="nmb" id="al_nmb">1</span>
			<span class="hud-top-tooltip-wrapper">
				<span class="hud-top-tooltip-content" id="al-tooltips">
					<?php echo METAL_ALUMINIUM; ?><br/>
					<?php echo CAPACITY; ?>: <span id="al-cap">XXX t</span><br/>
					<?php echo PRODUCTION; ?>: <span id="al-prod">XXX t</span><br/>
					<?php echo IMPORTANCE; ?>: <span id="al-variety">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="hud-top-tooltip">
			<span class="element" id="element_fe">Fe </span>
			<span class="nmb" id="fe_nmb">1</span>
			<span class="hud-top-tooltip-wrapper">
				<span class="hud-top-tooltip-content" id="fe-tooltips">
					<?php echo METAL_IRON; ?><br/>
					<?php echo CAPACITY; ?>: <span id="fe-cap">XXX t</span><br/>
					<?php echo PRODUCTION; ?>: <span id="fe-prod">XXX t</span><br/>
					<?php echo IMPORTANCE; ?>: <span id="fe-variety">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="hud-top-tooltip">
			<span class="element">Ti </span>
			<span class="nmb" id="ti_nmb">1</span>
			<span class="hud-top-tooltip-wrapper">
				<span class="hud-top-tooltip-content" id="ti-tooltips">
					<?php echo METAL_TITANIUM; ?><br/>
					<?php echo CAPACITY; ?>: <span id="ti-cap">XXX t</span><br/>
					<?php echo PRODUCTION; ?>: <span id="ti-prod">XXX t</span><br/>
					<?php echo IMPORTANCE; ?>: <span id="ti-variety">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span class="hud-top-tooltip">
			<span class="element">Cu </span>
			<span class="nmb" id="cu_nmb">1</span>
			<span class="hud-top-tooltip-wrapper">
				<span class="hud-top-tooltip-content" id="cu-tooltips">
					<?php echo METAL_COPPER; ?><br/>
					<?php echo CAPACITY; ?>: <span id="cu-cap">XXX t</span><br/>
					<?php echo PRODUCTION; ?>: <span id="cu-prod">XXX t</span><br/>
					<?php echo IMPORTANCE; ?>: <span id="cu-variety">XXX t</span><br/>
				</span>
			</span>
		</span>
		<span id="hud-top-right-moveRight">&#9654;</span>
	</div>
</div>
<?php /* HUD Bottom */ ?>
<div id="hud-bottom">
	<div id="hud-bottom-left">
		<span class="hud-bottom-tooltip">
			<a href="#map" id="hud-bottom-button-map"><img src="<?php echo $cdnURL; ?>img/ui/map.png" alt="map"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_MAP; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#researchs" id="hud-bottom-button-researchs"><img src="<?php echo $cdnURL; ?>img/ui/researchs.png" alt="researchs"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_RESEARCH; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#units" id="hud-bottom-button-units"><img src="<?php echo $cdnURL; ?>img/ui/units.png" alt="units"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_UNITS; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#fleets" id="hud-bottom-button-fleets"><img src="<?php echo $cdnURL; ?>img/ui/fleets.png" alt="fleets"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_FLEETS; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#radar" id="hud-bottom-button-radar"><img src="<?php echo $cdnURL; ?>img/ui/radar.png" alt="radar"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_RADAR; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#ally" id="hud-bottom-button-ally"><img src="<?php echo $cdnURL; ?>img/ui/ally.svg" alt="ally"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_ALLY; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#rapports" id="hud-bottom-button-rapports"><img src="<?php echo $cdnURL; ?>img/ui/rapports.png" alt="rapports"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_RAPPORTS; ?></span>
			</span>
		</span>
	</div>
	<div id="hud-bottom-right">
		<span class="hud-bottom-tooltip">
			<a href="#quests" id="hud-bottom-button-quests"><img src="<?php echo $cdnURL; ?>img/ui/quests.png" alt="quests"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_QUEST; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#trade" id="hud-bottom-button-trade"><img src="<?php echo $cdnURL; ?>img/ui/trade.png" alt="trade"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_TRADE; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#ranks" id="hud-bottom-button-ranks"><img src="<?php echo $cdnURL; ?>img/ui/ranks.png" alt="ranks"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_RANKS; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#profil" id="hud-bottom-button-profil"><img src="<?php echo $cdnURL; ?>img/ui/profil.png" alt="profil"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_PROFIL; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#messages" id="hud-bottom-button-messages"><img src="<?php echo $cdnURL; ?>img/ui/messages.png" alt="messages"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_MESSAGES; ?></span>
			</span>
		</span>
		<span class="hud-bottom-tooltip">
			<a href="#chat" id="hud-bottom-button-chat"><img src="<?php echo $cdnURL; ?>img/ui/chat.svg" alt="chat"></a>
			<span class="hud-bottom-tooltip-wrapper">
				<span class="hud-bottom-tooltip-content"><?php echo HUD_BOTTOM_CHAT; ?></span>
			</span>
		</span>
	</div>
</div>
<?php /* ESC */ ?>
<div id="settings-menu">
	<a href="#close-settings-tabs" id="close-settings-tabs">X</a><br/>
	<a href="https://galactae.eu/portal"><?php echo PORTAL; ?></a><br/>
	<a href="https://galactae.eu/profil"><?php echo PROFIL; ?></a><br/>
	<a href="https://galactae.eu/forum"><?php echo FORUM; ?></a><br/>
	<a href="https://galactae.eu/support"><?php echo SUPPORT; ?></a><br/>
	<a href="#settings-tabs"><?php echo SETTINGS; ?></a><br/>
	<a href="https://galactae.eu/deconnexion"><?php echo DISCONNECT; ?></a>
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
	<form action="#chat_text" method="post" id="chat_form">
		<input type="text" name="chat_message" id="chat_message" placeholder="Votre message..." size="50" autocomplete="off" />
		<a href="https://discord.gg/c8aARey" id="chat-voice" target="_blank"><img src="<?php echo $cdnURL; ?>img/ui/chat-voice.png" alt="voice"></a>
	</form>
</div>
<?php /* Ranks */ ?>
<div id="hud-ranks">
	<span id="hud-ranks-close">X</span>
	<iframe id="hud-ranks-frame" src="ranks.php"></iframe>
</div>
<?php /* News */
$lastNews = $mongoDB->getCondContent('galactae','announces',
		['onGame' => 1]
);

$max = 0;
if(isset($lastNews[0])) {
	foreach($lastNews as $key => $value) {
		$value = (array) $value;
		if($value['_id'] > $max) {
			$max = $value['_id'];
		}
	}
}

if($userData['lastViewedNews'] < $max) {
	echo '<div id="hud-news" style="display: block;">';
} else {
	echo '<div id="hud-news" style="display: none;">';
}
?>
	<span id="hud-news-close">X</span>
	<iframe id="hud-news-frame" src="news.php?n=<?php echo $max; ?>"></iframe>
</div>
<?php /* Map */ ?>
<div id="hud-map">
	<span id="hud-map-close">X</span>
	<div id="hud-map-back">Back to sector</div>
	<div id="hud-map-global"></div>
	<div id="hud-map-system" class="opening view-2D">
        <div id="hud-map-system-universeBack">
          <div id="hud-map-system-galaxyBack">
            <div id="hud-map-system-solarFront">
            </div>
          </div>
        </div>
    </div>
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
			<li shipType="SHIP_ALL" id="fleet-build-all-button" class="ul-choice-line-li-active"><?php echo FLEET_BUILD_ALL; ?></li>
			<li shipType="SHIP_DEF" id="fleet-build-defense-button"><?php echo FLEET_BUILD_DEF; ?></li>
			<li shipType="SHIP_FIGHTER" id="fleet-build-fighter-button"><?php echo FLEET_BUILD_FIGHTER; ?></li>
			<li shipType="SHIP_BATTLECRUISER" id="fleet-build-cruisader-button"><?php echo FLEET_BUILD_CUISADER; ?></li>
			<li shipType="SHIP_CUIRASSE" id="fleet-build-cuirasse-button"><?php echo FLEET_BUILD_CUIRASSE; ?></li>
			<li shipType="SHIP_CORVET" id="fleet-build-corvette-button"><?php echo FLEET_BUILD_CORVET; ?></li>
			<li shipType="SHIP_CARRIER" id="fleet-build-carrier-button"><?php echo FLEET_BUILD_CARRIER; ?></li>
		</ul>
		<div id="fleet-build-content">
			<h2 id="fleet-build-list-empty"><?php echo FLEET_NO_MODEL; ?></h2>
			<table id="fleet-build-list">
				<thead>
					<tr>
						<th id="fleet-build-list-type-name"><?php echo FLEET_BUILD_NAME; // Le nom du vaisseau 					 ?></th>
						<th id="fleet-build-list-type-shipType"><?php echo FLEET_BUILD_TYPE; // Le type de vaisseau 				 ?></th>
						<th id="fleet-build-list-type-shipShape"><?php echo FLEET_BUILD_SHAPE; // La forme du vaisseau 				 ?></th>
						<th id="fleet-build-list-type-note"><?php echo FLEET_BUILD_NOTE; // Sa note estimée par le systeme		 ?></th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>

			<div id="fleet-build-info">
				<input type="button" id="fleet-build-create" name="fleet-build-new-model" class="ui-large-button" value="<?php echo FLEET_BUILD_CREATE; ?>">

				<div id="fleet-build-cost">
					<span id="fleet-build-name"></span><img id="fleet-build-rename" src="<?php echo $cdnURL; ?>img/ui/rename.png"><br /><br />
					<?php echo '<span id="fleet-build-stat-attack">'.SHIP_ATTACK.' : <span id="fleet-build-stat-attack-val"></span></span>
					<span id="fleet-build-stat-shield">'.SHIP_SHIELD.' : <span id="fleet-build-stat-shield-val"></span></span>
					<span id="fleet-build-stat-subspeed">'.SHIP_SUBSPEED.' : <span id="fleet-build-stat-subspeed-val"></span></span>
					<span id="fleet-build-stat-supspeed">'.SHIP_SUPSPEED.' : <span id="fleet-build-stat-supspeed-val"></span></span>
					<span id="fleet-build-stat-miss">'.SHIP_MISS_CHANCE.' : <span id="fleet-build-stat-miss-val"></span></span>
					<span id="fleet-build-stat-mass">'.SHIP_MASS.' : <span id="fleet-build-stat-mass-val"></span></span>
					<span id="fleet-build-stat-fcap">'.SHIP_FCAP.' : <span id="fleet-build-stat-fcap-val"></span></span>
					<span id="fleet-build-stat-note">'.FLEET_BUILD_NOTE.' : <span id="fleet-build-stat-note-val"></span></span>'; ?>
				</div>
	
				<div id="fleet-build-buttons">

					<img id="fleet-build-openPanel" src="./cdn/img/ui/build.svg" alt="build">
					<img id="fleet-build-type-copy" src="./cdn/img/ui/copy.svg" alt="copy">
					<img id="fleet-build-type-delete" src=./cdn/img/ui/delete.png alt="delete">
					<br/>
					<span id="fleet-build-desc">Build unit</span>
				</div>

				<span id="fleet-build-message" style="display: block;"></span>
			</div>
		</div>
	</div>
	<?php /* Fleet Orbit */ ?>
	<div id="fleet-orbit">
		<div id="fleet-orbit-content"></div>
	</div>
	<?php /* Fleet Moves */ ?>
	<div id="fleet-move">
		<div id="fleet-move-content"></div>
	</div>
	<?php /* Fleet Out */ ?>
	<div id="fleet-out">
		<div id="fleet-out-content"></div>
	</div>
</div>

<div id="fleet-type-create">
	<form id="fleet-type-create-form">
		<span id="fleet-type-create-close">X</span>

		<select id="fleet-type-create-shipType" class="ui-large-select" onchange="units.changeShipType();"></select> 
		<select id="fleet-type-create-shipShape" class="ui-large-select" onchange="units.changeShipShape();"></select>
		<input type="text" id="fleet-type-create-name" placeholder="<?php echo SHIP_NAME; ?>" class="ui-large-button" required/>

		<svg id="fleet-type-create-schematic" width="800px" height="450px"></svg>
		<div id="fleet-type-create-selects"></div>

		<div id="fleet-type-create-cost">
				<?php echo '<div id="fleet-type-create-stat-subspeed">'.SHIP_SUBSPEED.' : <span id="fleet-type-create-stat-subspeed-val"></span><br /></div>
			<div id="fleet-type-create-stat-supspeed">'.SHIP_SUPSPEED.' : <span id="fleet-type-create-stat-supspeed-val"></span><br /></div>
			<div id="fleet-type-create-stat-miss">'.SHIP_MISS_CHANCE.' : <span id="fleet-type-create-stat-miss-val"></span><br /></div>
			<div id="fleet-type-create-stat-mass">'.SHIP_MASS.' : <span id="fleet-type-create-stat-mass-val"></span><br /></div>
			<div id="fleet-type-create-stat-fcap">'.SHIP_FCAP.' : <span id="fleet-type-create-stat-fcap-val"></span><br /></div>
			<div id="fleet-type-create-stat-note">'.FLEET_BUILD_NOTE.' : <span id="fleet-type-create-stat-note-val"></span><br /></div>'; ?>
		</div>

		<input type="submit" id="fleet-type-create-submit" class="ui-large-button" value="<?php echo FLEET_CREATE; ?>">
	</form>
</div>
<div id="fleet-ship-build">
	<span id="fleet-ship-build-close">X</span>
	<div class="fleet-ship-build-cost">
		<h4><?php echo FLEET_TOTAL_COST; ?></h4>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-iron">Fe <span id="fleet-ship-build-cost-iron-val">XXXt</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-aluminium">Al <span id="fleet-ship-build-cost-aluminium-val">XXXt</p></span>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-copper">Cu <span id="fleet-ship-build-cost-copper-val">XXXt</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-titanium">Ti <span id="fleet-ship-build-cost-titanium-val">XXXt</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-population"><img src="./cdn/img/ui/population.png" alt="population"> <span id="fleet-ship-build-cost-population-val">XXXM (+XXX.XK)</span></p>
		<p class="fleet-ship-build-cost-item" id="fleet-ship-build-cost-time"><?php echo TIME; ?>: <span id="fleet-ship-build-cost-time-val">00:00:00</span></p>
	</div>

	<span id="fleet-ship-build-name">This isn't a ship name</span>

	<script type="text/javascript">
		var unitBuildSelectHeader = '<option id="-2" selected disabled><?php echo FLEET; ?></option>';
		var unitBuildSelectNew = '<option id="-1"><?php echo NEW_FLEET; ?></option>';
	</script>
	
	<select id="fleet-ship-build-fleetSelect" class="ui-large-button">
		<option id="-2" selected disabled><?php echo FLEET; ?></option>
		<option id="-1"><?php echo NEW_FLEET; ?></option>
	</select>
	<input type="number" name="fleet-ship-build-count" id="fleet-ship-build-count" class="ui-large-button">
	<input type="button" id="fleet-ship-build-upgrade" class="ui-large-button" value="<?php echo BUILD; ?>">	
</div>
<div id="fleet-newFleet-panel">
	<input id="fleet-newFleet-name" class="ui-large-button" type="text" placeholder="<?php echo FLEET_NAME; ?>">
	<input id="fleet-newFleet-submit" class="ui-large-button" type="submit" placeholder="<?php echo CONFIRM; ?>">
</div>
<?php /* Researchs */ ?>
<div id="hud-research">
	<span id="hud-research-close">X</span>
	<div id="hud-research-content">
		<svg id="hud-research-links" width="10000px" height="10000px"></svg>
	</div>
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
<div id="game-version"><?php echo file_get_contents($cdnURL.'version.txt'); ?> - <a href="https://bugs.elanis.eu/" target="_blank">Bug Tracker</a><br /><?php echo CREATED_BY; ?> <a href="https://elanis.eu/" target="_blank">Elanis</a> - Copyright 2016-<?php echo date("Y"); ?></div>
<?php /* Libs */ ?>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/jquery.min.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/details-polyfill.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/socket.min.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/css_globe_perspectivetransform.js"></script>
<?php /* Client Classes */ ?>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/calcConstants.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/chat.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/map.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/misc.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/planet.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/planetback.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/research.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/settings.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/ui.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/units.js"></script>
<script type="text/javascript" src="<?php echo $cdnURL; ?>js/websockets.js"></script>
<?php /* Launch Game ! */ ?>
<script type="text/javascript" src="<?php echo $cdnURL; ?>/js/load.js"></script>
</body>
<?php /* Block Portrait Screens */ ?>
<div id="portrait-warn"><h1><?php echo PORTRAIT_ERROR; ?></h1></div>