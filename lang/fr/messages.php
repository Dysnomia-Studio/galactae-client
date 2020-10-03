<?php
	define('DEFAULT_LOAD', 'Connexion au serveur ...');

	// Building
	define('BUILD_OK', 'Le bâtiment commence son amélioration !');
	define('BUILD_ERROR', 'Erreur lors de la tentative d\'amélioration');
	define('BUILDING_ERROR_ALREADY', 'Un bâtiment est déjà en construction');
	define('UNIT_ERROR_ALREADY', 'Une unité est déjà en construction');
	define('BUILDING_ERROR_MAXIMUM', 'Niveau maximum déjà atteint');
	define('BUILDING_ERROR_COST', 'Pas assez de ressources disponibles');
	define('BUILDING_ERROR_STORAGE', 'Stockage de ressources insuffisant');
	define('BUILDING_ERROR_ENERGY', 'Production energetique insuffisante');
	define('BUILDING_ERROR_PEOPLE', 'Population insuffisante');
	define('BUILDING_ERROR_DEPENDENCIES', 'Dépendances manquantes afin de le construire');
	define('UPGRADE', 'Ameliorer');
	define('LEVEL', 'Niveau');
	define('UPGRADE_MAX', 'Niveau Maximum atteint');
	define('ENOUGH_RESOURCES_TODAY_AT', 'Assez de ressources aujourd\'hui à');
	define('ENOUGH_RESOURCES_TOMORROW_AT', 'Assez de ressources demain à');
	define('ENOUGH_RESOURCES_THE', 'Assez de ressources le');
	define('ENOUGH_RESOURCES_AT', 'à');
	define('ANOTHER_IN_BUILD', 'Un autre bâtiment est déjà en construction');
	// Build finish at ...
	define('BUILD_FINISH_TODAY_AT', 'Fin de la construction aujourd\'hui à');
	define('BUILD_FINISH_TOMORROW_AT', 'Fin de la construction demain à');
	define('BUILD_FINISH_THE', 'Fin de la construction le');
	define('BUILD_FINISH_AT', 'à');
	// [Number] units '[Name]' are being build in fleet '[FleetName]'
	define('UNIT_CURR_BUILD_01', 'unités');
	define('UNIT_CURR_BUILD_02', 'sont en construction dans la flotte');
	// Unit Notifs
	define('ENDED_UNIT_TITLE', 'Unités Terminées !');
	define('ENDED_UNIT_01', 'Vos ');
	define('ENDED_UNIT_02', ' unités de modele ');
	define('ENDED_UNIT_03', ' sont maintenant terminés.');
	// Building Notifs
	define('ENDED_BUILDING_TITLE', 'Bâtiment Terminé !');
	define('ENDED_BUILDING_01', 'Votre ');
	define('ENDED_BUILDING_02', ' viens de passer au niveau ');
	// Not Belonging
	define('ERROR_NOT_BELONGING', 'Cette planète ne vous appartient pas !');
	// Server messages
	define('CONNECT_LOSS', 'La connexion au serveur a été perdue. Tentative de reconnexion ...');
	define('KICK', 'Vous avez été exclus du jeu. Raison:');
	define('BAN', 'Le marteau du bannissement a frappé ! Raison:');
	define('MAINTENANCE', 'Une maintenance est en cours.');
	define('RESTARTING_SERVER', 'Redemarrage des serveurs de jeu ...');
	define('DOUBLE_ACCOUNTS_CONNECTED', 'Vous êtes connecté plusieurs fois sur le jeu en même temps.');
	define('ERR_BANNED', 'Erreur: vous êtes banni de ce serveur');
	define('ERR_WHITELIST', 'Erreur: vous n\'êtes pas dans la liste blanche de ce serveur');
	define('SYSTEM_MESSAGE', 'Message Systeme:');
	// Chat Mute
	define('CHAT_MUTED', 'Vous ne pouvez plus parler pendant');
	define('CHAT_UNMUTED', 'Vous pouvez de nouveau parler.');
	define('CHAT_MUTED_REASON', 'pour la raison');
	// Research
	define('MISSING_PARENTS', 'Dépendances manquantes');
	define('ENDED_RESEARCH', 'Recherche Terminée');
	define('NEEDED_RESEARCH_MISSING', 'Il vous reste des technologies a decouvrir afin de creer ce vaisseau.');
	define('PLANETS', 'planètes possédées');
	// Fleets & Units
	define('BUILDING_UNIT_OK', 'La flotte commence son expansion');
	define('SHIP_HAS_INVALID_PARTS', 'Votre vaisseau a des composants invalides');
	define('SHIP_HAS_WRONG_TYPE_OR_SHAPE', 'Votre vaisseau est du mauvais type ou de la mauvaise forme');
	define('SHIP_HAS_EMPTY_FIELD', 'Il manque certains composants dans votre vaisseau');
	define('SHIP_HAS_NO_NAME', 'Votre vaisseau n\'a pas de nom');
	define('SHIP_NAME_ALREADY_EXISTS', 'Un plan de vaisseau avec ce nom est déjà enregistré dans votre liste');
	define('SHIP_TYPE_ALREADY_EXISTS', 'Vous avez déjà un plan comportant ce modèle avec ces modules enregistré dans votre liste');
	define('MODEL_DELETE_USED_BY_UNITS', 'Ce plan est déjà utilisé par une ou plusieurs unités, vous devez les améliorer ou les détruire afin de pouvoir le supprimer');
	define('MODEL_DELETED', 'Plan de vaisseau supprimé !');
	define('FLEET_MAX_REACHED', 'Nombre de flottes maximales atteintes');
	define('FLEET_NAME_ALREADY_EXISTS', 'Une autre flotte avec ce nom appartient déjà à cette planète');
	define('FUEL_TRANSFER_SUCCESSFUL', 'Le transfert de fuel a été effectué avec succès.');
	define('BUILDING_ERROR_INVALID_FLEET', 'Erreur: la flotte où construire ces unités n\'existe pas');
	define('BUILDING_ERROR_FLEET_SIZE', 'Erreur: capacité maximale d\'unités de la flotte depassée');
	// Errors message
	define('PLY_NOT_FOUND', 'Erreur: joueur introuvable');
	define('NO_PM_YOU', 'Erreur: vous ne pouvez pas vous envoyer un message privé à vous même.');
	define('NO_LINKS', 'Erreur: vous ne pouvez pas envoyer de lien sur le chat');
	define('DISABLED_FUNCTIONALIY', 'Erreur: cette fonctionnalité n\'est pas encore disponible pour le moment.');
	// Anti Self XSS Warning
	define('SELF_XSS_WARN', 'Attention: si quelqu\'un vous dit de coller quelque chose ici, il y\'a de grandes chances que ce soit une arnaque, ce genre d\'attaques appelés «Self XSS» sont fait pour prendre le contrôle de votre compte. Soyez prudents !');

	// Move Panel
	define('MOVE_PANEL_PT1_DEF', 'Défense de la planete');
	define('MOVE_PANEL_PT1_ATK', 'Attaque de la planete');
	define('MOVE_PANEL_PT1_MOVE', 'Deplacement vers');
	define('MOVE_PANEL_PT1_SPY', 'Espionnage de la planete');

	define('MOVE_PANEL_BTN_DEF', 'Défendre');
	define('MOVE_PANEL_BTN_ATK', 'Attaquer');
	define('MOVE_PANEL_BTN_MOVE', 'S\'y déplacer');
	define('MOVE_PANEL_BTN_SPY', 'Espionner');

	define('IN_BUILDING_FLEET', 'Erreur: La file de construction de votre flotte n\'est pas terminée.');
	define('ALREADY_MOVING_FLEET', 'Erreur: Votre flotte se déplace déjà.');
	define('NO_ENOUGHT_CARRIER', 'Erreur: Pas assez de place pour transporter vos chasseurs.');
	define('CANT_MAKE_SUPRAMOVE', 'Erreur: Certains de vos vaisseaux ne sont pas capable de voyages interstellaires.');
	define('DESTINATION_NOT_EXISTS', 'Erreur: La destination n\'existe pas');
	define('NO_ENOUGH_FUEL', 'Erreur: La flotte ne possède pas assez de carburant');
	define('FLEET_MOVING', 'La flotte commence son déplacement');
	define('ENDED_MOVE', 'Flotte arrivée à destination');
	define('ENDED_MOVE_01', ' est arrivée à ');

	// Merge fleets/move units
	define('FLEET_AT_DIFFERENT_POSITIONS', 'Erreur: les flottes sont à des lieux differents');
	define('FLEET_UNIT_TRANSFER_SUCCESSFUL', 'Transfert d\'unité reussi !');
	define('FLEET_MERGE_SUCCESSFUL', 'Les deux flottes ont bien été fusionnées');

	// Reports
	define('NEW_REPORT_AVAILABLE', 'Nouveau rapport de combat disponible');
	define('REPORT_ATTACK', ' attaque ');
	define('NO_REPORTS_AVAILABLE', 'Aucun rapport de combat disponible');
	define('REPORT_DEF_WINS', 'Les défenseurs ont repoussé l\'attaque');
	define('REPORT_ATK_WINS', 'Les attaquants sont victorieux');
	define('REPORT_NO_FLEET', 'Aucune flotte');
	define('REPORT_DELETE_ONE', 'Voulez-vous vraiment supprimer ce rapport ?');
	define('REPORT_DELETE_MULTIPLE', 'Voulez-vous vraiment supprimer ces rapports ?');

	// Attack notif
	define('ATTACK_INCOMING_TITLE', 'Attaque entrante');
	define('ATTACK_INCOMING_FROM', 'Attaque entrante provenant de ');
	define('ATTACK_INCOMING_TO', ' à destination de ');
	define('ATTACK_INCOMING_TIME', '); arrivée: ');

	// Alliances notif
	define('ALLIANCE_CREATE_ERROR', 'Erreur: Une alliance avec le même nom existe déjà');
	define('ALLIANCE_DOES_NOT_EXISTS', 'Erreur: Cette Alliance n\'existe pas');
	define('ALLIANCE_YOU_ALREADY_HAVE', 'Erreur: Vous êtes déjà membre d\'une alliance');
	define('ALLIANCE_NOT_ENOUGH_RIGHTS', 'Erreur: Vous n\'avez pas les permissions necessaires.');
	define('ALLIANCE_INVALID_PLAYER_PERMISSIONS', 'Erreur: Permissions invalides.');
	define('ALLIANCE_ERR_SAME_ALLY', 'Erreur: Vous ne pouvez pas effectuer de diplomatie avec votre propre alliance.');
	define('ALLIANCE_PLY_ASKED_TO_JOIN', 'Une nation souhaiterait rejoindre votre alliance');
	define('ALLIANCE_ASKED_TO_PACT', 'Une alliance souhaiterai établir un pact avec la votre');
	define('ALLIANCE_NEW_PACT', 'Un nouveau pacte est maintenant en place');
	define('ALLIANCE_REFUSED_PACT', 'Pacte refusé');
	define('ALLIANCE_STOPPED_PACT', 'Pacte rompu');
	define('ALLIANCE_GRANTED', 'Votre candidature à %ally% a été acceptée.');
	define('ALLIANCE_REFUSED', 'Votre candidature à %ally% a été refusée.');
	define('ALLIANCE_INVITED', 'Vous êtes invité à rejoindre %ally%.');
	define('ALLIANCE_KICKED', 'Vous avez été éjecté de votre alliance par ');
	define('ALLIANCE_NEWPERMS', 'Votre rôle dans l\'alliance viens d\'être modifié par ');
	define('ALLIANCE_NEW_PLAYER', '%playerName% viens de rejoindre l\'alliance.');
	define('ALLIANCE_INVITE_REFUSED', '%playerName% a refusé de se joindre à l\'alliance.');
	define('ALLIANCE_MEMBER_KICKED', '%playerName% a été exclus de l\'alliance par %staffName%.');
	define('ALLIANCE_MEMBER_LEFT', '%playerName% a quitté l\'alliance.');
	define('ALLIANCE_EDITED', '%playerName% a modifié le nom et/ou la description de l\'alliance.');
	define('ALLIANCE_DISSOLVED', 'L\'alliance a été dissoute.');

	// Conquest
	define('BEING_CONQUESTED_BUILD', 'La planète est en train de se faire conquerir, il est impossible de construire.'); // @TODO: Conquest type
	define('BEING_CONQUESTED_BY', 'Aux armes ! Votre planète est en train de se faire conquerir par '); // @TODO: Conquest type
	define('YOU_ARE_CONQUERING', 'Vous êtes en train de conquerir ');
	define('BEING_CONQUESTED_END', 'Fin: ');

	// Load
	define('LOAD_FLEET', 'Chargement des flottes');
	define('LOAD_PICTURES', 'Chargement des images');
	define('LOAD_LOAD', 'Chargement de la page');
	define('LOAD_MAPS', 'Chargement des cartes');
	define('LOAD_PLANET', 'Chargement des données de la planete');
	define('LOAD_PLAYER', 'Chargement des données du joueurs');
	define('LOAD_SERVER', 'Connexion au serveur ...');
	define('LOAD_SERVICE_WORKER', 'Préchargement des images');
	define('LOAD_SETTINGS', 'Chargement des paramètres');
	define('LOAD_TACTICS', 'Chargement des tactiques');
	define('LOAD_UNITS', 'Chargement des données unités');