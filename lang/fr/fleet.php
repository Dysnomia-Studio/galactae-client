<?php
	//== Menus ==\\
	define('FLEET_BUILD','Construire');
	define('FLEET_ORBIT','Orbite');
	define('FLEET_MOVE','Deplacements');
	define('FLEET_OUT','En dehors');
	define('FLEET_TACTICS','Tactiques');
	define('FLEET_BUILD_ALL','Tout types');

	//== Types ==\\
	define('FLEET_TYPE_DEFENSE', 'Defenses Orbitales');
		define('FLEET_TYPE_DEFENSE_SAT_AG1', 'Satellite AG-I');
		define('FLEET_TYPE_DEFENSE_SAT_AG2', 'Satellite AG-II');
		define('FLEET_TYPE_DEFENSE_SAT_AG3', 'Satellite AG-III');

		define('FLEET_TYPE_DEFENSE_WEP_MINES', 'Mines spatiales');
		define('FLEET_TYPE_DEFENSE_WEP_MINES_IEM', 'Mines électromagnetiques');
		define('FLEET_TYPE_DEFENSE_WEP_MINES_NUKE', 'Mines nucléaires');

	define('FLEET_TYPE_BATTLECRUISER','Croiseurs');
		define('FLEET_TYPE_BATTLECRUISER_ATRIOS','Classe Atrios');

	define('FLEET_TYPE_CUIRASSE','Cuirassés');
		define('FLEET_TYPE_CUIRASSE_SMALL','Petit');

	define('FLEET_TYPE_FIGHTER','Chasseurs');
		define('FLEET_TYPE_FIGHTER_SMALL','Intercepteur Leger');
		define('FLEET_TYPE_FIGHTER_MEDIUM','Intercepteur Lourd');
		define('FLEET_TYPE_FIGHTER_HUGE','Bombardier');

	define('FLEET_TYPE_CORVET','Corvettes');
		define('FLEET_TYPE_CORVET_AEGIS','Classe Aegis');

	define('FLEET_TYPE_CARRIER','Transporteurs');
		define('FLEET_TYPE_CARRIER_MEDIUM','Moyen');

	define('FLEET_TYPE_COLONY','Vaisseaux Coloniaux');

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
	define('SHIP_FWEIGHT', 'Capacité chasseurs utilisée');

	//== Weapons ==\\
	define('SHIP_PART_WEAPON_RAILGUN', 'Canon Electrique');
	define('SHIP_PART_WEAPON_RAILGUN_DESC', 'Projectile accéléré par électromagnetisme');
	define('SHIP_PART_WEAPON_LASER', 'Canon Laser');
	define('SHIP_PART_WEAPON_LASER_DESC', 'Armes à laser');
	define('SHIP_PART_WEAPON_PLASMA', 'Canon Plasma');
	define('SHIP_PART_WEAPON_PLASMA_DESC', 'Armes à projectiles à très haute température');
	define('SHIP_PART_WEAPON_EXPLOSIVE', 'Missile Conventionnel');
	define('SHIP_PART_WEAPON_EXPLOSIVE_DESC', 'Missile explosif conventionnel à moyenne porté');
	define('SHIP_PART_WEAPON_NUKE', 'Missile Nucléaire');
	define('SHIP_PART_WEAPON_NUKE_DESC', 'Arme de destruction massive radioactive');
	define('SHIP_PART_WEAPON_IEM', 'Missile Electromagnetique');
	define('SHIP_PART_WEAPON_IEM_DESC', 'Missile générant une impulsion électromagnetique en explosant');
	define('SHIP_PART_WEAPON_ANTIMATER', 'Missile à antimatière');

	//== Ship Defenses ==\\
	define('SHIP_PART_DEF_MAGNETIC', 'Bouclier magnetique');
	define('SHIP_PART_DEF_MAGNETIC_DESC', 'Bouclier utilisant la force electromagnetique pour repousser les projectiles');
	define('SHIP_PART_DEF_TURRET', 'Tourelles anti-projectiles');
	define('SHIP_PART_DEF_TURRET_DESC', 'Tourelles utilisées afin d\'intercepter les projectiles explosifs');
	define('SHIP_PART_DEF_PROJECTOR', 'Projecteur de bouclier magnetique');
	define('SHIP_PART_DEF_PROJECTOR_DESC', 'Bouclier magnetique reporté sur un vaisseau allié');
	define('SHIP_PART_DEF_SINGULARITY', 'Systeme à Singularité');
	define('SHIP_PART_DEF_SINGULARITY_DESC', 'Système permettant d\'attirer les projectiles légers visant des vaisseaux alliés vers le courant');

	//== Propulsion ==\\
	define('SHIP_PART_PROP_ENGINE_SPEED', 'Vitesse max.');
	define('SHIP_PART_PROP_ION', 'Moteur à ion');
	define('SHIP_PART_PROP_ION_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% au/s');
	define('SHIP_PART_PROP_PPLASMA', 'Moteur à plasma');
	define('SHIP_PART_PROP_PPLASMA_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% au/s');
	define('SHIP_PART_PROP_VSOLAIRE', 'Voile solaire');
	define('SHIP_PART_PROP_VSOLAIRE_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% au/s');
	define('SHIP_PART_PROP_VSL', 'Moteur supraluminique');
	define('SHIP_PART_PROP_VSL_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% pc/s');
	define('SHIP_PART_PROP_WD', 'Generateur de saut');
	define('SHIP_PART_PROP_WD_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% pc/s');
	define('SHIP_PART_PROP_HYPERESPACE', 'Moteur Hyperespace');
	define('SHIP_PART_PROP_HYPERESPACE_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% pc/s');

	//== Other ==\\
	define('SHIP_PART_OTHER_HANGAR', 'Hangar');
	define('SHIP_PART_OTHER_HANGARCAPACITY', 'Capacité');
	define('SHIP_PART_OTHER_HANGARSIMPLE', 'Hangar Simple');
	define('SHIP_PART_OTHER_HANGARSIMPLE_DESC', SHIP_PART_OTHER_HANGARCAPACITY.': %hangarCapacity%');
	define('SHIP_PART_OTHER_HANGARDOUBLE', 'Hangar Double');
	define('SHIP_PART_OTHER_HANGARDOUBLE_DESC', SHIP_PART_OTHER_HANGARCAPACITY.': %hangarCapacity%');
	define('SHIP_PART_OTHER_NONE', 'Aucune pièce');
	define('SHIP_PART_OTHER_NONE_DESC', '&nbsp;');
	define('SHIP_PART_OTHER_NOPARTRESEARCHED', 'Aucune piece recherchée');
	define('SHIP_PART_OTHER_NOPARTRESEARCHED_DESC', 'Aucune piece recherchée');

	//== Types ==\\
	define('SHIP_PART_TYPE_CANNON', 'Canons');
	define('SHIP_PART_TYPE_ROCKETLAUNCHER', 'Lance missiles');
	define('SHIP_PART_TYPE_SHIELD', 'Defenses');
	define('SHIP_PART_TYPE_SUB_PROPULSION', 'Propulsion subluminique');
	define('SHIP_PART_TYPE_SUP_PROPULSION', 'Propulsion supraluminique');

	//== Texts ==\\
	define('FLEET_BUILD_OPENPANEL', 'Construire l\'unité');
	define('FLEET_BUILD_TYPE_COPY', 'Copier ce modele');
	define('FLEET_BUILD_TYPE_DELETE', 'Supprimer le modele');
	define('FLEET_BUILD_TYPE_DELETE_CONFIRMMESSAGE', 'Souhaitez vous vraiment supprimer ce modèle ?');

	define('UNITS_PRIORITY_FUEL', 'Prioritaire carburant');
	define('UNITS_NO_PRIORITY_FUEL', 'Non Prioritaire carburant');
	define('UNITS_OF_MAXFUEL', 'du reservoir');
	define('UNITS_ORBITING', 'Autour de');

	define('UNITS_TRANSFERUNITS', 'Transférer unités');
	define('UNITS_RECYCLE', 'Recycler unités');
	define('UNITS_UPGRADE', 'Ameliorer unités');
	define('UNITS_BACKTOMOTHERPLANET', 'Rappeler');

	define('UNITS_MERGEINTO', 'Fusionner dans ...');
	define('UNITS_TRANSFERFUEL', 'Transferer Carburant vers ...');
	define('UNITS_ASSIGNTACTIC', 'Assigner tactique');

	define('UNITS_NO_ORBIT_UNIT', 'Aucune unité en orbite');
	define('UNITS_NO_MOVE_UNIT', 'Aucune flotte ne se déplace');
	define('UNITS_NO_OUT_UNIT', 'Aucune unité en orbite d\'une autre planète');

	define('UNITS_MOVINGTO', 'Déplacement vers');
	define('UNITS_ATTACKING', 'Attaque vers');
	define('UNITS_MOVINGTODEF', 'Déplacement pour défendre vers');
	define('UNITS_ARRIVEAT', ', arrivée:');

	define('UNITS_UNIT', 'unité(s)');

	define('UNITS_TACTIC', 'Tactique');
	define('UNITS_DEFAULTTACTIC', 'Par Défaut');

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

	define('TACTIC', 'Tactique');
	define('DEFAULT_TACTIC', 'Tactique par defaut');
	define('FLEET_ASSIGN_TACTIC', 'Tactique à assigner à');

	//== Erreurs ==\\
	define('FLEET_NO_MODEL','Vous n\'avez encore aucun modèle');