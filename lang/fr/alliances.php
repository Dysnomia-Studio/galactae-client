<?php
// Menu
define('ALLY_MEMBERS', 'Membres');
define('ALLY_INFOS', 'Informations');
define('ALLY_DIPLOMACY', 'Diplomatie');

// Infos
define('ALLY_NAME', 'Nom de l\'alliance:');
define('ALLY_SEARCH', 'Rechercher une alliance ...');
define('ALLY_PLY_NAME', 'Nom du joueur:');
define('ALLY_DESC', 'Description:');
define('ALLY_EDIT', 'Modifier');
define('ALLY_EDIT_CANCEL', 'Cancel Edit');
define('ALLY_EDIT_SAVE', 'Save Edit');
define('ALLY_DISSOLVE', 'Dissoudre l\'alliance');
define('ALLY_QUIT', 'Quitter l\'alliance');
define('ALLY_CREATE', 'Créer une alliance');

// Members list
define('ALLY_MEMBERS_PLAYER_NAME', 'Nom du joueur');
define('ALLY_MEMBERS_PERMS_FOUNDER', 'Fondateur');
define('ALLY_MEMBERS_PERMS_LEADER', 'Leader');
define('ALLY_MEMBERS_PERMS_DIPLOMACY', 'Diplomatie');
define('ALLY_MEMBERS_PERMS_NONE', 'Aucune permission');
?>
<script type="text/javascript">
var translate = translate || {};

translate['alliance'] = {
	'pact-no': 'Aucun pacte en cours',
	'pact-current': 'Pactes en cours:',

	'pact-askToJoin-no': 'Aucune demande en cours',
	'pact-askToJoin-current': 'Demandes de pactes entrantes:',

	'pact-invitations-no': 'Aucune invitation en cours',
	'pact-invitations-current': 'Demandes de pactes sortantes:',

	'members-askToJoin-no': 'Aucune demande de joueur pour rejoindre l\'alliance',
	'members-askToJoin-current': 'Demandes de joueur à rejoindre l\'alliance:',

	'members-invitations-no': 'Aucune invitation à rejoindre l\'alliance',
	'members-invitations-current': 'Invitations à rejoindre l\'alliance:',

	'noAlly-askToJoin-no': 'Aucune demande pour rejoindre une alliance',
	'noAlly-askToJoin-current': 'Demandes de afin de rejoindre une alliance:',

	'noAlly-invitations-no': 'Aucune invitation à rejoindre une alliance',
	'noAlly-invitations-current': 'Invitations à rejoindre une alliance:',

	'askToJoin': 'Demander à rejoindre',
	'results-no': 'Aucun résultat',
	'results': 'Résultats:',

	'quit-confirm': 'Voulez-vous vraiment quitter l\'alliance ?',
	'dissolve-confirm': 'Voulez-vous vraiment dissoudre l\'alliance ?',
	'stopPact-confirm': 'Voulez-vous vraiment stopper ce pacte ?',
	'abandon-founder-confirm': (playerName) => 'Voulez-vous quitter votre rôle de fondateur de l\'alliance au profit de '+ playerName + ' ?',
	'kick-confirm': (playerName) => 'Voulez-vous vraiment exclure ' + playerName + ' de l\'alliance ?',
};
</script>