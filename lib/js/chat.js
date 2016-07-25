//Default Channel reception
var chatChannel = "hud-chat-global";

$(document).ready(function() {
    socket.emit('chat-connect',userData.name );

    $('#chat_form').on('submit', function(e){
        e.preventDefault(); // On évite le recharchement de la page lors de la validation du formulaire
        // On crée notre objet JSON correspondant à notre message
        var message = $('#chat_message').val();

        $('#chat_message').val(''); // On vide le champ texte

        if (message.length !== 0) { // Gestion message vide

        var ChatUsername = userData.name;

        if(userData.lvl==2) { ChatUsername = "<span style=\"color: #b0291b;\">[STAFF] "+userData.name+"</span>"; }
        if(userData.lvl==3) { ChatUsername = "<span style=\"color: #b0291b;\">[ADMIN] "+userData.name+"</span>"; }

          socket.emit('chat-send', { message: message, username: ChatUsername, channel: chatChannel });
        }
        $('#chat_message').focus(); // Focus sur le champ du message
    });
});

/**
 * Réception d'un message
 */
socket.on('chat-message', function (data) {
  $('#'+data.channel+' .chat_logs').append($('<li>').html("<strong>"+data.username+" :</strong> "+data.message));
});
