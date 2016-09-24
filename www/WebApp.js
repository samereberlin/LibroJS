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
	 * @param {boolean} booleanState - The log enabled boolean state.
	 */
	this.setLogEnabled = function(booleanState) {
		isLogEnabled = booleanState;
	};

	//################################################################################//
	// Application settings:

	var HASH_DELAY = 200;
	var isLoaded = false;
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
	 * @param {boolean} booleanState - The running boolean state.
	 */
	this.setRunning = function(booleanState) {
		if (booleanState) resume();
		else pause();
	};

	//################################################################################//
	// Page settings:

	var pageIds = [];
	var pageElements = {};
	var currentPage = null;
	var currentSearch = null;
	var defaultPageId = null;

	//################################################################################//
	// Page API:

	/**
	 * Get the pageIds array values,
	 * which contains the list of IDs corresponding to the current loaded page.
	 *
	 * @return {array} The list of IDs corresponding to the current loaded page.
	 */
	this.getPageIds = function() {
		return pageIds;
	};

	/**
	 * Get the pageElements object reference,
	 * which contains the key-value database (pageId: element) corresponding to the current loaded page.
	 *
	 * @return {object} The key-value database (pageId: element) corresponding to the current loaded page.
	 */
	this.getPageElements = function() {
		return pageElements;
	};

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
	 * @param {string} pageId - The default page id string value.
	 */
	this.setDefaultPageId = function(pageId) {
		defaultPageId = pageId;
	};

	//################################################################################//
	// History stack management settings:

	var isDefaultPageFirstly = true;
	var isHistoryManaged = true;
	var isHistoryUnique = true;
	var historyLength = window.history.length;
	var historyStack = [];

	//################################################################################//
	// History stack management API:

	/**
	 * Returns the default page firstly boolean state,
	 * which indicates if the default page must be inserted firstly.
	 *
	 * @return {boolean} The default page firstly boolean state.
	 */
	this.isDefaultPageFirstly = function() {
		return isDefaultPageFirstly;
	};

	/**
	 * Set the default page firstly boolean state,
	 * which indicates if the default page must be inserted firstly.
	 *
	 * @param {boolean} booleanState - The default page firstly boolean state.
	 */
	this.setDefaultPageFirstly = function(booleanState) {
		isDefaultPageFirstly = booleanState;
	};

	/**
	 * Returns the history managed boolean state,
	 * which indicates if the stack must be manipulate by WebApp.
	 *
	 * @return {boolean} The history managed boolean state.
	 */
	this.isHistoryManaged = function() {
		return isHistoryManaged;
	};

	/**
	 * Set the history managed boolean state,
	 * which indicates if the stack must be manipulate by WebApp.
	 *
	 * @param {boolean} booleanState - The history managed boolean state.
	 */
	this.setHistoryManaged = function(booleanState) {
		isHistoryManaged = booleanState;
	};

	/**
	 * Returns the history unique boolean state,
	 * which indicates if the page entries must be unique in the stack.
	 *
	 * @return {boolean} The history unique boolean state.
	 */
	this.isHistoryUnique = function() {
		return isHistoryUnique;
	};

	/**
	 * Set the history unique boolean state,
	 * which indicates if the page entries must be unique in the stack.
	 *
	 * @param {boolean} booleanState - The history unique boolean state.
	 */
	this.setHistoryUnique = function(booleanState) {
		isHistoryUnique = booleanState;
	};

	/**
	 * Get the historyStack array values,
	 * which contains the href historyStack, according to the history stack management.
	 *
	 * @return {array} The href historyStack, according to the history stack management.
	 */
	this.getHistoryStack = function() {
		return historyStack;
	};

	//################################################################################//
	// Animation/Transition settings:

	var styleRules = '/* Animation Effects (based on jquery.mobile-1.4.5). */' +
		'@keyframes fadein {from {opacity: 0;} to {opacity: 1;}}' +
		'@keyframes fadeout {from {opacity: 1;} to {opacity: 0;}}' +
		'.fadein {animation-name: fadein; animation-duration: 225ms; opacity: 1;}' +
		'.fadeout {animation-name: fadeout; animation-duration: 125ms; opacity: 0;}' +
		'@keyframes popin {from {transform: scale(.8); opacity: 0;} to {transform: scale(1); opacity: 1;}}' +
		'@keyframes popout {from {transform: scale(1); opacity: 1;} to {transform: scale(.8); opacity: 0;}}' +
		'.popin {animation-name: popin; animation-duration: 225ms; animation-timing-function: ease-out; opacity: 1;}' +
		'.popout {animation-name: popout; animation-duration: 125ms; animation-timing-function: ease-in; opacity: 0;}' +
		'@keyframes flipin {from {transform: matrix(0.2,0.2,0,1,0,0); opacity: 0;} to {transform: matrix(1,0,0,1,0,0); opacity: 1;}}' +
		'@keyframes flipout {from {transform: matrix(1,0,0,1,0,0); opacity: 1;} to {transform: matrix(0.2,-0.2,0,1,0,0); opacity: 0;}}' +
		'@keyframes fliprevin {from {transform: matrix(0.2,-0.2,0,1,0,0); opacity: 0;} to {transform: matrix(1,0,0,1,0,0); opacity: 1;}}' +
		'@keyframes fliprevout {from {transform: matrix(1,0,0,1,0,0); opacity: 1;} to {transform: matrix(0.2,0.2,0,1,0,0); opacity: 0;}}' +
		'.flipin, .fliprevin {animation-duration: 225ms; animation-timing-function: ease-out;}' +
		'.flipout, .fliprevout {animation-duration: 125ms; animation-timing-function: ease-in;}' +
		'.flipin {animation-name: flipin; opacity: 1;}' +
		'.flipout {animation-name: flipout; opacity: 0;}' +
		'.fliprevin {animation-name: fliprevin; opacity: 1;}' +
		'.fliprevout {animation-name: fliprevout; opacity: 0;}' +
		'@keyframes slidein {from {transform: translateX(100%);} to {transform: translateX(0);}}' +
		'@keyframes sliderevin {from {transform: translateX(-100%);} to {transform: translateX(0);}}' +
		'@keyframes sliderevout {from {transform: translateX(0);} to {transform: translateX(100%);}}' +
		'@keyframes slideout {from {transform: translateX(0);} to {transform: translateX(-100%);}}' +
		'.slidein, .sliderevin {animation-duration: 225ms; animation-timing-function: ease-out;}' +
		'.slideout, .sliderevout {animation-duration: 125ms; animation-timing-function: ease-in;}' +
		'.slidein {animation-name: slidein; transform: translateX(0);}' +
		'.slideout {animation-name: slideout; transform: translateX(-100%);}' +
		'.sliderevin {animation-name: sliderevin; transform: translateX(0);}' +
		'.sliderevout {animation-name: sliderevout; transform: translateX(100%);}';
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

	function load() {
		if (isLogEnabled) console.log('WebApp.js: load()');
		if (typeof WebApp.onLoad === 'function') WebApp.onLoad();

		// Load page elements:
		pageElements = {}; // Required to reset page elements.
		Array.prototype.forEach.call(document.body.children, function(element) {
			if (isPage(element)) loadPage(element, null);
		});
		if (!defaultPageId || (pageIds.indexOf(defaultPageId) < 0)) defaultPageId = pageIds[0];

		if (isLoaded) showPage(currentPage, currentSearch, currentPage);
		else {
			isLoaded = true;

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
			window.addEventListener('hashchange', updateHash);
			updateHash({'type': 'hashchange', 'newURL': null, 'oldURL': null}); // Required to set initial page.
		}
	}

	function isPage(element) {
		return (element.classList.contains('page') && element.id)? true: false;
	}

	function loadPage(element, insertBeforeId) {
		element.style.display = 'none';
		pageElements[element.id] = element;
		var insertBeforeIndex = insertBeforeId? pageIds.indexOf(insertBeforeId): -1;
		if (insertBeforeIndex >= 0) {
			pageIds.splice(insertBeforeIndex, 0, insertBeforeId);
		} else {
			pageIds.push(element.id);
		}
		if (typeof element.onLoad === 'function') element.onLoad();
	}

	function unload() {
		if (isLogEnabled) console.log('WebApp.js: unload()');
		if (typeof WebApp.onUnload === 'function') WebApp.onUnload();
		if (isRunning) pause();
		isLoaded = false;
		reset();
	}

	function reset() {
		hidePage(currentPage);
		currentPage = null;
		currentSearch = null;
		historyLength = window.history.length;
		historyStack = [];
	}

	function pause() {
		if (isLogEnabled) console.log('WebApp.js: pause()');
		if (isRunning) {
			isRunning = false;
			if (typeof WebApp.onPause === 'function') WebApp.onPause();
		}
	}

	function resume() {
		if (isLogEnabled) console.log('WebApp.js: resume()');
		if (!isRunning) {
			isRunning = true;
			if (typeof WebApp.onResume === 'function') WebApp.onResume();
		}
	}

	//################################################################################//
	// Application life cycle API:

	/**
	 * Load the WebApp framework library.
	 * It is called automatically after DOMContentLoaded event,
	 * but it is useful to reset/reload page elements
	 * (according to the current body's children nodes).
	 */
	this.load = load;

	/**
	 * Reset the WebApp framework library.
	 * It is called automatically after window.onunload event,
	 * but it is useful to simulate reset event for testing.
	 */
	this.reset = reset;

	/**
	 * Create page dynamically,
	 * without any previous HTML code declaration,
	 * and load it according to insertBeforeId value.
	 *
	 * @param {string} pageId - The new page id string value.
	 * @param {string} pageContent - The new page content string value.
	 * @param {string} insertBeforeId - The existent page id to be the next.
	 * 
	 * @return {node} The new page node element.
	 */
	this.createPage = function(pageId, pageContent, insertBeforeId) {
		if (pageElements[pageId] || typeof pageId !== 'string') return null;
		else {
			var pageElement = document.createElement('div');
			pageElement.className = 'page';
			pageElement.id = pageId;
			pageElement.innerHTML = pageContent;
			if (isLoaded) {
				loadPage(pageElement, insertBeforeId);
			}
			var insertBeforeElement = document.getElementById(insertBeforeId);
			if (insertBeforeElement) {
				document.body.insertBefore(pageElement, insertBeforeElement);
			} else {
				document.body.appendChild(pageElement);
			}
			return pageElement;
		}
	};

	/**
	 * Delete page dynamically,
	 * and unload it, in order to release memory resources.
	 * 
	 * @param {string} pageId - The page id string value.
	 */
	this.deletePage = function(pageId) {
		var pageElement = document.getElementById(pageId);
		if (pageElement && pageElement.parentNode == document.body && isPage(pageElement)) {
			document.body.removeChild(pageElement);
			pageIds.splice(pageIds.indexOf(pageId), 1);
			delete pageElements[pageId];
		}
	};

	//################################################################################//
	// Functions related to application settings:

	function resize() {
		if (isLogEnabled) console.log('WebApp.js: resize()');
		if (typeof WebApp.onResize === 'function') WebApp.onResize();
	}

	//################################################################################//
	// Functions related to internal actions:

	function updateHash(hashChangeEvent) {
		if (isLogEnabled) console.log('WebApp.js: updateHash(hashChangeEvent)... newURL = ' + hashChangeEvent.newURL + ', oldURL = ' + hashChangeEvent.oldURL);

		// Parse URL data:
		var nextSearch = (window.location.hash.indexOf('?') >= 0)? window.location.hash.substring(window.location.hash.indexOf('?') + 1): '';
		var nextHash = (window.location.hash.length > 1)? window.location.hash.substring(1, (nextSearch? window.location.hash.indexOf('?'): window.location.hash.length)): null;
		var nextPage = (nextHash && pageElements[nextHash])? pageElements[nextHash]: null;

		// Set default page firstly:
		if (isDefaultPageFirstly && hashChangeEvent.newURL === null && hashChangeEvent.oldURL === null && nextPage && nextHash !== defaultPageId) {
			window.location.replace(window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + defaultPageId);
			setTimeout(function() { // Timeout required to create history entry for WebKit browsers.
				window.location.hash = nextHash + (nextSearch? '?' + nextSearch: '');
			}, HASH_DELAY);
		} else {
			// Execute update action:
			if (nextPage) {

				// History stack management:
				if (isHistoryManaged) {
					var historyManipulations = 0;
					var historyStackIndex = historyStack.indexOf(hashChangeEvent.newURL);
					if (historyStack.length > 1 && historyStack[historyStack.length - 2] === hashChangeEvent.newURL) {
						historyStack.pop();
						// If back key has not been pressed, set historyManipulations:
						if (historyLength < window.history.length)  historyManipulations = 1;
					} else if (isHistoryUnique && historyStack.length > 2 && historyStackIndex >= 0) {
						var historyStackSteps = historyStack.length - 1 - historyStackIndex;
						historyStack.splice(historyStackIndex + 1, historyStackSteps);
						// If back key has not been pressed, set historyManipulations:
						if (historyLength < window.history.length) historyManipulations = historyStackSteps;
					} else  historyStack[historyStack.length] = window.location.href;
					if (historyManipulations) {
						window.history.go(-(historyManipulations + 1));
						historyLength = historyLength - historyManipulations;
					} else historyLength = window.history.length;
				}

				// Page switch management:
				if (nextPage === currentPage) {
					if (typeof currentPage.onSearchChange === 'function') currentPage.onSearchChange(nextSearch);
				} else {
					switchPage(currentPage, nextPage, nextSearch);
					currentPage = nextPage;
				}
			} else if (currentPage) {
				if (isHistoryManaged) historyStack.pop();
				window.history.back();
			}
			else if (defaultPageId) window.location.replace(window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + defaultPageId);
			currentSearch = nextSearch;
		}
		if (typeof WebApp.onUpdateHash === 'function') WebApp.onUpdateHash(hashChangeEvent);
	}

	function switchPage(current, next, search) {
		if (!nextTransition) nextTransition = defaultTransition;
		if (nextTransition === 'fliporder') {
			nextTransition = (current && pageIds.indexOf(current.id) > pageIds.indexOf(next.id))? 'fliprev': 'flip';
		} else if (nextTransition === 'slideorder') {
			nextTransition = (current && pageIds.indexOf(current.id) > pageIds.indexOf(next.id))? 'sliderev': 'slide';
		}

		if (nextTransition === 'none') {
			if (current) hidePage(current);
			showPage(next, search, current);
			nextTransition = null;
			if (typeof WebApp.onSwitchPage === 'function') WebApp.onSwitchPage(current, next);
		} else {
			var showNext = function() {
				animateElement(next, nextTransition + 'in', null);
				showPage(next, search, current);
				nextTransition = null;
				if (typeof WebApp.onSwitchPage === 'function') WebApp.onSwitchPage(current, next);
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

	function showPage(page, search, referrer) {
		page.style.display = 'block';
		if (typeof page.onShow === 'function') page.onShow(search, (referrer? referrer.id: null));
	}

	function hidePage(page) {
		if (typeof page.onHide === 'function') page.onHide();
		page.style.display = 'none';
	}

	//################################################################################//
	// Functions related to user interaction:

	function keyDown(keyEvent) {
		if (isLogEnabled) console.log('WebApp.js: keyDown(' + keyEvent.keyCode + ')');
		if (keyEvent.keyCode === 13) {
			if (keyEvent.target.onclick) keyEvent.target.onclick();
		} else {
			if (currentPage && typeof currentPage.onKeyDown === 'function') currentPage.onKeyDown(keyEvent);
		}
	}

	//################################################################################//
	// User interaction API:

	/**
	 * Go to the next page (when available),
	 * according to the available pageIds (@see getPageIds).
	 */
	this.nextPage = function() {
		var currentPageIndex = pageIds.indexOf(currentPage.id);
		if (currentPageIndex + 1 < pageIds.length) window.location.hash = pageIds[currentPageIndex + 1];
	};

	/**
	 * Go to the previous page (when available),
	 * according to the available pageIds (@see getPageIds).
	 */
	this.previousPage = function() {
		var currentPageIndex = pageIds.indexOf(currentPage.id);
		if (currentPageIndex > 0) window.location.hash = pageIds[currentPageIndex - 1];
	};

};
WebApp = new WebAppClass();
document.addEventListener('DOMContentLoaded', function() {WebApp.load();});
