<?php
	define('DEFAULT_LOAD','Connexion au serveur ...');
?>
<script type="text/javascript">
var translate = translate || {};

translate['messages'] = {
	// Building
	'BUILD_OK': 'Le bâtiment commence son amélioration !',
	'BUILD_ERROR': 'Erreur lors de la tentative d\'amélioration',
	'BUILDING_ERROR_ALREADY': 'Un bâtiment est déjà en construction',
	'UNIT_ERROR_ALREADY': 'Une unité est déjà en construction',
	'BUILDING_ERROR_MAXIMUM': 'Niveau maximum déjà atteint',
	'BUILDING_ERROR_COST': 'Pas assez de ressources disponibles',
	'BUILDING_ERROR_STORAGE': 'Stockage de ressources insuffisant',
	'BUILDING_ERROR_ENERGY': 'Production energetique insuffisante',
	'BUILDING_ERROR_PEOPLE': 'Population insuffisante',
	'BUILDING_ERROR_DEPENDENCIES': 'Dépendances manquantes afin de le construire',
	'UPGRADE': 'Ameliorer',
	'BUILD': 'Construire',
	'LEVEL': 'Niveau',
	'UPGRADE_MAX': 'Niveau Maximum atteint',
	'ENOUGH_RESOURCES_TODAY_AT': 'Assez de ressources aujourd\'hui à',
	'ENOUGH_RESOURCES_TOMORROW_AT': 'Assez de ressources demain à',
	'ENOUGH_RESOURCES_THE': 'Assez de ressources le',
	'ENOUGH_RESOURCES_AT': 'à',
	'ANOTHER_IN_BUILD': 'Un autre bâtiment est déjà en construction',
	// Build finish at ...
	'BUILD_FINISH_TODAY_AT': 'Fin de la construction aujourd\'hui à',
	'BUILD_FINISH_TOMORROW_AT': 'Fin de la construction demain à',
	'BUILD_FINISH_THE': 'Fin de la construction le',
	'BUILD_FINISH_AT': 'à',
	// [Number] units '[Name]' are being build in fleet '[FleetName]'
	'UNIT_CURR_BUILD_01': 'unités',
	'UNIT_CURR_BUILD_02': 'sont en construction dans la flotte',
	// Unit Notifs
	'ENDED_UNIT_TITLE': 'Unités Terminées !',
	'ENDED_UNIT_01': 'Vos ',
	'ENDED_UNIT_02': ' unités de modele ',
	'ENDED_UNIT_03': ' sont maintenant terminés.',
	// Building Notifs
	'ENDED_BUILDING_TITLE': 'Bâtiment Terminé !',
	'ENDED_BUILDING_01': 'Votre ',
	'ENDED_BUILDING_02': ' viens de passer au niveau ',
	// Not Belonging
	'ERROR_NOT_BELONGING': 'Cette planète ne vous appartient pas !',
	// Server messages
	'CONNECT_LOSS': 'La connexion au serveur a été perdue. Tentative de reconnexion ...',
	'KICK': 'Vous avez été exclus du jeu. Raison:',
	'BAN': 'Le marteau du bannissement a frappé ! Raison:',
	'MAINTENANCE': 'Une maintenance est en cours.',
	'RESTARTING_SERVER': 'Redemarrage des serveurs de jeu ...',
	'DOUBLE_ACCOUNTS_CONNECTED': 'Vous êtes connecté plusieurs fois sur le jeu en même temps.',
	'ERR_BANNED': 'Erreur: vous êtes banni de ce serveur',
	'ERR_WHITELIST': 'Erreur: vous n\'êtes pas dans la liste blanche de ce serveur',
	'SYSTEM_MESSAGE': 'Message Systeme:',
	// Chat Mute
	'CHAT_MUTED': 'Vous ne pouvez plus parler pendant',
	'CHAT_UNMUTED': 'Vous pouvez de nouveau parler.',
	'CHAT_MUTED_REASON': 'pour la raison',
	// Research
	'MISSING_PARENTS': 'Dépendances manquantes',
	'ENDED_RESEARCH': 'Recherche Terminée',
	'NEEDED_RESEARCH_MISSING': 'Il vous reste des technologies a decouvrir afin de creer ce vaisseau.',
	'PLANETS': 'planètes possédées',
	// Fleets & Units
	'BUILDING_UNIT_OK': 'La flotte commence son expansion',
	'SHIP_HAS_INVALID_PARTS': 'Votre vaisseau a des composants invalides',
	'SHIP_HAS_WRONG_TYPE_OR_SHAPE': 'Votre vaisseau est du mauvais type ou de la mauvaise forme',
	'SHIP_HAS_EMPTY_FIELD': 'Il manque certains composants dans votre vaisseau',
	'SHIP_HAS_NO_NAME': 'Votre vaisseau n\'a pas de nom',
	'SHIP_NAME_ALREADY_EXISTS': 'Un plan de vaisseau avec ce nom est déjà enregistré dans votre liste',
	'SHIP_TYPE_ALREADY_EXISTS': 'Vous avez déjà un plan comportant ce modèle avec ces modules enregistré dans votre liste',
	'MODEL_DELETE_USED_BY_UNITS': 'Ce plan est déjà utilisé par une ou plusieurs unités, vous devez les améliorer ou les détruire afin de pouvoir le supprimer',
	'MODEL_DELETED': 'Plan de vaisseau supprimé !',
	'FLEET_MAX_REACHED': 'Nombre de flottes maximales atteintes',
	'FLEET_NAME_ALREADY_EXISTS': 'Une autre flotte avec ce nom appartient déjà à cette planète',
	'BUILDING_ERROR_INVALID_FLEET': 'Erreur: la flotte où construire ces unités n\'existe pas',
	'BUILDING_ERROR_FLEET_SIZE': 'Erreur: capacité maximale d\'unités de la flotte depassée',
	// Errors message
	'PLY_NOT_FOUND': 'Erreur: joueur introuvable',
	'NO_PM_YOU': 'Erreur: vous ne pouvez pas vous envoyer un message privé à vous même.',
	'NO_LINKS': 'Erreur: vous ne pouvez pas envoyer de lien sur le chat',
	'DISABLED_FUNCTIONALIY': 'Erreur: cette fonctionnalité n\'est pas encore disponible pour le moment.',
	// Anti Self XSS Warning
	'selfXSSWarn': 'Attention: si quelqu\'un vous dit de coller quelque chose ici, il y\'a de grandes chances que ce soit une arnaque, ce genre d\'attaques appelés "Self XSS" sont fait pour prendre le contrôle de votre compte. Soyez prudents !',
	// Move Panel
	'movePanelPt1': [
		'Défense de la planete',
		'Attaque de la planete',
		'Deplacement vers',
		'Espionnage de la planete',
	],
	'IN_BUILDING_FLEET': 'Erreur: La file de construction de votre flotte n\'est pas terminée.',
	'ALREADY_MOVING_FLEET': 'Erreur: Votre flotte se déplace déjà.',
	'NO_ENOUGHT_CARRIER': 'Erreur: Pas assez de place pour transporter vos chasseurs.',
	'CANT_MAKE_SUPRAMOVE': 'Erreur: Certains de vos vaisseaux ne sont pas capable de voyages interstellaires.',
	'DESTINATION_NOT_EXISTS': 'Erreur: La destination n\'existe pas',
	'NO_ENOUGH_FUEL': 'Erreur: La flotte ne possède pas assez de carburant',
	'FLEET_MOVING': 'La flotte commence son déplacement',
	'ENDED_MOVE': 'Flotte arrivée à destination',
	'ENDED_MOVE_01': ' est arrivée à ',

	// Merge fleets/move units
	'FLEET_AT_DIFFERENT_POSITIONS': 'Erreur: les flottes sont à des lieux differents',
	'FLEET_UNIT_TRANSFER_SUCCESSFUL': 'Transfert d\'unité reussi !',
	'FLEET_MERGE_SUCCESSFUL': 'Les deux flottes ont bien été fusionnées',

	// Reports
	'NEW_REPORT_AVAILABLE': 'Nouveau rapport de combat disponible',
	'REPORT_ATTACK': ' attaque ',
	'NO_REPORTS_AVAILABLE': 'Aucun rapport de combat disponible',
	'REPORT_DEF_WINS': 'Les défenseurs ont repoussé l\'attaque',
	'REPORT_ATK_WINS': 'Les attaquants sont victorieux',
	'REPORT_NO_FLEET': 'Aucune flotte',
	'REPORT_DELETE_ONE': 'Voulez-vous vraiment supprimer ce rapport ?',
	'REPORT_DELETE_MULTIPLE': 'Voulez-vous vraiment supprimer ces rapports ?',

	// Attack notif
	'ATTACK_INCOMING_TITLE': 'Attaque entrante',
	'ATTACK_INCOMING_FROM': 'Attaque entrante provenant de ',
	'ATTACK_INCOMING_TO': ' à destination de ',
	'ATTACK_INCOMING_TIME': ', arrivée: ',

	// Alliances notif
	'ALLIANCE_CREATE_ERROR': 'Erreur: Une alliance avec le même nom existe déjà',
	'ALLIANCE_DOES_NOT_EXISTS': 'Erreur: Cette Alliance n\'existe pas',
};

translate['load'] = {
	'fleet': 'Chargement des flottes',
	'pictures': 'Chargement des images',
	'load': 'Chargement de la page',
	'maps': 'Chargement des cartes',
	'planet': 'Chargement des données de la planete',
	'player': 'Chargement des données du joueurs',
	'server': 'Connexion au serveur ...',
	'service-worker': 'Préchargement des images',
	'settings': 'Chargement des paramètres',
	'tactics': 'Chargement des tactiques',
	'units': 'Chargement des données unités',
};
</script>