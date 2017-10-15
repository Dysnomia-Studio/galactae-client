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
	define('CAPACITY','Capacity');
	define('PRODUCTION','Production');
	define('CONSUMPTION','Consumption');
	define('IMPORTANCE','Importance');
	define('AVAILABLE','Available');
	define('USED','Used');
	define('TOTAL','Total');

	// == Buildings == \\
	define('PLANET_BUILDING','Ground Build');
	define('ORBITAL_BUILDING','Orbital Build');
?>
<script type="text/javascript">
	var translate = translate || {};

	translate['buildings'] = [
		// ground
		{id: "carriere", name: "Quarry", desc: "The Quarry will harvest minerals from the ground."},
		{id: "metallurgy", name: "Metallurgy", desc: "In this building, minerals become metals."},
		{id: "living",name: "Houses", desc: "Here lives the population."},
		{id: "serre", name: "Greenhouse", desc: "The greenhouse are the main source of food on the planet."},
		{id: "solar", name: "Solar Power Plant", desc: "Make electricity with solar energy !" },
		{id: "warehouse", name: "Warehouse", desc: "Warehouse will stock minerals and metals." },
		{id: "headquarter", name: "Headquarters", desc: "The Headquarters lead all your fleets and all your defenses." },
		{id: "launchpad", name: "Space Center", desc: "In the space center, we'll build planet defences, fighters and resource transport to space buildings." },
		{id: "research", name: "Institute for Scientific Research", desc: "The research centers of all your planets works together to discover new technologies." }
		// Space
		{id: "radar", name: "Radar Satelite", desc: "This satelite will detect all closet fleets and is useful to contact your fleets." },
		{id: "tank", name: "Tank", desc: "It will stock Helium 3." },
		{id: "shipyard", name: "Shipyard", desc: "The shipyard will create and build all your ships." },
		{id: "trade", name: "Trading station", desc: "The trading station is the center of all our commercial activities." },
		{id: "he3exp", name: "Helium 3 exploitation station", desc: "This station will search helium 3 in closet asteroids and get it." },
		];
</script>