'use strict';
var WebApp = null;
var WebAppClass = function() {
	var isDebugOn = true;
	this.getDebugOn = function() {return isDebugOn;};
	this.setDebugOn = function(booleanState) {isDebugOn = booleanState;};
	var isRunning = false;

	// Page settings:
	var pageList = null;
	var pageStack = null;
	var currentPage = null;
	var defaultPageId = null;
	this.getDefaultPageId = function() {return defaultPageId;};
	this.setDefaultPageId = function(pageId) {defaultPageId = pageId;};

	// Transition settings:
	var transitionTypes = ['fade', 'none', 'slide', 'sliderev', 'slideorder'];
	var defaultTransition = transitionTypes[0];
	this.getDefaultTransition = function() {return defaultTransition;};
	this.setDefaultTransition = function(transitionType) {if (!transitionType || transitionTypes.indexOf(transitionType) >= 0) defaultTransition = transitionType;};
	var nextTransition = null;
	this.getNextTransition = function() {return nextTransition;};
	this.setNextTransition = function(transitionType) {if (!transitionType || transitionTypes.indexOf(transitionType) >= 0) nextTransition = transitionType;};

	// API functions:
	this.animateElement = animateElement;

	this.load = function() {
		if (isDebugOn) console.log('WebApp.js: load()');
		if (typeof WebApp['onLoad'] === 'function') WebApp.onLoad();

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
			if (!defaultPageId || (pageList.indexOf(defaultPageId) < 0)) defaultPageId = pageList[0];

			// Setup CSS style effects:
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = styleEffects;
			document.getElementsByTagName('head')[0].appendChild(style);

			// Setup application life cycle callbacks:
			window.onblur = function() {pause();};
			window.onfocus = function() {resume();};
			window.onkeydown = function(arg) {keyDown(arg);};
			window.onresize = function() {resize();};
			window.onunload = function() {unload();};
			resume(); // Required to dispatch initial onResume event.

			// Setup page change listener:
			window.addEventListener('hashchange', updatePage);
			updatePage({'type': 'hashchange', 'newURL': null, 'oldURL': null}); // Required to set initial page.
		}
	};

	function unload() {
		if (isDebugOn) console.log('WebApp.js: unload()');
		if (typeof WebApp['onUnload'] === 'function') WebApp.onUnload();
		if (isRunning) pause();
		currentPage = null;
	}

	function pause() {
		if (isDebugOn) console.log('WebApp.js: pause()');
		if (isRunning) {
			isRunning = false;
			if (typeof WebApp['onPause'] === 'function') WebApp.onPause();
		}
	}

	function resume() {
		if (isDebugOn) console.log('WebApp.js: resume()');
		if (!isRunning) {
			isRunning = true;
			if (typeof WebApp['onResume'] === 'function') WebApp.onResume();
		}
	}

	function resize() {
		if (isDebugOn) console.log('WebApp.js: resize()');
		if (typeof WebApp['onResize'] === 'function') WebApp.onResize();
	}

	function keyDown(keyEvent) {
		if (isDebugOn) console.log('WebApp.js: keyDown(' + keyEvent.keyCode + ')');
		if (keyEvent.keyCode === 13) {
			if (keyEvent.target['onclick']) keyEvent.target.onclick();
		} else {
			if (typeof currentPage['onKeyDown'] === 'function') currentPage.onKeyDown(keyEvent);
		}
	}

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
				switchPage(currentPage, nextPage);
				currentPage = nextPage;
			}
		} else if (currentPage) window.history.back();
		else window.location.replace(window.location.protocol + '//' + window.location.pathname + '#' + defaultPageId);
	}

	function switchPage(current, next) {
		if (!nextTransition) nextTransition = defaultTransition;
		if (nextTransition === 'slideorder') {
			nextTransition = (current && pageList.indexOf(current.id) > pageList.indexOf(next.id))? ' sliderev': ' slide';
		}

		if (nextTransition === 'none') {
			if (current) hidePage(current);
			showPage(next);
			nextTransition = null;
		} else {
			function showNext() {
				animateElement(next, nextTransition + 'in', null);
				showPage(next);
				nextTransition = null;
			}
			if (current) {
				animateElement(current, nextTransition + 'out', function() {
					hidePage(current);
					showNext();
				});
			} else showNext();
		}
	}

	function animateElement(element, animation, callback) {
		var animationRunning = true;
		function animationEnded() {
			animationRunning = false;
			element.removeEventListener('animationend', animationEnded);
			element.className = element.className.replace(new RegExp('(?:^|\\s)' + animation + '(?!\\S)', 'g'), '');
			if (typeof callback === 'function') callback();
		}
		setTimeout(function() {if (animationRunning) animationEnded();}, 1000);
		element.addEventListener('animationend', animationEnded);
		element.className += ' ' + animation;
	}

	function showPage(page) {
		page.style.display = page['styleDisplay'] || 'block';
		if (typeof page['onShow'] === 'function') page.onShow();
	}

	function hidePage(page) {
		if (typeof page['onHide'] === 'function') page.onHide();
		page.style.display = 'none';
	}

};
WebApp = new WebAppClass();
document.addEventListener('DOMContentLoaded', function() {WebApp.load();});

var styleEffects = '\
    /* Animation Effects (based on jquery.mobile-1.4.5). */\
	@keyframes fadein {from {opacity: 0;} to {opacity: 1;}}\
	@keyframes fadeout {from {opacity: 1;} to {opacity: 0;}}\
	.fadeout {opacity: 0; animation-duration: 125ms; animation-name: fadeout;}\
	.fadein {opacity: 1; animation-duration: 225ms; animation-name: fadein;}\
	@keyframes slideinfromright {from {transform: translateX(100%);} to {transform: translateX(0);}}\
	@keyframes slideinfromleft {from {transform: translateX(-100%);} to {transform: translateX(0);}}\
	@keyframes slideouttoleft {from {transform: translateX(0);} to {transform: translateX(-100%);}}\
	@keyframes slideouttoright {from {transform: translateX(0);} to {transform: translateX(100%);}}\
	.slidein, .sliderevin {animation-timing-function: ease-out; animation-duration: 225ms;}\
	.slideout, .sliderevout {animation-timing-function: ease-in; animation-duration: 125ms;}\
	.slideout {transform: translateX(-100%); animation-name: slideouttoleft;}\
	.slidein {transform: translateX(0); animation-name: slideinfromright;}\
	.sliderevout {transform: translateX(100%); animation-name: slideouttoright;}\
	.sliderevin {transform: translateX(0); animation-name: slideinfromleft;}\
';
