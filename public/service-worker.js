importScripts('js/calcConstants.js');

let changed = true;
let changedFiles = [];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('galactae-cache').then(function(cache) {
			// Return cache
			return cache.addAll(neededCache);
		})
	);
});

self.addEventListener('message', function(data) {
	console.log('Message:');
	console.info(data);
});

self.addEventListener('fetch', function(event) {
	console.log("fetch");
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