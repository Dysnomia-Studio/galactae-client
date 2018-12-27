importScripts('cdn/js/calcConstants.js');

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
	console.info('[SW] Changed: ' + data.data.change);
	changed = data.data.change;
});

self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request).then(function(response) {
		// caches.match() always resolves
		// but in case of success response will have value

		let whitelisted = ['png','jpg','svg'];
		if (response !== undefined && (changed == false 
			|| changedFiles.indexOf(response.url) !== -1 
			|| whitelisted.indexOf(response.url.substr(-3)) !== -1) 
			&& response.headers.get('Content-Type').indexOf('html') === -1) {

			// Mise à jour sur cette session
			if(changed && changedFiles.indexOf(response.url) === -1) {
				fetch(event.request).then(function (response) {
					if(response.status !== 200 || event.request.method === "POST") { return; }

					caches.open('galactae-cache').then(function (cache) {
						cache.put(event.request, response);
						changedFiles.push(response.url);
					});
				});
			}

			return response;
		} else {
			return fetch(event.request).then(function (response) {
				if(response.status !== 200 
					|| event.request.method === "POST" 
					|| response.headers.get('Content-Type').indexOf("html") !== -1) { 
					
						return response; 
				}

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