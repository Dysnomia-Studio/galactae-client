<?php
	// == Resources == \\
	define('MINERALS','Minerais bruts');
	define('POPULATION','Population');
	define('ELECTRICITY','Electricité');
	define('HELIUM3','Helium 3');
	define('DISTRIBUTING_FUEL', 'Rechargement des flottes<br/> en carburant');
	define('METAL_CATEGORY','Metal');
	define('METAL_IRON','Fer');
	define('METAL_ALUMINIUM','Aluminium');
	define('METAL_COPPER','Cuivre');
	define('METAL_TITANIUM','Titane');
	define('ENERGY','Consommation Energetique');
	define('TIME','Temps');
	define('BUILD','Construire');
	define('CAPACITY','Capacité');
	define('PRODUCTION','Production');
	define('CONSUMPTION','Consommation');
	define('IMPORTANCE','Presence');
	define('AVAILABLE','Disponible');
	define('USED','Utilisé');
	define('TOTAL','Total');
	define('COST','Coût du niveau suivant');

	// == Buildings == \\
	define('PLANET_BUILDING','Constructions à la Surface');
	define('ORBITAL_BUILDING','Constructions en Orbite');
?>
<script type="text/javascript">
var translate = translate || {};

translate['buildings'] = [
	// ground
	{id: 'carriere', name: 'Carrieres', desc: 'Les carrières vont extraire les minerais bruts du sol de la planète.'},
	{id: 'metallurgy', name: 'Metallurgie', desc: 'Les minerais bruts seront ici traités et les metaux extraits.'},
	{id: 'living',name: 'Habitations', desc: 'Les habitations hebergent la population stationnée sur la planète.'},
	{id: 'serre', name: 'Serres', desc: 'Les serres sont la principale source de nourriture pour la population.'},
	{id: 'solar', name: 'Centrales Solaires', desc: 'Ces centrales transforment l\'energie solaire en energie electrique.' },
	{id: 'warehouse', name: 'Entrepots', desc: 'Dans les entrepôts sont stockés les minerais bruts ainsi que les metaux traités.' },
	{id: 'headquarter', name: 'Etat Major', desc: 'L\'Etat Major est le centre névralgique de la gestion des flottes et du système millitaire de la planète.' },
	{id: 'launchpad', name: 'Centre Spatial', desc: 'Le centre spatial gère la création des défenses spatiales, des chasseurs ainsi que l\'acheminements des ressources necessaires à la création de bâtiments spatiaux. Chaque niveau augmente la productivité.' },
	{id: 'research', name: 'Centre de recherches', desc: 'Les differents centres de recherches de vos planètes travaillent ensemble afin de découvrir de nouvelles technologies.' },
	// Space
	{id: 'radar', name: 'Satellite Radar', desc: 'Le Satellite Radar vous permet de détecter les flottes à une certaine distance de votre planète, il permet aussi de communiquer avec vos flottes en mouvement.' },
	{id: 'tank', name: 'Réservoirs', desc: 'Cette station spatiale stocke l\'helium 3.' },
	{id: 'shipyard', name: 'Chantier Naval', desc: 'Le chantier naval vous permet de concevoir ainsi que de construire vos differents vaisseaux. Chaque niveau augmente la productivité.' },
	{id: 'trade', name: 'Hub Commercial', desc: 'Cette station est le centre névralgique de toutes les activités commerciales autour de votre planète.' },
	{id: 'he3exp', name: 'Station d\'exploitation d\'Helium 3', desc: 'Cette station va exploiter les astéroides environnants afin de recuperer automatiquement de l\'helium 3.' },
];

translate['planet-ui'] = {
	'storage': 'Stockage',
	'production': 'Production',
	'population': 'Population',
	'afterUpdating': 'après l\'amélioration',
	'availableFleets': 'Flottes disponibles',
	'metal': 'Metaux',
	'min&met': 'Minerais/Metaux',
	'total': '(total)',
};
</script>