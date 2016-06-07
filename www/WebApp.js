'use strict';

var pages = [];
var page = null;

document.addEventListener('DOMContentLoaded', load);

function load() {
	console.log('WebApp.js: load()');

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
	console.log('WebApp.js: updatePage(hashChangeEvent)... newURL = ' + hashChangeEvent.newURL + ', oldURL = ' + hashChangeEvent.oldURL);

	// Parse page URL (hash/search) data:
	var newPageSearch = (window.location.hash.indexOf('?') >= 0)? window.location.hash.substring(window.location.hash.indexOf('?') + 1): null;
	var newPageHash = (window.location.hash.length > 1)? window.location.hash.substring(1, (newPageSearch? window.location.hash.indexOf('?'): window.location.hash.length)): null;

	// Query for the new requested page (pageHash):
	var newPage = null;
	if (newPageHash) {
		for (var i = 0; i < pages.length; i++) {
			if (pages[i].id === newPageHash) {
				newPage = pages[i];
				break;
			}
		}
	}

	// Parse the new requested parameters (pageSearch):
	var newParams = {};
	if (newPageSearch) {
		var indexOfEqual = null;
		newPageSearch = newPageSearch.split('&');
		newPageSearch.forEach(function(param) {
			indexOfEqual = param.indexOf('=');
			if (indexOfEqual > 0) {
				newParams[param.slice(0, indexOfEqual)] = param.slice(indexOfEqual + 1, param.length)
			}
		});
	}

	if (newPage) {
		if (newPage === page) {
			// TODO: implement URL parameters updated engine.
		} else {
			switchPage(page, newPage, newParams['transition'], newParams['display']);
			page = newPage;
		}
	} else if (page) window.history.back();
	else window.location.replace(window.location.protocol + '//' + window.location.pathname + '#' + pages[0].id);
}

function switchPage(page, newPage, transition, display) {
	switch (transition) {
	case 'fade':
		if (page) {
			fadeOut(page, 'none', function() {
				fadeIn(newPage, display, null);
			});
		} else fadeIn(newPage, display, null);
		break;
	default:
		if (page) page.style.display = 'none';
		newPage.style.display = display || 'block';
		newPage.style.opacity = 1;
		break;
	}
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
