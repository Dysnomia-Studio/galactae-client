<?php
//English
if($_SESSION['lang']=="en") {
	// == HUD == \\
	define('CHAT_WELCOME','Welcome to the Chat ! Respect the others or you will be sanctioned by the moderators.');
	define('CHAT_GLOBAL','Global');
	define('CHAT_TRADE','Trade');
	define('CHAT_ALLY','Ally');

	define('MAP','Map');

	// == Resources == \\
	define('METAL_CATEGORY','Metal');
	define('METAL_IRON','Iron');
	define('METAL_ALUMINIUM','Aluminium');
	define('METAL_COPPER','Copper');
	define('METAL_TITANIUM','Titanium');
	define('ENERGY','Energy');
	define('TIME','Time');

	// == Buildings == \\
	define('PLANET_BUILDING','Ground Build');
	define('ORBITAL_BUILDING','Orbital Build');

	define('PLANET_BUILDING_CONTENT','	
	var planetBuilding = [
	{id: "carriere", name: "Quarry", actualLevel: 1, desc: "This will harvest minerals from the ground."},
	{id: "metalurgie", name: "Metallurgy", actualLevel: 1, desc: "In this building, minerals become metals."},
	{id: "living",name: "Houses", actualLevel: 1, desc: "Here lives the population."},
	{id: "serre", name: "Greenhouse", actualLevel: 1, desc: "In this place will grow all the food."},
	{id: "solar", name: "Solar Power Plant", actualLevel: 1, desc: "Make electricity with condensed solar energy !" },
	{id: "warehouse", name: "Warehouse", actualLevel: 1, desc: "It will stock solid things (minerals and metals)" },
	{id: "tank", name: "Tank", actualLevel: 1, desc: "It will stock liquid resources (water and petrol)." },
	{id: "launchpad", name: "Space Center", actualLevel: 1, desc: "From Here, we build and launch our basic spatial units." },
	{id: "research", name: "Research center", actualLevel: 1, desc: "Here, do your research." }
	];
	');
}
//Francais
else {
	// == HUD == \\
	define('CHAT_WELCOME','Bienvenue sur le Chat ! Respectez les autres ou vous serez sanctionné par les modérateurs.');
	define('CHAT_GLOBAL','Global');
	define('CHAT_TRADE','Commerce');
	define('CHAT_ALLY','Alliance');

	define('MAP','Carte');

	// == Resources == \\
	define('METAL_CATEGORY','Metal');
	define('METAL_IRON','Fer');
	define('METAL_ALUMINIUM','Aluminium');
	define('METAL_COPPER','Cuivre');
	define('METAL_TITANIUM','Titane');
	define('ENERGY','Energie');
	define('TIME','Temps');

	// == Buildings == \\
	define('PLANET_BUILDING','Constructions à la Surface');
	define('ORBITAL_BUILDING','Constructions en Orbite');

	define('PLANET_BUILDING_CONTENT','	
	var planetBuilding = [
	{id: "carriere", name: "Carriere", actualLevel: 1, desc: "Les carrières vont extraire les minerais bruts du sol de la planète."},
	{id: "metalurgie", name: "Metallurgie", actualLevel: 1, desc: "Les minerais bruts seront ici traités et les metaux extraits."},
	{id: "living",name: "Habitations", actualLevel: 1, desc: "Les batiments dans lesquels vivent la population."},
	{id: "serre", name: "Serres", actualLevel: 1, desc: "C\'est dans ces endroits que pousse la nourriture."},
	{id: "solar", name: "Centrales Solaires", actualLevel: 1, desc: "Ces centrales transforment l\'energie condensée par les satelites en energie electrique." },
	{id: "warehouse", name: "Entrepots", actualLevel: 1, desc: "Ces batiments stockeront les solides (minerais bruts et metaux)" },
	{id: "tank", name: "Réservoirs", actualLevel: 1, desc: "Ces batiments stockeront les liquides (eau et pétrole)." },
	{id: "launchpad", name: "Centre Spatial", actualLevel: 1, desc: "C\'est ici que seront construites et lancées vos unités et bâtiments spatiaux de base." },
	{id: "research", name: "Centre de recherches", actualLevel: 1, desc: "Ici, vous ferez vos recherches." }
	];
	');
}