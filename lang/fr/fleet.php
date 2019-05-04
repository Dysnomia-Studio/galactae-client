<?php
	//== Menus ==\\
	define('FLEET_BUILD','Construire');
	define('FLEET_ORBIT','Orbite');
	define('FLEET_MOVE','Deplacements');
	define('FLEET_OUT','En dehors');
	define('FLEET_TACTICS','Tactiques');
	define('FLEET_BUILD_ALL','Tout types');
	define('FLEET_BUILD_DEF','Defenses Orbitales');
	define('FLEET_BUILD_CUISADER','Croiseurs');
	define('FLEET_BUILD_CUIRASSE','Cuirassés');
	define('FLEET_BUILD_FIGHTER','Chasseurs');
	define('FLEET_BUILD_CORVET','Corvettes');
	define('FLEET_BUILD_CARRIER','Transporteurs');

	//== Details ==\\
	define('FLEET_BUILD_NAME','Nom');
	define('FLEET_BUILD_TYPE','Type');
	define('FLEET_BUILD_SHAPE','Modele');
	define('FLEET_BUILD_NOTE','Evaluation');
	define('FLEET_BUILD_COUNT','Nombre');
	define('FLEET_BUILD_CREATE','Nouveau plan');
	define('FLEET_TOTAL_COST','Coût Total');
	define('FLEET_CREATE','Creer');
	define('SHIP_NAME','Nom');
	define('SHIP_WEAPONS','Armes');
	define('SHIP_SHIELD','Défenses');
	define('SHIP_ROLE','Role');
	define('SHIP_SPEEDS','Moteur(s)');
	define('SHIP_SUBSPEED','Interplanetaire');
	define('SHIP_SUPSPEED','Interstellaire');
	define('SHIP_MISS_CHANCE','Chance d\'évitement');
	define('SHIP_FCAP','Capacité chasseurs');

	//== Fleet ==\\
	define('FLEET','Flotte');
	define('FLEET_NAME','Nom de la flotte');
	define('FLEET_NEWNAME','Nouveau Nom pour');
	define('FLEET_TRANSFER_TYPE','Tranferer unités de type');
	define('FLEET_TRANSFERALL_TYPE','Transfert de toutes les unités de');
	define('FLEET_TRANSFERFUEL_FROM','Tranferer fuel de');
	define('FLEET_TRANSFER_TO','vers');
	define('NEW_FLEET','Nouvelle Flotte ...');

	//== Tactics ==\\
	define('FLEET_UNIT_TYPE', 'Type d\'unité');
	define('FLEET_UNIT_TARGET', 'Cible prioritaire');
	define('FLEET_PRIORITY', 'Niveau de priorité');
	define('FLEET_TACTIC_NAME', 'Nom de la tactique');
	define('FLEET_TACTIC_ADD_ORDER', 'Ajouter un ordre');
	define('FLEET_TACTIC_DELETE_ORDER', 'Supprimer l\'ordre');
	define('FLEET_TACTIC_SAVE_ORDER', 'Sauvegarder l\'ordre');
	define('FLEET_TACTIC_SAVE', 'Sauvegarder la tactique');

	//== Erreurs ==\\
	define('FLEET_NO_MODEL','Vous n\'avez encore aucun modèle');
?>
<script type="text/javascript">
const fleetTranslate = {
	// Titles
	'SHIP_TYPE': 'Type',
	'SHIP_SHAPE': 'Modèle',

	// Types & Shapes
	'SHIP_DEF': 'Défense',
	'SHIP_SAT_AG1': 'Satellite AG-I',
	'SHIP_SAT_AG2': 'Satellite AG-II',
	'SHIP_SAT_AG3': 'Satellite AG-III',

	'SHIP_WEP_MINES': 'Mines spatiales',
	'SHIP_WEP_MINES_IEM': 'Mines électromagnetiques',
	'SHIP_WEP_MINES_NUKE': 'Mines nucléaires',

	'SHIP_BATTLECRUISER': 'Croiseur',
	'SHIP_BATTLECRUISER_SMALL': 'Petit',

	'SHIP_CUIRASSE': 'Cuirassé',
	'SHIP_CUIRASSE_SMALL': 'Petit',

	'SHIP_FIGHTER': 'Chasseur',
	'SHIP_FIGHTER_SMALL': 'Intercepteur Leger',
	'SHIP_FIGHTER_MEDIUM': 'Intercepteur Lourd',
	'SHIP_FIGHTER_HUGE': 'Bombardier',

	'SHIP_CORVET': 'Corvette',
	'SHIP_CORVET_SMALL': 'Petite',

	'SHIP_CARRIER': 'Transporteur',
	'SHIP_CARRIER_MEDIUM': 'Moyen',

	// Armes
	'railgun': 'Canon Electrique',
	'laser': 'Canon Laser',
	'plasma': 'Canon Plasma',
	'missile_explosive': 'Missile Conventionnel',
	'missile_nuke': 'Missile Nucléaire',
	'missile_iem': 'Missile Electromagnetique',
	'missile_antimater': 'Missile à antimatière',

	// Defenses
	'magnetic': 'Bouclier magnetique',
	'turret': 'Tourelles anti-projectiles',
	'projector': 'Projecteur de bouclier magnetique',
	'singularity': 'Systeme à Singularité',

	// Other
	'hangar': 'Hangar',

	// Texts
	'fleet-build-openPanel': 'Construire l\'unité',
	'fleet-build-type-copy': 'Copier ce modele',
	'fleet-build-type-delete': 'Supprimer le modele',
	'fleet-build-type-delete-confirmMessage': 'Souhaitez vous vraiment supprimer ce modèle ?',

	'priorty-fuel': 'Prioritaire carburant',
	'no-priorty-fuel': 'Non Prioritaire carburant',
	'of-maxFuel': 'du reservoir',
	'orbiting': 'Autour de',

	'transferUnits': 'Transférer unités',
	'recycle': 'Recycler unités',
	'upgrade': 'Ameliorer unités',

	'mergeInto': 'Fusionner dans ...',
	'transferFuel': 'Transferer Carburant vers ...',
	'editTactic': 'Tactiques de flotte',

	'no-orbit-unit': 'Aucune unité en orbite',
	'no-move-unit': 'Aucune flotte ne se déplace',
	'no-out-unit': 'Aucune unité en orbite d\'une autre planète',

	'movingTo': 'Déplacement vers',
	'attacking': 'Attaque vers',
	'movingToDef': 'Déplacement pour défendre vers',
	'arriveAt': ', arrivée:',

	'unit': 'unité(s)',
};
</script>