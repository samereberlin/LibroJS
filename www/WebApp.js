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

	var HASH_DELAY = 100;
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
		if (booleanState) {
			resume();
		} else {
			pause();
		}
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
	 * which contains the list of IDs corresponding to the current loaded pages.
	 *
	 * @return {array} The list of IDs corresponding to the current loaded pages.
	 */
	this.getPageIds = function() {
		return pageIds;
	};

	/**
	 * Get the pageElements object reference,
	 * which contains the key-value database (pageId: element) corresponding to the current loaded pages.
	 *
	 * @return {object} The key-value database (pageId: element) corresponding to the current loaded pages.
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

	/**
	 * Create page dynamically,
	 * without any previous HTML code declaration,
	 * and load it according to the insertBeforeId value.
	 *
	 * @param {string} pageId - The new page id string value.
	 * @param {string} extraClass - Extra class which must be assigned.
	 * @param {string} insertBeforeId - The existent page id to be the next.
	 * @param {string} pageContent - The new page content string value.
	 * 
	 * @return {node} The new page node element.
	 */
	this.createPage = function(pageId, extraClass, insertBeforeId, pageContent) {
		if (pageElements[pageId] || typeof pageId !== 'string') {
			return null;
		} else {
			var pageElement = document.createElement('div');
			pageElement.className = 'page' + (extraClass? ' ' + extraClass: '');
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
	// Modal settings:

	var modalIds = [];
	var modalElements = {};
	var modalHistoryLength = window.history.length;
	var currentModal = null;

	//################################################################################//
	// Modal API:

	/**
	 * Get the modalIds array values,
	 * which contains the list of IDs corresponding to the current loaded modals.
	 *
	 * @return {array} The list of IDs corresponding to the current loaded modals.
	 */
	this.getModalIds = function() {
		return modalIds;
	};

	/**
	 * Get the modalElements object reference,
	 * which contains the key-value database (modalId: element) corresponding to the current loaded modals.
	 *
	 * @return {object} The key-value database (modalId: element) corresponding to the current loaded modals.
	 */
	this.getModalElements = function() {
		return modalElements;
	};

	/**
	 * Create modal dynamically,
	 * without any previous HTML code declaration,
	 * and load it according to the insertBeforeId value.
	 *
	 * @param {string} modalId - The new modal id string value.
	 * @param {string} extraClass - Extra class which must be assigned.
	 * @param {string} modalContent - The new modal content string value.
	 * 
	 * @return {node} The new modal node element.
	 */
	this.createModal = function(modalId, extraClass, modalContent) {
		if (modalElements[modalId] || typeof modalId !== 'string') {
			return null;
		} else {
			var modalElement = document.createElement('div');
			modalElement.className = 'modal' + (extraClass? ' ' + extraClass: '');
			modalElement.id = modalId;
			modalElement.innerHTML = modalContent;
			if (isLoaded) {
				loadModal(modalElement);
			}
			document.body.appendChild(modalElement);
			return modalElement;
		}
	};

	/**
	 * Delete modal dynamically,
	 * and unload it, in order to release memory resources.
	 * 
	 * @param {string} modalId - The modal id string value.
	 */
	this.deleteModal = function(modalId) {
		var modalElement = document.getElementById(modalId);
		if (modalElement && modalElement.parentNode == document.body && isModal(modalElement)) {
			document.body.removeChild(modalElement);
			modalIds.splice(modalIds.indexOf(modalId), 1);
			delete modalElements[modalId];
		}
	};

	//################################################################################//
	// History stack management settings:

	var isDefaultPageFirstly = true;
	var isHistoryManaged = (typeof window.history.replaceState !== 'undefined')? true: false;
	var isHistoryUnique = isHistoryManaged;
	var isRedirection = false;
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
		isHistoryManaged = (typeof window.history.replaceState !== 'undefined') && booleanState;
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
		isHistoryUnique = (typeof window.history.replaceState !== 'undefined') && booleanState;
	};

	/**
	 * Returns the redirection boolean state,
	 * which indicates if the next updateHash event must be bypassed.
	 *
	 * @return {boolean} The redirection boolean state.
	 */
	this.isRedirection = function() {
		return isRedirection;
	};

	/**
	 * Set the redirection boolean state,
	 * which indicates if the next updateHash event must be bypassed.
	 *
	 * @param {boolean} booleanState - The redirection boolean state.
	 */
	this.setIsRedirection = function(booleanState) {
		isRedirection = booleanState;
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

	var animationTypes = ['fadein', 'fadeout', 'popin', 'popout', 'flipin', 'flipout', 'fliprevin', 'fliprevout', 'slidein', 'slideout', 'sliderevin', 'sliderevout', 'drawertopin', 'drawertopout', 'drawerbottomin', 'drawerbottomout', 'drawerleftin', 'drawerleftout', 'drawerrightin', 'drawerrightout'];
	var transitionTypes = ['none', 'fade', 'pop', 'flip', 'fliprev', 'fliporder', 'slide', 'sliderev', 'slideorder', 'drawertop', 'drawerbottom', 'drawerleft', 'drawerright'];
	var defaultPageTransition = transitionTypes[1];
	var nextPageTransition = null;
	var defaultModalTransition = transitionTypes[2];
	var nextModalTransition = null;

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
		if (element && element.nodeType === 1 && animation && animationTypes.indexOf(animation) >= 0) {
			animateElement(element, animation, callback);
		}
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
	 * @return {string} The default page transition type.
	 */
	this.getDefaultPageTransition = function() {
		return defaultPageTransition;
	};

	/**
	 * Set the default transition type, to be used between every page switching.
	 *
	 * @param {string} transitionType - The default page transition type.
	 */
	this.setDefaultPageTransition = function(transitionType) {
		if (transitionType && transitionTypes.indexOf(transitionType) >= 0) {
			defaultPageTransition = transitionType;
		}
	};

	/**
	 * Get the next transition type, to be used between the next page switching only.
	 *
	 * @return {string} The next page transition type.
	 */
	this.getNextPageTransition = function() {
		return nextPageTransition;
	};

	/**
	 * Set the next transition type, to be used between the next page switching only.
	 *
	 * @param {string} transitionType - The next page transition type.
	 */
	this.setNextPageTransition = function(transitionType) {
		if (transitionType && transitionTypes.indexOf(transitionType) >= 0) {
			nextPageTransition = transitionType;
		}
	};

	/**
	 * Get the default transition type, to be used between every modal switching.
	 *
	 * @return {string} The default modal transition type.
	 */
	this.getDefaultModalTransition = function() {
		return defaultModalTransition;
	};

	/**
	 * Set the default transition type, to be used between every modal switching.
	 *
	 * @param {string} transitionType - The default modal transition type.
	 */
	this.setDefaultModalTransition = function(transitionType) {
		if (transitionType && transitionTypes.indexOf(transitionType) >= 0) {
			defaultModalTransition = transitionType;
		}
	};

	/**
	 * Get the next transition type, to be used between the next modal switching only.
	 *
	 * @return {string} The next modal transition type.
	 */
	this.getNextModalTransition = function() {
		return nextModalTransition;
	};

	/**
	 * Set the next transition type, to be used between the next modal switching only.
	 *
	 * @param {string} transitionType - The next modal transition type.
	 */
	this.setNextModalTransition = function(transitionType) {
		if (transitionType && transitionTypes.indexOf(transitionType) >= 0) {
			nextModalTransition = transitionType;
		}
	};

	//################################################################################//
	// Functions related to application life cycle:

	function load() {
		if (isLogEnabled) console.log('WebApp.js: load()');
		if (typeof WebApp.onLoad === 'function') {
			WebApp.onLoad();
		}

		// Load body elements:
		pageIds = []; // Required to reset page IDs.
		modalIds = []; // Required to reset modal IDs.
		pageElements = {}; // Required to reset page elements.
		modalElements = {}; // Required to reset modal elements.
		Array.prototype.forEach.call(document.body.children, function(element) {
			if (isPage(element)) {
				loadPage(element, null);
			} else if (isModal(element)) {
				loadModal(element, null);
			}
		});
		if (!defaultPageId || (pageIds.indexOf(defaultPageId) < 0)) {
			defaultPageId = pageIds[0];
		}

		if (isLoaded) {
			showElement(currentPage, currentSearch, currentPage);
		} else {
			isLoaded = true;

			// Setup CSS style effects:
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = '/* Animation Effects (based on jquery.mobile-1.4.5). */' +
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
				'@keyframes slideout {from {transform: translateX(0);} to {transform: translateX(-100%);}}' +
				'@keyframes sliderevin {from {transform: translateX(-100%);} to {transform: translateX(0);}}' +
				'@keyframes sliderevout {from {transform: translateX(0);} to {transform: translateX(100%);}}' +
				'.slidein, .sliderevin {animation-duration: 225ms; animation-timing-function: ease-out;}' +
				'.slideout, .sliderevout {animation-duration: 125ms; animation-timing-function: ease-in;}' +
				'.slidein {animation-name: slidein; transform: translateX(0);}' +
				'.slideout {animation-name: slideout; transform: translateX(-100%);}' +
				'.sliderevin {animation-name: sliderevin; transform: translateX(0);}' +
				'.sliderevout {animation-name: sliderevout; transform: translateX(100%);}' +
				'@keyframes drawertopin {from {transform: translateY(-100%);} to {transform: translateY(0);}}' +
				'@keyframes drawertopout {from {transform: translateY(0);} to {transform: translateY(-100%);}}' +
				'@keyframes drawerbottomin {from {transform: translateY(100%);} to {transform: translateY(0);}}' +
				'@keyframes drawerbottomout {from {transform: translateY(0);} to {transform: translateY(100%);}}' +
				'@keyframes drawerleftin {from {transform: translateX(-100%);} to {transform: translateX(0);}}' +
				'@keyframes drawerleftout {from {transform: translateX(0);} to {transform: translateX(-100%);}}' +
				'@keyframes drawerrightin {from {transform: translateX(100%);} to {transform: translateX(0);}}' +
				'@keyframes drawerrightout {from {transform: translateX(0);} to {transform: translateX(100%);}}' +
				'.drawertopin, .drawerbottomin, .drawerleftin, .drawerrightin {animation-duration: 225ms; animation-timing-function: ease-out;}' +
				'.drawertopout, .drawerbottomout, .drawerleftout, .drawerrightout {animation-duration: 125ms; animation-timing-function: ease-in;}' +
				'.drawertopin {animation-name: drawertopin; transform: translateY(0);}' +
				'.drawertopout {animation-name: drawertopout; transform: translateY(-100%);}' +
				'.drawerbottomin {animation-name: drawerbottomin; transform: translateY(0);}' +
				'.drawerbottomout {animation-name: drawerbottomout; transform: translateY(100%);}' +
				'.drawerleftin {animation-name: drawerleftin; transform: translateX(0);}' +
				'.drawerleftout {animation-name: drawerleftout; transform: translateX(-100%);}' +
				'.drawerrightin {animation-name: drawerrightin; transform: translateX(0);}' +
				'.drawerrightout {animation-name: drawerrightout; transform: translateX(100%);}' +
				'/* WebApp basic/required CSS rules. */' +
				'.modal {background-color: rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; overflow: auto; z-index: 3}' +
				'.modal > * {background-color: white; border-radius: 0.3125em; box-shadow: 0 2px 12px rgba(0,0,0,0.6); margin: 10% auto 1em; max-width: 600px; width: 80%; overflow: hidden}'
			;
			var head = document.getElementsByTagName('head')[0];
			head.insertBefore(style, head.firstChild);

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
			pageIds.splice(insertBeforeIndex, 0, element.id);
		} else {
			pageIds.push(element.id);
		}
		var transitionType = element.getAttribute('transition');
		if (transitionType && transitionTypes.indexOf(transitionType) >= 0) {
			element.transitionType = transitionType;
		}
		if (typeof element.onLoad === 'function') {
			element.onLoad();
		}
	}

	function isModal(element) {
		return (element.classList.contains('modal') && element.id)? true: false;
	}

	function loadModal(element) {
		element.style.display = 'none';
		modalElements[element.id] = element;
		modalIds.push(element.id);
		var transitionType = element.children[0].getAttribute('transition');
		if (transitionType && transitionTypes.indexOf(transitionType) >= 0) {
			element.transitionType = transitionType;
		}
		if (typeof element.onLoad === 'function') {
			element.onLoad();
		}
	}

	function unload() {
		if (isLogEnabled) console.log('WebApp.js: unload()');
		if (typeof WebApp.onUnload === 'function') {
			WebApp.onUnload();
		}
		if (isRunning) {
			pause();
		}
		isLoaded = false;
		reset();
	}

	function reset() {
		hideElement(currentPage, currentSearch, currentPage);
		currentPage = null;
		currentSearch = null;
		historyStack = [];
	}

	function pause() {
		if (isLogEnabled) console.log('WebApp.js: pause()');
		if (isRunning) {
			isRunning = false;
			if (typeof WebApp.onPause === 'function') {
				WebApp.onPause();
			}
		}
	}

	function resume() {
		if (isLogEnabled) console.log('WebApp.js: resume()');
		if (!isRunning) {
			isRunning = true;
			if (typeof WebApp.onResume === 'function') {
				WebApp.onResume();
			}
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
	 * Unload the WebApp framework library.
	 * It is called automatically on window.onunload event,
	 * but it is useful to simulate unload event for testing.
	 */
	this.unload = unload;

	/**
	 * Reset the WebApp framework library.
	 * It is called automatically after window.onunload event,
	 * but it is useful to simulate reset event for testing.
	 */
	this.reset = reset;

	//################################################################################//
	// Functions related to application settings:

	function resize() {
		if (isLogEnabled) console.log('WebApp.js: resize()');
		if (typeof WebApp.onResize === 'function') {
			WebApp.onResize();
		}
	}

	//################################################################################//
	// Functions related to internal actions:

	function updateHash(hashChangeEvent) {
		if (isLogEnabled) console.log('WebApp.js: updateHash(hashChangeEvent)... newURL = ' + hashChangeEvent.newURL + ', oldURL = ' + hashChangeEvent.oldURL);

		// Parse URL data:
		var indexOfSearch = window.location.hash.indexOf('?');
		var nextSearch = (indexOfSearch >= 0)? window.location.hash.substring(indexOfSearch + 1): '';
		var nextHash = (window.location.hash.length > 1)? window.location.hash.substring(1, (nextSearch? indexOfSearch: window.location.hash.length)): null;
		var nextPage = (nextHash && pageElements[nextHash])? pageElements[nextHash]: null;
		var nextModal = (!nextPage && nextHash && modalElements[nextHash])? modalElements[nextHash]: null;

		// If it is a redirection, bypass it:
		if (isRedirection) {
			isRedirection = false;

		// Else if current modal is shown, hide it:
		} else if (currentModal) {
			if (nextModal === currentModal) {
				updateSearch(nextSearch, nextModal);
			} else {
				switchModal(false, currentModal, nextPage, nextSearch);
				// If nextPage is not the same as the currentPage:
				if (nextPage !== currentPage) {
					isRedirection = true;
					var nextURL = window.location.href;
					setTimeout(function() { // Timeout required to create history entry for WebKit browsers.
						window.location.href = nextURL;
					}, HASH_DELAY);
				}
				// If back key has not been pressed, go back twice:
				if (modalHistoryLength < window.history.length) {
					window.history.go(-2);
				}
			}

		// Else, execute update action:
		} else {

			// Set default page firstly:
			if (isDefaultPageFirstly && hashChangeEvent.newURL === null && hashChangeEvent.oldURL === null && nextPage && nextHash !== defaultPageId) {
				window.location.replace(window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + defaultPageId);
				setTimeout(function() { // Timeout required to create history entry for WebKit browsers.
					window.location.hash = nextHash + (nextSearch? '?' + nextSearch: '');
				}, HASH_DELAY);
			} else {
				if (nextPage) {

					// History stack management:
					if (isHistoryManaged) {
						var historyManipulations = 0;
						var historyStackIndex = historyStack.indexOf(hashChangeEvent.newURL);
						if (historyStack.length > 1 && historyStack[historyStack.length - 2] === hashChangeEvent.newURL) {
							historyManipulations = 1;
							historyStack.pop();
						} else if (isHistoryUnique && historyStack.length > 2 && historyStackIndex >= 0) {
							historyManipulations = historyStack.length - 1 - historyStackIndex;
							historyStack.splice(historyStackIndex + 1, historyManipulations);
						} else {
							historyStack[historyStack.length] = window.location.href;
						}
						// If there are history manipulations:
						if (historyManipulations) {
							// And if browser back key has not been pressed:
							if (!window.history.state) {
								window.history.go(-(historyManipulations + 1));
							}
						} else {
							window.history.replaceState(true, "", "");
						}
					}

					// Page update management:
					if (nextPage === currentPage) {
						updateSearch(nextSearch, nextPage);
					} else {
						switchPage(nextPage, nextSearch);
					}
				} else if (currentPage) {
					if (nextModal) {
						switchModal(true, nextModal, nextPage, nextSearch);
						modalHistoryLength = window.history.length;
					} else {
						isRedirection = true;
						window.history.back();
					}
				} else if (defaultPageId) {
					window.location.replace(window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + defaultPageId);
				}
				currentSearch = nextSearch;
			}
		}
		if (typeof WebApp.onUpdateHash === 'function') {
			WebApp.onUpdateHash(hashChangeEvent);
		}
	}

	function updateSearch(searchData, element) {
		if (isLogEnabled) console.log('WebApp.js: updateSearch(searchData, element)... searchData: ' + searchData + ', element.id: ' + element.id);
		if (typeof element.onUpdateSearch === 'function') {
			element.onUpdateSearch(searchData);
		}
	}

	function switchPage(pageElement, searchData) {
		if (isLogEnabled) console.log('WebApp.js: switchPage(pageElement, searchData)... pageElement.id = ' + pageElement.id + ', currentPage.id = ' + (currentPage? currentPage.id: ''));
		if (!nextPageTransition) {
			nextPageTransition = pageElement.transitionType? pageElement.transitionType: defaultPageTransition;
		}
		if (nextPageTransition === 'fliporder') {
			nextPageTransition = (currentPage && pageIds.indexOf(currentPage.id) > pageIds.indexOf(pageElement.id))? 'fliprev': 'flip';
		} else if (nextPageTransition === 'slideorder') {
			nextPageTransition = (currentPage && pageIds.indexOf(currentPage.id) > pageIds.indexOf(pageElement.id))? 'sliderev': 'slide';
		}

		var showNext = function(referrerElement) {
			animateElement(pageElement, nextPageTransition + 'in', null);
			showElement(pageElement, searchData, referrerElement);
			nextPageTransition = null;
			if (typeof WebApp.onSwitchPage === 'function') {
				WebApp.onSwitchPage(pageElement, referrerElement);
			}
		};
		if (currentPage) {
			var referrerElement = currentPage;
			animateElement(referrerElement, nextPageTransition + 'out', function() {
				hideElement(referrerElement, searchData, pageElement);
				showNext(referrerElement);
			});
		} else {
			showNext(currentPage);
		}
		currentPage = pageElement;
	}

	function switchModal(switchOn, modalElement, nextElement, searchData) {
		if (isLogEnabled) console.log('WebApp.js: switchModal(switchOn, modalElement, nextElement, searchData)... switchOn: ' + switchOn + ', modalElement.id: ' + modalElement.id + ', nextElement.id = ' + (nextElement? nextElement.id: '') + ', currentPage.id = ' + (currentPage? currentPage.id: ''));
		if (!nextModalTransition) {
			nextModalTransition = modalElement.transitionType? modalElement.transitionType: defaultModalTransition;
		}
		if (nextModalTransition === 'fliporder') {
			nextModalTransition = 'flip';
		} else if (nextModalTransition === 'slideorder') {
			nextPageTransition = 'slide';
		}

		var onSwitchModal = function() {
			if (typeof WebApp.onSwitchModal === 'function') {
				WebApp.onSwitchModal(switchOn, modalElement, currentPage);
			}
		};
		if (switchOn) {
			animateElement(modalElement, 'fadein', null);
			animateElement(modalElement.children[0], nextModalTransition + 'in', null);
			showElement(modalElement, searchData, currentPage);
			currentModal = modalElement;
			onSwitchModal();
		} else {
			animateElement(modalElement.children[0], nextModalTransition + 'out', null);
			animateElement(modalElement, 'fadeout', function() {
				hideElement(modalElement, searchData, nextElement);
				onSwitchModal();
			});
			currentModal = null;
			nextModalTransition = null;
		}
	}

	function animateElement(element, animation, callback) {
		if (animation === 'nonein' || animation === 'noneout') {
			if (typeof callback === 'function') {
				callback();
			}
		} else {
			var animationRunning = true;
			var animationEnded = function() {
				animationRunning = false;
				element.removeEventListener('animationend', animationEnded);
				element.className = element.className.replace(new RegExp('(?:^|\\s)' + animation + '(?!\\S)', 'g'), '');
				if (typeof callback === 'function') {
					callback();
				}
			};
			setTimeout(function() {
				if (animationRunning) {
					animationEnded();
				}
			}, 1000); // 1000 = animation timeout.
			element.addEventListener('animationend', animationEnded);
			element.className += ' ' + animation;
		}
	}

	function showElement(element, searchData, referrerElement) {
		element.style.display = 'block';
		if (typeof element.onShow === 'function') {
			element.onShow(searchData, referrerElement);
		}
	}

	function hideElement(element, nextSearchData, nextElement) {
		element.style.display = 'none';
		if (typeof element.onHide === 'function') {
			element.onHide(nextSearchData, nextElement);
		}
	}

	//################################################################################//
	// Functions related to user interaction:

	function keyDown(keyEvent) {
		if (isLogEnabled) console.log('WebApp.js: keyDown(' + keyEvent.keyCode + ', ' + (currentPage? currentPage.id: '') + ')');
		if (keyEvent.keyCode === 13 && keyEvent.target.onclick) {
			keyEvent.target.onclick();
		} else if (keyEvent.keyCode === 27 && currentModal) {
			window.history.back();
		} else {
			if (typeof WebApp.onKeyDown === 'function') {
				WebApp.onKeyDown(keyEvent, currentPage);
			}
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
		if (currentPageIndex + 1 < pageIds.length) {
			window.location.hash = pageIds[currentPageIndex + 1];
		}
	};

	/**
	 * Go to the previous page (when available),
	 * according to the available pageIds (@see getPageIds).
	 */
	this.previousPage = function() {
		var currentPageIndex = pageIds.indexOf(currentPage.id);
		if (currentPageIndex > 0) {
			window.location.hash = pageIds[currentPageIndex - 1];
		}
	};

};
WebApp = new WebAppClass();
document.addEventListener('DOMContentLoaded', function() {WebApp.load();});
