var chatChannel = "hud-chat-global";

class chat {
	static launch() {
		/**
		 * Envoi d'un message
		 */
		$('#chat_form').on('submit', function(e){
	        e.preventDefault(); // On évite le recharchement de la page lors de la validation du formulaire
	        // On crée notre objet JSON correspondant à notre message
	        var message = $('#chat_message').val();

	        $('#chat_message').val(''); // On vide le champ texte

	        if (message.length !== 0) { // Gestion message vide
	          socket.emit('chat-send', { message: message, username: userData.username, id: userData.id, channel: chatChannel });
	        }
	        $('#chat_message').focus(); // Focus sur le champ du message
	    });

		/**
		 * Réception d'un message
		 * @ADD: Notify messages ( ! )
		 */
		socket.on('chat-message', function (data) {
			$('#'+data.channel+' .chat_logs').append($('<li>').html(data.message));
			$('#'+data.channel).scrollTop($('#'+data.channel).height());
		});

	}
}

$(document).ready(function(){	//Lorsque la page est chargée ...
	$(".chatTab").click(function () {	//Lorsqu'un lien est cliqué ...
		$(".chatActive").removeClass("chatActive"); //Retirer les classes actives
		$(this).addClass("chatActive"); // Activer l'onglet cliqué
		$(".chatContent").hide(); // Cacher les boîtes de contenu
		chatChannel = $(this).attr("title");
		$("#" + chatChannel).show(); // Afficher la boite actuelle
	});
});