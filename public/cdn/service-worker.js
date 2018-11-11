importScripts('js/calcConstants.js');

let changed = -1;
let changedFiles = [];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('galactae-cache').then(function(cache) {
			// Return cache
			return cache.addAll(neededCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	console.log("fetch");
	event.respondWith(caches.match(event.request).then(function(response) {
		if(changed === -1) {
			changed = (localStorage.gameVersion !== localStorage.newVersion);
			localStorage.gameVersion = localStorage.newVersion;
		}

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