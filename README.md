# WebApp
WebApp is a lightweight (simple and efficient) WEB application framework (library for HTML5 projects), which allow us to fit multiple pages into a single HTML file (following the "single-page application" concept), and also provides a rich set of facilities like:
- [Minimum startup code](#minimum-startup-code);
- [Default application page](#default-application-page);
- [Dynamic page creation](#dynamic-page-creation);
- [Global elements](#global-elements);
- [Page transitions](#page-transitions);
- [Key pressed callbacks](#key-pressed-callbacks);
- [Life cycle callbacks](#life-cycle-callbacks);
- [History stack management](#history-stack-management);
- [Modal window support](#modal-window-support);
- [Canvas screen support](#canvas-screen-support) (coming soon);
- [Language (i18n) support](#language-i18n-support) (coming soon);
- [Simplified audio API](#simplified-audio-api) (coming soon);
- [Header/Footer widget API](#headerfooter-widget-api) (coming soon);
- [Tooltip widget API](#tooltip-widget-api) (coming soon);
- [Click enhancement feature](#click-enhancement-feature) (coming soon);
- [Swipe left/right feature](#Swipe-left-right-feature) (coming soon);
- [Public API](#public-api);


## Minimum startup code:
The following HTML crumb is the minimum startup code required to use WebApp framework. As we can easily guess, it creates an application containing two simple pages (_firstPage_ and _secondPage_), accessible through the corresponding file URLs _../index.html#firstPage_ and _../index.html#secondPage_ (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex01.0_minimum.html#firstPage" target="_blank">live preview</a>):

```html
<body>

<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>
	<a href="#firstPage">go to the first page</a>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

</body>
```

Where:
- `<div class="page" id="firstPage">` is the element required for page creation, which must have the class _page_, a unique _id_, and be placed as a _body's child_ element.
- `<h1>First Page</h1>` and `<a href="#secondPage">go to the second page</a>` represent the content of the page _firstPage_ (notice that only the hash data is required to create a link to the secondPage).
- `<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>` is the inclusion of WebApp framework library, which can be obtained remotely (as here it is, using GitHub _CDN_ URL) or locally (stored beside our _HTML_ file).

**Important Note:** for simplicity reasons, the above HTML code does not include any header definition, but it is strongly recommended to assure compatibility between different devices and platforms. Please include at least the _title_ and the basic _responsive_ meta tag `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex01.1_responsive.html#firstPage" target="_blank">live preview</a>):

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WebApp</title>
</head>

<body>

<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>
	<a href="#firstPage">go to the first page</a>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

</body>

</html>
```


## Default application page:
The default application page is the first _body's child_ class _page_ element, which means that the first request to the basic URL _../index.html_ (without page specification) will be redirected to _../index.html#firstPage_. If we need to set any other element, we can use _WebApp.setDefaultPageId('pageId')_ function API, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex02.0_setDefaultPageId.html#secondPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>
	<a href="#firstPage">go to the first page</a>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

<script>
	// Set default application page id:
	WebApp.setDefaultPageId('secondPage');
</script>
```

**Important Note:** WebApp function APIs must be called after the inclusion of WebApp framework library.


## Dynamic page creation:
If we need to create another page after application startup, or dynamically during execution (on run-time), we can use _WebApp.createPage('pageId', 'extraClass', 'insertBeforeId', 'pageContent')_ function API, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex03.0_createPage.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

<script>
// Create another page dynamically:
WebApp.createPage('secondPage', null, null, '<h1>Second Page</h1>'
		+ '<a href="#firstPage">go to the first page</a>');
</script>
```

And _WebApp.deletePage('pageId')_ function API can be used to remove pages (useful to release memory resources). Checkout these other dynamic page creation examples, which demonstrate better some practical utilization cases: <a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex03.1_deleteOnHide.html#firstPage" target="_blank">ex03.1_deleteOnHide.html</a>, <a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex03.2_insertNextPage.html#1" target="_blank">ex03.2_insertNextPage.html</a>, <a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex03.3_replaceNextPages.html#1" target="_blank">ex03.3_replaceNextPages.html</a>.
(note that these additional examples use _onShow_ / _onHide_ "life cycle callbacks", which were not presented yet, but are explained in the next sections)


## Global elements:
Global elements are components that must always be displayed (common between the pages, e.g.: toolbar, statusbar, menus, etc). To define an element as global, place it as a _body's child_ element (exactly as a regular page), but without the class _page_, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex04.0_globalElement.html#firstPage" target="_blank">live preview</a>):

```html
<div style="border: 1px solid gray; padding: .4em;">
	This is a global element, displayed above every page.
</div>

<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>
	<a href="#firstPage">go to the first page</a>
</div>

<div>
	<br>This is another global element,
	<br>displayed below every page.
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>
```


## Page transitions:
The soft/basic page transition "fade" is enabled by default, but if we need to set a different one, we can use _WebApp.setDefaultPageTransition('transitionType')_ function API. But if we need to set a different transition for an specific page only, we just need to set the _transition="transitionType"_ DOM element property. The available transition types are:
- 'fade' (which is the soft/basic default page transition);
- 'pop' (which simulates the "pop" appearing effect);
- 'flip' (which simulates the "flip" forward effect);
- 'fliprev' (which simulates the "flip" reverse effect);
- 'fliporder' (which also simulates the "flip" switching effect, but the direction depends on the page ordering. If switching from the first to the second page, it applies flip forward; And if switching back from the second to the first page, it applies flip reverse);
- 'slide' (which slides the pages from the right to the left);
- 'sliderev' (which slides the page from the left to the right);
- 'slideorder' (which also slides the pages, but the direction depends on the page ordering. If switching from the first to the second page, the slide occurs from the right to the left side; And if switching back from the second to the first page, the slide occurs from the left to the right side);
- 'drawertop' (which slides the pages "in" from the top, and slides it "out" also to the top, simulating a kind of drawer in the top);
- 'drawerbottom' (which slides the pages "in" from the bottom, and slides it "out" also to the bottom, simulating a kind of drawer in the bottom);
- 'drawerleft' (which slides the pages "in" from the left, and slides it "out" also to the left, simulating a kind of drawer in the left);
- 'drawerright' (which slides the pages "in" from the right, and slides it "out" also to the right, simulating a kind of drawer in the right);
- 'none' (which disables page transition).
The different page transition types can be observed/compared in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex05.0_setDefaultPageTransition.html#firstPage" target="_blank">live preview</a>):

```html
<div style="border: 1px solid gray; padding: .4em;">
	<label style="padding-left: 1em; white-space:nowrap;">
		Page transition
		<select onchange="WebApp.setDefaultPageTransition(this.value);">
			<option value="none">None</option>
			<option value="fade" selected>Fade</option>
			<option value="pop">Pop</option>
		</select>
	</label>
</div>

<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>
	<a href="#firstPage">go to the first page</a>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>
```

If we need to set an specific page transition to be used once only (without modify the default setting), we can use _WebApp.setNextPageTransition('transitionType')_ function API, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex05.1_setNextPageTransition.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>First Page</h1>

	<!-- uses soft/fade default transition -->
	<a href="#secondPage">go to the second page</a><br>

	<!-- uses Pop transition -->
	(<a href="#secondPage" onclick="WebApp.setNextPageTransition('pop')">using Pop</a>)<br>

	<!-- uses no transition -->
	(<a href="#secondPage" onclick="WebApp.setNextPageTransition('none')">no transition</a>)
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>

	<!-- uses soft/fade default transition -->
	<a href="#firstPage">go to the first page</a><br>

	<!-- uses Pop transition -->
	(<a href="#firstPage" onclick="WebApp.setNextPageTransition('pop')">using Pop</a>)<br>

	<!-- uses no transition -->
	(<a href="#firstPage" onclick="WebApp.setNextPageTransition('none')">no transition</a>)
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>
```


## Key pressed callbacks:
Key pressed callbacks are useful to set page shortcut keys, for example if we want to navigate between the available pages using left/right keys, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex06.0_onKeyDown.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
    <h1>First Page</h1>
    <a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
    <h1>Second Page</h1>
    <a href="#firstPage">go to the first page</a>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

<script>
//Set key down callback action:
WebApp.onKeyDown = function(keyEvent, pageElement) {
	if (keyEvent.keyCode === 39 /*39 = right arrow*/) {
		WebApp.nextPage();
	} else if (keyEvent.keyCode === 37 /*37 = left arrow*/) {
		WebApp.previousPage();
	}
};
</script>
```

And as we can see in the above example, onKeyDown event is dispatched globally to the WebApp object, but it can be distinguished/filtered according to the pageElement argument.


## Life cycle callbacks:
Application life cycle process is a set of pre-defined events that occurs during the application execution, which must be monitored (through callbacks) in order to execute the appropriate actions. For example, if we are developing a game, we need to know when the user minimizes the application (in order to pause the game execution, timers, etc.), and we also need to know when the user returns to the application (in order to resume the game from the point where it was paused). That is why the process callbacks are so relevant.

If you do not understand the above explanation, do not be afraid. The use of callbacks is much easier than the explanation by itself :) To implement an application callback, we just need to get the _page_ element reference (or WebApp object for global callbacks), and implement the desired function, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex07.0_callbacks.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>
	<a href="#firstPage">go to the first page</a>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

<script>
// Set global callbacks:
WebApp.onLoad = function() {
	console.log('WebApp.onLoad(): ' + (new Date().toLocaleString()));
}
WebApp.onPause = function() {
	console.log('WebApp.onPause(): ' + (new Date().toLocaleString()));
}
WebApp.onResume = function() {
	console.log('WebApp.onResume(): ' + (new Date().toLocaleString()));
}

// Set firstPage callbacks:
var firstPageElement = document.getElementById('firstPage');
firstPageElement.onShow = function(searchData, referrerElement) {
	console.log('firstPageElement.onShow(' + searchData + ', ' + (referrerElement? referrerElement.id: '') + '): ' + (new Date().toLocaleString()));
};
firstPageElement.onHide = function(nextSearchData, nextElement) {
	console.log('firstPageElement.onHide(' + nextSearchData + ', ' + nextElement.id + '): ' + (new Date().toLocaleString()));
};

// Set secondPage callbacks:
var secondPageElement = document.getElementById('secondPage');
secondPageElement.onShow = function(searchData, referrerElement) {
	console.log('secondPageElement.onShow(' + searchData + ', ' + (referrerElement? referrerElement.id: '') + '): ' + (new Date().toLocaleString()));
};
secondPageElement.onHide = function(nextSearchData, nextElement) {
	console.log('secondPageElement.onHide(' + nextSearchData + ', ' + nextElement.id + '): ' + (new Date().toLocaleString()));
};
</script>
```

**Important Note:** the available callbacks are:
- WebApp.onLoad();
- WebApp.onUnload();
- WebApp.onPause();
- WebApp.onResume();
- WebApp.onResize();
- WebApp.onUpdateHash(hashChangeEvent);
- WebApp.onSwitchPage(pageElement, referrerElement);
- WebApp.onSwitchModal(switchOn, modalElement, referrerElement);
- WebApp.onKeyDown(keyEvent, pageElement);
- pageElement.onShow(searchData, referrerElement);
- pageElement.onHide(nextSearchData, nextElement);
- pageElement.onUpdateSearch(searchData);
- modalElement.onShow(searchData, referrerElement);
- modalElement.onHide(nextSearchData, nextElement);
- modalElement.onUpdateSearch(searchData);
Where:
- `searchData` is the url content from the question mark (if present) to the end. For example, in case of `index.html#fistPage?foo=bar`, the searchData would be `foo=bar`.
- `referrerElement` is the previous displayed page element.
- `nextElement` is the page element that will be displayed.


## History stack management:
The primary purpose of WebApp history stack management engine is to emulate "back key" event when the subsequent page is the same of the previous visited one, in order to keep the Internet browser history stack compliant with the user navigation flow (this feature is activated by default, but if we need to disable it, we can use _WebApp.setHistoryManaged(false)_ function API).

** User navigation example:**
```
 page      unmanaged    managed
loading     history     history
 #pg1        #pg1        #pg1 <--
  |           |           |      ^  (back event
  V           V           V      |   emulation)
 #pg2        #pg2        #pg2 -->
  |           |
  V           V
 #pg1        #pg1
```

As a similar feature, this history management engine presents the "unique entry" stack concept, which compares the subsequent page with all previous visited ones, and emulates "back key" event(s) up to reach the matched instance (this feature is also activated by default, but if we need to disable it, we can use _WebApp.setHistoryUnique(false)_ function API).

** User navigation example:**
```
 page      unmanaged    managed history    managed history
loading     history     (unique false)     (unique true)
 #pg1        #pg1            #pg1               #pg1 <--
  |           |               |                  |      ^
  V           V               V                  V      |  (back event
 #pg2        #pg2            #pg2               #pg2    |   emulation)
  |           |               |                  |      |
  V           V               V                  V      |
 #pg3        #pg3            #pg3               #pg3 -->
  |           |               |
  V           V               V
 #pg1        #pg1            #pg1
```

And another interesting behavior, is the "default page firstly" feature, which inserts the default page at the beginning of the history stack when any other page is explicitly requested firstly. (this feature is also activated by default, but if we need to disable it, we can use _WebApp.setDefaultPageFirstly(false)_ function API).

** User navigation example:**
```
 page      unmanaged           managed history
loading     history            (default first)
                                    #pg1 <--
                                            ^
                                            |  (returns to
 #pg2        #pg2 <--               #pg2    |   #pg1, which
  |           |      ^               |      |   is inserted
  V           V      | (do not       V      |   dynamically)
press       press    |  change)    press    |
back key    back key ^             back key ^
```


## Modal window support:
Modal window are elements designed to appear over page elements. The primary purpose is to display pop-up dialogs, but it can also be customized to display smaller components, like a simple menu, for example. Similar to page elements, modal windows visibility is also controlled by the file URL hash data, which must contain the corresponding element "id". And this mechanism is interesting because it allow us to hide/close the modal by pressing the browser back key. Also similar to page nodes, the code required to use modal elements must be placed as a _body's child_ element, an it also must have the class _modal_, and a unique _id_, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex09.0_modalWindow.html#firstPage" target="_blank">live preview</a>):

```html
<body>

<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>
	<a href="#firstPage">go to the first page</a>
</div>

<div class="modal" id="modalWindow">
	<div style="padding: 0.5em;">
		<h1>Modal Window</h1>
		<a href="#firstPage">#firstPage</a> | <a href="#secondPage">#secondPage</a>
		<br><br>
		<a href="javascript:window.history.back();">(hide modal)</a>
	</div>
</div>

<br>
<a href="#modalWindow">(show modal)</a>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

</body>
```

**Important Note:** the whole modal content must be inside another single element (which in this case is using style padding: 0.5em), in order to generate a single pop-up dialog.

If we need a modal window that closes automatically on click outside the dialog content, we can use the following implementation with "onclick" handling instead (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex09.1_hideOnClickOutside.html#firstPage" target="_blank">live preview</a>):

```html
<div class="modal" id="modalWindow" onclick="window.history.back();">
	<div style="padding: 0.5em;" onclick="event.stopPropagation();">
		<h1>Modal Window</h1>
		<a href="#firstPage">#firstPage</a> | <a href="#secondPage">#secondPage</a>
		<br><br>
		<a href="javascript:window.history.back();">(hide modal)</a>
	</div>
</div>
```

If we need to create another modal after application startup, or dynamically during execution (on run-time), we can use _WebApp.createModal('modalId', 'extraClass', 'modalContent')_ function API, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex09.2_createModal.html#firstPage" target="_blank">live preview</a>), and _WebApp.deleteModal('modalId')_ function API can be used to remove modals (useful to release memory resources):

```html
<body>

<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>
	<a href="#firstPage">go to the first page</a>
</div>

<br>
<a href="#modalWindow">(show modal)</a>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

<script>
// Create modal dynamically:
WebApp.createModal('modalWindow', null, '<div style="padding: 0.5em;">'
		+ '<h1>Modal Window</h1>'
		+ '<a href="#firstPage">#firstPage</a> | <a href="#secondPage">#secondPage</a>'
		+ '<br><br>'
		+ '<a href="javascript:window.history.back();">(hide modal)</a>'
		+ '</div>');
</script>

</body>
```

The pop-up modal transition "pop" is enabled by default, but if we need to set a different one, we can use _WebApp.setDefaultModalTransition('transitionType')_ function API. But if we need to set a different transition for an specific modal only, we just need to set the _transition="transitionType"_ DOM element property. And if we need to set an specific modal transition to be used once only (without modify the default setting), we can use _WebApp.setNextModalTransition('transitionType')_ function API, similar as described in the "page transitions" section. The following example demonstrates how to create a simple modal "drawer element" and a simple modal "top menu" (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex09.3_modalMenus.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#modalSideMenu">Side Menu</a> |
	<a href="#modalTopMenu">Top Menu</a>
</div>

<div class="modal" id="modalTopMenu" onclick="window.history.back();">
	<div transition="drawertop" onclick="event.stopPropagation();"
			style="border-radius: 0; margin: 0 0 auto auto; max-width: 300px; padding: 0.5em;">
		<h2>Modal - Top Menu</h2>
		<br>
		<a href="javascript:window.history.back();">(hide modal)</a>
	</div>
</div>

<div class="modal" id="modalSideMenu" onclick="window.history.back();">
	<div transition="drawerleft" onclick="event.stopPropagation();"
			style="border-radius: 0; margin: 0; max-width: 300px; padding: 0.5em;
				position: fixed; top: 0; bottom: 0; left: 0; overflow: auto;">
		<h2>Modal - Side Menu</h2>
		<br>
		<a href="javascript:window.history.back();">(hide modal)</a>
	</div>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>
```

Another interesting use case for modal window pop-ups, is the "exit dialog" emulation possibility, which alerts the user when returning, in order to prevent data loss. The following example demonstrates how to create a simple "exit dialog" confirmation, which alerts the user when returning from the second to the first page (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/examples/ex09.4_exitDialog.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>WebApp - <span style="color:#004;">First Page</span></h1>
	<p>If you are viewing this page (firstPage), it means that the current browser URL ends with "#firstPage"</p>
	<a href="#secondPage?modal">go to the next page</a>
</div>

<div class="page" id="secondPage">
	<h1>WebApp - <span style="color:#040;">Second Page</span></h1>
	<p>If you are viewing this page (secondPage), it means that the current browser URL ends with "#secondPage"</p>
	<a href="javascript:window.history.back();">return to the previous</a>
</div>

<div class="modal" id="returnDialog" onclick="window.history.back();">
	<div style="padding: 0.5em; text-align: center;" onclick="event.stopPropagation();">
		<p>Are you sure you want to return to the previous page?</p>
		<button onclick="window.history.back();">Cancel</button>&nbsp;&nbsp;
		<button onclick="window.location.hash = '#firstPage';">Return</button>
	</div>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

<script>
// Set secondPage callbacks:
var secondPageElement = document.getElementById('secondPage');
secondPageElement.onShow = function(searchData, referrerElement) {
	if (searchData && searchData === 'modal') {
		window.location.hash = 'secondPage';
	}
};
secondPageElement.onUpdateSearch = function(searchData) {
	if (searchData && searchData === 'modal') {
		window.location.hash = 'returnDialog';
	}
};
</script>
```


## Canvas screen support:
Coming soon...


## Language (i18n) support:
Coming soon...


## Simplified audio API:
Coming soon...


## Header/Footer widget API:
Coming soon...


## Tooltip widget API:
Coming soon...


## Click enhancement feature:
Coming soon...


## Swipe left/right feature:
Coming soon...


## Public API:

#### isLogEnabled()
Returns the log enabled boolean state, which is responsible to show/hide WebApp console.log messages.

**Returns:** {boolean} The log enabled boolean state.

#### setLogEnabled(booleanState)
Set the log enabled boolean state, which is responsible to show/hide WebApp console.log messages.

**Parameters:**

| Name         | Type    | Description                    |
|--------------|---------|--------------------------------|
| booleanState | boolean | The log enabled boolean state. |

#### isRunning()
Returns the running boolean state, which represents the current status of WebApp.

**Returns:** {boolean} The running boolean state.

#### setRunning(booleanState)
Set the running boolean state, which represents the current status of WebApp.

**Parameters:**

| Name         | Type    | Description                |
|--------------|---------|----------------------------|
| booleanState | boolean | The running boolean state. |

#### getPageIds()
Get the pageIds array values, which contains the list of IDs corresponding to the current loaded pages.

**Returns:** {array} The list of IDs corresponding to the current loaded pages.

#### getPageElements()
Get the pageElements object reference, which contains the key-value database (pageId: element) corresponding to the current loaded pages.

**Returns:** {array} The key-value database (pageId: element) corresponding to the current loaded pages.

#### getDefaultPageId()
Get the default page id string value, which must be shown in the first request to the basic URL (default value: the first body's child class page element id).

**Returns:** {string} The default page id string value.

#### setDefaultPageId(pageId)
Set the default page id string value, which must be shown in the first request to the basic URL (default value: the first body's child class page element id).

**Parameters:**

| Name   | Type   | Description                       |
|--------|--------|-----------------------------------|
| pageId | string | The default page id string value. |

#### createPage(pageId, extraClass, insertBeforeId, pageContent)
Create page dynamically, without any previous HTML code declaration, and load it according to the insertBeforeId value.

**Parameters:**

| Name           | Type   | Description                          |
|----------------|--------|--------------------------------------|
| pageId         | string | The new page id string value.        |
| extraClass     | string | Extra class which must be assigned.  |
| insertBeforeId | string | The existent page id to be the next. |
| pageContent    | string | The new page content string value.   |

**Returns:** {node} The new page node element.

#### deletePage(pageId)
Delete page dynamically, and unload it, in order to release memory resources.

**Parameters:**

| Name   | Type   | Description               |
|--------|--------|---------------------------|
| pageId | string | The page id string value. |

#### getModalIds()
Get the modalIds array values, which contains the list of IDs corresponding to the current loaded modals.

**Returns:** {array} The list of IDs corresponding to the current loaded modals.

#### getModalElements()
Get the modalElements object reference, which contains the key-value database (modalId: element) corresponding to the current loaded modals.

**Returns:** {array} The key-value database (modalId: element) corresponding to the current loaded modals.

#### createModal(modalId, extraClass, modalContent)
Create modal dynamically, without any previous HTML code declaration, and load it.

**Parameters:**

| Name         | Type   | Description                         |
|--------------|--------|-------------------------------------|
| modalId      | string | The new modal id string value.      |
| extraClass   | string | Extra class which must be assigned. |
| modalContent | string | The new modal content string value. |

**Returns:** {node} The new modal node element.

#### deleteModal(modalId)
Delete modal dynamically, and unload it, in order to release memory resources.

**Parameters:**

| Name    | Type   | Description                |
|---------|--------|----------------------------|
| modalId | string | The modal id string value. |

#### isDefaultPageFirstly()
Returns the default page firstly boolean state, which indicates if the default page must be inserted firstly.

**Returns:** {boolean} The default page firstly boolean state.

#### setDefaultPageFirstly(booleanState)
Set the default page firstly boolean state, which indicates if the default page must be inserted firstly.

**Parameters:**

| Name         | Type    | Description                              |
|--------------|---------|------------------------------------------|
| booleanState | boolean | The default page firstly boolean state.  |

#### isHistoryManaged()
Returns the history managed boolean state, which indicates if the stack must be manipulate by WebApp.

**Returns:** {boolean} The history managed boolean state.

#### setHistoryManaged(booleanState)
Set the history managed boolean state, which indicates if the stack must be manipulate by WebApp.

**Parameters:**

| Name         | Type    | Description                        |
|--------------|---------|------------------------------------|
| booleanState | boolean | The history managed boolean state. |

#### isHistoryUnique()
Returns the history unique boolean state, which indicates if the page entries must be unique in the stack.

**Returns:** {boolean} The history unique boolean state.

#### setHistoryUnique(booleanState)
Set the history unique boolean state, which indicates if the page entries must be unique in the stack.

**Parameters:**

| Name         | Type    | Description                       |
|--------------|---------|-----------------------------------|
| booleanState | boolean | The history unique boolean state. |

#### isRedirection()
Returns the redirection boolean state, which indicates if the next updateHash event must be bypassed.

**Returns:** {boolean} The redirection boolean state.

#### setIsRedirection(booleanState)
Set the redirection boolean state, which indicates if the next updateHash event must be bypassed.

**Parameters:**

| Name         | Type    | Description                    |
|--------------|---------|--------------------------------|
| booleanState | boolean | The redirection boolean state. |

#### getHistoryStack()
Get the historyStack array values, which contains the href historyStack, according to the history stack management.

**Returns:** {array} The href historyStack, according to the history stack management.

#### animateElement(element, animation, callback)
Animate a node element, according to the supplied animation type (@see getAnimationTypes).

**Parameters:**

| Name      | Type     | Description                                          |
|-----------|----------|------------------------------------------------------|
| element   | node     | The node element to be animated.                     |
| animation | string   | The animation type to be applied.                    |
| callback  | function | The function callback to be invoked after animation. |

#### getAnimationTypes()
Get the available animation types, to be applied on node elements (@see animateElement).

**Returns:** {array} An array containing the available animation types.

#### getTransitionTypes()
Get the available transition types, to be used between page switching.

**Returns:** {array} An array containing the available transition types.

#### getDefaultPageTransition()
Get the default transition type, to be used between every page switching.

**Returns:** {string} The default page transition type.

#### setDefaultPageTransition(transitionType)
Set the default transition type, to be used between every page switching.

**Parameters:**

| Name           | Type   | Description                       |
|----------------|--------|-----------------------------------|
| transitionType | string | The default page transition type. |

#### getNextPageTransition()
Get the next transition type, to be used between the next page switching only.

**Returns:** {string} The next page transition type.

#### setNextPageTransition(transitionType)
Set the next transition type, to be used between the next page switching only.

**Parameters:**

| Name           | Type   | Description                    |
|----------------|--------|--------------------------------|
| transitionType | string | The next page transition type. |

#### getDefaultModalTransition()
Get the default transition type, to be used between every modal switching.

**Returns:** {string} The default modal transition type.

#### setDefaultModalTransition(transitionType)
Set the default transition type, to be used between every modal switching.

**Parameters:**

| Name           | Type   | Description                       |
|----------------|--------|-----------------------------------|
| transitionType | string | The default modal transition type. |

#### getNextModalTransition()
Get the next transition type, to be used between the next modal switching only.

**Returns:** {string} The next modal transition type.

#### setNextModalTransition(transitionType)
Set the next transition type, to be used between the next modal switching only.

**Parameters:**

| Name           | Type   | Description                    |
|----------------|--------|--------------------------------|
| transitionType | string | The next modal transition type. |

#### load()
Load the WebApp framework library. It is called automatically after DOMContentLoaded event, but it is useful to reset/reload page elements (according to the current body's children nodes).

#### unload()
Unload the WebApp framework library. It is called automatically after window.onunload event, but it is useful to simulate unload event for testing.

#### reset()
Reset the WebApp framework library. It is called automatically after window.onunload event, but it is useful to simulate reset event for testing.

#### nextPage()
Go to the next page (when available), according to the available pageIds (@see getPageIds).

#### previousPage()
Go to the previous page (when available), according to the available pageIds (@see getPageIds).
