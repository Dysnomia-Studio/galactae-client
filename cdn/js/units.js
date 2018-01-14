var preventFleetHUDClosing = false;
var preventUnitBuildPanelClose = false;

class units {
	static sync() {
		socket.emit('units-ask-data', userData);
	}

	static refresh(data) {
		units.list = data;

		units.fname = "";
		units.currUnit = -1;
		units.fleetList = units.fleetList || {};

		units.sortTypes = "name";

		units.drawMain();
		units.drawFleetLists();
	}

	static loadUI() {
		units.lastType = "SHIP_ALL";

		// Fleet panels close events
		$("#hud-fleet-close").click(function() {
			if(preventFleetHUDClosing) { return; }
			if(units.unitPanelTimeout != -1) {
				clearTimeout(units.unitPanelInterval);
				units.unitPanelTimeout = -1;
			}
			ui.closeTab("#hud-fleet");
			ui.fleet = false;
		});
		$("#fleet-type-create-close").click(function() {
			preventFleetHUDClosing = false;
			ui.closeTab("#fleet-type-create");
		});
		$("#fleet-ship-build-close").click(function() {
			if(preventUnitBuildPanelClose) { return; }
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
		$('#fleet-build-type-copy').click(function() {
			units.drawCreateTypePanel(units.currUnit);
		});
		$('#fleet-build-type-delete').click(function() {
			socket.emit("unit-type-delete", { 
				id: userData.id,
				username: userData.username,
				unit: units.list[units.currUnit]._id
			});
		});
		$('#fleet-build-list thead tr th').click(function() {
			var name = $(this).attr('id').substr('-')[4];

			if(name == units.sortTypes) {
				name += "-desc";
			}

			units.sortTypes = name;

			units.drawMain();
		});

		// Fleet build
		$('#fleet-build-openPanel').click(function() {
			preventFleetHUDClosing = true;
			units.drawBuildPanel();
		});
		$('#fleet-newFleet-submit').click(function() {
			units.validFleetName();
		})

		$('#fleet-ship-build-upgrade').click(function() {
			units.askUnitBuild();
		});

		// Change informations with buttons
		$('#fleet-build-buttons img').mouseenter(function() {
			switch($(this).attr('id')) {
				case "fleet-build-openPanel":
				case "fleet-build-type-copy":
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
			if(parseInt($('#fleet-ship-build-fleetSelect option').filter(":selected").attr('id'))==-1) {
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

		// Sort
		units.list.sort(function(a,b) {
			var desc = units.sortTypes.split("-").length - 1;
			if(desc) {
				var sort = units.sortTypes.split("-")[0];
			} else {
				var sort = units.sortTypes;
			}

			if(a[units.sortTypes] > [units.sortTypes]) {
				if(desc) {
					return 1;
				}
				return -1;
			} else if(a[units.sortTypes] == [units.sortTypes]) {
				return 0;
			} else {
				if(desc) {
					return -1;
				}
				return 1;
			}
		});

		var unitCount = 0;

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

					content += "<td>" + units.list[i].name + "</td><td>" + fleetTranslate[units.list[i].shipType] + "</td><td>" + fleetTranslate[units.list[i].shipShape] + "</td><td>" + units.list[i].note + "</td></tr>";
					unitCount++;
				}
			}

			$('#fleet-build-list tbody').html(content);
			units.selectUnit();

			$('#fleet-build-list').css('display','inline-block');

			$('#fleet-build-stat').css('display','block');
			$('#fleet-build-message').css('display','block');
			$('#fleet-build-count').css('display','block');
			$('#fleet-build-upgrade').css('display','block');

			// Time left
			if(units.unitPanelTimeout != -1) {
				clearTimeout(units.unitPanelInterval);
				units.unitPanelTimeout = -1;
			}

			if(planetData.unitBuildingEndTime > (Date.now() + planet.deltaNow)) { // Current building in build mode
				var dateEnd = new Date(planetData.unitBuildingEndTime + planet.deltaNow);
				var dateTom = new Date(Date.now() + (24*60*60*1000));

				if(dateNow.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Same day
					$('#fleet-build-message').html(translate["messages"]["BUILD_FINISH_TODAY_AT"] + " " + dateEnd.toLocaleTimeString());
				} else if(dateTom.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Tomorrow
					$('#fleet-build-message').html(translate["messages"]["BUILD_FINISH_TOMORROW_AT"] + " " + dateEnd.toLocaleTimeString());
				} else {
					$('#fleet-build-message').html(translate["messages"]["BUILD_FINISH_THE"] + " " + dateEnd.toLocaleDateString() + " " + translate["messages"]["BUILD_FINISH_AT"] + " " + dateEnd.toLocaleTimeString());
				}

				var currentFleetName = units.list[0].name;
				for(var i=0; i<units.list.length; i++) {
					if(units.list[i]._id == unitBuildingID) {
						currentFleetName = units.list[i].name;
					}
				}

				if(dateTom.toLocaleDateString() != dateEnd.toLocaleDateString()) {
					units.unitPanelTimeout = setTimeout(function() {
						ui.notify("Galactae: " + translate["messages"]['ENDED_UNIT_TITLE'], {
							icon: cdnURL+"img/favicon.png",
							body: translate["messages"]['ENDED_UNIT_01'] + planetData.unitBuildingCount + translate["messages"]['ENDED_UNIT_02'] + currentFleetName + translate["messages"]['ENDED_UNIT_03']
						});
						units.drawMain(id);
					},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000); // Refresh at 00:00:05
				} else {
					units.unitPanelTimeout = setTimeout(function() {
						ui.notify("Galactae: " + translate["messages"]['ENDED_UNIT_TITLE'], {
							icon: cdnURL+"img/favicon.png",
							body: translate["messages"]['ENDED_UNIT_01'] + planetData.unitBuildingCount + translate["messages"]['ENDED_UNIT_02'] + currentFleetName + translate["messages"]['ENDED_UNIT_03']
						});
						units.drawMain(id);
					},(((dateEnd.getHours() - dateNow.getHours())*60 + (dateEnd.getMinutes() - dateNow.getMinutes()))*60 + (dateEnd.getSeconds() + 5 - dateNow.getSeconds()))*1000); // Refresh 5 sec after end
				}
			} 

			// Fleet Build
			$('#fleet-build-list tbody tr').click(function() {
				$("#fleet-build-list .fleet-build-list-active").removeClass("fleet-build-list-active"); //Retirer les classes actives
				$(this).addClass("fleet-build-list-active"); // Activer l'onglet cliqué
				units.selectUnit($(this).attr('id'));
			});
		}

		if(unitCount == 0) {
			$('#fleet-build-list').css('display','none');

			$('#fleet-build-stat').css('display','none');
			$('#fleet-build-message').css('display','none');
			$('#fleet-build-count').css('display','none');
			$('#fleet-build-upgrade').css('display','none');

			$('#fleet-build-list-empty').css('display','inline-block');
		}
	}

	static drawNewFleetPanel() {
		$('#fleet-newFleet-name').val("");
		$('#fleet-newFleet-panel').css('display','block');
		preventUnitBuildPanelClose = true;
	}

	static fleetExists(fname) {
		for(var i in units.fleetList) {
			if(units.fleetList.name == fname) {
				return true;
			}
		}
		return false;
	}

	static validFleetName() {
		var fname = $('#fleet-newFleet-name').val();

		if(fname == "") { return; }
		if(units.fleetExists(fname)) { return; }

		units.fname = fname;
		$('#fleet-ship-build-fleetSelect option#-1').text(units.fname);
		$('#fleet-newFleet-panel').css('display','none');
		preventUnitBuildPanelClose = false;
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
				$("#" + costs[i].substring(0,costs[i].length-4)).css("display","none");
				continue;
			}
			$("#" + costs[i].substring(0,costs[i].length-4)).css("display","block");

			if(costs[i] != "fleet-ship-build-cost-time-val") {
				$("#" + costs[i]).text(GetBetterUnit(Math.round(count * parseFloat(currUnit.cost[i]))));
			} else {
				$("#" + costs[i]).text(getStringTime(count * parseFloat(currUnit.cost[i])));
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

	static regenerateBuildFleetList() {
		// Fleet list
		$('#fleet-ship-build-fleetSelect').html(unitBuildSelectHeader);
		for(var i=0; i<units.fleetList.length; i++) {
			if(units.fleetList[i].name == "SHIP_DEF") { break; }
			$('#fleet-ship-build-fleetSelect').append('<option id="' + i + '">' + units.fleetList[i].name + '</option>');
		}
		$('#fleet-ship-build-fleetSelect').append(unitBuildSelectNew);
	}

	static drawBuildPanel() {
		if(units.currUnit == -1 || units.list[units.currUnit] == undefined) { return; }
		$('#fleet-ship-build-fleetSelect').css('display','block');

		units.fname = "";
		var currUnit = units.list[units.currUnit];

		// Name
		$("#fleet-ship-build-name").text(currUnit.name);

		// Costs
		units.updateBuildCost();

		// Count
		$("#fleet-ship-build-count").val("");
		$("#fleet-ship-build-count").attr("placeholder","Max: " + units.getMaxShips());

		units.regenerateBuildFleetList();

		if(units.list[units.currUnit].shipType == "SHIP_DEF") {
			$('#fleet-ship-build-fleetSelect').css('display','none');
		}

		// Draw panel
		$("#fleet-ship-build").css('display','block');	
	}

	static askUnitBuild() {
		var count = parseInt($("#fleet-ship-build-count").val());
		var fleet = parseInt($("#fleet-ship-build-fleetSelect option").filter(':selected').attr("id"));
		
		if(fleet==NaN || fleet==undefined || (fleet==-2 && units.list[units.currUnit].shipType != "SHIP_DEF")) { return; }
		if(count==NaN || count==undefined || units.currUnit==-1) { return; }
		if(preventUnitBuildPanelClose) { return; }

		var unit = { 
			id: userData.id,
			username: userData.username,
			planet: userData.pid,
			count: count,
			unit: units.list[units.currUnit]._id
		};

		if(fleet == -1) {
			unit.fleetName = units.fname;
			unit.fleet = -1;
		} else if(fleet == -2) {
			unit.fleet = -2;
		} else {
			unit.fleet = units.fleetList[fleet]._id;
		} 

		socket.emit("unit-build", unit);
		ui.closeTab("#fleet-ship-build");

		preventFleetHUDClosing = false;
	}

	static drawCreateTypePanel(unit=-1) {
		var unitsParts = [];
		var selectedType = "";
		var selectedShape = "";

		if(units.currUnit != -1 && units.list[units.currUnit] != undefined) { 
			for(var i in units.list[units.currUnit].parts) {
				unitsParts[units.list[units.currUnit].parts[i].name] = units.list[units.currUnit].parts[i].tech;
			}

			selectedType = units.list[units.currUnit].shipType;
			selectedShape = units.list[units.currUnit].shipShape;
		}

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

			if(!disabled && selectedType != unitTypes[i]) {
				selectContent += '<option value="' + unitTypes[i] + '">' + fleetTranslate[unitTypes[i]] + '</option>';
			} else if(!disabled && selectedType == unitTypes[i]) {
				selectContent += '<option value="' + unitTypes[i] + '" selected>' + fleetTranslate[unitTypes[i]] + '</option>';
			}
		}

		$('#fleet-type-create-shipType').html(selectContent);

		$('#fleet-type-create-shipShape').html("<option disabled>" + fleetTranslate['SHIP_SHAPE'] + "</option>");

		units.changeShipType(unitsParts,selectedShape);

		preventFleetHUDClosing = true;

		$("#fleet-type-create").css('display','block');
	}
	
	static changeShipType(unitsParts=[],selectedShape="") {
		var type  = $("#fleet-type-create-shipType option").filter(":selected").val();
		var shape = "";

		$($('#fleet-type-create-name').get(0)).val('');

		var selectShipShape = "";
		for(var index in shipShapesDetails[type]) {
			if(shape=="") { shape = index; }
			if(shipResearchDependencies[index] != undefined && !research.isSearched(shipResearchDependencies[index])) { continue; }
			if(index == selectedShape) {
				selectShipShape += '<option value="' + index + '" selected>' + fleetTranslate[index] + '</option>';
			} else {
				selectShipShape += '<option value="' + index + '">' + fleetTranslate[index] + '</option>';
			}
		}

		if(selectShipShape != "") {
			selectShipShape = "<option disabled>" + fleetTranslate['SHIP_SHAPE'] + "</option>" + selectShipShape;

			$('#fleet-type-create-shipType option[value='+type+']').css("display","block");
			
			$('#fleet-type-create-shipShape').html(selectShipShape);

			units.drawShipShape(shipShapesDetails[type][shape]['svg'],shipShapesDetails[type][shape]['content'],unitsParts);
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

	static drawShipShape(shape,content,unitsParts=[]) {
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

				for(var j=0; j<content[shape[i][0]].length; j++) { //@ADD: Entete
					if(content[shape[i][0]][j] != "none" && !research.isSearched(shipResearchDependencies[content[shape[i][0]][j]])) { continue; }
					if(unitsParts[shape[i][6]] != undefined && unitsParts[shape[i][6]] == content[shape[i][0]][j]) {
						htmlContent += '<option value="' + content[shape[i][0]][j] + '" style="background-image: url(\''+ cdnURL + 'img/units-modules/' + content[shape[i][0]][j] + '.png\'); background-size: 100%;background-repeat: no-repeat;background-position: left top; width: ' + shape[i][4] + 'px; height: ' + shape[i][5] + 'px;" selected></option>';
					} else {
						htmlContent += '<option value="' + content[shape[i][0]][j] + '" style="background-image: url(\''+ cdnURL + 'img/units-modules/' + content[shape[i][0]][j] + '.png\'); background-size: 100%;background-repeat: no-repeat;background-position: left top; width: ' + shape[i][4] + 'px; height: ' + shape[i][5] + 'px;"></option>';
					}
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
		units.currUnit = id = (id === undefined)?0:id;
		if(units.list[id] === undefined) { return; }
		$('#fleet-build-name').text(units.list[id].name);

		// Weapons
		// $('#fleet-build-stat-attack-val').text(attack);

		// Shields
		//$('#fleet-build-stat-shield-val').text(units.list[id].shieldType);

		if(units.list[id].shipType == "SHIP_DEF") {
			$('#fleet-build-stat-supspeed').css('display','none');
			$('#fleet-build-stat-subspeed').css('display','none');
		} else {
			if(units.list[id].shipType != "SHIP_FIGHTER") {
				//$('#fleet-build-stat-supspeed-val').text(supspeed);
				$('#fleet-build-stat-supspeed').css('display','block');	
			} else {
				$('#fleet-build-stat-supspeed').css('display','none');
			}

			//$('#fleet-build-stat-subspeed-val').text(subspeed);
			$('#fleet-build-stat-subspeed').css('display','block');
		}

		// Proba d'evitement
		// $('#fleet-build-stat-miss-val').text(missChance);

		// Masse
		// $('#fleet-build-stat-mass-val').text(mass);

		// Hangars
		if(units.list[id].shipType == "SHIP_CARRIER") {
			//$('#fleet-build-stat-fcap-val').text(fighterCap);
			$('#fleet-build-stat-fcap').css("display","block");
		} else {
			$('#fleet-build-stat-fcap').css("display","none");
		}
		
		// Evaluation
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

	static drawFleetLists() {
		if(planetData.address == undefined) { 
			setTimeout(function() {
				units.drawFleetLists();
			},1000); 
		}

		var orbit = [];
		var moving = [];
		var out = [];

		for(var i=0; i<units.fleetList.length; i++) {
			if(units.fleetList[i].position == planetData.address && units.fleetList[i].orbitPosition != -1) {
				orbit.push(units.fleetList[i]);
			} else if(units.fleetList[i].orbitPosition == -1) {
				moving.push(units.fleetList[i]);
			} else {
				out.push(units.fleetList[i]);
			}
		}

		// On orbit
		var orbitDOM = "";
		if(orbit.length != 0) {
			for(var i=0; i<orbit.length; i++) {
				var totalcount = 0;
				for(var j=0; j<orbit[i].units.length; j++) {
					totalcount += orbit[i].units[j][1];
				}
				if(orbit[i].name=="SHIP_DEF") { orbit[i].name = fleetTranslate[orbit[i].name]; }
				var content = '<details class="fleet-show-global"><summary class="fleet-show-name">' + orbit[i].name + ' <span class="fleet-show-count">' + totalcount + ' ' + fleetTranslate['unit'] + '</span></summary></details>';

				if(orbit[i].name== fleetTranslate["SHIP_DEF"]) { // Defence fleet always first
					orbitDOM = content + orbitDOM;
					continue;
				}
				orbitDOM += content;
			}
		} else {
			orbitDOM = "<h2>" + fleetTranslate['no-orbit-unit'] + "</h2>";
		}
		$('#fleet-orbit-content').html(orbitDOM);

		// Moving
		var movingDOM = "";
		if(moving.length != 0) {
			for(var i=0; i<moving.length; i++) {
				var totalcount = 0;
				for(var j=0; j<moving[i].units.length; j++) {
					totalcount += moving[i].units[j][1];
				}
				movingDOM += '<details class="fleet-show-global"><summary class="fleet-show-name">' + moving[i].name + ' <span class="fleet-show-count">' + totalcount + ' ' + fleetTranslate['unit'] + '</span></summary></details>';
			}
		} else {
			movingDOM = "<h2>" + fleetTranslate['no-move-unit'] + "</h2>";
		}
		$('#fleet-move-content').html(movingDOM);

		// Out
		var outDOM = "";
		if(out.length != 0) {
			for(var i=0; i<out.length; i++) {
				var totalcount = 0;
				for(var j=0; j<out[i].units.length; j++) {
					totalcount += out[i].units[j][1];
				}
				outDOM += '<details class="fleet-show-global"><summary class="fleet-show-name">' + out[i].name + ' <span class="fleet-show-count">' + totalcount + ' ' + fleetTranslate['unit'] + '</span></summary></details>';
			}
		} else {
			outDOM = "<h2>" + fleetTranslate['no-out-unit'] + "</h2>";
		}
		$('#fleet-out-content').html(outDOM);
	}
}