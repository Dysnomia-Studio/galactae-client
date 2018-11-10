importScripts('js/calcConstants.js');

let changed = true;
let changedFiles = [];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('galactae-cache').then(function(cache) {
			return cache.addAll(neededCache);
		})
	);
});

self.addEventListener('message', function(event) {
	console.log("Message recieved !");

	if(event.data.error) {
		console.error("Error while recieving message from main window");
		return;
	}

	if(event.data.version !== undefined) {
		if(localStorage.gameVersion !== undefined) {
			changed = (localStorage.gameVersion !== event.data.version);
		}

		if(changed) {
			console.log("New version detected ! Forcing scripts reload.");
		}

		localStorage.gameVersion = event.data.version;
	}
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		clients.matchAll().then(clients => {
			console.log(clients);
			clients.forEach(client => {
				console.log(client);
				client.postMessage("loaded");
			});
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request).then(function(response) {
		// caches.match() always resolves
		// but in case of success response will have value
		console.info(response);
		console.log(response.url);
		if (response !== undefined && (changed == false || changedFiles.indexOf(reponse.url) !== -1)) {
			return response;
		} else {
			return fetch(event.request).then(function (response) {
				// response may be used only once
				// we need to save clone to put one copy in cache
				// and serve second one
				let responseClone = response.clone();
				
				caches.open('galactae-cache').then(function (cache) {
					cache.put(event.request, responseClone);
					changedFiles.push(responseClone.url);
				});
				return response;
			});
		}
	}));
});