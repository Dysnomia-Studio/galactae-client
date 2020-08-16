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