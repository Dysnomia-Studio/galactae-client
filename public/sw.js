importScripts('cdn/js/calcConstants.js');

self.version = 'Beta-0.6.7-rev.200802a';

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
					console.debug('[SW] Deleting old cache: ' + key);
					return caches.delete(key);
				}
			}));
		}).then(() => {
			self.clients.claim();
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request).then(function(response) {
		// caches.match() always resolves
		// but in case of success response will have value
		if (response !== undefined) {
			console.debug('[SW] Use of cache: ' + event.request.url);
			return response;
		}

		return fetch(event.request).then(function(response) {
			if(response.status !== 200 ||
				event.request.method === 'POST' ||
				response.headers.get('Content-Type').indexOf('html') !== -1) {

				return response;
			}

			// response may be used only once
			// we need to save clone to put one copy in cache
			// and serve second one
			const responseClone = response.clone();

			caches.open(self.version).then(function (cache) {
				console.debug('[SW] Add to cache: ' + event.request.url);
				cache.put(event.request, responseClone);
			});

			return response;
		});
	}));
});