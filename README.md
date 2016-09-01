# WebApp
WebApp is a lightweight (simple and efficient) WEB application framework (library for HTML5 projects), which allow us to fit multiple pages into a single HTML file (following the "single-page application" concept), and several other facilities like:
- [Minimum startup code](#minimum-startup-code);
- [Default application page](#default-application-page);
- [Dynamic page creation](#dynamic-page-creation);
- [Global elements](#global-elements);
- [Page transitions](#page-transitions);
- [Key pressed callbacks](#key-pressed-callbacks);
- [Life cycle callbacks](#life-cycle-callbacks);
- [History stack management](#history-stack-management) (coming soon);
- [Friendly header/menu API](#friendly-Header-Menu-api) (coming soon);
- [Canvas screen support](#canvas-screen-support) (coming soon);
- [Simplified audio API](#simplified-audio-api) (coming soon);
- [Tooltip widget API](#tooltip-widget-api) (coming soon);
- [Language (i18n) support](#language-i18n-support) (coming soon);
- [Click enhancement feature](#click-enhancement-feature) (coming soon);
- [Swipe left/right feature](#Swipe-left-right-feature) (coming soon);
- [Public API](#public-api);
  - [isLogEnabled()](#islogenabled)
  - [setLogEnabled(booleanState)](#setlogenabledbooleanstate)
  - [isRunning()](#isrunning)
  - [setRunning(booleanState)](#setrunningbooleanstate)
  - [getPageIds()](#getPageIds)
  - [getDefaultPageId()](#getdefaultpageid)
  - [setDefaultPageId(pageId)](#setdefaultpageidpageid)
  - [animateElement(element, animation, callback)](#animateelementelement-animation-callback)
  - [getAnimationTypes()](#getanimationtypes)
  - [getTransitionTypes()](#gettransitiontypes)
  - [getDefaultTransition()](#getdefaulttransition)
  - [setDefaultTransition(transitionType)](#setdefaulttransitiontransitiontype)
  - [getNextTransition()](#getnexttransition)
  - [setNextTransition(transitionType)](#setnexttransitiontransitiontype)
  - [load()](#load)
  - [createPage(pageId, pageContent, insertBeforeId)](#createpagepageid-pagecontent-insertbeforeid)
  - [deletePage(pageId)](#deletepagepageid)
  - [nextPage()](#nextpage)
  - [previousPage()](#previouspage)


## Minimum startup code:
The following HTML crumb is the minimum startup code required to use WebApp framework. As you can easily guess, it creates an application containing two simple pages (_firstPage_ and _secondPage_), accessible through the corresponding file URLs _../index.html#firstPage_ and _../index.html#secondPage_ (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex01.0_minimum.html#firstPage" target="_blank">live preview</a>).

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
- `<div class="page" id="firstPage">` is the element required for page creation, which must have the class _page_, contains a unique _id_, and be placed as a _body's child_ element.
- `<h1>First Page</h1>` and `<a href="#secondPage">go to the second page</a>` represent the content of the page _firstPage_ (notice that only the hash data is required to create a link to the secondPage).
- `<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>` is the inclusion of WebApp framework library, which can be obtained remotely (as here it is, using GitHub _CDN_ URL) or locally (stored beside your _HTML_ file).

**Important Note:** for simplicity reasons, the above HTML code does not include any header definition, but it is strongly recommended to assure compatibility between different devices and platforms. Please include at least the _title_ and the basic _responsive_ meta tag `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex01.1_responsive.html#firstPage" target="_blank">live preview</a>):

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
The default application page is the first _body's child_ class _page_ element, which means that the first request to the basic URL _../index.html_ (without page specification) will be redirected to _../index.html#firstPage_. If you need to set any other element, use _WebApp.setDefaultPageId('pageId')_ function API, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex02.0_setDefaultPageId.html#secondPage" target="_blank">live preview</a>):

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
If you need to load another page after application startup, or dynamically during execution (on run-time), use _WebApp.createPage('pageId', 'pageContent')_ API, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex03.0_createPage.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>First Page</h1>
	<a href="#secondPage">go to the second page</a>
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>

<script>
// Create another page dynamically:
WebApp.createPage('secondPage', '<h1>Second Page</h1>'
		+ '<a href="#firstPage">go to the first page</a>');
</script>
```

And _WebApp.deletePage('pageId')_ API can be used to remove pages (useful to release memory resources). Checkout these other dynamic page creation examples, which demonstrate better some practical utilization cases: <a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex03.1_deleteOnHide.html#firstPage" target="_blank">ex03.1_deleteOnHide.html</a>, <a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex03.2_insertNextPage.html#1" target="_blank">ex03.2_insertNextPage.html</a>, <a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex03.3_replaceNextPages.html#1" target="_blank">ex03.3_replaceNextPages.html</a>.
(note that these additional examples use _onShow_ / _onHide_ "life cycle callbacks", which were not presented yet, but are explained in the next sections)


## Global elements:
Global elements are components that must always be displayed (common between the pages, e.g.: toolbar, statusbar, menus, etc). To define an element as global, place it as a _body's child_ element (exactly as a regular page), but without the class _page_, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex04.0_globalElement.html#firstPage" target="_blank">live preview</a>):

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
The soft/basic page transition "fadein" is enabled by default, but if you need to set a different one, use _WebApp.setDefaultTransition('transitionType')_ function API. The available transition types are:
- 'fade' (which is the soft/basic default page transition);
- 'pop' (which simulates the "pop" appearing effect);
- 'flip' (which simulates the "flip" forward effect);
- 'fliprev' (which simulates the "flip" reverse effect);
- 'fliporder' (which also simulates the "flip" switching effect, but the direction depends on the page ordering. If switching from the first to the second page, it applies flip forward; And if switching back from the second to the first page, it applies flip reverse);
- 'slide' (which slides the pages from the right to the left);
- 'sliderev' (which slides the page from the left to the right);
- 'slideorder' (which also slides the pages, but the direction depends on the page ordering. If switching from the first to the second page, the slide occurs from the right to the left side; And if switching back from the second to the first page, the slide occurs from the left to the right side);
- 'none' (which disables page transition).
The different page transition types can be observed/compared in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex05.0_setDefaultTransition.html#firstPage" target="_blank">live preview</a>):

```html
<div style="border: 1px solid gray; padding: .4em;">
	<label style="padding-left: 1em; white-space:nowrap;">
		Transition
		<select onchange="WebApp.setDefaultTransition(this.value);">
			<option value="none">None</option>
			<option value="fade" selected>Fade</option>
			<option value="pop">Pop</option>
			<option value="flip">Flip</option>
			<option value="fliprev">Flip Reverse</option>
			<option value="fliporder">Flip Order</option>
			<option value="slide">Slide</option>
			<option value="sliderev">Slide Reverse</option>
			<option value="slideorder">Slide Order</option>
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

**Important Note:** if you need to set an specific transition to be used once only (without modify the default setting), use _WebApp.setNextTransition('transitionType')_ function API, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex05.1_setNextTransition.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>First Page</h1>

	<!-- uses soft/fade default transition -->
	<a href="#secondPage">go to the second page</a><br>

	<!-- uses Pop transition -->
	(<a href="#secondPage" onclick="WebApp.setNextTransition('pop')">using Pop</a>)<br>

	<!-- uses Flip transition -->
	(<a href="#secondPage" onclick="WebApp.setNextTransition('flip')">using Flip</a>)<br>

	<!-- uses Slide transition -->
	(<a href="#secondPage" onclick="WebApp.setNextTransition('slide')">using Slide</a>)<br>

	<!-- uses no transition -->
	(<a href="#secondPage" onclick="WebApp.setNextTransition('none')">no transition</a>)
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>

	<!-- uses soft/fade default transition -->
	<a href="#firstPage">go to the first page</a><br>

	<!-- uses Pop transition -->
	(<a href="#firstPage" onclick="WebApp.setNextTransition('pop')">using Pop</a>)<br>

	<!-- uses Flip transition -->
	(<a href="#firstPage" onclick="WebApp.setNextTransition('flip')">using Flip</a>)<br>

	<!-- uses Slide transition -->
	(<a href="#firstPage" onclick="WebApp.setNextTransition('slide')">using Slide</a>)<br>

	<!-- uses no transition -->
	(<a href="#firstPage" onclick="WebApp.setNextTransition('none')">no transition</a>)
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>
```


## Key pressed callbacks:
Key pressed callbacks are useful to set page shortcut keys, for example if you want to navigate between the available pages using left/right keys, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex06.0_onKeyDown.html#firstPage" target="_blank">live preview</a>):

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
// Set firstPage key down callback action:
document.getElementById('firstPage').onKeyDown = function(keyEvent) {
	if (keyEvent.keyCode === 39 /*39 = right arrow*/) WebApp.nextPage();
};

// Set secondPage key down callback action:
document.getElementById('secondPage').onKeyDown = function(keyEvent) {
	if (keyEvent.keyCode === 37 /*37 = left arrow*/) WebApp.previousPage();
};
</script>
```

And as you can see in the above example, onKeyDown event is dispatched to the current/active page only.


## Life cycle callbacks:
Application life cycle process is a set of pre-defined events that occurs during the application execution, which must be monitored (through callbacks) in order to execute the appropriate actions. For example, if you are developing a game, you need to know when the use minimizes the application (in order to pause the game execution, timers, etc.), and you also need to know when the user returns to the application (in order to resume the game from the point where it was paused). That is why the process callbacks are so relevant.

If you do not understand the above explanation, do not be afraid. The use of callbacks is much easier than the explanation itself :) To implement an application callback, you just need to get the _page_ element reference (or WebApp object for global callbacks), and implement the desired function, as demonstrated in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/ex07.0_callbacks.html#firstPage" target="_blank">live preview</a>):

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
WebApp.onPause = function() {
	console.log('WebApp.onPause(): ' + (new Date().toLocaleString()));
}
WebApp.onResume = function() {
	console.log('WebApp.onResume(): ' + (new Date().toLocaleString()));
}

// Set firstPage callbacks:
var firstPageElement = document.getElementById('firstPage');
firstPageElement.onLoad = function() {
	console.log('firstPageElement.onLoad(): ' + (new Date().toLocaleString()));
};
firstPageElement.onShow = function(searchData) {
	console.log('firstPageElement.onShow(' + searchData + '): ' + (new Date().toLocaleString()));
};
firstPageElement.onHide = function() {
	console.log('firstPageElement.onHide(): ' + (new Date().toLocaleString()));
};

// Set secondPage callbacks:
var secondPageElement = document.getElementById('secondPage');
secondPageElement.onLoad = function() {
	console.log('secondPageElement.onLoad(): ' + (new Date().toLocaleString()));
};
secondPageElement.onShow = function(searchData) {
	console.log('secondPageElement.onShow(' + searchData + '): ' + (new Date().toLocaleString()));
};
secondPageElement.onHide = function() {
	console.log('secondPageElement.onHide(): ' + (new Date().toLocaleString()));
};
</script>
```

**Important Note:** the available callbacks are:
- WebApp.onLoad();
- WebApp.onUnload();
- WebApp.onPause();
- WebApp.onResume();
- WebApp.onResize();
- pageElement.onLoad();
- pageElement.onShow(searchData);
- pageElement.onSearchChange(searchData);
- pageElement.onHide();
Where:
- `searchData` is the url content from the question mark (if present) to the end. For example, in case of `index.html#fistPage?foo=bar`, the searchData would be `foo=bar`.


## History stack management:
The primary functionality of WebApp history stack management engine is to emulate "back key" action when the subsequent page is the same of the previous visited one, in order to keep the Internet browser history stack compliant with the user navigation flow (this feature is activated by default, but if you need to disable it, use _WebApp.setHistoryManaged(false)_ function API). And some other powerful functionalities are:

**History inserted page:** if you need to insert an intermediate page... Coming soon...

**History bypassed page:** if you need to ignore an intermediate page... Coming soon...


## Friendly header/menu API:
Coming soon...


## Canvas screen support:
Coming soon...


## Simplified audio API:
Coming soon...


## Tooltip widget API:
Coming soon...


## Language (i18n) support:
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
Get the pageIds array values, which contains the list of current loaded pages.

**Returns:** {array} The list of IDs corresponding to the current loaded page.

#### getDefaultPageId()
Get the default page id string value, which must be shown in the first request to the basic URL (default value: the first body's child class page element id).

**Returns:** {string} The default page id string value.

#### setDefaultPageId(pageId)
Set the default page id string value, which must be shown in the first request to the basic URL (default value: the first body's child class page element id).

**Parameters:**

| Name   | Type   | Description                       |
|--------|--------|-----------------------------------|
| pageId | string | The default page id string value. |



#### isHistoryManaged()
Returns the history managed boolean state, which indicates if the stack must be manipulate by WebApp.

**Returns:** {boolean} The history managed boolean state.

#### setHistoryManaged(booleanState)
Set the history managed boolean state, which indicates if the stack must be manipulate by WebApp.

**Parameters:**

| Name         | Type    | Description                        |
|--------------|---------|------------------------------------|
| booleanState | boolean | The history managed boolean state. |




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

#### getDefaultTransition()
Get the default transition type, to be used between every page switching.

**Returns:** {string} The default transition type.

#### setDefaultTransition(transitionType)
Set the default transition type, to be used between every page switching.

**Parameters:**

| Name           | Type   | Description                  |
|----------------|--------|------------------------------|
| transitionType | string | The default transition type. |

#### getNextTransition()
Get the next transition type, to be used between the next page switching only.

**Returns:** {string} The next transition type.

#### setNextTransition(transitionType)
Set the next transition type, to be used between the next page switching only.

**Parameters:**

| Name           | Type   | Description               |
|----------------|--------|---------------------------|
| transitionType | string | The next transition type. |

#### load()
Load the WebApp framework library. It is called automatically after DOMContentLoaded event, but it is usefull to reset/reload page elements (according to the current body's children nodes).

#### createPage(pageId, pageContent, insertBeforeId)
Create page dynamically, without any previous HTML code declaration, and load it according to insertBeforeId value.

**Parameters:**

| Name           | Type     | Description                          |
|----------------|----------|--------------------------------------|
| pageId         | string   | The new page id string value.        |
| pageContent    | string   | The new page content string value.   |
| insertBeforeId | string   | The existent page id to be the next. |

**Returns:** {node} The new page node element

#### deletePage(pageId)
Delete page dynamically, and unload it, in order to release memory resources.

**Parameters:**

| Name   | Type   | Description               |
|--------|--------|---------------------------|
| pageId | string | The page id string value. |

#### nextPage()
Go to the next page (when available), according to the available pageIds (@see getPageIds).

#### previousPage()
Go to the previous page (when available), according to the available pageIds (@see getPageIds).
