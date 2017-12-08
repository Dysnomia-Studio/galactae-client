var preventFleetHUDClosing = false;

class units {
	static sync() {
		socket.emit('units-ask-data', userData);
	}

	static refresh(data) {
		units.list = data;

		units.currUnit = -1;
		units.fleetList = units.fleetList || {};

		units.drawMain();
	}

	static regenFleetList(fleets) {
		units.fleetList = fleets;

		/**
		 * Regen Fleet building
		 */
		var optionList = $("#fleet-ship-build-fleetSelect option");
		// Remove old option
		for(var i=0; i<optionList.length; i++) {
			if(parseInt($(optionList[i]).attr('id')) > -1) {
				$(optionList[i]).remove();
			}
		}
		// Regen new option
		for(var i=0; i<units.fleetList.length; i++) {
			$('#fleet-ship-build-fleetSelect').append('<option id="' + i + '">' + units.fleetList[i].name + '</option>');
		}
	}

	static loadUI() {
		units.lastType = "SHIP_ALL";

		// Fleet panels close events
		$("#hud-fleet-close").click(function() {
			if(preventFleetHUDClosing) { return; }
			ui.closeTab("#hud-fleet");
			ui.fleet = false;
		});
		$("#fleet-type-create-close").click(function() {
			preventFleetHUDClosing = false;
			ui.closeTab("#fleet-type-create");
		});
		$("#fleet-ship-build-close").click(function() {
			preventFleetHUDClosing = false;
			ui.closeTab("#fleet-ship-build");
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
		// Fleet type create
		$('#fleet-type-create-form').submit(function(e) {
			 e.preventDefault();
			 units.createNewType();
		});

		// Fleet create
		$('#fleet-build-create').click(function() {
			units.drawCreateTypePanel();
		});

		// Fleet build
		$('#fleet-build-openPanel').click(function() {
			preventFleetHUDClosing = true;
			units.drawBuildPanel();
		});

		$('#fleet-ship-build-upgrade').click(function() {
			//units.askUnitBuild();
			// Disabled until we finish all work
			// @Petit Malin qui lit le code, pas la peine de tester, tout sera clear a la mise en route
		});

		// Change informations with buttons
		$('#fleet-build-buttons img').mouseenter(function() {
			switch($(this).attr('id')) {
				case "fleet-build-openPanel":
				case "fleet-build-type-edit":
				case "fleet-build-type-delete":
					$('#fleet-build-desc').text(fleetTranslate[$(this).attr('id')]);
					break;
				default:
					// do nothing here
			}
		});

		// Fleet counter
		$('#fleet-ship-build-count').keypress(function(event) {
			if (event.which != 8 && event.which != 0 && (event.which < 48 || event.which > 57)) {
				return false;
			}
		});

		$('#fleet-ship-build-count').on('input', function() {
			units.updateCount(parseInt($(this).val()));
		});

		$('#fleet-ship-build-fleetSelect').change(function() {
			if(parseInt($(this).attr('id'))==-1) {
				units.drawNewFleetPanel();
			}
		});
	}

	static drawMain(type="") {
		if(type=="") {
			type = units.lastType;
		} else {
			units.lastType = type;
		}

		if(units.list.length!=0) {
			$('#fleet-build-list-empty').css('display','none');

			var content = "";
			var active = true;
			for(var i=0; i<units.list.length; i++) {
				if(type=="SHIP_ALL" || type==units.list[i].shipType) {
					if(active) {
						content+= "<tr id=\""+ i +"\" class=\"fleet-build-list-active\">";
						active = false;
					} else {
						content+= "<tr id=\""+ i +"\">";
					}

					content += "<td>" + units.list[i].name + "</td><td>" + fleetTranslate[units.list[i].shipType] + "</td><td>" + units.list[i].note + "<td>" + units.list[i].owned + "</td></tr>";
				}
			}

			$('#fleet-build-list tbody').html(content);
			units.selectUnit(0);

			$('#fleet-build-list').css('display','inline-block');

			$('#fleet-build-stat').css('display','block');
			$('#fleet-build-message').css('display','block');
			$('#fleet-build-count').css('display','block');
			$('#fleet-build-upgrade').css('display','block');

			// Fleet Build
			$('#fleet-build-list tbody tr').click(function() {
				$("#fleet-build-list .fleet-build-list-active").removeClass("fleet-build-list-active"); //Retirer les classes actives
				$(this).addClass("fleet-build-list-active"); // Activer l'onglet cliqué
				units.selectUnit($(this).attr('id'));
			});
		} else {
			$('#fleet-build-list').css('display','none');

			$('#fleet-build-stat').css('display','none');
			$('#fleet-build-message').css('display','none');
			$('#fleet-build-count').css('display','none');
			$('#fleet-build-upgrade').css('display','none');

			$('#fleet-build-list-empty').css('display','inline-block');
		}
	}

	static drawNewFleetPanel() {
		// @ADD: Display panel
	}

	static createNewFleet() {
		// @ADD: Create new fleet
	}

	static updateBuildCost() {
		var costs = [
			"fleet-ship-build-cost-aluminium-val",
			"fleet-ship-build-cost-iron-val",
			"fleet-ship-build-cost-titanium-val",
			"fleet-ship-build-cost-copper-val",
			"fleet-ship-build-cost-time-val",
			"fleet-ship-build-cost-population-val",
		];

		var currUnit = units.list[units.currUnit];
		var count = parseInt($("#fleet-ship-build-count").val());

		if($("#fleet-ship-build-count").val() == "" || count < 1) { count = 1; }

		for(var i in costs) {
			if(currUnit.cost[i] == 0) { 
				$("#" + costs[i]).css("display","none");
				continue;
			}
			$("#" + costs[i]).css("display","inline-block");

			if(costs[i] != "fleet-ship-build-cost-time-val") {
				$("#" + costs[i]).text(GetBetterUnit(Math.round(count * currUnit.cost[i])));
			} else {
				$("#" + costs[i]).text(getStringTime(count * currUnit.cost[i]));
			}
		}
	}

	static getMaxShips() {
		var currUnit = units.list[units.currUnit];
		var max = Math.floor(planetData.resources[2] / currUnit.cost[0])

		for(var i=1; i<4; i++) {
			var currMax = Math.floor(planetData.resources[2 + i] / currUnit.cost[i]);
			if(currMax < max) {
				max = currMax;
			}
		}

		if(Math.floor(habProd/currUnit.cost[4]) < max) {
			max = Math.floor(habProd/currUnit.cost[4]);
		}

		return max;
	}

	static updateCount(count) {
		var max = units.getMaxShips();
		if(count > max) {
			$("#fleet-ship-build-count").val(max);
		}

		units.updateBuildCost();
	}

	static drawBuildPanel() {
		if(units.currUnit == -1 || units.list[units.currUnit] == undefined) { return; }

		var currUnit = units.list[units.currUnit];

		$("#fleet-ship-build-name").text(currUnit.name);

		units.updateBuildCost();

		$("#fleet-ship-build-count").val("");
		$("#fleet-ship-build-count").attr("placeholder","Max: " + units.getMaxShips());

		$("#fleet-ship-build").css('display','block');	
	}

	static askUnitBuild() {
		var count = parseInt($("#fleet-ship-build-count").val());

		if(count==NaN || count==undefined || units.currUnit==-1) { return; }

		socket.emit("unit-build", { 
			id: userData.id,
			username: userData.username,
			planet: userData.pid,
			count: count,
			unit: units.currUnit,
			fleet: $("#fleet-ship-build-fleet").val()
		});
		ui.closeTab("fleet-ship-build");
	}

	static drawCreateTypePanel() {
		$('#fleet-type-create-cost div').css('display','none');

		$('#fleet-type-create-schematic').html("");
		$('#fleet-type-create-selects').html("");

		var selectContent = "<option disabled>" + fleetTranslate['SHIP_TYPE'] + "</option>";

		for(var i=0; i<unitTypes.length; i++) {
			var disabled = false;
			for(var index in shipShapesDetails[unitTypes[i]]) {
				if(shipResearchDependencies[index] != undefined && !research.isSearched(shipResearchDependencies[index])) { 
					disabled = true;
				}
			}

			if(!disabled) {
				selectContent += '<option value="' + unitTypes[i] + '">' + fleetTranslate[unitTypes[i]] + '</option>';
			}
		}

		$('#fleet-type-create-shipType').html(selectContent);

		$('#fleet-type-create-shipShape').html("<option disabled>" + fleetTranslate['SHIP_SHAPE'] + "</option>");

		units.changeShipType();

		preventFleetHUDClosing = true;

		$("#fleet-type-create").css('display','block');
	}
	
	static changeShipType() {
		var type  = $("#fleet-type-create-shipType option").filter(":selected").val();
		var shape = "";

		$($('#fleet-type-create-name').get(0)).val('');

		var selectShipShape = "";
		for(var index in shipShapesDetails[type]) {
			if(shape=="") { shape = index; }
			if(shipResearchDependencies[index] != undefined && !research.isSearched(shipResearchDependencies[index])) { continue; }
			selectShipShape += '<option value="' + index + '">' + fleetTranslate[index] + '</option>';
		}

		if(selectShipShape != "") {
			selectShipShape = "<option disabled>" + fleetTranslate['SHIP_SHAPE'] + "</option>" + selectShipShape;

			$('#fleet-type-create-shipType option[value='+type+']').css("display","block");
			
			$('#fleet-type-create-shipShape').html(selectShipShape);

			units.drawShipShape(shipShapesDetails[type][shape]['svg'],shipShapesDetails[type][shape]['content']);
			units.updateStats(shipShapesDetails[type][shape]['content'],shipShapesDetails[type][shape]['stats']);
		} else {
			$("#fleet-type-create-shipType").val($("#fleet-type-create-shipType option:first").val());
			$('#fleet-type-create-shipType option[value='+type+']').css("display","none");
		}
	}

	static changeShipShape(id) {
		var type  = $("#fleet-type-create-shipType option").filter(":selected").val();
		var shape = $("#fleet-type-create-shipShape option").filter(":selected").val();

		$($('#fleet-type-create-name').get(0)).val('');

		units.drawShipShape(shipShapesDetails[type][shape]['svg'],shipShapesDetails[type][shape]['content']);
		units.updateStats(shipShapesDetails[type][shape]['content'],shipShapesDetails[type][shape]['stats']);
	}

	static drawShipShape(shape,content) {
		var svgContent = "";
		var htmlContent = "";

		for(var i=0; i<shape.length; i++) {
			// Draw shape
			switch(shape[i][1]) {
				case "rect":
					svgContent += '<rect class="' + shape[i][0] + '" x="' + shape[i][2] + '" y="' + shape[i][3] + '" width="' + shape[i][4] + '" height="' + shape[i][5] + '"></rect>';
					break;
				case "circle":
					svgContent += '<circle class="' + shape[i][0] + '" cx="' + shape[i][2] + '" cy="' + shape[i][3] + '" r="' + shape[i][4] + '"></circle>';
					break;
				case "line":
					svgContent += '<line class="' + shape[i][0] + '" x1="' + shape[i][2] + '" y1="' + shape[i][3] + '" x2="' + shape[i][4] + '" y2="' + shape[i][5] + '"></line>';
					break;
				case "path":
					svgContent += '<path class="' + shape[i][0] + '" d="';

					for(var j=2; j<shape[i].length; j++) {
						svgContent += shape[i][j] + " ";
					}

					svgContent += '" ></path>';
					break;
				default: // Poly
					svgContent += '<polygon class="' + shape[i][0] + '" points="';

					for(var j=2; j<shape[i].length; j+=2) {
						svgContent += shape[i][j] + "," + shape[i][j+1] + " ";
					}

					svgContent += '" ></polygon>';
			}

			// Draw HTML
			if(shape[i][0]!="struct") {
				htmlContent += '<select class="part-selecting" partName="' + shape[i][6] + '" partType="' + shape[i][0] + '" style="';
				htmlContent += 'left: ' + shape[i][2] + 'px;';
				htmlContent += 'top: ' + shape[i][3] + 'px;';
				htmlContent += 'width: ' + shape[i][4] + 'px;';
				htmlContent += 'height: ' + shape[i][5] + 'px;';
				htmlContent += '">';

				for(var j=0; j<content[shape[i][0]].length; j++) { //@ADD: research check
					if(content[shape[i][0]][j] != "none" && !research.isSearched(shipResearchDependencies[content[shape[i][0]][j]])) { continue; }
					htmlContent += '<option value="' + content[shape[i][0]][j] + '">' + content[shape[i][0]][j] + '</option>'; // @ADD: Translation
				}

				htmlContent += '</select>';
			}
		}
		$('#fleet-type-create-schematic').html(svgContent);
		$('#fleet-type-create-selects').html(htmlContent);

		// Events
		$('.part-selecting').on("change",function() { 
			var type  = $("#fleet-type-create-shipType option").filter(":selected").val();
			var shape = $("#fleet-type-create-shipShape option").filter(":selected").val();
			
			units.updateStats(shipShapesDetails[type][shape]['content'],shipShapesDetails[type][shape]['stats']);
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
		units.currUnit = id;
		$('#fleet-build-stat-attack-val').text(units.list[id].attack);
		$('#fleet-build-stat-shield-val').text(units.list[id].shieldType);
		$('#fleet-build-stat-role-val').text(unitTypes[units.list[id].shipType]);
		$('#fleet-build-stat-propulsion-val').text(units.list[id].engineType);
		$('#fleet-build-stat-miss-val').text(units.list[id].missChance);
		$('#fleet-build-stat-note-val').text(units.list[id].note);
	}

	static createNewType() {
		var errors = 0;
		var errorMessage = "";
		
		var ship = {
			name: $("#fleet-type-create-name").val(),
			type: $("#fleet-type-create-shipType option").filter(":selected").val(),
			shape: $("#fleet-type-create-shipShape option").filter(":selected").val()
		};
		/* Checks ... */
		if(ship.name.split(' ').join('')=="") {
			errors ++;
			errorMessage = "SHIP_HAS_NO_NAME";
		}

		/* Get All parts */
		var parts = $('#fleet-type-create-selects').children();
		for(var i=0; i<parts.length; i++) {
			var name = $(parts[i]).attr('partName');
			var type = $(parts[i]).attr('partType');
			var value =  $(parts[i]).val();

			if(value==undefined || value.split(' ').join('')=="") {
				errors++;
				errorMessage = "SHIP_HAS_EMPTY_FIELD";
				break;
			}

			if(type==undefined || type.split(' ').join('')=="") {
				errors++;
				errorMessage = "SHIP_HAS_WRONG_PARTS";
				break;
			}

			ship[name] = {value: value, type: type};
		}
		
		if(errors==0) {
			ui.closeTab("#fleet-type-create",false);
			preventFleetHUDClosing = false;
			socket.emit('unit-type-create', { id: userData.id, username: userData.username, ship: ship });
		} else {
			ui.drawMessage(errorMessage); // @ADD: Translation
		}
	}
}