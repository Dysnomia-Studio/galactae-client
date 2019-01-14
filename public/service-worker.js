importScripts('cdn/js/calcConstants.js');

self.version = 'Alpha-0.5.7-rev.190114b';

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
			return Promise.all(keyList.map(function(key) {
				console.log(self.version);
				console.log(key);
				console.log(self.version !== key);
				if (self.version !== key) {
					console.info('[SW] Deleting old cache: ' + self.version);
					return caches.delete(keyList[key]);
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
			return response;
		} else {
			return fetch(event.request).then(function(response) {
				if(response.status !== 200 ||
					event.request.method === "POST" ||
					response.headers.get('Content-Type').indexOf("html") !== -1) { 
					
						return response; 
				}
				
				// response may be used only once
				// we need to save clone to put one copy in cache
				// and serve second one
				let responseClone = response.clone();

				caches.open(self.version).then(function (cache) {
					cache.put(event.request, responseClone);
				});

				return response;
			});
		}
	}));
});