let chatChannel = 'hud-chat-global';

/**
 * Class for chat.
 */
class chat {
	static init() {
		/**
		 * Envoi d'un message
		 */
		document.getElementById('chat_form').addEventListener('submit', function(e){
	        e.preventDefault(); // On évite le rechargement de la page lors de la validation du formulaire
	        
	        // On recupere le message et on vide le input
	        let message = document.getElementById('chat_message').value;
	        document.getElementById('chat_message').value = '';

	        // Quelques verifs pour empecher les messages inutiles
	        let blockSend = false;

	        if(message.charAt(0) === '@' && message.substr(1,userData.username.length).toLowerCase() === userData.username.toLowerCase()) {
	        	chat.sm('NO_PM_YOU');
	        	blockSend = true;
	        }
	        if(message.length === 0) { blockSend = true; }

	        // On envoie le message au serveur
	        if (!blockSend) {
	          socket.emit('chat-send', { message: normalizeText(message), username: userData.username, id: userData.id, channel: chatChannel });
	          ui.lastMessage = message;
	        }
	        document.getElementById('chat_message').focus(); // Focus sur le champ du message
	    });

		/**
		 * Réception d'un message
		 * @ADD: Notify messages on tabs
		 */
		socket.on('chat-message', function(data) {
			let listElt = document.createElement('li'); 
			listElt.innerHTML = data.message;

			listElt.addEventListener('DOMNodeInserted', function() {
				let DOMElts = this.querySelectorAll('.username');
				for(let elt=0; elt<DOMElts.length; elt++) {	
					DOMElts[elt].addEventListener('mousedown', chat.clickEvent(event));	
				}
			});

			document.querySelector('#'+data.channel+' .chat_logs').append(listElt);

			document.querySelector('#'+data.channel).scrollTop = document.querySelector('#'+data.channel+' .chat_logs').clientHeight;
		});
		/*
		 * Private Message
		 */
		socket.on('chat-message-private', function(data) {
			chat.pm(data);
		});
		/*
		 * System Message
		 */
		socket.on('chat-message-system', function(data) {
			chat.sm(data);
		});
	}

	/**
	 * Recieved private message
	 *
	 * @param      {object}  data    The data
	 */
	static pm(data) {
		// Translation
		if((translate.messages[data.msg] !== undefined) && (translate.messages[data.msg] !== '')) { data.msg = translate.messages[data.msg]; }

		let listElt = '<li><span class="private-message">'+data.msg+'</span></li>';

		document.querySelector('#hud-chat-global .chat_logs').innerHTML += listElt;
		document.querySelector('#hud-chat-trade .chat_logs').innerHTML += listElt;
		document.querySelector('#hud-chat-ally .chat_logs').innerHTML += listElt;

		document.querySelector('#'+data.channel).scrollTop = document.querySelector('#'+data.channel+' .chat_logs').clientHeight;

		if(data.sound) {
			let pmSound = new Audio('snd/ui/private_message.mp3');
			pmSound.volume = 0.2;
			pmSound.play();
		}
	}

	/**
	 * Recieved system message
	 *
	 * @param      {object}  data    The data
	 */
	static sm(msg) {
		// Translation
		if((translate.messages[msg] !== undefined) && (translate.messages[msg] !== '')) { msg = translate.messages[msg]; }

		let listElt = '<li><span class="system-message">'+msg+'</span></li>';

		document.querySelector('#hud-chat-global .chat_logs').innerHTML += listElt;
		document.querySelector('#hud-chat-trade .chat_logs').innerHTML += listElt;
		document.querySelector('#hud-chat-ally .chat_logs').innerHTML += listElt;

		document.querySelector('#'+chatChannel).scrollTop = document.querySelector('#'+chatChannel+' .chat_logs').clientHeight;
	}

	static clickEvent(event) {
		if(this.innerText !== userData.username && !ui.hasClass(this, 'no-pm')) {
			switch(event.which) { // 1 => LEFT, 2 => MIDDLE, 3 => RIGHT
				case KEYBOARD.LMOUSE:
					document.getElementById('chat_message').value = '@' + this.innerText + ' ';
					break;
				case KEYBOARD.RMOUSE:
					let win = window.open('https://galactae.eu/profil?u='+ this.innerText, '_blank');
					win.focus();
					break;
				default:

			}
		}
	}

	/**
	 * Loads chat UI
	 */
	static loadUI() {
		let EltsList = document.querySelectorAll('.chatTab');

		for(let i=0; i<EltsList.length; i++) {
			EltsList[i].addEventListener('click', function() {
				ui.toggleClass('#hud-chat-channels .ul-choice-line-li-active', 'ul-choice-line-li-active', this);

				ui.hide('.chatContent'); 

				let chatChannel = this.getAttribute('chatChannel');
				ui.show('#' + chatChannel);

				document.querySelector('#' + chatChannel).scrollTop = document.querySelector('#' + chatChannel).clientHeight;
			});
		}
	}
}