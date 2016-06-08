'use strict';

var isDebugOn = true;
var isFadeOn = true;

var pages = [];
var currentPage = null;

document.addEventListener('DOMContentLoaded', load);

function load() {
	if (isDebugOn) console.log('WebApp.js: load()');

	// Setup page elements:
	Array.prototype.forEach.call(document.body.children, function (node) {
		if (node.classList.contains('page')) {
			node.styleDisplay = node.style.display;
			node.style.opacity = node.styleOpacity;
			node.style.display = 'none';
			pages[pages.length] = node;
		}
	});

	// Setup page change listener:
	window.addEventListener('hashchange', updatePage);
	updatePage({'type': 'hashchange', 'newURL': null, 'oldURL': null}); // Required to set initial page.
}

function updatePage(hashChangeEvent) {
	if (isDebugOn) console.log('WebApp.js: updatePage(hashChangeEvent)... newURL = ' + hashChangeEvent.newURL + ', oldURL = ' + hashChangeEvent.oldURL);

	// Parse page URL (hash/search) data:
	var nextSearch = (window.location.hash.indexOf('?') >= 0)? window.location.hash.substring(window.location.hash.indexOf('?') + 1): null;
	var nextHash = (window.location.hash.length > 1)? window.location.hash.substring(1, (nextSearch? window.location.hash.indexOf('?'): window.location.hash.length)): null;

	// Query for the requested page (pageHash):
	var nextPage = null;
	if (nextHash) {
		for (var i = 0; i < pages.length; i++) {
			if (pages[i].id === nextHash) {
				nextPage = pages[i];
				break;
			}
		}
	}

	// Parse the requested parameters (pageSearch):
	var nextParams = {};
	if (nextSearch) {
		var indexOfEqual = null;
		nextSearch = nextSearch.split('&');
		nextSearch.forEach(function(param) {
			indexOfEqual = param.indexOf('=');
			if (indexOfEqual > 0) {
				nextParams[param.slice(0, indexOfEqual)] = param.slice(indexOfEqual + 1, param.length);
			}
		});
	}

	if (nextPage) {
		if (nextPage === currentPage) {
			// TODO: implement URL parameters updated engine.
		} else {
			if (isFadeOn) {
				if (currentPage) {
					fadeOut(currentPage, function() {
						fadeIn(nextPage, null);
					});
				} else fadeIn(nextPage, null);
			} else {
				if (currentPage) currentPage.style.display = 'none';
				nextPage.style.display = nextPage['styleDisplay'] || 'block';
			}
			currentPage = nextPage;
		}
	} else if (currentPage) window.history.back();
	else window.location.replace(window.location.protocol + '//' + window.location.pathname + '#' + pages[0].id);
}

function fadeOut(element, callback) {
	(function fade() {
		if ((element.style.opacity -= .2) < 0) {
			element.style.display = 'none';
			element.style.opacity = element['styleOpacity'] || 1;
			if (typeof callback === 'function') callback();
		} else {
			requestAnimationFrame(fade);
		}
	})();
}

function fadeIn(element, callback) {
	element.style.opacity = 0;
	element.style.display = element['styleDisplay'] || 'block';
	(function fade() {
		var val = parseFloat(element.style.opacity);
		if ((val += .2) > (element['styleOpacity'] || 1)) {
			element.style.opacity = element['styleOpacity'] || 1;
			if (typeof callback === 'function') callback();
		} else {
			element.style.opacity = val;
			requestAnimationFrame(fade);
		}
	})();
}
