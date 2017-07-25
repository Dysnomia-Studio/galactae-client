<?php
	// == Resources == \\
	define('METAL_CATEGORY','Metal');
	define('METAL_IRON','Iron');
	define('METAL_ALUMINIUM','Aluminium');
	define('METAL_COPPER','Copper');
	define('METAL_TITANIUM','Titanium');
	define('ENERGY','Energy Consumption');
	define('TIME','Time');
	define('BUILD','Build');

	// == Buildings == \\
	define('PLANET_BUILDING','Ground Build');
	define('ORBITAL_BUILDING','Orbital Build');

	// == Fleets == \\
	define('FLEET_BUILD_NAME','Name');
	define('FLEET_BUILD_TYPE','Type');
	define('FLEET_BUILD_NOTE','Notation');
	define('FLEET_BUILD_N_OWN','Number of owned');
	define('FLEET_BUILD_CREATE','New model');
	define('SHIP_ATTACK','Attack');
	define('SHIP_SHIELD','Shield');
	define('SHIP_ROLE','Role');
	define('SHIP_PROPULSION','Engines');
	define('SHIP_MISS_CHANCE','Miss Chance');
?>
<script type="text/javascript">
	var planetBuilding = [
		// ground
		{id: "carriere", name: "Quarry", desc: "This will harvest minerals from the ground."},
		{id: "metalurgie", name: "Metallurgy", desc: "In this building, minerals become metals."},
		{id: "living",name: "Houses", desc: "Here lives the population."},
		{id: "serre", name: "Greenhouse", desc: "In this place will grow all the food."},
		{id: "solar", name: "Solar Power Plant", desc: "Make electricity with solar energy !" },
		{id: "warehouse", name: "Warehouse", desc: "It will stock solid things (minerals and metals)" },
		{id: "headquarter", name: "Headquarters", desc: "The Headquarters lead all your fleets and all your defenses." },
		{id: "launchpad", name: "Space Center", desc: "From Here, we build and launch our basic spatial units." },
		{id: "research", name: "Institute for Scientific Research", desc: "Here, you can manage all scientific research on this planet." }
		// Space
		{id: "radar", name: "Radar Satelite", desc: "This satelite will detect all closet fleets and its range will grow while updating." },
		{id: "tank", name: "Tank", desc: "It will stock Helium 3." },
		{id: "shipyard", name: "Shipyard", desc: "The shipyard will create and build all your ships." },
		{id: "trade", name: "Trading station", desc: "The trading station is the center of all our commercial activities." },
		{id: "he3exp", name: "Helium 3 exploitation station", desc: "This station will search helium 3 in closet asteroids and get it." },
		];
</script>