var unitTypes = [
	"Defense",
	"Chasseur",
	"Croiseur",
	"Cuirassé",
	"Corvette",
	"Transporteur"
];

class units {
	static sync() {
		socket.emit('units-ask-data', userData);
	}

	static refresh(data) {
		units.list = data;

		units.draw();
	}

	static loadUI() {
		// Fleet panel close
		$("#hud-fleet-close").click(function() {
			ui.closeTab("#hud-fleet");
			ui.fleet = false;
		});
		// Fleet Menu
		$(".fleet-ul1 li").click(function() {
			$(".fleet-ul1 .ul-choice-line-li-active").removeClass("ul-choice-line-li-active"); //Retirer les classes actives
			$(this).addClass("ul-choice-line-li-active"); // Activer l'onglet cliqué

			$("#fleet-build").css('display',($(this).attr('id')=="fleet-build-button")?"block":"none");
			$("#fleet-orbit").css('display',($(this).attr('id')=="fleet-orbit-button")?"block":"none");
			$("#fleet-move").css('display',($(this).attr('id')=="fleet-move-button")?"block":"none");
			$("#fleet-out").css('display',($(this).attr('id')=="fleet-out-button")?"block":"none");
		});
		// Fleet submenus
		$("#fleet-build-choice li").click(function() {
			$("#fleet-build-choice .ul-choice-line-li-active").removeClass("ul-choice-line-li-active"); //Retirer les classes actives
			$(this).addClass("ul-choice-line-li-active"); // Activer l'onglet cliqué

			units.draw($(this).attr('shipType'));
		});
		// Fleet Build
		$('#fleet-build-list tbody tr').click(function() {
			$("#fleet-build-list .fleet-build-list-active").removeClass("fleet-build-list-active"); //Retirer les classes actives
			$(this).addClass("fleet-build-list-active"); // Activer l'onglet cliqué
			units.select($(this).attr('id'));
		});
	}

	static draw(type=-1) {
		if(units.list.length!=0) {
			$('#fleet-build-list-empty').css('display','none');

			var content = "";
			for(var i=0; i<units.list.length; i++) {
				if(type==units.list[i].shipType || type==-1) {
					if(i==0) {
						content+= "<tr id=\""+ 0 +"\" class=\"fleet-build-list-active\">";
					} else {
						content+= "<tr id=\""+ i +"\">";
					}

					content += "<td>" + units.list[i].name + "</td><td>" + unitTypes[units.list[i].shipType] + "</td><td>" + units.list[i].note + "<td>" + units.list[i].owned + "</td></tr>";
				}
			}

			$('#fleet-build-list tbody tr').html(content);
			units.select(0);

			$('#fleet-build-list').css('display','inline-block');

			$('#fleet-build-cost').css('display','block');
			$('#fleet-build-message').css('display','block');
			$('#fleet-build-upgrade').css('display','block');
		} else {
			$('#fleet-build-list').css('display','none');

			$('#fleet-build-cost').css('display','none');
			$('#fleet-build-message').css('display','none');
			$('#fleet-build-upgrade').css('display','none');

			$('#fleet-build-list-empty').css('display','inline-block');
		}
	}

	static select(id) {
		$('#fleet-build-stat-attack-val').text(units.list[id].attack);
		$('#fleet-build-stat-shield-val').text(units.list[id].shieldType);
		$('#fleet-build-stat-role-val').text(unitTypes[units.list[i].shipType]);
		$('#fleet-build-stat-propulsion-val').text(units.list[id].engineType);
		$('#fleet-build-stat-miss-val').text(units.list[id].missChance);
		$('#fleet-build-stat-note-val').text(units.list[id].note);
	}
}