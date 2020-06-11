importScripts('cdn/js/calcConstants.js');

self.version = 'Beta-0.6.7-rev.200611b';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(self.version).then(function(cache) {
			// Return cache
			return cache.addAll(neededCache);
		})
	);
});

this.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.allSettled(keyList.map(function(key) {
				if (self.version !== key) {
					console.log('[SW] Deleting old cache: ' + key);
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request).then(function(response) {
		// caches.match() always resolves
		// but in case of success response will have value
		if (response !== undefined) {
			console.log('Use of cached resource !');
			console.log(event.request);
			console.log('------------------------');
			return response;
		}

		console.log('Fetch resource !');
		console.log(event.request);
		console.log('------------------------');

		return fetch(event.request).then(function(response) {
			if(response.status !== 200 ||
				event.request.method === 'POST' ||
				response.headers.get('Content-Type').indexOf('html') !== -1) {

				console.log('------------------------');
				console.log(event.request);
				console.log('Do not cache it');
				console.log('------------------------');

				return response;
			}

			console.log('------------------------');
			console.log(event.request);
			console.log('Cache it');
			console.log('------------------------');

			// response may be used only once
			// we need to save clone to put one copy in cache
			// and serve second one
			const responseClone = response.clone();

			caches.open(self.version).then(function (cache) {
				cache.put(event.request, responseClone);
			});

			return response;
		});
	}));
});