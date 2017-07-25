<?php
	// == Resources == \\
	define('METAL_CATEGORY','Metal');
	define('METAL_IRON','Iron');
	define('METAL_ALUMINIUM','Aluminium');
	define('METAL_COPPER','Copper');
	define('METAL_TITANIUM','Titanium');
	define('ENERGY','Energy Consumption');
	define('TIME','Time');

	// == Buildings == \\
	define('PLANET_BUILDING','Ground Build');
	define('ORBITAL_BUILDING','Orbital Build');
	define('UPGRADE','Ameliorer');
?>
<script type="text/javascript">
	var planetBuilding = [
		{id: "carriere", name: "Quarry", desc: "This will harvest minerals from the ground."},
		{id: "metalurgie", name: "Metallurgy", desc: "In this building, minerals become metals."},
		{id: "living",name: "Houses", desc: "Here lives the population."},
		{id: "serre", name: "Greenhouse", desc: "In this place will grow all the food."},
		{id: "solar", name: "Solar Power Plant", desc: "Make electricity with solar energy !" },
		{id: "warehouse", name: "Warehouse", desc: "It will stock solid things (minerals and metals)" },
		{id: "tank", name: "Tank", desc: "It will stock liquid resources (water and petrol)." },
		{id: "launchpad", name: "Space Center", desc: "From Here, we build and launch our basic spatial units." },
		{id: "research", name: "Research center", desc: "Here, do your research." }
	];
</script>