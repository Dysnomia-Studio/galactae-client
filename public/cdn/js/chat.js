let chatChannel = 'hud-chat-global';

/**
 * Class for game chat
 */
class chat {
	static init() {
		/**
		 * Sending message
		 */
		document.getElementById('chat_form').addEventListener('submit', function(e){
			e.preventDefault(); // Prevent reloading page

			// Getting message & emptying input
			const message = document.getElementById('chat_message').value;
			document.getElementById('chat_message').value = '';

			// Checking message content
			let blockSend = false;

			if(message.charAt(0) === '@' && message.substr(1,userData.username.length).toLowerCase() === userData.username.toLowerCase()) {
				chat.sm('NO_PM_YOU');
				blockSend = true;
			}
			if(message.length === 0) { blockSend = true; }

			// Sending message to server
			if (!blockSend) {
				socket.emit('chat-send', { message: normalizeText(message), username: userData.username, id: userData.id, channel: chatChannel });
				ui.lastMessage = message;
			}
			document.getElementById('chat_message').focus(); // Focus chat input
		});

		/**
		 * Recieving message
		 * @TODO: Notify messages on tabs
		 */
		socket.on('chat-message', function(data) {
			const listElt = document.createElement('li');
			listElt.innerHTML = data.message;

			listElt.addEventListener('DOMNodeInserted', function() {
				const DOMElts = this.querySelectorAll('.username');
				for(let elt=0; elt<DOMElts.length; elt++) {
					DOMElts[elt].addEventListener('mousedown', chat.usernameClickEvent(event));
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
	 * @param	  {object}  data	The data
	 */
	static pm(data) {
		// Translation
		if((translate.messages[data.msg] !== undefined) && (translate.messages[data.msg] !== '')) { data.msg = translate.messages[data.msg]; }

		const listElt = '<li><span class="private-message">'+data.msg+'</span></li>';

		document.querySelector('#hud-chat-global .chat_logs').innerHTML += listElt;
		document.querySelector('#hud-chat-trade .chat_logs').innerHTML += listElt;
		document.querySelector('#hud-chat-ally .chat_logs').innerHTML += listElt;

		document.querySelector('#'+data.channel).scrollTop = document.querySelector('#'+data.channel+' .chat_logs').clientHeight;

		if(data.sound && settings.get('sounds_privateMessage')) {
			const pmSound = new Audio('snd/ui/private_message.mp3');
			pmSound.volume = 0.2 * settings.get('sounds_soundLvl')/100;
			pmSound.play();
		}
	}

	/**
	 * Recieved system message
	 *
	 * @param	  {object}  data	The data
	 */
	static sm(msg) {
		// Translation
		if((translate.messages[msg] !== undefined) && (translate.messages[msg] !== '')) { msg = translate.messages[msg]; }

		const listElt = '<li><span class="system-message">'+msg+'</span></li>';

		document.querySelector('#hud-chat-global .chat_logs').innerHTML += listElt;
		document.querySelector('#hud-chat-trade .chat_logs').innerHTML += listElt;
		document.querySelector('#hud-chat-ally .chat_logs').innerHTML += listElt;

		document.querySelector('#'+chatChannel).scrollTop = document.querySelector('#'+chatChannel+' .chat_logs').clientHeight;
	}

	/**
	 * When we click on an username
	 *
	 * @param      {object}  event   The event
	 */
	static usernameClickEvent(event) {
		if(this.innerText !== userData.username && !ui.hasClass(this, 'no-pm')) {
			switch(event.which) {
				case KEYBOARD.LMOUSE:
					document.getElementById('chat_message').value = '@' + this.innerText + ' ';
					break;
				case KEYBOARD.RMOUSE:
					ui.openProfile(this.innerText);
					break;
				default:

			}
		}
	}

	/**
	 * Loads chat UI
	 */
	static loadUI() {
		const EltsList = document.querySelectorAll('.chatTab');

		for(let i=0; i<EltsList.length; i++) {
			EltsList[i].addEventListener('click', function() {
				ui.toggleClass('#hud-chat-channels .ul-choice-line-li-active', 'ul-choice-line-li-active', this);

				ui.hide('.chatContent');

				chatChannel = this.getAttribute('chatChannel');
				ui.show('#' + chatChannel);

				document.querySelector('#' + chatChannel).scrollTop = document.querySelector('#' + chatChannel).clientHeight;
			});
		}
	}
}