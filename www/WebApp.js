'use strict';

var pages = [];
var page = null;

document.addEventListener('DOMContentLoaded', load);

function load() {
	console.log('upsky.pagemanager.js: load()');

	// Setup page elements:
	Array.prototype.forEach.call(document.body.children, function (node) {
		if (node.classList.contains('page')) {
			node.style.display = 'none';
			pages[pages.length] = node;
		}
	});

	// Setup page change listener:
	window.addEventListener('hashchange', updatePage);
	updatePage({'type': 'hashchange', 'newURL': null, 'oldURL': null}); // Required to set initial page.
}

function updatePage(hashChangeEvent) {
	console.log('upsky.pagemanager.js: updatePage(hashChangeEvent)... newURL = ' + hashChangeEvent.newURL + ', oldURL = ' + hashChangeEvent.oldURL);

	var newPage = null;
	if (window.location.hash.length > 0) {
		for (var i = 0; i < pages.length; i++) {
			if (pages[i].id == window.location.hash.substr(1)) {
				newPage = pages[i];
				break;
			}
		}
	}

	if (newPage) {
		if (page) {
			fadeOut(page, null, function() {
				fadeIn(newPage, null, null);
			});
		} else fadeIn(newPage, null, null);
		page = newPage;
	} else if (page) window.history.back();
	else window.location.replace(window.location.protocol + '//' + window.location.pathname + '#' + pages[0].id);
}

function fadeOut(element, display, callback){
	element.style.opacity = 1;
	(function fade() {
		if ((element.style.opacity -= .2) < 0) {
			element.style.display = display || 'none';
			if (typeof callback === 'function') callback();
		} else {
			requestAnimationFrame(fade);
		}
	})();
}

function fadeIn(element, display, callback){
	element.style.opacity = 0;
	element.style.display = display || 'block';
	(function fade() {
		var val = parseFloat(element.style.opacity);
		if ((val += .2) > 1) {
			if (typeof callback === 'function') callback();
		} else {
			element.style.opacity = val;
			requestAnimationFrame(fade);
		}
	})();
}
