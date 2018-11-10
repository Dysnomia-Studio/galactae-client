importScripts('js/calcConstants.js');

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('galactae-cache').then(function(cache) {
			return cache.addAll(imgCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request).then(function(response) {
		// caches.match() always resolves
		// but in case of success response will have value
		console.info(response);
		if (response !== undefined) {
			return response;
		} else {
			return fetch(event.request).then(function (response) {
				// response may be used only once
				// we need to save clone to put one copy in cache
				// and serve second one
				let responseClone = response.clone();
				
				caches.open('galactae-cache').then(function (cache) {
					cache.put(event.request, responseClone);
				});
				return response;
			});
		}
	}));
});