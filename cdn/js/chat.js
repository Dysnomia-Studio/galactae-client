var chatChannel = "hud-chat-global";

class chat {
	static init() {
		/**
		 * Envoi d'un message
		 */
		$('#chat_form').on('submit', function(e){
	        e.preventDefault(); // On évite le rechargement de la page lors de la validation du formulaire
	        
	        // On recupere le message et on vide le input
	        var message = $('#chat_message').val();
	        $('#chat_message').val('');

	        // Quelques verifs pour empecher les messages inutiles
	        var blockSend = false;

	        if(message.charAt(0)=="@" && message.substr(1,userData.username.length).toLowerCase()==userData.username.toLowerCase()) {
	        	chat.sm('NO_PM_YOU');
	        	blockSend = true;
	        }
	        if(message.length === 0) { blockSend = true; }

	        // On envoie le message au serveur
	        if (!blockSend) {
	          socket.emit('chat-send', { message: normalizeText(message), username: userData.username, id: userData.id, channel: chatChannel });
	          ui.lastMessage = message;
	        }
	        $('#chat_message').focus(); // Focus sur le champ du message
	    });

		/**
		 * Réception d'un message
		 * @ADD: Notify messages on tabs
		 */
		socket.on('chat-message', function(data) {
			$('#'+data.channel+' .chat_logs').append($('<li>').html(data.message));
			$('#'+data.channel).scrollTop($('#'+data.channel+' .chat_logs').height());
		});
		/*
		 * Private Message
		 */
		socket.on('chat-message-private', function(data) {
			chat.pm(data);
		});
		/*
		 * Private Message
		 */
		socket.on('chat-message-system', function(data) {
			chat.sm(data);
		});
	}
	static pm(data) {
		// Translation
		if((translate["messages"][data.msg] !=undefined) && (translate["messages"][data.msg] !="")) { data.msg = translate["messages"][data.msg]; }

		$('#hud-chat-global .chat_logs').append($('<li>').html("<span class=\"private-message\">"+data.msg+"</span>"));
		$('#hud-chat-trade .chat_logs').append($('<li>').html("<span class=\"private-message\">"+data.msg+"</span>"));
		$('#hud-chat-ally .chat_logs').append($('<li>').html("<span class=\"private-message\">"+data.msg+"</span>"));

		$('#'+chatChannel).scrollTop($('#'+chatChannel).height());

		if(data.sound) {
			var pmSound = new Audio('snd/ui/private_message.mp3');
			pmSound.volume = 0.2;
			pmSound.play();
		}
	}
	static sm(msg) {
		// Translation
		if((translate["messages"][msg] !=undefined) && (translate["messages"][msg] !="")) { msg = translate["messages"][msg]; }

		$('#hud-chat-global .chat_logs').append($('<li>').html("<span class=\"system-message\">"+msg+"</span>"));
		$('#hud-chat-trade .chat_logs').append($('<li>').html("<span class=\"system-message\">"+msg+"</span>"));
		$('#hud-chat-ally .chat_logs').append($('<li>').html("<span class=\"system-message\">"+msg+"</span>"));

		$('#'+chatChannel).scrollTop($('#'+chatChannel).height());
	}
	static loadUI() {
		// Menu
		$(".chatTab").click(function () {
			$("#hud-chat-channels .ul-choice-line-li-active").removeClass("ul-choice-line-li-active");
			$(this).addClass("ul-choice-line-li-active");
			$(".chatContent").hide();
			chatChannel = $(this).attr("chatChannel");
			$("#" + chatChannel).show();
			$('#'+chatChannel).scrollTop($('#'+chatChannel).height());
		});
		// Chat events on username
		$('body').on('mousedown', '.username', function(event) {
			if($(this).text()!=userData.username && !$(this).hasClass('no-pm')) {
				switch(event.which) { // 1 => LEFT, 2 => MIDDLE, 3 => RIGHT
					case KEYBOARD.LMOUSE:
						$("#chat_message").val("@"+ $(this).text() + " ");
						break;
					case KEYBOARD.RMOUSE:
						var win = window.open("https://galactae.eu/profil?u="+$(this).text(), '_blank');
						win.focus();
						break;
					default:

				}
			}
		});
	}
}