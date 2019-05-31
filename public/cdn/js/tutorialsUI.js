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

		userData = Tutorials.updateTutorialList(userData, planetData);

		//@TODO: draw yellow outline on buildings needs to be build

		TutorialsUI.openTutorialPanel();
	}

	static openTutorialPanel() {
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
}