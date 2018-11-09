if('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register(cdnURL + 'js/service-worker.js')
		.then(function() { console.log("Service Worker Registered"); });
}