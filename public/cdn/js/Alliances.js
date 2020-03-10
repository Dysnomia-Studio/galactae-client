class Alliances {
	static loadUI() {
		document.getElementById('alliances-close').addEventListener('click', () => {
			ui.hide('#alliances-panel');
		});

		// Menu
		// @TODO: refacto to group up with fleet tabs
		document.querySelectorAll('#alliances-panel .ul-choice-line li').forEach(function(elt) {
			elt.addEventListener('click', () => {
				ui.toggleClass('#alliances-panel .ul-choice-line .ul-choice-line-li-active', 'ul-choice-line-li-active', elt);

				const buttonList = [
					'alliances-panel-info',
					'alliances-panel-members',
					'alliances-panel-newMembers',
					'alliances-panel-diplomacy',
				];

				for(const buttonName of buttonList) {
					if(elt.id === buttonName + '-button') {
						ui.show('#' + buttonName);
					} else {
						ui.hide('#' + buttonName);
					}
				}
			});
		});
	}

	static updateDetails(newAllyDetails) {
		Alliances.details = newAllyDetails;
		console.log(Alliances.details);

		Alliances.writeDetails();
		Alliances.writeMembers();
	}

	static writeDetails() {
		document.getElementById('alliances-panel-info-name').innerText = Alliances.details.name;
		document.getElementById('alliances-panel-info-desc').innerText = Alliances.details.description;
		document.getElementById('alliances-panel-info-membersCount').innerText = Alliances.details.members.length;
	}

	static writeMembers() {
		ui.empty('#alliances-panel-members-list');

		const tbody = document.getElementById('alliances-panel-members-list');
		const permsList = [
			'founder',
			'leader',
			'diplomacy',
		];
		const currUser = Alliances.details.members.filter((user) => user.name === userData.username)[0];

		for(const player of Alliances.details.members) {
			const tr = document.createElement('tr');

			// Name
			const tdName = document.createElement('td');
			tdName.innerText = player.name;
			tr.append(tdName);

			// Perms
			for(const perm of permsList) {
				const checkBox = document.createElement('input');
				checkBox.setAttribute('type', 'radio');
				checkBox.setAttribute('permType', perm);

				if(player[perm]) {
					checkBox.setAttribute('checked', true);
				}

				if(currUser.founder || (currUser.leader && !player.founder && !player.leader)) {
					checkBox.setAttribute('disabled', true);
				}

				// TODO: set checkbox value
				// TODO: disable if no perm

				const tdCheckBox = document.createElement('td');
				tdCheckBox.append(checkBox);

				tr.append(tdCheckBox);
			}


			tbody.append(tr);
		}
	}
}