class units {
	static sync() {
		socket.emit('units-ask-data', userData);
	}

	static refresh(data) {
		units.list = data;

		units.drawMain();
	}

	static loadUI() {
		// Fleet panels close events
		$("#hud-fleet-close").click(function() {
			ui.closeTab("#hud-fleet");
			ui.fleet = false;
		});
		$("#fleet-type-create-close").click(function() {
			ui.closeTab("#fleet-type-create");
		});
		$("#fleet-ship-build").click(function() {
			ui.closeTab("#fleet-ship-build-close");
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

			units.drawMain($(this).attr('shipType'));
		});
		// Fleet Build
		$('#fleet-build-list tbody tr').click(function() {
			$("#fleet-build-list .fleet-build-list-active").removeClass("fleet-build-list-active"); //Retirer les classes actives
			$(this).addClass("fleet-build-list-active"); // Activer l'onglet cliqué
			units.selectUnit($(this).attr('id'));
		});
		// Fleet type create
		$('#fleet-type-create-form').submit(function(e) {
			 e.preventDefault();
			 units.createNewType();
			 ui.closeTab('#fleet-type-create',false);
		});
	}

	static drawMain(type=-1) {
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
			units.selectUnit(0);

			$('#fleet-build-list').css('display','inline-block');

			$('#fleet-build-cost').css('display','block');
			$('#fleet-build-message').css('display','block');
			$('#fleet-build-count').css('display','block');
			$('#fleet-build-upgrade').css('display','block');
		} else {
			$('#fleet-build-list').css('display','none');

			$('#fleet-build-cost').css('display','none');
			$('#fleet-build-message').css('display','none');
			$('#fleet-build-count').css('display','none');
			$('#fleet-build-upgrade').css('display','none');

			$('#fleet-build-list-empty').css('display','inline-block');
		}
	}

	static drawCreateTypePanel() {
		$('#fleet-type-create-cost div').css('display','none');

		var selectContent = "<option disabled>" + fleetTranslate['SHIP_TYPE'] + "</option>";

		for(var i=0; i<unitTypes.length; i++) {
			selectContent += '<option value="' + unitTypes[i] + '">' + fleetTranslate[unitTypes[i]] + '</option>';
		}

		$('#fleet-type-create-shipType').html(selectContent);

		$('#fleet-type-create-shipShape').html("<option disabled>" + fleetTranslate['SHIP_SHAPE'] + "</option>");

		units.changeShipType();

		$("#fleet-type-create").css('display','block');
	}

	static drawBuildPanel() {
		$("#fleet-ship-build-close").css('display','block');
	}

	static changeShipType() {
		var type  = $("#fleet-type-create-shipType option").filter(":selected").val();
		var shape = "";

		var selectShipShape = "<option disabled>" + fleetTranslate['SHIP_SHAPE'] + "</option>";
		for(var index in shipShapesDetails[type]) {
			if(shape=="") { shape = index; }
			selectShipShape += '<option value="' + index + '">' + fleetTranslate[index] + '</option>';
		}
		$('#fleet-type-create-shipShape').html(selectShipShape);

		units.drawShipShape(shipShapesDetails[type][shape]['svg'],shipShapesDetails[type][shape]['content']);
		units.updateStats(shipShapesDetails[type][shape]['content'],shipShapesDetails[type][shape]['stats']);
	}

	static changeShipShape(id) {
		var type  = $("#fleet-type-create-shipType option").filter(":selected").val();
		var shape = $("#fleet-type-create-shipShape option").filter(":selected").val();

		units.drawShipShape(shipShapesDetails[type][shape]['svg'],shipShapesDetails[type][shape]['content']);
		units.updateStats(shipShapesDetails[type][shape]['content'],shipShapesDetails[type][shape]['stats']);
	}

	static drawShipShape(shape) {
		var svgContent = "";

		for(var i=0; i<shape.length; i++) {
			// Draw shape
			switch(shape[i][1]) {
				case "rect":
					svgContent += '<rect class="' + shape[i][0] + '" x="' + shape[i][2] + '" y="' + shape[i][3] + '" width="' + shape[i][4] + '" height="' + shape[i][5] + '">';
					break;
				case "circle":
					svgContent += '<circle class="' + shape[i][0] + '" cx="' + shape[i][2] + '" cy="' + shape[i][3] + '" r="' + shape[i][4] + '">';
					break;
				case "line":
					svgContent += '<line class="' + shape[i][0] + '" x1="' + shape[i][2] + '" y1="' + shape[i][3] + '" x2="' + shape[i][4] + '" y2="' + shape[i][5] + '">';
					break;
				case "path":
					svgContent += '<path class="' + shape[i][0] + '" d="';

					for(var j=2; j<shape[i].length; j++) {
						svgContent += shape[i][j] + " ";
					}

					svgContent += '" >';
					break;
				default: // Poly
					svgContent += '<polygon class="' + shape[i][0] + '" points="';

					for(var j=2; j<shape[i].length; j+=2) {
						svgContent += shape[i][j] + "," + shape[i][j+1] + " ";
					}

					svgContent += '" >';
			}

			// End shape
			if(shape[i][1]=="" || shape[i][1]=="poly") { shape[i][1]="polygon"; }
			svgContent += "</" + shape[i][1] + ">";
		}
		$('#fleet-type-create-schematic').html(svgContent);

		console.log(svgContent);

		// Events
		$('#fleet-type-create-schematic *').click(function() { 
			if(! $(this).hasClass('struct')) {
				units.showPartPanel($(this));	
			}
		 });
	}

	static updateStats(content,stats) {
		// Hide some things if needed
		$('#fleet-type-create-cost div').css('display','block');

		if(content['sub_propulsion']==undefined) {
			$('#fleet-type-create-stat-subspeed').css('display','none');
			$('#fleet-type-create-stat-subspeed-val').html(0 + " km/s"); // @ADD: Subspeed value
		}
		if(content['sup_propulsion']==undefined) {
			$('#fleet-type-create-stat-supspeed').css('display','none');
			$('#fleet-type-create-stat-supspeed-val').html(0 + " pc/s"); // @ADD: Supspeed value
		}
		if(content['fighterHangar']==undefined) {
			$('#fleet-type-create-stat-fcap').css('display','none');
		} else {
			// @ADD: Hangar Capacity
			// $('#fleet-type-create-stat-fcap-val').text();
		}

		// Masse
		$('#fleet-type-create-stat-mass-val').html(GetBetterUnit(stats['mass'],"t")); // @ADD: Calc Mass

		// Note
		$('#fleet-type-create-stat-note-val').text("X.X"); // @ADD: Calc note

		// Miss chance
		$('#fleet-type-create-stat-miss-val').text("X.X%"); // @ADD: Calc miss
	}

	static selectUnit(id) {
		$('#fleet-build-stat-attack-val').text(units.list[id].attack);
		$('#fleet-build-stat-shield-val').text(units.list[id].shieldType);
		$('#fleet-build-stat-role-val').text(unitTypes[units.list[i].shipType]);
		$('#fleet-build-stat-propulsion-val').text(units.list[id].engineType);
		$('#fleet-build-stat-miss-val').text(units.list[id].missChance);
		$('#fleet-build-stat-note-val').text(units.list[id].note);
	}

	static showPartPanel(obj) {
		console.log('partChoice');
	}

	static createNewType() {
		// Do some stuff
		
		$('#fleet-type-create-name').val('');
	}
}