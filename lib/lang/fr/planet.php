<?php
	// == Resources == \\
	define('METAL_CATEGORY','Metal');
	define('METAL_IRON','Fer');
	define('METAL_ALUMINIUM','Aluminium');
	define('METAL_COPPER','Cuivre');
	define('METAL_TITANIUM','Titane');
	define('ENERGY','Consommation Energetique');
	define('TIME','Temps');

	// == Buildings == \\
	define('PLANET_BUILDING','Constructions à la Surface');
	define('ORBITAL_BUILDING','Constructions en Orbite');
	define('UPGRADE','Ameliorer');
?>
<script type="text/javascript">
	var planetBuilding = [
		{id: "carriere", name: "Carriere", desc: "Les carrières vont extraire les minerais bruts du sol de la planète."},
		{id: "metalurgie", name: "Metallurgie", desc: "Les minerais bruts seront ici traités et les metaux extraits."},
		{id: "living",name: "Habitations", desc: "Les batiments dans lesquels vivent la population."},
		{id: "serre", name: "Serres", desc: "C\'est dans ces endroits que pousse la nourriture."},
		{id: "solar", name: "Centrales Solaires", desc: "Ces centrales transforment l\'energie solaire en energie electrique." },
		{id: "warehouse", name: "Entrepots", desc: "Ces batiments stockeront les solides (minerais bruts et metaux)" },
		{id: "tank", name: "Réservoirs", desc: "Ces batiments stockeront les liquides (eau et pétrole)." },
		{id: "launchpad", name: "Centre Spatial", desc: "C\'est ici que seront construites et lancées vos unités et bâtiments spatiaux de base." },
		{id: "research", name: "Centre de recherches", desc: "Ici, vous ferez vos recherches." }
		];
</script>