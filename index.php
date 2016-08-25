<?php
include_once('lib/base.php'); 

if(!isset($_SESSION['username'])||$_SESSION['username']=="") { header('Location: ../index.php'); }
?>
	<div id="planet-content">
		<div id="messagePanel">
			
		</div>
		<img id="hud-top-back" src="img/hud-top.png" alt="hud-top">
		<div id="hud-top">
			<div id="hud-top-left-content">
				<img height="20" src="img/population.png" alt="population"> <span class="nmb" id="population_nmb">1</span>
				<img height="20" src="img/research.png" alt="research"> <span class="nmb" id="research_nmb">1</span>
				<img height="20" src="img/moral.png" alt="moral"> <span class="nmb" id="moral_nmb">1</span>
				<img height="20" src="img/electricity.png" alt="electricity"> <span class="nmb" id="electricity_nmb">1</span>
			</div>
			<ul id="hud-top-center">
				<li id="hud-username"></li>
				<li id="hud-planet-prev">&#60;</li>
				<li id="hud-planet-name"><span class="planet-name-text"></span></li>
				<li id="hud-planet-next">&#62;</li>
				<li id="hud-user-money"><img height="20" src="img/money.png" alt="money"> <span class="nmb" id="money_nmb">1</span></li>
				<li id="hud-solar-system"><?php echo MAP; ?></li>
			</ul>
			<div id="hud-top-right-content">
				<img height="20" src="img/minerals.png" alt="minerals"> <span class="nmb" id="minerals_nmb">1</span>
				<span class="element">&sup3;He </span><span class="nmb" id="gas_nmb">1</span> 
				<span class="element" id="element_fe">Fe </span><span class="nmb" id="iron_nmb">1</span>
				<span class="element">Al </span><span class="nmb" id="aluminium_nmb">1</span>
				<span class="element">Cu </span><span class="nmb" id="copper_nmb">1</span>
				<span class="element">Ti </span><span class="nmb" id="titanium_nmb">1</span>
			</div>
		</div>

		<div id="building-area">	
			<h1 id="building-name">NOM DU BATIMENT</h1>
			<p id="building-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
			<div id="building-cost">
			<?php echo METAL_IRON.' : <span id="building-cost-iron"></span><br/>
			'.METAL_ALUMINIUM.' : <span id="building-cost-aluminium"></span><br/>
			'.METAL_COPPER.' : <span id="building-cost-copper"></span><br/>
			'.METAL_TITANIUM.' : <span id="building-cost-titanium"></span><br/>
			'.ENERGY.' : <span id="building-cost-energy"></span><br/>
			'.TIME.' : <span id="building-cost-time"></span><br/>';
			?>
			<input type="button" id="building-upgrade" value="<?php echo UPGRADE; ?>">
			</div>
			<img src="?" id="building-img" alt="building-img">
			<input type="button" id="building-quit" value="X" onclick="HideBuildPanel()">
		</div>

		<div class="build-tab">
			<p class="build-title"><?php echo PLANET_BUILDING; ?></p>
			<img src="img/building-tabs/solar1.png" class="build-tab-building" id="solar" onclick="OpenBuildingPanel(4)" alt="solar">
			<img src="img/building-tabs/warehouse1.png" class="build-tab-building" id="warehouse"  onclick="OpenBuildingPanel(5)" alt="warehouse">
			<img src="img/building-tabs/tank1.png" class="build-tab-building" id="tank"  onclick="OpenBuildingPanel(6)" alt="tank">
			<img src="img/building-tabs/serre1.png" class="build-tab-building" id="serre"  onclick="OpenBuildingPanel(3)" alt="serre">
			<img src="img/building-tabs/living1.png" class="build-tab-building" id="living"  onclick="OpenBuildingPanel(2)" alt="living">
			<img src="img/building-tabs/research1.png" class="build-tab-building" id="research"  onclick="OpenBuildingPanel(8)" alt="research">
			<img src="img/building-tabs/concasseur1.png" class="build-tab-building" id="concasseur" height="70" onclick="OpenBuildingPanel(1)" alt="metallurgy">
			<img src="img/building-tabs/launchpad1.png" class="build-tab-building" id="launchpad" height="70" onclick="OpenBuildingPanel(7)" alt="launchpad">
			<img src="img/building-tabs/carriere1.png" class="build-tab-building" id="carriere" width="70" onclick="OpenBuildingPanel(0)" alt="carriere">
			<img src="img/building-tabs/0.png" class="build-tab-background" alt="building-tab">
		</div>

		<div class="space-tab">
			<p class="space-title"><?php echo ORBITAL_BUILDING; ?></p>
			<img src="img/building-tabs/space-tab.png" class="space-tab-background" alt="space-tab">
		</div>

		<div id="hud-chat">
			<ul id="hud-chat-channels">
				<li><a href="#" title="hud-chat-global" class="chatTab chatActive"><?php echo CHAT_GLOBAL; ?></a></li>
				<li><a href="#" title="hud-chat-trade" class="chatTab"><?php echo CHAT_TRADE; ?></a></li>
				<li><a href="#" title="hud-chat-ally" class="chatTab"><?php echo CHAT_ALLY; ?></a></li>
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
				<input type="text" name="chat_message" id="chat_message" placeholder="Votre message..." size="50" autofocus />
			</form>
		</div>
	</div>
	<div id="system-map">	
		<canvas id="map" width="1920" height="940"></canvas>
		<div id="hud-system-back">Back to the planet</div>
	</div>
	<div id="game-version">Alpha-0.1.1-160726a<br />Created By Elanis - Copyright 2016</div>
</body>