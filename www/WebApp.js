'use strict';
var WebApp = null;
var WebAppClass = function() {
	var isDebugOn = true;
	this.getDebugOn = function() {return isDebugOn;};
	this.setDebugOn = function(state) {isDebugOn = state;};

	var isSlideModeOn = false;
	this.getSlideModeOn = function() {return isSlideModeOn;};
	this.setSlideModeOn = function(state) {isSlideModeOn = state;};

	var isTransitionOn = true;
	this.getTransitionOn = function() {return isTransitionOn;};
	this.setTransitionOn = function(state) {isTransitionOn = state;};

	var pageList = null;
	var pageStack = null;
	var currentPage = null;

	var defaultPageId = null;
	this.getDefaultPageId = function() {return defaultPageId;};
	this.setDefaultPageId = function(pageId) {defaultPageId = pageId;};

	this.load = function() {
		if (isDebugOn) console.log('WebApp.js: load()');

		// Setup page elements:
		if (!pageStack) {
			pageStack = {};
			Array.prototype.forEach.call(document.body.children, function (node) {
				if (node.classList.contains('page') && node.id) {
					node.styleDisplay = node.style.display;
					node.style.display = 'none';
					pageStack[node.id] = node;
					if (typeof node['onLoad'] === 'function') node.onLoad();
				}
			});
			pageList = Object.keys(pageStack);
			if (!defaultPageId) defaultPageId = pageList[0];

			// Setup CSS style effects:
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = '\
				@keyframes fadein {from {opacity: 0;} to {opacity: 1;}}\
				@keyframes fadeout {from {opacity: 1;} to {opacity: 0;}}\
				.fadeout {opacity: 0; animation-duration: 125ms; animation-name: fadeout;}\
				.fadein {opacity: 1; animation-duration: 225ms; animation-name: fadein;}\
				@keyframes slideinfromright {from {transform: translateX(100%);} to {transform: translateX(0);}}\
				@keyframes slideinfromleft {from {transform: translateX(-100%);} to {transform: translateX(0);}}\
				@keyframes slideouttoleft {from {transform: translateX(0);} to {transform: translateX(-100%);}}\
				@keyframes slideouttoright {from {transform: translateX(0);} to {transform: translateX(100%);}}\
				.slideout, .slidein, .slideoutrev, .slideinrev {animation-timing-function: ease-out; animation-duration: 350ms;}\
				.slideout {transform: translateX(-100%); animation-name: slideouttoleft;}\
				.slidein {transform: translateX(0); animation-name: slideinfromright;}\
				.slideoutrev {transform: translateX(100%); animation-name: slideouttoright;}\
				.slideinrev {transform: translateX(0); animation-name: slideinfromleft;}\
			';
			document.getElementsByTagName('head')[0].appendChild(style);

			// Setup page change listener:
			window.addEventListener('hashchange', updatePage);
			updatePage({'type': 'hashchange', 'newURL': null, 'oldURL': null}); // Required to set initial page.
		}
	};

	function updatePage(hashChangeEvent) {
		if (isDebugOn) console.log('WebApp.js: updatePage(hashChangeEvent)... newURL = ' + hashChangeEvent.newURL + ', oldURL = ' + hashChangeEvent.oldURL);

		// Parse URL data:
		var nextSearch = (window.location.hash.indexOf('?') >= 0)? window.location.hash.substring(window.location.hash.indexOf('?') + 1): null;
		var nextHash = (window.location.hash.length > 1)? window.location.hash.substring(1, (nextSearch? window.location.hash.indexOf('?'): window.location.hash.length)): null;
		var nextPage = (nextHash && pageStack[nextHash])? pageStack[nextHash]: null;

		// Parse URL parameters:
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

		// Execute update action:
		if (nextPage) {
			if (nextPage === currentPage) {
				// TODO: implement URL parameters updated engine.
			} else {
				switchElement(currentPage, nextPage);
				currentPage = nextPage;
			}
		} else if (currentPage) window.history.back();
		else window.location.replace(window.location.protocol + '//' + window.location.pathname + '#' + defaultPageId);
	}

	function switchElement(currentElement, nextElement) {
		if (isTransitionOn) {
			if (currentElement) hideElement(currentElement);
			if (isSlideModeOn) {
				var slideClass = (currentElement && pageList.indexOf(currentElement.id) > pageList.indexOf(nextElement.id))? ' slideinrev': ' slidein';
				nextElement.className += slideClass;
			} else nextElement.className += ' fadein';
			showElement(nextElement);
		} else {
			if (currentElement) hideElement(currentElement);
			showElement(nextElement);
		}
	}

	function showElement(element) {
		element.style.display = element['styleDisplay'] || 'block';
		if (typeof element['onShow'] === 'function') element.onShow();
	}

	function hideElement(element) {
		if (typeof element['onHide'] === 'function') element.onHide();
		element.style.display = 'none';
		element.className = element.className.replace( /(?:^|\s)fadein|slidein|slideinrev(?!\S)/g , '' );
	}

};
WebApp = new WebAppClass();
document.addEventListener('DOMContentLoaded', function() {WebApp.load();});
