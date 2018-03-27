var preventFleetHUDClosing = false;
var preventUnitBuildPanelClose = false;

class units {
	static sync() {
		socket.emit('units-ask-data', userData);
	}

	static refresh(data) {
		units.list = data;

		for(var i=0; i<units.list.length; i++) {
			if(units.list[i]._id.substr(0,14) == "SHIP_WEP_MINES") {
				units.list.splice(i,1);
				i--;
			}
		}

		// Mines
		if(research.isSearched(shipResearchDependencies["SHIP_WEP_MINES"])) {
			units.list.push({
				_id: "SHIP_WEP_MINES",
				name: fleetTranslate["SHIP_WEP_MINES"],
				note: 0, // @ADD: Note
				cost: shipCosts["SHIP_WEP_MINES"],
				shipShape: "SHIP_WEP_MINES",
				shipType: "SHIP_DEF",
			});
		}
		if(research.isSearched(shipResearchDependencies["SHIP_WEP_MINES_IEM"])) {
			units.list.push({
				_id: "SHIP_WEP_MINES_IEM",
				name: fleetTranslate["SHIP_WEP_MINES_IEM"],
				note: 0, // @ADD: Note
				cost: shipCosts["SHIP_WEP_MINES_IEM"],
				shipShape: "SHIP_WEP_MINES_IEM",
				shipType: "SHIP_DEF",
			});
		}
		if(research.isSearched(shipResearchDependencies["SHIP_WEP_MINES_NUKE"])) {
			units.list.push({
				_id: "SHIP_WEP_MINES_NUKE",
				name: fleetTranslate["SHIP_WEP_MINES_NUKE"],
				note: 0, // @ADD: Note
				cost: shipCosts["SHIP_WEP_MINES_NUKE"],
				shipShape: "SHIP_WEP_MINES_NUKE",
				shipType: "SHIP_DEF",
			});
		}

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

			if($(this).attr('id')=="fleet-build-button") {
				$("#fleet-build").css('display',"block");
			} else {
				$("#fleet-build").css('display',"none");
			}

			if($(this).attr('id')=="fleet-orbit-button") {
				$("#fleet-orbit").css('display',"block");
			} else {
				$("#fleet-orbit").css('display',"none");
			}

			if($(this).attr('id')=="fleet-move-button") {
				$("#fleet-move").css('display',"block");
			} else {
				$("#fleet-move").css('display',"none");
			}

			if($(this).attr('id')=="fleet-out-button") {
				$("#fleet-out").css('display',"block");
			} else {
				$("#fleet-out").css('display',"none");
			}

			ui.updateBottom();
		});
		// Fleet submenus
		$("#fleet-build-choice li").click(function() {
			$("#fleet-build-choice .ul-choice-line-li-active").removeClass("ul-choice-line-li-active"); //Retirer les classes actives
			$(this).addClass("ul-choice-line-li-active"); // Activer l'onglet cliqué

			units.drawMain($(this).attr('shipType'));
		});
		// Type create
		$('#fleet-type-create-form').submit(function(e) {
			 e.preventDefault();
			 units.createNewType();
		});
		$('#fleet-build-create').click(function() {
			units.drawCreateTypePanel();
		});
		// Type copy
		$('#fleet-build-type-copy').click(function() {
			units.drawCreateTypePanel(units.currUnit);
		});
		// Type delete
		$('#fleet-build-type-delete').click(function() {
			$('#fleet-typeDelete-panel').css('display','block');
			preventFleetHUDClosing = true;
		});
		$('#fleet-typeDelete-yes').click(function() {
			socket.emit("unit-type-delete", { 
				id: userData.id,
				username: userData.username,
				unit: units.list[units.currUnit]._id
			});
			$('#fleet-typeDelete-panel').css('display','none');
			preventFleetHUDClosing = false;
		});
		$('#fleet-typeDelete-no').click(function() {
			$('#fleet-typeDelete-panel').css('display','none');
			preventFleetHUDClosing = false;
		});
		// Type rename
		$('#fleet-build-rename').click(function() {
			var oldName = units.list[units.currUnit].name;

			$('#fleet-type-rename-name').text(oldName);
			$('#fleet-type-rename-newName').val(oldName);

			$('#fleet-type-rename').css('display','block');
			preventFleetHUDClosing = true;
		});
		$('#fleet-type-rename-submit').click(function() {
			if($('#fleet-type-rename-newName').val() == "") { return; }

			socket.emit("unit-type-rename", { 
				id: userData.id,
				username: userData.username,
				shipId: units.list[units.currUnit]._id,
				shipNewName: $('#fleet-type-rename-newName').val()
			});
			$('#fleet-type-rename').css('display','none');
			preventFleetHUDClosing = false;
		});
		$('#fleet-type-rename-close').click(function() {
			$('#fleet-type-rename').css('display','none');
			preventFleetHUDClosing = false;
		});
		// Nouveau tri
		$('#fleet-build-list thead tr th').click(function() {
			var name = $(this).attr('id').split('-')[4];

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
		var oldCurr = units.list[units.currUnit];
		units.list.sort(function(a,b) {
			var desc = units.sortTypes.split("-").length - 1;
			var sort = units.sortTypes.split("-")[0];

			var Na = a[sort];
			var Nb = b[sort];

			if(!Number.isInteger(Na)) {
				if(fleetTranslate[Na] !== undefined) {
					Na = fleetTranslate[Na];
				}
				if(fleetTranslate[Nb] !== undefined) {
					Nb = fleetTranslate[Nb];
				}

				Na = Na.toLowerCase();
				Nb = Nb.toLowerCase();
			} else {
				Na = a[sort];
				Nb = b[sort];
			}

			if(Na > Nb) {
				if(desc) {
					return -1;
				}
				return 1;
			} 

			if(Na == Nb) {
				return 0;
			}

			if(desc) {
				return 1;
			}
			return -1;
		});

		for(var i=0; i<units.list; i++) {
			if(units.list[i]._id == oldCurr._id) {
				units.currUnit = i;
				break;
			}
		}

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
			$('#fleet-build-buttons').css('display','block');

			$('#fleet-build-message').html("");

			// Time left
			if(units.unitPanelTimeout != -1) {
				clearTimeout(units.unitPanelInterval);
				units.unitPanelTimeout = -1;
			}

			if(planetData.unitBuildingEndTime > (Date.now() + planet.deltaNow)) { // An unit is building
				var dateNow = new Date();
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
					if(units.list[i]._id == planetData.unitBuildingID) {
						currentFleetName = units.list[i].name;
					}
				}

				if(dateNow.toLocaleDateString() != dateEnd.toLocaleDateString()) {
					units.unitPanelTimeout = setTimeout(function() {
						units.drawMain();
					},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000); // Refresh at 00:00:05
				} else {
					units.unitPanelTimeout = setTimeout(function() {
						ui.notify("Galactae: " + translate["messages"]['ENDED_UNIT_TITLE'], {
							icon: cdnURL+"img/favicon.png",
							body: translate["messages"]['ENDED_UNIT_01'] + planetData.unitBuildingCount + translate["messages"]['ENDED_UNIT_02'] + currentFleetName + translate["messages"]['ENDED_UNIT_03']
						});
						planet.sync();
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

		// Check if we can create fleet
		var disabledButton = true;
		for(var i=0; i<unitTypes.length; i++) {
			for(var index in shipShapesDetails[unitTypes[i]]) {
				if(shipResearchDependencies[index] == undefined || research.isSearched(shipResearchDependencies[index])) { 
					disabledButton = false;
					break;
				}
			}
			if(!disabledButton) { break; }
		}
		if(disabledButton) {
			$('#fleet-build-create').css("display","none");
		} else {
			$('#fleet-build-create').css("display","block");
		}

		if(unitCount == 0) {
			$('#fleet-build-list').css('display','none');

			$('#fleet-build-stat').css('display','none');
			$('#fleet-build-message').css('display','none');
			$('#fleet-build-buttons').css('display','none');

			$('#fleet-build-list-empty').css('display','inline-block');
		}
	}

	static drawNewFleetPanel() {
		$('#fleet-newFleet-name').val("");
		$('#fleet-newFleet-panel').css('display','block');
		$('#fleet-newFleet-name').keypress(function(e) {
			if(e.which == 13) {
				units.validFleetName();
			}
		});
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
				$("#" + costs[i]).text(getStringTime(count * parseFloat(currUnit.cost[i]) * (1 - buildLvlUnitBuildingSpeedBonus * planetData.Buildings[7])));
			}
		}
	}

	static getMaxShips() {
		var currUnit = units.list[units.currUnit];
		var transitionTable = [3,2,5,4];
		var max = Math.floor(planetData.resources[3] / currUnit.cost[0]); // 3 = transitionTable[0]

		for(var i=1; i<4; i++) {
			var currMax = Math.floor(planetData.resources[transitionTable[i]] / currUnit.cost[i]);
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
			if(units.fleetList[i].name == "SHIP_DEF" || units.fleetList[i].name == fleetTranslate["SHIP_DEF"]) { continue; } // Def fleet
			if(units.fleetList[i].position != planetData.address || units.fleetList[i].orbitPosition != 0) { continue; } // Moving/Out fleets

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

		$('#fleet-ship-build-count').keypress(function(e) {
			if(e.which == 13) {
				units.askUnitBuild();
			}
		});

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

		var selectContent = "";
		for(var i=0; i<unitTypes.length; i++) {
			var disabled = true;
			for(var index in shipShapesDetails[unitTypes[i]]) {
				if(shipResearchDependencies[index] == undefined || research.isSearched(shipResearchDependencies[index])) { 
					disabled = false;
					break;
				}
			}
			if(disabled) { continue; }

			if(selectedType != unitTypes[i]) {
				selectContent += '<option value="' + unitTypes[i] + '">' + fleetTranslate[unitTypes[i]] + '</option>';
			} else {
				selectContent += '<option value="' + unitTypes[i] + '" selected>' + fleetTranslate[unitTypes[i]] + '</option>';
			}
		}

		if(selectContent == "") { // No shape searched
			return;
		}
		selectContent = "<option disabled>" + fleetTranslate['SHIP_TYPE'] + "</option>" + selectContent;

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
			units.updateTypeCreateStats();
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
		units.updateTypeCreateStats();
	}

	static drawShipShape(shape,content,unitsParts=[]) {
		var svgContent = "";
		$('#fleet-type-create-selects').html("");

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
				/* Hidden Select */
				var hiddenSelect = '<select id="part-selecting-hidden-' + i + '" partName="' + shape[i][6] + '" partType="' + shape[i][0] + '" style="display: none;">';
				for(var j=0; j<content[shape[i][0]].length; j++) {
					if(content[shape[i][0]][j] != "none" && shipResearchDependencies[content[shape[i][0]][j]] !== undefined && !research.isSearched(shipResearchDependencies[content[shape[i][0]][j]])) { continue; }
					if(unitsParts[shape[i][6]] != undefined && unitsParts[shape[i][6]] == content[shape[i][0]][j]) {
						hiddenSelect += '<option value="' + content[shape[i][0]][j] + '" id="' + content[shape[i][0]][j] + '" selected>';
					} else {
						hiddenSelect += '<option value="' + content[shape[i][0]][j] + '" id="' + content[shape[i][0]][j] + '"></option>';
					}
				}
				hiddenSelect += '</select>';
				$('#fleet-type-create-selects').append(hiddenSelect);

				/* Seen Select */
				let id = i;
				var source = $("#part-selecting-hidden-" + id);
				var selected = source.find("option[selected]");
				if(selected[0] === undefined) {
					selected = $(source.find("option")[0]);
				}
				var options = $("option", source);

				var selw = $("#fleet-type-create-schematic").width();
				var selh = $("#fleet-type-create-schematic").height();
				var w = shape[id][4]/800*selw - 12;
				var h = shape[id][5]/450*selh - 12;
				$("#fleet-type-create-selects").append('<dl id="part-selecting-seen-' + id + '" class="part-selecting dropdown" style="'
					+ 'left: ' + ((shape[id][2])/800)*selw + 'px;'
					+ 'top: ' + ((shape[id][3])/450)*selh + 'px;'
					+ 'width: ' + w + 'px;'
					+ 'height: ' + h + 'px;'
					+ '"></dl>');

				$("#part-selecting-seen-" + id).append('<dt><a href="#" value="' + selected.val()  + '" style="background-image: url(\''+ cdnURL + 'img/units-modules/' + selected.val()  + '.svg\'); background-size: 95%;background-repeat: no-repeat;background-position: left top;display: block;'
						+ 'width: ' + w + 'px;'
						+ 'height: ' + h + 'px;'
						+ '"></a></dt>');
				$("#part-selecting-seen-" + id).append('<dd><ul></ul></dd>')

				options.each(function(){
					$("#part-selecting-seen-" + id + " dd ul").append('<li><a href="#" value="' + $(this).attr('id')  + '" style="background-image: url(\''+ cdnURL + 'img/units-modules/' + $(this).attr('id') + '.svg\'); background-size: 95%;background-repeat: no-repeat;background-position: left top;display: block;'
						+ 'width: ' + w + 'px;'
						+ 'height: ' + h + 'px;'
						+ '"></a></li>');
				});

			   $("#part-selecting-seen-" + id + " dt a").click(function() {
					$("#part-selecting-seen-" + id + " dd ul").toggle();
				});
				$(document).bind('click', function(e) {
					var $clicked = $(e.target);
					if(! $clicked.parents().hasClass("dropdown"))
						$("#part-selecting-seen-" + id + " dd ul").hide();
				});	
				$("#part-selecting-seen-" + id + " dd ul li a").click(function() {
					$("#part-selecting-seen-" + id + " dd ul").hide();
					
					var source = $("#part-selecting-hidden-" + id);
					
					if($(source).attr("parttype") == "sub_propulsion" ||
						$(source).attr("parttype") == "sup_propulsion") {

						var selects = $('#fleet-type-create-selects select[parttype=' + $(source).attr("parttype") +']');
						for(var currSelect=0; currSelect < selects.length; currSelect++) {
							$(selects[currSelect]).val($(this).attr("value"));

							for(var currStyle=0; currStyle<$(this)[0].style.length; currStyle++) {
								$("#" + $(selects[currSelect]).attr('id').split('hidden').join("seen") + " dt a")[0].style[$(this)[0].style[currStyle]] = $(this)[0].style[$(this)[0].style[currStyle]];
							}
						}
					} else {
						source.val($(this).attr("value"));

						for(var currSelect=0; currSelect<$(this)[0].style.length; currSelect++) {
							$("#part-selecting-seen-" + id + " dt a")[0].style[$(this)[0].style[currSelect]] = $(this)[0].style[$(this)[0].style[currSelect]];
						}
					}

					units.updateTypeCreateStats();
				});
			}
		}
		$('#fleet-type-create-schematic').html(svgContent);
	}

	static updateTypeCreateStats() {
		var type  = $("#fleet-type-create-shipType option").filter(":selected").val();
		var shape = $("#fleet-type-create-shipShape option").filter(":selected").val();
		var partList = $('#fleet-type-create-selects select');
		
		var parts = [];

		for(var p=0; p<partList.length; p++) {
			parts.push({
				type: $(partList[p]).attr("parttype"),
				tech: $(partList[p]).find("option:selected").val(),
			});
		}

		units.updateStats("#fleet-type-create-stat", type, shape, parts);
	}

	static updateStats(div, type, shape, parts, note) {
		if(parts === undefined) { parts = []; } // Mines only

		var modules = {
			"sub_propulsion": 0,
			"sup_propulsion": 0,
			"hangar": 0,
		};

		var miss = 0; // @ADD: Calc miss

		// Hide some things if needed
		$(div + ' div').css('display','block');

		for(var i=0; i<parts.length; i++) {
			if(parts[i].tech == "none") { continue; }

			switch(parts[i].type) {
				case "sub_propulsion":
					if(modules['sub_propulsion'] == 0) {
						modules['sub_propulsion'] = 0; // @ADD: Calc subspeed
						modules['sub_propulsion'] *= 1000; // Passage de km en m
					} else {
						modules['sub_propulsion'] *= 1.5;
					}
					break;
				case "sup_propulsion":
					if(modules['sup_propulsion'] == 0) {
						modules['sup_propulsion'] = shipPartsSpeed[parts[i].tech][0]*10000 
							+ shipPartsSpeed[parts[i].tech][1]*100 + shipPartsSpeed[parts[i].tech][2];
						modules['sup_propulsion'] = 30675/(modules['sup_propulsion'] * 3600);
						modules['sup_propulsion'] = modules['sup_propulsion'].toFixed(3);
					} else {
						modules['sup_propulsion'] *= 1.5;
					}
					break;
				case "hangar":
					modules['hangar'] += hangarSize[parts[i].tech];
					miss -= hangarMiss[parts[i].tech];
					break;
				default:
					// Do nothing
			}
		}

		if(modules['sub_propulsion'] == 0) {
			$(div + '-subspeed').css('display','none');
		} else {
			$(div + '-subspeed-val').text(GetBetterUnit(modules['sub_propulsion'],"m/s"));
		}

		if(modules['sup_propulsion'] == 0) {
			$(div + '-supspeed').css('display','none');
		} else {
			$(div + '-supspeed-val').text(modules['sup_propulsion'] + "pc/s");
		}

		if(modules['sup_propulsion'] == 0 && modules['sub_propulsion'] == 0) {
			$(div + '-speed').css('display','none');
		}

		if(type != "SHIP_CARRIER") {
			$(div + '-fcap').css('display','none');
		} else {
			$(div + '-fcap-val').text(modules['hangar']);
		}

		// Calcul des données si données
		if(note === undefined) {
			note = "X.X"; // @ADD: Calc note
		}
		var mass = 0; // @ADD: Calc mass
		
		// Masse
		$(div + '-mass-val').html(GetBetterUnit(mass,"t"));

		// Note
		$(div + '-note-val').text(note); 

		// Miss chance
		$(div + '-miss-val').text(miss + "%");
	}

	static selectUnit(id) {
		units.currUnit = id = (id === undefined)?0:id;
		if(units.list[id] === undefined) { return; }
		$('#fleet-build-name').text(units.list[id].name);

		units.updateStats("#fleet-build-stat", units.list[id].shipType, units.list[id].shipShape, units.list[id].parts, units.list[id].note);

		// Weapons
		var armesText = "";
		if(units.list[id].shipShape.substr(0,14) != "SHIP_WEP_MINES") {
			var armes = {};
			for(var i=0; i<units.list[id].parts.length; i++) {
				if(units.list[id].parts[i].type != "cannon" && units.list[id].parts[i].type != "rocketLauncher") { continue; }
				if(units.list[id].parts[i].tech == "none") { continue; }
				if(armes[units.list[id].parts[i].tech] === undefined) {
					armes[units.list[id].parts[i].tech] = 1;
				} else {
					armes[units.list[id].parts[i].tech]++;
				}
			}
			for(var i in armes) {
				if(armesText != "") { armesText += ", "}
				var translate = fleetTranslate[i];
				if(translate === undefined) {
					translate = fleetTranslate["missile_" + i];
				}
				armesText += armes[i] + "x " + translate;
			}
		}
		if(armesText != "") {
			$('#fleet-build-stat-attack-val').text(armesText);
		} else {
			$('#fleet-build-stat-attack').css('display','none');
		}

		// Shields
		var shieldText = "";
		if(units.list[id].shipShape.substr(0,14) != "SHIP_WEP_MINES") {
			var shields = {};
			for(var i=0; i<units.list[id].parts.length; i++) {
				if(units.list[id].parts[i].type != "shield") { continue; }
				if(units.list[id].parts[i].tech == "none") { continue; }
				if(shields[units.list[id].parts[i].tech] === undefined) {
					shields[units.list[id].parts[i].tech] = 1;
				} else {
					shields[units.list[id].parts[i].tech]++;
				}
			}
			for(var i in shields) {
				if(shieldText != "") { shieldText += ", "}
				shieldText += shields[i] + "x " + fleetTranslate[i];
			}
		}
		if(shieldText != "") {
			$('#fleet-build-stat-shield-val').text(shieldText);
		} else {
			$('#fleet-build-stat-shield').css('display','none');
		}

		// Boutons
		if(units.list[id].shipShape.substr(0,14) == "SHIP_WEP_MINES") {
			$('#fleet-build-type-copy').css('display','none');
			$('#fleet-build-type-delete').css('display','none');
			$('#fleet-build-rename').css('display','none');
		} else {
			$('#fleet-build-type-copy').css('display','inline-block');
			$('#fleet-build-type-delete').css('display','inline-block');
			$('#fleet-build-rename').css('display','inline-block');
		}
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
		var parts = $('#fleet-type-create-selects select');
		for(var i=0; i<parts.length; i++) {
			var name = $(parts[i]).attr('partName');
			var type = $(parts[i]).attr('partType');
			var value =  $(parts[i]).val();

			if(value==undefined || value.split(' ').join('')=="") {
				errors++;
				errorMessage = "SHIP_HAS_EMPTY_FIELD";
				//break;
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
				var content = '<details class="fleet-show-global"><summary class="fleet-show-name">' + orbit[i].name + ' <span class="fleet-show-count">' + totalcount + ' ' + fleetTranslate['unit'] + '</span></summary>'
					+ '<table class="unit-list-table">' + fleetListHeader + '<tbody>';

				for(var allUnitsId=0; allUnitsId<units.list.length; allUnitsId++) {
					var count = -1;
					for(var fleetUnitId=0; fleetUnitId<orbit[i].units.length; fleetUnitId++) {
						if(orbit[i].units[fleetUnitId][0] == units.list[allUnitsId]._id) {
							count = orbit[i].units[fleetUnitId][1];
							break;
						}
					}
					if(count < 0) { continue; }

					content+= "<tr id=\""+ units.list[allUnitsId]._id +"\"><td>" + units.list[allUnitsId].name + "</td><td>" + fleetTranslate[units.list[allUnitsId].shipType] + "</td><td>" + fleetTranslate[units.list[allUnitsId].shipShape] + "</td><td>" + count + "</td><td></td></tr>";
				}

				content += '</tbody></table></details>';

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