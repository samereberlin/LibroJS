/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var WebApp = null;
var WebAppClass = function() {

	//################################################################################//
	// Platform settings:

	var isLogEnabled = true;

	//################################################################################//
	// Platform API:

	/**
	 * Returns the log enabled boolean state,
	 * which is responsible to show/hide WebApp console.log messages.
	 *
	 * @return {boolean} The log enabled boolean state.
	 */
	this.isLogEnabled = function() {
		return isLogEnabled;
	};

	/**
	 * Set the log enabled boolean state,
	 * which is responsible to show/hide WebApp console.log messages.
	 *
	 * @param {boolean} booleanState - The desired log enabled boolean state.
	 */
	this.setLogEnabled = function(booleanState) {
		isLogEnabled = booleanState;
	};

	//################################################################################//
	// Application settings:

	var isRunning = false;

	//################################################################################//
	// Application API:

	/**
	 * Returns the running boolean state,
	 * which represents the current status of WebApp.
	 *
	 * @return {boolean} The running boolean state.
	 */
	this.isRunning = function() {
		return isRunning;
	};

	/**
	 * Set the running boolean state,
	 * which represents the current status of WebApp.
	 *
	 * @param {boolean} booleanState - The desired running boolean state.
	 */
	this.setRunning = function(booleanState) {
		if (booleanState) resume();
		else pause();
	};

	//################################################################################//
	// Page settings:

	var pageList = null;
	var pageStack = null;
	var currentPage = null;
	var currentSearch = null;
	var defaultPageId = null;

	//################################################################################//
	// Page API:

	/**
	 * Get the default page id string value,
	 * which must be shown in the first request to the basic URL
	 * (default value: the first body's child class page element id).
	 *
	 * @return {string} The default page id string value.
	 */
	this.getDefaultPageId = function() {
		return defaultPageId;
	};

	/**
	 * Set the default page id string value,
	 * which must be shown in the first request to the basic URL
	 * (default value: the first body's child class page element id).
	 *
	 * @param {string} pageId - The desired default page id string value.
	 */
	this.setDefaultPageId = function(pageId) {
		defaultPageId = pageId;
	};

	//################################################################################//
	// Animation/Transition settings:

	var styleRules = '\
		/* Animation Effects (based on jquery.mobile-1.4.5). */\
		@keyframes fadein {from {opacity: 0;} to {opacity: 1;}}\
		@keyframes fadeout {from {opacity: 1;} to {opacity: 0;}}\
		.fadein {animation-name: fadein; animation-duration: 225ms; opacity: 1;}\
		.fadeout {animation-name: fadeout; animation-duration: 125ms; opacity: 0;}\
		@keyframes popin {from {transform: scale(.8); opacity: 0;} to {transform: scale(1); opacity: 1;}}\
		@keyframes popout {from {transform: scale(1); opacity: 1;} to {transform: scale(.8); opacity: 0;}}\
		.popin {animation-name: popin; animation-duration: 225ms; animation-timing-function: ease-out; opacity: 1;}\
		.popout {animation-name: popout; animation-duration: 125ms; animation-timing-function: ease-in; opacity: 0;}\
		@keyframes flipin {from {transform: matrix(0.2,0.2,0,1,0,0); opacity: 0;} to {transform: matrix(1,0,0,1,0,0); opacity: 1;}}\
		@keyframes flipout {from {transform: matrix(1,0,0,1,0,0); opacity: 1;} to {transform: matrix(0.2,-0.2,0,1,0,0); opacity: 0;}}\
		@keyframes fliprevin {from {transform: matrix(0.2,-0.2,0,1,0,0); opacity: 0;} to {transform: matrix(1,0,0,1,0,0); opacity: 1;}}\
		@keyframes fliprevout {from {transform: matrix(1,0,0,1,0,0); opacity: 1;} to {transform: matrix(0.2,0.2,0,1,0,0); opacity: 0;}}\
		.flipin, .fliprevin {animation-duration: 225ms; animation-timing-function: ease-out;}\
		.flipout, .fliprevout {animation-duration: 125ms; animation-timing-function: ease-in;}\
		.flipin {animation-name: flipin; opacity: 1;}\
		.flipout {animation-name: flipout; opacity: 0;}\
		.fliprevin {animation-name: fliprevin; opacity: 1;}\
		.fliprevout {animation-name: fliprevout; opacity: 0;}\
		@keyframes slidein {from {transform: translateX(100%);} to {transform: translateX(0);}}\
		@keyframes sliderevin {from {transform: translateX(-100%);} to {transform: translateX(0);}}\
		@keyframes sliderevout {from {transform: translateX(0);} to {transform: translateX(100%);}}\
		@keyframes slideout {from {transform: translateX(0);} to {transform: translateX(-100%);}}\
		.slidein, .sliderevin {animation-duration: 225ms; animation-timing-function: ease-out;}\
		.slideout, .sliderevout {animation-duration: 125ms; animation-timing-function: ease-in;}\
		.slidein {animation-name: slidein; transform: translateX(0);}\
		.slideout {animation-name: slideout; transform: translateX(-100%);}\
		.sliderevin {animation-name: sliderevin; transform: translateX(0);}\
		.sliderevout {animation-name: sliderevout; transform: translateX(100%);}\
	';
	var animationTypes = ['fadein', 'fadeout', 'popin', 'popout', 'flipin', 'flipout', 'fliprevin', 'fliprevout', 'slidein', 'slideout', 'sliderevin', 'sliderevout'];
	var transitionTypes = ['none', 'fade', 'pop', 'flip', 'fliprev', 'fliporder', 'slide', 'sliderev', 'slideorder'];
	var defaultTransition = transitionTypes[1];
	var nextTransition = null;

	//################################################################################//
	// Animation/Transition API:

	/**
	 * Animate a node element, according to the supplied animation type (@see getAnimationTypes).
	 *
	 * @param {node} element - The node element to be animated.
	 * @param {string} animation - The animation type to be applied.
	 * @param {function} callback - The function callback to be invoked after animation.
	 */
	this.animateElement = function(element, animation, callback) {
		if (element && element.nodeType === 1 && animation && animationTypes.indexOf(animation) >= 0) animateElement(element, animation, callback);
	};

	/**
	 * Get the available animation types, to be applied on node elements (@see animateElement).
	 *
	 * @return {array} An array containing the available animation types.
	 */
	this.getAnimationTypes = function() {
		return animationTypes;
	};

	/**
	 * Get the available transition types, to be used between page switching.
	 *
	 * @return {array} An array containing the available transition types.
	 */
	this.getTransitionTypes = function() {
		return transitionTypes;
	};

	/**
	 * Get the default transition type, to be used between every page switching.
	 *
	 * @return {string} The default transition type.
	 */
	this.getDefaultTransition = function() {
		return defaultTransition;
	};

	/**
	 * Set the default transition type, to be used between every page switching.
	 *
	 * @param {string} transitionType - The default transition type.
	 */
	this.setDefaultTransition = function(transitionType) {
		if (transitionType && transitionTypes.indexOf(transitionType) >= 0) defaultTransition = transitionType;
	};

	/**
	 * Get the next transition type, to be used between the next page switching only.
	 *
	 * @return {string} The next transition type.
	 */
	this.getNextTransition = function() {
		return nextTransition;
	};

	/**
	 * Set the next transition type, to be used between the next page switching only.
	 *
	 * @param {string} transitionType - The next transition type.
	 */
	this.setNextTransition = function(transitionType) {
		if (transitionType && transitionTypes.indexOf(transitionType) >= 0) nextTransition = transitionType;
	};

	//################################################################################//
	// Functions related to application life cycle:

	this.load = function() {
		if (isLogEnabled) console.log('WebApp.js: load()');
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
			style.innerHTML = styleRules;
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
		if (isLogEnabled) console.log('WebApp.js: unload()');
		if (typeof WebApp['onUnload'] === 'function') WebApp.onUnload();
		if (isRunning) pause();
		currentPage = null;
	}

	function pause() {
		if (isLogEnabled) console.log('WebApp.js: pause()');
		if (isRunning) {
			isRunning = false;
			if (typeof WebApp['onPause'] === 'function') WebApp.onPause();
		}
	}

	function resume() {
		if (isLogEnabled) console.log('WebApp.js: resume()');
		if (!isRunning) {
			isRunning = true;
			if (typeof WebApp['onResume'] === 'function') WebApp.onResume();
		}
	}

	//################################################################################//
	// Functions related to application settings:

	function resize() {
		if (isLogEnabled) console.log('WebApp.js: resize()');
		if (typeof WebApp['onResize'] === 'function') WebApp.onResize();
	}

	//################################################################################//
	// Functions related to internal actions:

	function updatePage(hashChangeEvent) {
		if (isLogEnabled) console.log('WebApp.js: updatePage(hashChangeEvent)... newURL = ' + hashChangeEvent.newURL + ', oldURL = ' + hashChangeEvent.oldURL);

		// Parse URL data:
		var nextSearch = (window.location.hash.indexOf('?') >= 0)? window.location.hash.substring(window.location.hash.indexOf('?') + 1): "";
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
				if (typeof currentPage['onSearchChange'] === 'function') currentPage.onSearchChange(nextSearch);
			} else {
				switchPage(currentPage, nextPage, nextSearch);
				currentPage = nextPage;
			}
		} else if (currentPage) window.history.back();
		else if (defaultPageId) window.location.replace(window.location.protocol + '//' + window.location.pathname + '#' + defaultPageId);
		currentSearch = nextSearch;
	}

	function switchPage(current, next, search) {
		if (!nextTransition) nextTransition = defaultTransition;
		if (nextTransition === 'fliporder') {
			nextTransition = (current && pageList.indexOf(current.id) > pageList.indexOf(next.id))? 'fliprev': 'flip';
		} else if (nextTransition === 'slideorder') {
			nextTransition = (current && pageList.indexOf(current.id) > pageList.indexOf(next.id))? 'sliderev': 'slide';
		}

		if (nextTransition === 'none') {
			if (current) hidePage(current);
			showPage(next, search);
			nextTransition = null;
		} else {
			var showNext = function() {
				animateElement(next, nextTransition + 'in', null);
				showPage(next, search);
				nextTransition = null;
			};
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
		var animationEnded = function() {
			animationRunning = false;
			element.removeEventListener('animationend', animationEnded);
			element.className = element.className.replace(new RegExp('(?:^|\\s)' + animation + '(?!\\S)', 'g'), '');
			if (typeof callback === 'function') callback();
		};
		setTimeout(function() {if (animationRunning) animationEnded();}, 1000);
		element.addEventListener('animationend', animationEnded);
		element.className += ' ' + animation;
	}

	function showPage(page, search) {
		page.style.display = page['styleDisplay'] || 'block';
		if (typeof page['onShow'] === 'function') page.onShow(search);
	}

	function hidePage(page) {
		if (typeof page['onHide'] === 'function') page.onHide();
		page.style.display = 'none';
	}

	//################################################################################//
	// Functions related to user interaction:

	function keyDown(keyEvent) {
		if (isLogEnabled) console.log('WebApp.js: keyDown(' + keyEvent.keyCode + ')');
		if (keyEvent.keyCode === 13) {
			if (keyEvent.target['onclick']) keyEvent.target.onclick();
		} else {
			if (currentPage && typeof currentPage['onKeyDown'] === 'function') currentPage.onKeyDown(keyEvent);
		}
	}

};
WebApp = new WebAppClass();
document.addEventListener('DOMContentLoaded', function() {WebApp.load();});
