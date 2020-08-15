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
define('ALLY_EDIT_CANCEL', 'Annuler');
define('ALLY_EDIT_SAVE', 'Sauvegarder');
define('ALLY_DISSOLVE', 'Dissoudre l\'alliance');
define('ALLY_QUIT', 'Quitter l\'alliance');
define('ALLY_CREATE', 'Créer une alliance');

// Members list
define('ALLY_MEMBERS_PLAYER_NAME', 'Nom du joueur');
define('ALLY_MEMBERS_PERMS_FOUNDER', 'Fondateur');
define('ALLY_MEMBERS_PERMS_LEADER', 'Leader');
define('ALLY_MEMBERS_PERMS_DIPLOMACY', 'Diplomatie');
define('ALLY_MEMBERS_PERMS_NONE', 'Aucune permission');

// Pacts
define('ALLY_PACT_NO', 'Aucun pacte en cours');
define('ALLY_PACT_CURRENT', 'Pactes en cours:');

define('ALLY_PACT_ASKTOJOIN_NO', 'Aucune demande en cours');
define('ALLY_PACT_ASKTOJOIN_CURRENT', 'Demandes de pactes entrantes:');

define('ALLY_PACT_INVITATIONS_NO', 'Aucune invitation en cours');
define('ALLY_PACT_INVITATIONS_CURRENT', 'Demandes de pactes sortantes');

define('ALLY_MEMBERS_ASKTOJOIN_NO', 'Aucune demande de joueur pour rejoindre l\'alliance');
define('ALLY_MEMBERS_ASKTOJOIN_CURRENT', 'Demandes de joueur à rejoindre l\'alliance:');

define('ALLY_MEMBERS_INVITATIONS_NO', 'Aucune invitation à rejoindre l\'alliance');
define('ALLY_MEMBERS_INVITATIONS_CURRENT', 'Invitations à rejoindre l\'alliance:');

define('ALLY_NOALLY_ASKTOJOIN_NO', 'Aucune invitation à rejoindre une alliance');
define('ALLY_NOALLY_ASKTOJOIN_CURRENT', 'Demandes de afin de rejoindre une alliance:');

define('ALLY_NOALLY_INVITATIONS_NO', 'Aucune invitation à rejoindre une alliance');
define('ALLY_NOALLY_INVITATIONS_CURRENT', 'Invitations à rejoindre une alliance:');

define('ALLY_ASKTOJOIN', 'Demander à rejoindre');
define('ALLY_RESULTS', 'Aucun résultat');
define('ALLY_RESULTS_NO', 'Résultats:');

define('ALLY_QUIT_CONFIRM', 'Voulez-vous vraiment quitter l\'alliance ?');
define('ALLY_DISSOLVE_CONFIRM', 'Voulez-vous vraiment dissoudre l\'alliance ?');
define('ALLY_STOPPACT_CONFIRM', 'Voulez-vous vraiment stopper ce pacte ?');

define('ALLY_ABANDON_FOUNDER_CONFIRM', 'Voulez-vous quitter votre rôle de fondateur de l\'alliance au profit de %playerName% ?');
define('ALLY_KICK_CONFIRM', 'Voulez-vous vraiment exclure %playerName% de l\'alliance ?');
?>
<script type="text/javascript">
var translate = translate || {};

translate['alliance'] = {
	'pact-no': "<?= ALLY_PACT_NO ?>",
	'pact-current': "<?= ALLY_PACT_CURRENT ?>",

	'pact-askToJoin-no': "<?= ALLY_PACT_ASKTOJOIN_NO ?>",
	'pact-askToJoin-current': "<?= ALLY_PACT_ASKTOJOIN_CURRENT ?>",

	'pact-invitations-no': "<?= ALLY_PACT_INVITATIONS_NO ?>",
	'pact-invitations-current': "<?= ALLY_PACT_INVITATIONS_CURRENT ?>",

	'members-askToJoin-no': "<?= ALLY_MEMBERS_ASKTOJOIN_NO ?>",
	'members-askToJoin-current': "<?= ALLY_MEMBERS_ASKTOJOIN_CURRENT ?>",

	'members-invitations-no': "<?= ALLY_MEMBERS_INVITATIONS_NO ?>",
	'members-invitations-current': "<?= ALLY_MEMBERS_INVITATIONS_CURRENT ?>",

	'noAlly-askToJoin-no': "<?= ALLY_NOALLY_ASKTOJOIN_NO ?>",
	'noAlly-askToJoin-current': "<?= ALLY_NOALLY_ASKTOJOIN_CURRENT ?>",

	'noAlly-invitations-no': "<?= ALLY_NOALLY_INVITATIONS_NO ?>",
	'noAlly-invitations-current': "<?= ALLY_NOALLY_INVITATIONS_CURRENT ?>",

	'askToJoin': "<?= ALLY_ASKTOJOIN ?>",
	'results-no': "<?= ALLY_RESULTS ?>",
	'results': "<?= ALLY_RESULTS_NO ?>",

	'quit-confirm': "<?= ALLY_QUIT_CONFIRM ?>",
	'dissolve-confirm': "<?= ALLY_DISSOLVE_CONFIRM ?>",
	'stopPact-confirm': "<?= ALLY_STOPPACT_CONFIRM ?>",
	'abandon-founder-confirm': (playerName) => "<?= ALLY_ABANDON_FOUNDER_CONFIRM ?>".replace('%playerName%', playerName),
	'kick-confirm': (playerName) => "<?= ALLY_KICK_CONFIRM ?>".replace('%playerName%', playerName),
};
</script>