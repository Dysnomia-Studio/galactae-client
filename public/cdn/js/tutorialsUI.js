class TutorialsUI {
	static loadUI() {
		document.getElementById('tutorial-panel-ok').addEventListener('click', () => {
			if(Tutorials.hasCompletedTutorial(TutorialsUI.currTutorial, userData, planetData)) {
				socket.emit('tutorial-confirm', {
					id: userData.id,
					username: userData.username,
					tutorial: TutorialsUI.currTutorial,
				});
			} else {
				notifications.notifyOnGame(
					'tutorial',
					translate.tutorials[TutorialsUI.currTutorial + '-title'],
					{ id: 'tutorial-' + TutorialsUI.currTutorial }
				);
			}

			ui.hide('#tutorial-panel');
		});
	}

	static newTutorial(type) {
		TutorialsUI.currTutorial = type;

		//@TODO: draw yellow outline on buildings needs to be build

		TutorialsUI.openTutorialPanel();

		TutorialsUI.highlightButtons();
	}

	static openTutorialPanel() {
		const notif = document.getElementsByClassName('notif-tutorial')[0];
		if(notif) {
			notif.parentNode.removeChild(notif);
		}

		document.getElementById('tutorial-panel-title').innerText = translate.tutorials[TutorialsUI.currTutorial + '-title'];

		document.getElementById('tutorial-panel-desc').innerText =
			translate.tutorials[TutorialsUI.currTutorial + '-desc']
				.replace(/{PlayerName}/g, userData.username);

		const objectivesUL = document.getElementById('tutorial-panel-objectives');
		while(objectivesUL.firstChild) {
			objectivesUL.removeChild(objectivesUL.firstChild);
		}
		for(let currTutorial = 0; currTutorial < tutorialObjectives[TutorialsUI.currTutorial].length; currTutorial++) {
			const listElt = document.createElement('li');
			listElt.innerText = translate.tutorials[TutorialsUI.currTutorial + '-objective-' + currTutorial];
			//@TODO: draw done objectives

			objectivesUL.appendChild(listElt);
		}

		setTimeout(() => {
			ui.show('#tutorial-panel');
		}, 100);
	}

	static highlightButtons() {
		Array.from(document.getElementsByClassName('tutorial-active')).forEach((elt) => {
			elt.classList.remove('tutorial-active');
		});

		for(const objective of tutorialObjectives[TutorialsUI.currTutorial]) {
			switch(objective.type) {
				case 'building':
					document.getElementById(buildingsNames[objective.building]).classList.add('tutorial-active');
					document.getElementById(buildingsNames[objective.building]).addEventListener('click', function() {
						this.classList.remove('tutorial-active');
					});
					break;
				case 'research':
					document.getElementById('hud-bottom-button-research').classList.add('tutorial-active');
					document.getElementById('hud-bottom-button-research').addEventListener('click', function() {
						this.classList.remove('tutorial-active');
					});
					break;
				//@TODO do other objectives types
				default:
			}
		}
	}
}