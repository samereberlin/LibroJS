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
	// Application settings:

	var HASH_DELAY = 200;
	var isLoaded = false;
	var isLogEnabled = true;
	var isRunning = false;
	var isTouchSupported = (typeof window.ontouchstart !== 'undefined')? true: false;

	//################################################################################//
	// Application API:

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
	 * Get the currentPage HTML DOM element reference,
	 * which represents the currently displayed page.
	 *
	 * @return {HTML DOM element} The currentPage HTML DOM element reference.
	 */
	this.getCurrentPage = function() {
		return currentPage;
	};

	/**
	 * Get the current searchData string value,
	 * which is the URL hash content from the question mark (if present) to the end.
	 *
	 * @return {string} The current searchData string value.
	 */
	this.getCurrentSearch = function() {
		return currentSearch;
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
	 * @param {string} tagName - Root element (default value: 'div').
	 * @param {string} extraClass - Extra class which must be assigned.
	 * @param {string} insertBeforeId - The existent page id to be the next.
	 * @param {string} pageContent - The new page content string value.
	 * 
	 * @return {node} The new page node element.
	 */
	this.createPage = function(pageId, tagName, extraClass, insertBeforeId, pageContent) {
		if (pageElements[pageId] || (typeof pageId !== 'string')) {
			return null;
		} else {
			var pageElement = document.createElement(tagName? tagName: 'div');
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
		if (pageElement && (pageElement.parentNode == document.body) && isPage(pageElement)) {
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
	 * Get the currentModal HTML DOM element reference,
	 * which represents the currently displayed modal.
	 *
	 * @return {HTML DOM element} The currentModal HTML DOM element reference.
	 */
	this.getCurrentModal = function() {
		return currentModal;
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
		if (modalElements[modalId] || (typeof modalId !== 'string')) {
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
		if (modalElement && (modalElement.parentNode == document.body) && isModal(modalElement)) {
			document.body.removeChild(modalElement);
			modalIds.splice(modalIds.indexOf(modalId), 1);
			delete modalElements[modalId];
		}
	};

	//################################################################################//
	// Canvas page settings:

	var fpsDelay = 1000 / 24; // FPS = 24 frames per second.
	var intervalUpdate = 0;
	var requestAnimation = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
		function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		};

	//################################################################################//
	// Canvas page API:

	/**
	 * Returns the "frames per second" canvas page update rate (default value: 24),
	 * which indicates the number of times which canvas page is updated per second.
	 *
	 * @return {Number} The "frames per second" canvas page update rate.
	 */
	this.getFps = function() {
		return 1000 / fpsDelay;
	};

	/**
	 * Set the "frames per second" canvas page update rate (default value: 24),
	 * which indicates the number of times which canvas page is updated per second.
	 *
	 * @param {number} fpsRate - The "frames per second" canvas page update rate.
	 */
	this.setFps = function(fpsRate) {
		fpsDelay = 1000 / fpsRate;
	};

	//################################################################################//
	// Canvas touchable settings:

	var CANVAS_TOUCH_DELAY = 600; // Required to solve touchEvent.preventDefault() issue.
	var canvasTouchLastTime = 0; // Required to solve touchEvent.preventDefault() issue.
	var canvasDebugTouch = '';
	var isCanvasMouseDown = false;
	var isCanvasTouchable = true;

	//################################################################################//
	// Canvas touchable API:

	/**
	 * Returns the isCanvasTouchable boolean state,
	 * which indicates if the WebApp manages canvas page touch/mouse events.
	 *
	 * @return {boolean} The isCanvasTouchable boolean state.
	 */
	this.isCanvasTouchable = function() {
		return isCanvasTouchable;
	};

	/**
	 * Set the isCanvasTouchable boolean state,
	 * which indicates if the WebApp manages canvas page touch/mouse events.
	 *
	 * @param {boolean} booleanState - The isCanvasTouchable boolean state.
	 */
	this.setCanvasTouchable = function(booleanState) {
		isCanvasTouchable = booleanState;
		if (currentPage && currentPage.canvasContext) {
			setCanvasTouchable(currentPage, booleanState);
		}
	};

	//################################################################################//
	// Transition settings:

	var animationTypes = ['fadein', 'fadeout', 'popin', 'popout', 'flipin', 'flipout', 'fliprevin', 'fliprevout', 'slidein', 'slideout', 'sliderevin', 'sliderevout', 'drawertopin', 'drawertopout', 'drawerbottomin', 'drawerbottomout', 'drawerleftin', 'drawerleftout', 'drawerrightin', 'drawerrightout'];
	var transitionTypes = ['none', 'fade', 'pop', 'flip', 'fliprev', 'fliporder', 'slide', 'sliderev', 'slideorder', 'drawertop', 'drawerbottom', 'drawerleft', 'drawerright'];
	var defaultPageTransition = transitionTypes[1];
	var nextPageTransition = null;
	var defaultModalTransition = transitionTypes[2];
	var nextModalTransition = null;

	//################################################################################//
	// Transition API:

	/**
	 * Animate a node element, according to the supplied animation type (@see getAnimationTypes).
	 *
	 * @param {node} element - The node element to be animated.
	 * @param {string} animation - The animation type to be applied.
	 * @param {function} callback - The function callback to be invoked after animation.
	 */
	this.animateElement = function(element, animation, callback) {
		if (element && (element.nodeType === 1) && animation && (animationTypes.indexOf(animation) >= 0)) {
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
		if (transitionType && (transitionTypes.indexOf(transitionType) >= 0)) {
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
		if (transitionType && (transitionTypes.indexOf(transitionType) >= 0)) {
			nextPageTransition = transitionType;
		}
	};

	/**
	 * Get the transition type, to be used when switching to the specified page.
	 *
	 * @param {string} pageId - The page id string value.
	 *
	 * @return {string} The transition type.
	 */
	this.getPageTransition = function(pageId) {
		var transitionType = null;
		var pageElement = document.getElementById(pageId);
		if (pageElement && (pageElement.parentNode == document.body) && isPage(pageElement)) {
			transitionType = pageElement.getAttribute('transition');
		}
		return transitionType;
	};

	/**
	 * Set the transition type, to be used when switching to the specified page.
	 *
	 * @param {string} pageId - The page id string value.
	 * @param {string} transitionType - The transition type.
	 */
	this.setPageTransition = function(pageId, transitionType) {
		if (transitionType && (transitionTypes.indexOf(transitionType) >= 0)) {
			var pageElement = document.getElementById(pageId);
			if (pageElement && (pageElement.parentNode == document.body) && isPage(pageElement)) {
				pageElement.setAttribute('transition', transitionType);
			}
			if (isLoaded) {
				pageElement.transitionType = transitionType;
			}
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
		if (transitionType && (transitionTypes.indexOf(transitionType) >= 0)) {
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
		if (transitionType && (transitionTypes.indexOf(transitionType) >= 0)) {
			nextModalTransition = transitionType;
		}
	};

	/**
	 * Get the transition type, to be used when switching to this specific modal.
	 *
	 * @param {string} modalId - The modal id string value.
	 *
	 * @return {string} The transition type.
	 */
	this.getModalTransition = function(modalId) {
		var transitionType = null;
		var modalElement = document.getElementById(modalId);
		if (modalElement && (modalElement.parentNode == document.body) && isModal(modalElement)) {
			transitionType = modalElement.getAttribute('transition');
		}
		return transitionType;
	};

	/**
	 * Set the transition type, to be used when switching to the specified modal.
	 *
	 * @param {string} modalId - The modal id string value.
	 * @param {string} transitionType - The transition type.
	 */
	this.setModalTransition = function(modalId, transitionType) {
		if (transitionType && (transitionTypes.indexOf(transitionType) >= 0)) {
			var modalElement = document.getElementById(modalId);
			if (modalElement && (modalElement.parentNode == document.body) && isModal(modalElement)) {
				modalElement.setAttribute('transition', transitionType);
			}
			if (isLoaded) {
				modalElement.transitionType = transitionType;
			}
		}
	};

	//################################################################################//
	// Swipe page/modal settings:

	var SWIPE_TOUCH_DELAY = 600; // Required to emulate touchEvent.preventDefault().
	var swipeTouchLastTime = 0; // Required to emulate touchEvent.preventDefault().
	var swipeDebugTouch = '';
	var isSwipeMouseDown = false;
	var isSwipePageSwitch = false;
	var isSwipeModalSwitch = false;
	var isSwipeModalSwitchLeft = false;
	var isSwipeModalSwitchRight = false;
	var swipeCurrentIndex = 0;
	var swipeCurrentTop = '0px';
	var swipeDestinationPage = null;
	var swipeMoving = false, swipeMovingPrevious = false, swipeMovingNext = false;
	var swipeStartX = 0, swipeStartY = 0, swipeMoveX = 0, swipeMoveY = 0;

	//################################################################################//
	// Swipe page/modal API:

	/**
	 * Returns the swipe page boolean state,
	 * which is responsible to enable/disable swipe page switch.
	 *
	 * @return {boolean} The swipe page boolean state.
	 */
	this.isSwipePageSwitch = function() {
		return isSwipePageSwitch;
	};

	/**
	 * Set the swipe page boolean state,
	 * which is responsible to enable/disable swipe page switch.
	 *
	 * @param {boolean} booleanState - The swipe page boolean state.
	 */
	this.setSwipePageSwitch = function(booleanState) {
		isSwipePageSwitch = booleanState;
		if (currentPage) {
			setSwipeSwitch(currentPage, booleanState);
		}
	};

	/**
	 * Returns the swipe modal boolean state,
	 * which is responsible to enable/disable swipe modal switch.
	 *
	 * @return {boolean} The swipe modal boolean state.
	 */
	this.isSwipeModalSwitch = function() {
		return isSwipeModalSwitch;
	};

	/**
	 * Set the swipe modal boolean state,
	 * which is responsible to enable/disable swipe modal switch.
	 *
	 * @param {boolean} booleanState - The swipe modal boolean state.
	 */
	this.setSwipeModalSwitch = function(booleanState) {
		isSwipeModalSwitch = booleanState;
		if (currentModal) {
			setSwipeSwitch(currentModal.children[0], booleanState);
		}
	};

	/**
	 * Swipe a node element horizontally, according to the supplied fromPx and toPx coordinates.
	 *
	 * @param {node} element - The node element to be swiped.
	 * @param {number} fromPx - The swipe movement start position (in pixels).
	 * @param {number} toPx - The swipe movement destination position (in pixels).
	 * @param {number} stepPx - The swipe movement step length (in pixels).
	 * @param {function} callback - The function callback to be invoked after swipe.
	 */
	this.swipeElement = swipeElement;

	//################################################################################//
	// History stack management settings:

	var isDefaultPageFirstly = true;
	var isHistoryManaged = (typeof window.history.replaceState !== 'undefined')? true: false;
	var isHistoryUnique = isHistoryManaged;
	var isRedirection = false;
	var historyStack = [];
	var historyState = null;

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
		isHistoryManaged = booleanState && (typeof window.history.replaceState !== 'undefined');
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
		isHistoryUnique = booleanState && (typeof window.history.replaceState !== 'undefined');
	};

	/**
	 * Returns the redirection boolean state,
	 * which indicates if the next updateHash event must be bypassed
	 * (useful to update searchData content without hash processing).
	 *
	 * @return {boolean} The redirection boolean state.
	 */
	this.isRedirection = function() {
		return isRedirection;
	};

	/**
	 * Set the redirection boolean state,
	 * which indicates if the next updateHash event must be bypassed
	 * (useful to update searchData content without hash processing).
	 *
	 * @param {boolean} booleanState - The redirection boolean state.
	 */
	this.setRedirection = function(booleanState) {
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
				'@-webkit-keyframes fadein {from {opacity: 0;} to {opacity: 1;}}' +
				'@-webkit-keyframes fadeout {from {opacity: 1;} to {opacity: 0;}}' +
				'.fadein {animation-name: fadein; animation-duration: 225ms; -webkit-animation-name: fadein; -webkit-animation-duration: 225ms; opacity: 1;}' +
				'.fadeout {animation-name: fadeout; animation-duration: 215ms; -webkit-animation-name: fadeout; -webkit-animation-duration: 215ms; opacity: 0;}' +
				'@keyframes popin {from {transform: scale(.8); opacity: 0;} to {transform: scale(1); opacity: 1;}}' +
				'@keyframes popout {from {transform: scale(1); opacity: 1;} to {transform: scale(.8); opacity: 0;}}' +
				'@-webkit-keyframes popin {from {-webkit-transform: scale(.8); opacity: 0;} to {-webkit-transform: scale(1); opacity: 1;}}' +
				'@-webkit-keyframes popout {from {-webkit-transform: scale(1); opacity: 1;} to {-webkit-transform: scale(.8); opacity: 0;}}' +
				'.popin {animation-name: popin; animation-duration: 225ms; animation-timing-function: ease-out; -webkit-animation-name: popin; -webkit-animation-duration: 225ms; -webkit-animation-timing-function: ease-out; opacity: 1;}' +
				'.popout {animation-name: popout; animation-duration: 215ms; animation-timing-function: ease-in; -webkit-animation-name: popout; -webkit-animation-duration: 215ms; -webkit-animation-timing-function: ease-in; opacity: 0;}' +
				'@keyframes flipin {from {transform: matrix(0.2,0.2,0,1,0,0); opacity: 0;} to {transform: matrix(1,0,0,1,0,0); opacity: 1;}}' +
				'@keyframes flipout {from {transform: matrix(1,0,0,1,0,0); opacity: 1;} to {transform: matrix(0.2,-0.2,0,1,0,0); opacity: 0;}}' +
				'@keyframes fliprevin {from {transform: matrix(0.2,-0.2,0,1,0,0); opacity: 0;} to {transform: matrix(1,0,0,1,0,0); opacity: 1;}}' +
				'@keyframes fliprevout {from {transform: matrix(1,0,0,1,0,0); opacity: 1;} to {transform: matrix(0.2,0.2,0,1,0,0); opacity: 0;}}' +
				'@-webkit-keyframes flipin {from {-webkit-transform: matrix(0.2,0.2,0,1,0,0); opacity: 0;} to {-webkit-transform: matrix(1,0,0,1,0,0); opacity: 1;}}' +
				'@-webkit-keyframes flipout {from {-webkit-transform: matrix(1,0,0,1,0,0); opacity: 1;} to {-webkit-transform: matrix(0.2,-0.2,0,1,0,0); opacity: 0;}}' +
				'@-webkit-keyframes fliprevin {from {-webkit-transform: matrix(0.2,-0.2,0,1,0,0); opacity: 0;} to {-webkit-transform: matrix(1,0,0,1,0,0); opacity: 1;}}' +
				'@-webkit-keyframes fliprevout {from {-webkit-transform: matrix(1,0,0,1,0,0); opacity: 1;} to {-webkit-transform: matrix(0.2,0.2,0,1,0,0); opacity: 0;}}' +
				'.flipin, .fliprevin {animation-duration: 225ms; animation-timing-function: ease-out; -webkit-animation-duration: 225ms; -webkit-animation-timing-function: ease-out;}' +
				'.flipout, .fliprevout {animation-duration: 215ms; animation-timing-function: ease-in; -webkit-animation-duration: 215ms; -webkit-animation-timing-function: ease-in;}' +
				'.flipin {animation-name: flipin; -webkit-animation-name: flipin; opacity: 1;}' +
				'.flipout {animation-name: flipout; -webkit-animation-name: flipout; opacity: 0;}' +
				'.fliprevin {animation-name: fliprevin; -webkit-animation-name: fliprevin; opacity: 1;}' +
				'.fliprevout {animation-name: fliprevout; -webkit-animation-name: fliprevout; opacity: 0;}' +
				'@keyframes slidein {from {transform: translateX(100%);} to {transform: translateX(0);}}' +
				'@keyframes slideout {from {transform: translateX(0); opacity: 1;} to {transform: translateX(-100%); opacity: 0;}}' +
				'@keyframes sliderevin {from {transform: translateX(-100%);} to {transform: translateX(0);}}' +
				'@keyframes sliderevout {from {transform: translateX(0); opacity: 1;} to {transform: translateX(100%); opacity: 0;}}' +
				'@-webkit-keyframes slidein {from {-webkit-transform: translateX(100%);} to {-webkit-transform: translateX(0);}}' +
				'@-webkit-keyframes slideout {from {-webkit-transform: translateX(0); opacity: 1;} to {-webkit-transform: translateX(-100%); opacity: 0;}}' +
				'@-webkit-keyframes sliderevin {from {-webkit-transform: translateX(-100%);} to {-webkit-transform: translateX(0);}}' +
				'@-webkit-keyframes sliderevout {from {-webkit-transform: translateX(0); opacity: 1;} to {-webkit-transform: translateX(100%); opacity: 0;}}' +
				'.slidein, .sliderevin {animation-duration: 225ms; animation-timing-function: ease-out; -webkit-animation-duration: 225ms; -webkit-animation-timing-function: ease-out;}' +
				'.slideout, .sliderevout {animation-duration: 225ms; animation-timing-function: ease-in; -webkit-animation-duration: 225ms; -webkit-animation-timing-function: ease-in; opacity: 0;}' +
				'.slidein {animation-name: slidein; transform: translateX(0); -webkit-animation-name: slidein; -webkit-transform: translateX(0);}' +
				'.slideout {animation-name: slideout; transform: translateX(-100%); -webkit-animation-name: slideout; -webkit-transform: translateX(-100%);}' +
				'.sliderevin {animation-name: sliderevin; transform: translateX(0); -webkit-animation-name: sliderevin; -webkit-transform: translateX(0);}' +
				'.sliderevout {animation-name: sliderevout; transform: translateX(100%); -webkit-animation-name: sliderevout; -webkit-transform: translateX(100%);}' +
				'@keyframes drawertopin {from {transform: translateY(-100%);} to {transform: translateY(0);}}' +
				'@keyframes drawertopout {from {transform: translateY(0);} to {transform: translateY(-100%);}}' +
				'@keyframes drawerbottomin {from {transform: translateY(100%);} to {transform: translateY(0);}}' +
				'@keyframes drawerbottomout {from {transform: translateY(0);} to {transform: translateY(100%);}}' +
				'@keyframes drawerleftin {from {transform: translateX(-100%);} to {transform: translateX(0);}}' +
				'@keyframes drawerleftout {from {transform: translateX(0);} to {transform: translateX(-100%);}}' +
				'@keyframes drawerrightin {from {transform: translateX(100%);} to {transform: translateX(0);}}' +
				'@keyframes drawerrightout {from {transform: translateX(0);} to {transform: translateX(100%);}}' +
				'@-webkit-keyframes drawertopin {from {-webkit-transform: translateY(-100%);} to {-webkit-transform: translateY(0);}}' +
				'@-webkit-keyframes drawertopout {from {-webkit-transform: translateY(0);} to {-webkit-transform: translateY(-100%);}}' +
				'@-webkit-keyframes drawerbottomin {from {-webkit-transform: translateY(100%);} to {-webkit-transform: translateY(0);}}' +
				'@-webkit-keyframes drawerbottomout {from {-webkit-transform: translateY(0);} to {-webkit-transform: translateY(100%);}}' +
				'@-webkit-keyframes drawerleftin {from {-webkit-transform: translateX(-100%);} to {-webkit-transform: translateX(0);}}' +
				'@-webkit-keyframes drawerleftout {from {-webkit-transform: translateX(0);} to {-webkit-transform: translateX(-100%);}}' +
				'@-webkit-keyframes drawerrightin {from {-webkit-transform: translateX(100%);} to {-webkit-transform: translateX(0);}}' +
				'@-webkit-keyframes drawerrightout {from {-webkit-transform: translateX(0);} to {-webkit-transform: translateX(100%);}}' +
				'.drawertopin, .drawerbottomin, .drawerleftin, .drawerrightin {animation-duration: 225ms; animation-timing-function: ease-out; -webkit-animation-duration: 225ms; -webkit-animation-timing-function: ease-out;}' +
				'.drawertopout, .drawerbottomout, .drawerleftout, .drawerrightout {animation-duration: 215ms; animation-timing-function: ease-in; -webkit-animation-duration: 215ms; -webkit-animation-timing-function: ease-in;}' +
				'.drawertopin {animation-name: drawertopin; transform: translateY(0); -webkit-animation-name: drawertopin; -webkit-transform: translateY(0);}' +
				'.drawertopout {animation-name: drawertopout; transform: translateY(-100%); -webkit-animation-name: drawertopout; -webkit-transform: translateY(-100%);}' +
				'.drawerbottomin {animation-name: drawerbottomin; transform: translateY(0); -webkit-animation-name: drawerbottomin; -webkit-transform: translateY(0);}' +
				'.drawerbottomout {animation-name: drawerbottomout; transform: translateY(100%); -webkit-animation-name: drawerbottomout; -webkit-transform: translateY(100%);}' +
				'.drawerleftin {animation-name: drawerleftin; transform: translateX(0); -webkit-animation-name: drawerleftin; -webkit-transform: translateX(0);}' +
				'.drawerleftout {animation-name: drawerleftout; transform: translateX(-100%); -webkit-animation-name: drawerleftout; -webkit-transform: translateX(-100%);}' +
				'.drawerrightin {animation-name: drawerrightin; transform: translateX(0); -webkit-animation-name: drawerrightin; -webkit-transform: translateX(0);}' +
				'.drawerrightout {animation-name: drawerrightout; transform: translateX(100%); -webkit-animation-name: drawerrightout; -webkit-transform: translateX(100%);}' +
				'/* WebApp basic/required CSS rules. */' +
				'.modal {background-color: rgba(0,0,0,0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0; overflow: auto; z-index: 3}' +
				'.modal > * {background-color: white; border-radius: 0.3125em; box-shadow: 0 2px 6px rgba(0,0,0,0.6); margin: 10% auto 1em; max-width: 600px; width: 80%; overflow: hidden}' +
				'.page {background-color: white; overflow: auto; width: 100%;} canvas.page {width: auto;}'
			;
			var head = document.getElementsByTagName('head')[0];
			head.insertBefore(style, head.firstChild);

			// Setup application life cycle callbacks:
			window.addEventListener('blur', pause);
			window.addEventListener('focus', resume);
			window.addEventListener('keydown', keyDown);
			window.addEventListener('keyup', keyUp);
			window.addEventListener('resize', resize);
			window.addEventListener('unload', unload);
			resume(); // Required to dispatch initial onResume event.
			resize(); // Required to set initial size for Desktop browsers.

			// Setup page change listener:
			window.addEventListener('hashchange', updateHash);
			window.addEventListener('popstate', function(event) {historyState = event.state;}); // Required to track previously visited pages.
			updateHash({'type': 'hashchange', 'newURL': null, 'oldURL': null}); // Required to set initial page.
		}
	}

	function isPage(element) {
		return ((element.className.search('(^| )page($| )') >= 0) && element.id)? true: false;
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
		if (transitionType && (transitionTypes.indexOf(transitionType) >= 0)) {
			element.transitionType = transitionType;
		}
		if (element.tagName === 'CANVAS') {
			element.canvasContext = element.getContext('2d');
			if (typeof element.onDraw !== 'function') {
				element.onDraw = function() {};
			}
			if (typeof element.onCanvasTouchableStart !== 'function') {
				element.onCanvasTouchableStart = function() {};
			}
			if (typeof element.onCanvasTouchableMove !== 'function') {
				element.onCanvasTouchableMove = function() {};
			}
			if (typeof element.onCanvasTouchableEnd !== 'function') {
				element.onCanvasTouchableEnd = function() {};
			}
		}
	}

	function isModal(element) {
		return ((element.className.search('(^| )modal($| )') >= 0) && element.id)? true: false;
	}

	function loadModal(element) {
		element.style.display = 'none';
		modalElements[element.id] = element;
		modalIds.push(element.id);
		var transitionType = element.getAttribute('transition');
		if (transitionType && (transitionTypes.indexOf(transitionType) >= 0)) {
			element.transitionType = transitionType;
		}
		element.onclick = function() {window.history.back();};
		element.children[0].onclick = function(event) {event.stopPropagation();};
	}

	function unload() {
		if (isLogEnabled) console.log('WebApp.js: unload()');
		if (isRunning) {
			pause();
		}
		if (typeof WebApp.onUnload === 'function') {
			WebApp.onUnload();
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
		if (isLogEnabled) console.log('WebApp.js: pause()... isRunning: ' + isRunning);
		if (isRunning) {
			isRunning = false;
			if (currentPage) {
				setPage(currentPage, false);
			}
			if (typeof WebApp.onPause === 'function') {
				WebApp.onPause();
			}
		}
	}

	function resume() {
		if (isLogEnabled) console.log('WebApp.js: resume()... isRunning: ' + isRunning);
		if (!isRunning) {
			isRunning = true;
			if (currentPage) {
				setPage(currentPage, true);
			}
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
	 * It is called automatically on window unload event,
	 * but it is useful to simulate unload event for testing.
	 */
	this.unload = unload;

	/**
	 * Reset the WebApp framework library.
	 * It is called automatically after window unload event,
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
				// If browser back key has not been pressed:
				if (modalHistoryLength < window.history.length) {
					// If nextPage is not the same as the currentPage:
					if (nextPage !== currentPage) {
						isRedirection = true;
						var nextURL = window.location.href;
						setTimeout(function() { // Timeout required to create history entry for WebKit browsers.
							window.location.href = nextURL;
						}, HASH_DELAY);
					}
					window.history.go(-2); // Go back twice.
				} else if (nextPage !== currentPage) {
					updateHash(hashChangeEvent);
				}
			}

		// Else, execute update action:
		} else {

			// Set default page firstly:
			if (isDefaultPageFirstly && (hashChangeEvent.newURL === null) && (hashChangeEvent.oldURL === null) && nextPage && (nextHash !== defaultPageId)) {
				window.location.replace(window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + defaultPageId);
				setTimeout(function() { // Timeout required to create history entry for WebKit browsers.
					window.location.hash = nextHash + (nextSearch? '?' + nextSearch: '');
				}, HASH_DELAY);
			} else {
				if (nextPage) {

					// History stack management:
					if (isHistoryManaged) {
						var historyManipulations = 0;
						var historyStackIndex = historyStack.indexOf(window.location.href);
						if ((historyStack.length > 1) && (historyStack[historyStack.length - 2] === window.location.href)) {
							historyManipulations = 1;
							historyStack.pop();
						} else if (isHistoryUnique && (historyStack.length > 2) && (historyStackIndex >= 0)) {
							historyManipulations = historyStack.length - 1 - historyStackIndex;
							historyStack.splice(historyStackIndex + 1, historyManipulations);
						} else {
							historyStack[historyStack.length] = window.location.href;
						}
						// If there are history manipulations:
						if (historyManipulations) {
							// And if browser back key has not been pressed:
							if (!historyState) { // Required to track previously visited pages.
								window.history.go(-(historyManipulations + 1));
							}
						} else {
							window.history.replaceState(true, "", ""); // Required to track previously visited pages.
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
		if (isLogEnabled) console.log('WebApp.js: updateSearch(searchData, element)... searchData: ' + searchData + ', element.id: ' + (element? element.id: ''));
		if (typeof element.onUpdateSearch === 'function') {
			element.onUpdateSearch(searchData);
		}
	}

	function switchPage(pageElement, searchData) {
		if (isLogEnabled) console.log('WebApp.js: switchPage(pageElement, searchData)... pageElement.id = ' + (pageElement? pageElement.id: '') + ', searchData: ' + searchData + ', currentPage.id = ' + (currentPage? currentPage.id: ''));
		if (!nextPageTransition) {
			nextPageTransition = pageElement.transitionType? pageElement.transitionType: defaultPageTransition;
		}
		if (nextPageTransition === 'fliporder') {
			nextPageTransition = (currentPage && (pageIds.indexOf(currentPage.id) > pageIds.indexOf(pageElement.id)))? 'fliprev': 'flip';
		} else if (nextPageTransition === 'slideorder') {
			nextPageTransition = (currentPage && (pageIds.indexOf(currentPage.id) > pageIds.indexOf(pageElement.id)))? 'sliderev': 'slide';
		}

		var onSwitchPage = function(referrerElement) {
			nextPageTransition = null;
			if (typeof WebApp.onSwitchPage === 'function') {
				WebApp.onSwitchPage(pageElement, referrerElement);
			}
		};

		if (nextPageTransition.lastIndexOf('swipe', 0) === 0) {
			var referrerElement = currentPage;
			setPage(referrerElement, false);
			var referrerFromPx = parseInt(referrerElement.style.transform.substring(
					referrerElement.style.transform.lastIndexOf('(') + 1,
					referrerElement.style.transform.lastIndexOf('p')));
			var referrerToPx = window.innerWidth * ((nextPageTransition === 'swipe')? -1: 1);
			var pageFromPx = parseInt(pageElement.style.transform.substring(
					pageElement.style.transform.lastIndexOf('(') + 1,
					pageElement.style.transform.lastIndexOf('p')));
			swipeElement(referrerElement, referrerFromPx, referrerToPx, 25, function() {
				hideElement(referrerElement, searchData, pageElement);
			});
			swipeElement(pageElement, pageFromPx, 0, 25, function() {
				pageElement.style.position = '';
				pageElement.style.top = '';
				pageElement.style.width = ''; // Required to solve WebKit unstable width issue.
				showElement(pageElement, searchData, referrerElement);
				onSwitchPage(referrerElement);
				setPage(pageElement, true);
			});
		} else {
			var showNext = function(referrerElement) {
				animateElement(pageElement, nextPageTransition + 'in', function() {
					setPage(pageElement, true);
				});
				showElement(pageElement, searchData, referrerElement);
				onSwitchPage(referrerElement);
			};
			if (currentPage) {
				var referrerElement = currentPage;
				setPage(referrerElement, false);
				if (nextPageTransition.lastIndexOf('slide', 0) === 0) {
					pageElement.style.position = 'fixed';
					pageElement.style.zIndex = '1';
					pageElement.style.top = ((referrerElement.offsetTop - window.pageYOffset > 0)?
							referrerElement.offsetTop - window.pageYOffset: 0) + 'px';
					animateElement(referrerElement, nextPageTransition + 'out', function() {
						hideElement(referrerElement, searchData, pageElement);
						pageElement.style.position = '';
						pageElement.style.zIndex = '';
						pageElement.style.top = '';
					});
					showNext(referrerElement);
				} else {
					animateElement(referrerElement, nextPageTransition + 'out', function() {
						hideElement(referrerElement, searchData, pageElement);
						showNext(referrerElement);
					});
				}
			} else {
				showNext(currentPage);
			}
		}
		currentPage = pageElement;
	}

	function setPage(pageElement, booleanState) {
		if (pageElement.canvasContext) {
			if (booleanState) {
				if (intervalUpdate === 0) {
					intervalUpdate = setInterval(pageElement.onUpdate, fpsDelay);
					var canvasPage = pageElement; // Local variable required to absorb the last requestAnimation call.
					(function draw() {
						canvasPage.onDraw();
						if (isRunning) {
							requestAnimation(draw);
						}
					})();
				}
			} else {
				clearInterval(intervalUpdate);
				intervalUpdate = 0;
			}
			if (isCanvasTouchable) {
				setCanvasTouchable(pageElement, booleanState);
			}
		}
		if (isSwipePageSwitch) {
			setSwipeSwitch(pageElement, booleanState);
		}
	}

	function setCanvasTouchable(pageElement, booleanState) {
		if (booleanState) {
			pageElement.addEventListener('mousedown', canvasMouseDown);
			pageElement.addEventListener('mousemove', canvasMouseMove);
			pageElement.addEventListener('mouseup', canvasMouseUp);
			pageElement.addEventListener('mouseout', canvasMouseUp);
			if (isTouchSupported) {
				pageElement.addEventListener('touchstart', canvasTouchStart);
				pageElement.addEventListener('touchmove', canvasTouchMove);
				pageElement.addEventListener('touchend', canvasTouchEnd);
				pageElement.addEventListener('touchcancel', canvasTouchEnd);
			}
		} else {
			pageElement.removeEventListener('mousedown', canvasMouseDown);
			pageElement.removeEventListener('mousemove', canvasMouseMove);
			pageElement.removeEventListener('mouseup', canvasMouseUp);
			pageElement.removeEventListener('mouseout', canvasMouseUp);
			if (isTouchSupported) {
				pageElement.removeEventListener('touchstart', canvasTouchStart);
				pageElement.removeEventListener('touchmove', canvasTouchMove);
				pageElement.removeEventListener('touchend', canvasTouchEnd);
				pageElement.removeEventListener('touchcancel', canvasTouchEnd);
			}
		}
	}

	function setSwipeSwitch(element, booleanState) {
		if (booleanState) {
			element.addEventListener('mousedown', swipeMouseDown);
			element.addEventListener('mousemove', swipeMouseMove);
			element.addEventListener('mouseup', swipeMouseUp);
			element.addEventListener('mouseout', swipeMouseUp);
			if (isTouchSupported) {
				element.addEventListener('touchstart', swipeTouchStart);
				element.addEventListener('touchmove', swipeTouchMove);
				element.addEventListener('touchend', swipeTouchEnd);
				element.addEventListener('touchcancel', swipeTouchEnd);
			}
		} else {
			element.removeEventListener('mousedown', swipeMouseDown);
			element.removeEventListener('mousemove', swipeMouseMove);
			element.removeEventListener('mouseup', swipeMouseUp);
			element.removeEventListener('mouseout', swipeMouseUp);
			if (isTouchSupported) {
				element.removeEventListener('touchstart', swipeTouchStart);
				element.removeEventListener('touchmove', swipeTouchMove);
				element.removeEventListener('touchend', swipeTouchEnd);
				element.removeEventListener('touchcancel', swipeTouchEnd);
			}
		}
	}

	function switchModal(booleanState, modalElement, nextElement, searchData) {
		if (isLogEnabled) console.log('WebApp.js: switchModal(booleanState, modalElement, nextElement, searchData)... booleanState: ' + booleanState + ', modalElement.id: ' + (modalElement? modalElement.id: '') + ', nextElement.id = ' + (nextElement? nextElement.id: '') + ', searchData: ' + searchData + ', currentPage.id = ' + (currentPage? currentPage.id: ''));
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
				WebApp.onSwitchModal(booleanState, modalElement, currentPage);
			}
		};

		if (isSwipeModalSwitch) {
			setSwipeSwitch(modalElement.children[0], booleanState);
			if (booleanState) {
				isSwipeModalSwitchLeft = (nextModalTransition === 'drawerright')? false: true;
				isSwipeModalSwitchRight = (nextModalTransition === 'drawerleft')? false: true;
			}
		}
		if (booleanState) {
			animateElement(modalElement, 'fadein', null);
			animateElement(modalElement.children[0], nextModalTransition + 'in', null);
			showElement(modalElement, searchData, currentPage);
			currentModal = modalElement;
			onSwitchModal();
		} else {
			if (nextModalTransition.lastIndexOf('swipe', 0) === 0) {
				var modalFromPx = parseInt(currentModal.children[0].style.transform.substring(
						currentModal.children[0].style.transform.lastIndexOf('(') + 1,
						currentModal.children[0].style.transform.lastIndexOf('p')));
				var modalToPx = window.innerWidth * ((nextModalTransition === 'swipe')? -1: 1);
				swipeElement(currentModal.children[0], modalFromPx, modalToPx, 25, null);
			} else {
				animateElement(modalElement.children[0], nextModalTransition + 'out', null);
			}
			animateElement(modalElement, 'fadeout', function() {
				hideElement(modalElement, searchData, nextElement);
				onSwitchModal();
			});
			currentModal = null;
			nextModalTransition = null;
		}
	}

	function animateElement(element, animation, callback) {
		if ((animation === 'nonein') || (animation === 'noneout')) {
			if (typeof callback === 'function') {
				callback();
			}
		} else {
			var animationEnded = function() {
				element.removeEventListener('animationend', animationEnded);
				element.removeEventListener('webkitAnimationEnd', animationEnded);
				element.className = element.className.replace(new RegExp('(?:^|\\s)' + animation + '(?!\\S)', 'g'), '');
				if (typeof callback === 'function') {
					callback();
				}
			};
			element.addEventListener('animationend', animationEnded);
			element.addEventListener('webkitAnimationEnd', animationEnded);
			element.className += ' ' + animation;
		}
	}

	function showElement(element, searchData, referrerElement) {
		if (isLogEnabled) console.log('WebApp.js: showElement(element, searchData, referrerElement)... element.id: ' + (element? element.id: '') + ', searchData: ' + searchData + ', referrerElement.id: ' + (referrerElement? referrerElement.id: ''));
		element.style.display = 'block';
		if (typeof element.onShow === 'function') {
			element.onShow(searchData, referrerElement);
		}
	}

	function hideElement(element, nextSearchData, nextElement) {
		if (isLogEnabled) console.log('WebApp.js: hideElement(element, nextSearchData, nextElement)... element.id: ' + (element? element.id: '') + ', nextSearchData: ' + nextSearchData + ', nextElement.id: ' + (nextElement? nextElement.id: ''));
		element.style.display = 'none';
		if (typeof element.onHide === 'function') {
			element.onHide(nextSearchData, nextElement);
		}
	}

	//################################################################################//
	// Functions related to canvas touchable actions:

	function canvasMouseDown(touchEvent) {
		if (touchEvent.button === 0) {
			if (!isTouchSupported || (Date.now() > canvasTouchLastTime + CANVAS_TOUCH_DELAY)) { // Required to solve touchEvent.preventDefault() issue.
				if (isLogEnabled) console.log('WebApp.js: canvasMouseDown(touchEvent)... X = ' + touchEvent.clientX + ', Y = ' + touchEvent.clientY);
				touchEvent.stopPropagation();
				touchEvent.preventDefault();
				isCanvasMouseDown = true;
				touchEvent.changedTouches = [{
					identifier: -1,
					clientX: touchEvent.clientX,
					clientY: touchEvent.clientY,
					pageX: touchEvent.pageX,
					pageY: touchEvent.pageY
				}];
				currentPage.onCanvasTouchableStart(touchEvent);
			}
		}
	}
	function canvasMouseMove(touchEvent) {
		if (isCanvasMouseDown && (touchEvent.button === 0)) {
			if (isLogEnabled) canvasDebugTouch += (touchEvent.clientX + ' ' + touchEvent.clientY + ', ');
			touchEvent.stopPropagation();
			touchEvent.preventDefault();
			touchEvent.changedTouches = [{
				identifier: -1,
				clientX: touchEvent.clientX,
				clientY: touchEvent.clientY,
				pageX: touchEvent.pageX,
				pageY: touchEvent.pageY
			}];
			currentPage.onCanvasTouchableMove(touchEvent);
		}
	}
	function canvasMouseUp(touchEvent) {
		if (isCanvasMouseDown && (touchEvent.button === 0)) {
			if (isLogEnabled) {
				console.log('WebApp.js: canvasMouseUp(touchEvent)... X = ' + touchEvent.clientX + ', Y = ' + touchEvent.clientY + ', canvasDebugTouch = ' + canvasDebugTouch);
				canvasDebugTouch = '';
			}
			touchEvent.stopPropagation();
			touchEvent.preventDefault();
			isCanvasMouseDown = false;
			touchEvent.changedTouches = [{
				identifier: -1,
				clientX: touchEvent.clientX,
				clientY: touchEvent.clientY,
				pageX: touchEvent.pageX,
				pageY: touchEvent.pageY
			}];
			currentPage.onCanvasTouchableEnd(touchEvent);
		}
	}

	function canvasTouchStart(touchEvent) {
		if (isLogEnabled) console.log('WebApp.js: canvasTouchStart(touchEvent)... X = ' + touchEvent.changedTouches[0].clientX + ', Y = ' + touchEvent.changedTouches[0].clientY);
		touchEvent.stopPropagation();
		touchEvent.preventDefault();
		canvasTouchLastTime = Date.now(); // Required to solve touchEvent.preventDefault() issue.
		currentPage.onCanvasTouchableStart(touchEvent);
	}
	function canvasTouchMove(touchEvent) {
		if (isLogEnabled) canvasDebugTouch += (touchEvent.changedTouches[0].clientX + ' ' + touchEvent.changedTouches[0].clientY + ', ');
		touchEvent.stopPropagation();
		touchEvent.preventDefault();
		currentPage.onCanvasTouchableMove(touchEvent);
	}
	function canvasTouchEnd(touchEvent) {
		if (isLogEnabled) {
			console.log('WebApp.js: canvasTouchEnd(touchEvent)... X = ' + touchEvent.changedTouches[0].clientX + ', Y = ' + touchEvent.changedTouches[0].clientY + ', canvasDebugTouch = ' + canvasDebugTouch);
			canvasDebugTouch = '';
		}
		touchEvent.stopPropagation();
		touchEvent.preventDefault();
		canvasTouchLastTime = Date.now(); // Required to solve touchEvent.preventDefault() issue.
		currentPage.onCanvasTouchableEnd(touchEvent);
	}

	//################################################################################//
	// Functions related to swipe page/modal actions:

	function swipeMouseDown(touchEvent) {
		if (touchEvent.button === 0) {
			if (!isTouchSupported || (Date.now() > swipeTouchLastTime + SWIPE_TOUCH_DELAY)) { // Required to emulate touchEvent.preventDefault().
				if (isLogEnabled) console.log('WebApp.js: swipeMouseDown(touchEvent)... X = ' + touchEvent.clientX + ', Y = ' + touchEvent.clientY);
				isSwipeMouseDown = true;
				touchEvent.changedTouches = [{
					identifier: -1,
					clientX: touchEvent.clientX,
					clientY: touchEvent.clientY,
					pageX: touchEvent.pageX,
					pageY: touchEvent.pageY
				}];
				swipeActionStart(touchEvent);
			}
		}
	}
	function swipeMouseMove(touchEvent) {
		if (isSwipeMouseDown && (touchEvent.button === 0)) {
			if (isLogEnabled) swipeDebugTouch += (touchEvent.clientX + ' ' + touchEvent.clientY + ', ');
			touchEvent.changedTouches = [{
				identifier: -1,
				clientX: touchEvent.clientX,
				clientY: touchEvent.clientY,
				pageX: touchEvent.pageX,
				pageY: touchEvent.pageY
			}];
			swipeActionMove(touchEvent);
		}
	}
	function swipeMouseUp(touchEvent) {
		if (isSwipeMouseDown && (touchEvent.button === 0)) {
			if (isLogEnabled) {
				console.log('WebApp.js: swipeMouseUp(touchEvent)... X = ' + touchEvent.clientX + ', Y = ' + touchEvent.clientY + ', swipeDebugTouch = ' + swipeDebugTouch);
				swipeDebugTouch = '';
			}
			isSwipeMouseDown = false;
			touchEvent.changedTouches = [{
				identifier: -1,
				clientX: touchEvent.clientX,
				clientY: touchEvent.clientY,
				pageX: touchEvent.pageX,
				pageY: touchEvent.pageY
			}];
			swipeActionEnd(touchEvent);
		}
	}

	function swipeTouchStart(touchEvent) {
		if (isLogEnabled) console.log('WebApp.js: swipeTouchStart(touchEvent)... X = ' + touchEvent.changedTouches[0].clientX + ', Y = ' + touchEvent.changedTouches[0].clientY);
		swipeTouchLastTime = Date.now(); // Required to emulate touchEvent.preventDefault().
		swipeActionStart(touchEvent);
	}
	function swipeTouchMove(touchEvent) {
		if (isLogEnabled) swipeDebugTouch += (touchEvent.changedTouches[0].clientX + ' ' + touchEvent.changedTouches[0].clientY + ', ');
		swipeActionMove(touchEvent);
	}
	function swipeTouchEnd(touchEvent) {
		if (isLogEnabled) {
			console.log('WebApp.js: swipeTouchEnd(touchEvent)... X = ' + touchEvent.changedTouches[0].clientX + ', Y = ' + touchEvent.changedTouches[0].clientY + ', swipeDebugTouch = ' + swipeDebugTouch);
			swipeDebugTouch = '';
		}
		swipeTouchLastTime = Date.now(); // Required to emulate touchEvent.preventDefault().
		swipeActionEnd(touchEvent);
	}

	function swipeActionStart(touchEvent) {
		swipeStartX = touchEvent.changedTouches[0].clientX;
		swipeStartY = touchEvent.changedTouches[0].clientY;
	}
	function swipeActionMove(touchEvent) {
		swipeMoveX = touchEvent.changedTouches[0].clientX - swipeStartX;
		swipeMoveY = touchEvent.changedTouches[0].clientY - swipeStartY;
		if (!swipeMoving && (Math.abs(swipeMoveX) > Math.abs(swipeMoveY * 2))) {
			if (currentModal) {
				if (swipeMoveX > 0 && isSwipeModalSwitchRight) {
					swipeMoving = true;
					swipeMovingPrevious = true;
				} else if (isSwipeModalSwitchLeft) {
					swipeMoving = true;
					swipeMovingNext = true;
				}
			} else {
				swipeMoving = true;
				swipeCurrentIndex = pageIds.indexOf(currentPage.id);
				swipeCurrentTop = ((currentPage.offsetTop - window.pageYOffset > 0)?
						currentPage.offsetTop - window.pageYOffset: 0) + 'px';
				if (swipeMoveX > 0) {
					swipeMovingPrevious = true;
					swipeDestinationPage = pageElements[pageIds[swipeCurrentIndex - 1]];
				} else {
					swipeMovingNext = true;
					swipeDestinationPage = pageElements[pageIds[swipeCurrentIndex + 1]];
				}
				if (swipeDestinationPage) {
					swipeDestinationPage.style.display = 'block';
					swipeDestinationPage.style.position = 'fixed';
					swipeDestinationPage.style.top = swipeCurrentTop;
					swipeDestinationPage.style.width = window.innerWidth + 'px'; // Required to solve WebKit unstable width issue.
				}
			}
		}
		if (swipeMoving) {
			touchEvent.stopPropagation();
			touchEvent.preventDefault();
			if (currentModal) {
				if (swipeMovingPrevious && swipeMoveX < 0) {
					swipeMovingPrevious = false;
					swipeMovingNext = true;
				} else if (swipeMovingNext && swipeMoveX > 0) {
					swipeMovingPrevious = true;
					swipeMovingNext = false;
				}
				if ((swipeMovingPrevious && isSwipeModalSwitchRight) ||
						(swipeMovingNext && isSwipeModalSwitchLeft)) {
					currentModal.children[0].style.transform = 'translateX(' + swipeMoveX + 'px)';
					currentModal.children[0].style.webkitTransform = 'translateX(' + swipeMoveX + 'px)';
				}
			} else {
				if (swipeMovingPrevious && swipeMoveX < 0) {
					swipeMovingPrevious = false;
					swipeMovingNext = true;
					if (swipeDestinationPage) {
						swipeDestinationPage.style.display = 'none';
						swipeDestinationPage.style.position = '';
						swipeDestinationPage.style.top = '';
						swipeDestinationPage.style.width = ''; // Required to solve WebKit unstable width issue.
						swipeDestinationPage.style.transform = '';
						swipeDestinationPage.style.webkitTransform = '';
					}
					swipeDestinationPage = pageElements[pageIds[swipeCurrentIndex + 1]];
					if (swipeDestinationPage) {
						swipeDestinationPage.style.display = 'block';
						swipeDestinationPage.style.position = 'fixed';
						swipeDestinationPage.style.top = swipeCurrentTop;
						swipeDestinationPage.style.width = window.innerWidth + 'px'; // Required to solve WebKit unstable width issue.
					}
				} else if (swipeMovingNext && swipeMoveX > 0) {
					swipeMovingPrevious = true;
					swipeMovingNext = false;
					if (swipeDestinationPage) {
						swipeDestinationPage.style.display = 'none';
						swipeDestinationPage.style.position = '';
						swipeDestinationPage.style.top = '';
						swipeDestinationPage.style.width = ''; // Required to solve WebKit unstable width issue.
						swipeDestinationPage.style.transform = '';
						swipeDestinationPage.style.webkitTransform = '';
					}
					swipeDestinationPage = pageElements[pageIds[swipeCurrentIndex - 1]];
					if (swipeDestinationPage) {
						swipeDestinationPage.style.display = 'block';
						swipeDestinationPage.style.position = 'fixed';
						swipeDestinationPage.style.top = swipeCurrentTop;
						swipeDestinationPage.style.width = window.innerWidth + 'px'; // Required to solve WebKit unstable width issue.
					}
				}
				currentPage.style.transform = 'translateX(' + swipeMoveX + 'px)';
				currentPage.style.webkitTransform = 'translateX(' + swipeMoveX + 'px)';
				if (swipeDestinationPage) {
					if (swipeMovingPrevious) {
						swipeDestinationPage.style.transform = 'translateX(' + (swipeMoveX - window.innerWidth) + 'px)';
						swipeDestinationPage.style.webkitTransform = 'translateX(' + (swipeMoveX - window.innerWidth) + 'px)';
					} else {
						swipeDestinationPage.style.transform = 'translateX(' + (window.innerWidth + swipeMoveX) + 'px)';
						swipeDestinationPage.style.webkitTransform = 'translateX(' + (window.innerWidth + swipeMoveX) + 'px)';
					}
				}
			}
		}
	}
	function swipeActionEnd(touchEvent) {
		if (swipeMoving) {
			touchEvent.stopPropagation();
			touchEvent.preventDefault();
			if (currentModal) {
				if ((Math.abs(swipeMoveX) > (currentModal.children[0].offsetWidth / 4)) &&
						((swipeMovingPrevious && isSwipeModalSwitchRight) ||
								(swipeMovingNext && isSwipeModalSwitchLeft))) {
					if (swipeMovingNext) {
						nextModalTransition = 'swipe';
					} else {
						nextModalTransition = 'swiperev';
					}
					window.history.back();
				} else {
					currentModal.children[0].style.transform = '';
					currentModal.children[0].style.webkitTransform = '';
				}
			} else {
				if (Math.abs(swipeMoveX) > (window.innerWidth / 4) && swipeDestinationPage) {
					if (swipeMovingNext) {
						nextPageTransition = 'swipe';
					} else {
						nextPageTransition = 'swiperev';
					}
					window.location.hash = swipeDestinationPage.id;
				} else {
					currentPage.style.transform = '';
					currentPage.style.webkitTransform = '';
					if (swipeDestinationPage) {
						swipeDestinationPage.style.display = 'none';
						swipeDestinationPage.style.position = '';
						swipeDestinationPage.style.top = '';
						swipeDestinationPage.style.width = ''; // Required to solve WebKit unstable width issue.
						swipeDestinationPage.style.transform = '';
						swipeDestinationPage.style.webkitTransform = '';
					}
				}
			}
			swipeMoving = false;
			swipeMovingPrevious = false;
			swipeMovingNext = false;
			swipeDestinationPage = null;
		}
		swipeStartX = 0;
		swipeStartY = 0;
		swipeMoveX = 0;
		swipeMoveY = 0;
	}

	function swipeElement(element, fromPx, toPx, stepPx, callback) {
		var newFromPx = fromPx;
		var lengthPx = Math.abs(toPx - fromPx);
		stepPx = Math.abs(stepPx) * ((toPx > fromPx)? 1: -1);
		(function swipeElementAgain() {
			newFromPx += stepPx;
			if (Math.abs(newFromPx - fromPx) >= lengthPx) {
				element.style.transform = '';
				element.style.webkitTransform = '';
				if (typeof callback === 'function') {
					callback();
				}
			} else {
				element.style.transform = 'translateX(' + newFromPx + 'px)';
				element.style.webkitTransform = 'translateX(' + newFromPx + 'px)';
				requestAnimation(swipeElementAgain);
			}
		})();
	}

	//################################################################################//
	// Functions related to user interaction:

	function keyDown(keyEvent) {
		if (isLogEnabled) console.log('WebApp.js: keyDown(keyEvent)... keyEvent.keyCode: ' + keyEvent.keyCode + ', currentPage.id: ' + (currentPage? currentPage.id: ''));
		if ((keyEvent.keyCode === 13) && keyEvent.target.onclick) {
			keyEvent.target.onclick();
		} else if ((keyEvent.keyCode === 27) && currentModal) {
			window.history.back();
		} else {
			if (typeof WebApp.onKeyDown === 'function') {
				WebApp.onKeyDown(keyEvent, currentPage);
			}
		}
	}

	function keyUp(keyEvent) {
		if (isLogEnabled) console.log('WebApp.js: keyUp(keyEvent)... keyEvent.keyCode: ' + keyEvent.keyCode + ', currentPage.id: ' + (currentPage? currentPage.id: ''));
		if (typeof WebApp.onKeyUp === 'function') {
			WebApp.onKeyUp(keyEvent, currentPage);
		}
	}

	//################################################################################//
	// User interaction API:

	/**
	 * Dispatch keyDown keyboard event.
	 * It is called automatically on window keydown event,
	 * but it is useful to simulate keyDown keyboard event for testing.
	 *
	 * @param {KeyboardEvent} keyEvent - The keyDown keyboard event.
	 */
	this.keyDown = keyDown;

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
