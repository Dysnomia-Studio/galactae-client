importScripts('cdn/js/calcConstants.js');

let version = 'Alpha-0.5.7-rev.190114b';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(version).then(function(cache) {
			// Return cache
			return cache.addAll(neededCache);
		})
	);
});

this.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (version !== key) {
					console.info('[SW] Deleting old cache: ' + version);
					return caches.delete(keyList[i]);
				}
			}));
		})
	);
});

self.addEventListener('message', function(data) {
	console.info('[SW] Version: ' + data.data.version);
	version = data.data.version;
});

self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request).then(function(response) {
		// caches.match() always resolves
		// but in case of success response will have value
		if (response !== undefined) {
			return response;
		} else {
			return fetch(event.request).then(function(response) {
				// response may be used only once
				// we need to save clone to put one copy in cache
				// and serve second one
				let responseClone = response.clone();

				caches.open(version).then(function (cache) {
					cache.put(event.request, responseClone);
				});

				return response;
			});
		}
	}));
});