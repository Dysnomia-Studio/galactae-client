<?php
	// == Resources == \\
	define('METAL_CATEGORY','Metal');
	define('METAL_IRON','Fer');
	define('METAL_ALUMINIUM','Aluminium');
	define('METAL_COPPER','Cuivre');
	define('METAL_TITANIUM','Titane');
	define('ENERGY','Consommation Energetique');
	define('TIME','Temps');
	define('BUILD','Construire');

	// == Buildings == \\
	define('PLANET_BUILDING','Constructions à la Surface');
	define('ORBITAL_BUILDING','Constructions en Orbite');

	// == Fleets == \\
	define('FLEET_BUILD_NAME','Nom');
	define('FLEET_BUILD_TYPE','Type');
	define('FLEET_BUILD_NOTE','Evaluation');
	define('FLEET_BUILD_N_OWN','Nombre possédés');
	define('FLEET_BUILD_CREATE','Nouveau modele');
	define('SHIP_ATTACK','Attaque');
	define('SHIP_SHIELD','Bouclier');
	define('SHIP_ROLE','Role');
	define('SHIP_PROPULSION','Moteurs');
	define('SHIP_MISS_CHANCE','Probabilité d\'evitement');
?>
<script type="text/javascript">
	var planetBuilding = [
		// ground
		{id: "carriere", name: "Carriere", desc: "Les carrières vont extraire les minerais bruts du sol de la planète."},
		{id: "metalurgie", name: "Metallurgie", desc: "Les minerais bruts seront ici traités et les metaux extraits."},
		{id: "living",name: "Habitations", desc: "Les batiments dans lesquels vivent la population."},
		{id: "serre", name: "Serres", desc: "C\'est dans ces endroits que pousse la nourriture."},
		{id: "solar", name: "Centrales Solaires", desc: "Ces centrales transforment l\'energie solaire en energie electrique." },
		{id: "warehouse", name: "Entrepots", desc: "Ces batiments stockeront les solides (minerais bruts et metaux)" },
		{id: "headquarter", name: "Etat Major", desc: "L'Etat Major vous permet de gerer vos differentes flottes, ainsi que les défenses de votre planète." },		
		{id: "launchpad", name: "Centre Spatial", desc: "C\'est ici que seront construites et lancées vos unités et bâtiments spatiaux de base." },
		{id: "research", name: "Centre de recherches", desc: "Ici, vous pourrez gerer toutes les recherches scientifiques de cette planète." },
		// Space
		{id: "radar", name: "Satellite Radar", desc: "Ce satellite vous permettra de dectecter les flottes de plus en plus loin avec ses evolutions." },
		{id: "tank", name: "Réservoirs", desc: "Ces batiments stockeront l'helium 3." },
		{id: "shipyard", name: "Chantier Naval", desc: "Le chantier naval vous permet de concevoir  ainsi que de construire vos differents vaisseaux." },
		{id: "trade", name: "Hub Commercial", desc: "Cette station est le centre névralgique de toutes les activités commerciales de votre planète." },
		{id: "he3exp", name: "Station d'exploitation d'Helium 3", desc: "Cette station va exploiter les astéroides environnants afin de recuperer automatiquement de l'helium 3." },
		];
</script>