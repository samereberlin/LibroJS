# WebApp
WebApp is a lightweight (simple and efficient) WEB application framework (library for HTML5 projects), which allow us to fit multiple pages into a single HTML file (following the "single-page application" concept), and several other facilities like:
- [Minimum code required](#minimum-code-required);
- [Default application page](#default-application-page);
- [Dynamic page loading](#dynamic-page-loading) (coming soon);
- [Global elements](#global-elements);
- [Page transitions](#page-transitions);
- [History manipulation](#history-manipulation) (coming soon);
- [History inserted page](#history-inserted-page) (coming soon);
- [History bypassed page](#history-bypassed-page) (coming soon);
- [Life cycle callbacks](#life-cycle-callbacks);
- [Friendly header/menu API](#friendly-Header-Menu-api) (coming soon);
- [Canvas screen support](#canvas-screen-support) (coming soon);
- [Simplified audio API](#simplified-audio-api) (coming soon);
- [Tooltip widget API](#tooltip-widget-api) (coming soon);
- [Internationalization support](#internationalization-support) (coming soon);
- [Language (i18n) support](#language-i18n-support) (coming soon);
- [Click enhancement feature](#click-enhancement-feature) (coming soon);


## Minimum code required:
The following HTML crumb is the minimum code required to use WebApp framework. As you can easily guess, it creates an application containing two simple pages (_firstPage_ and _secondPage_), accessible through the corresponding file URLs _../index.html#firstPage_ and _../index.html#secondPage_ (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_minimum.html#firstPage" target="_blank">live preview</a>).

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
- `<h1>First Page</h1>` and `<a href="#secondPage">go to the second page</a>` represent the content of the page _firstPage_ (note that only the hash data is required to create a link to the secondPage).
- `<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>` is the inclusion of WebApp framework library, which can be obtained remotely (as here it is, using GitHub _CDN_ URL) or locally (stored beside your _HTML_ file).

**Important Note:** for simplicity reasons, the above HTML code does not include any header definition, but it is strongly recommended to assure compatibility between different devices and platforms. Please include at least the _title_ and the basic _responsive_ meta tag `<meta name="viewport" content="width=device-width, initial-scale=1.0">` as the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_responsive.html#firstPage" target="_blank">live preview</a>):

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
The default application page is the first _body's child_ class _page_ element, which means that the first request to the basic URL _../index.html_ (without page specification) will be redirected to _../index.html#firstPage_. If you need to set any other element, use _WebApp.setDefaultPageId('secondPage')_ function API, as the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_setDefaultPageId.html#secondPage" target="_blank">live preview</a>):

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


## Dynamic page loading:
Coming soon...


## Global elements:
Global elements are components that must always be displayed (common between the pages, e.g.: toolbar, statusbar, menus, etc). To define an element as global, place it as a _body's child_ element (exactly as a regular page), but without the class _page_, as the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_globalelement.html#firstPage" target="_blank">live preview</a>):

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
- 'slide' (which slides the new page from the right to the left);
- 'sliderev' (which slides the new page from the left to the right);
- 'slideorder' (which also slides the new page, but the direction depends on the page ordering. If switching from the first to the second page, the slide occurs from the right to the left side; And if switching back from the second to the first page, the slide occurs from the left to the right side);
- 'none' (which disables page transition).
The different page transition types can be observed/compared in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_setDefaultTransition.html#firstPage" target="_blank">live preview</a>):

```html
<div style="border: 1px solid gray; padding: .4em;">
	<label style="padding-left: 1em; white-space:nowrap;">
		Transition
		<select onchange="WebApp.setDefaultTransition(this.value);">
			<option value="none">None</option>
			<option value="fade" selected>Fade</option>
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

**Important Note:** if you need to set an specific transition to be used once only (without modify the default setting), use _WebApp.setNextTransition('transitionType')_ function API, according to the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_setNextTransition.html#firstPage" target="_blank">live preview</a>):

```html
<div class="page" id="firstPage">
	<h1>First Page</h1>

	<!-- uses soft/fade default transition -->
	<a href="#secondPage">go to the second page</a>

	<!-- uses Slide transition -->
	(<a href="#secondPage" onclick="WebApp.setNextTransition('slide')">using Slide</a>)

	<!-- uses Slide Reverse transition -->
	(<a href="#secondPage" onclick="WebApp.setNextTransition('sliderev')">Slide Reverse</a>)

	<!-- uses Slide Order transition -->
	(<a href="#secondPage" onclick="WebApp.setNextTransition('slideorder')">Slide Order</a>)

	<!-- uses no transition -->
	(<a href="#secondPage" onclick="WebApp.setNextTransition('none')">no transition</a>)
</div>

<div class="page" id="secondPage">
	<h1>Second Page</h1>

	<!-- uses soft/fade default transition -->
	<a href="#firstPage">go to the first page</a>

	<!-- uses Slide transition -->
	(<a href="#firstPage" onclick="WebApp.setNextTransition('slide')">using Slide</a>)

	<!-- uses Slide Reverse transition -->
	(<a href="#firstPage" onclick="WebApp.setNextTransition('sliderev')">Slide Reverse</a>)

	<!-- uses Slide Order transition -->
	(<a href="#firstPage" onclick="WebApp.setNextTransition('slideorder')">Slide order</a>)

	<!-- uses no transition -->
	(<a href="#firstPage" onclick="WebApp.setNextTransition('none')">no transition</a>)
</div>

<script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"></script>
```


## History manipulation:
Coming soon...


## History inserted page:
Coming soon...


## History bypassed page:
Coming soon...


## Life cycle callbacks:
Application life cycle process is a set of pre-defined events that occurs during the application execution, which must be monitored (through callbacks) in order to execute the appropriate actions. For example, if you are developing a game, you need to know when the use minimizes the application (in order to pause the game execution, timers, etc.), and you also need to know when the user returns to the application (in order to resume the game from the point where it was paused). That is why the process callbacks are so relevant.

I you do not understand the above explanation, do not be afraid. The use of callbacks is much easier than the explanation itself :) To implement an application callback, you just need to get the _page_ element reference (or WebApp object for global callbacks), and implement the desired function, as can be observed in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_callbacks.html#firstPage" target="_blank">live preview</a>):

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
firstPageElement.onShow = function() {
	console.log('firstPage.onShow(): ' + (new Date().toLocaleString()));
};
firstPageElement.onHide = function() {
	console.log('firstPage.onHide(): ' + (new Date().toLocaleString()));
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
- pageElement.onShow();
- pageElement.onHide();
- pageElement.onKeyDown(keyEvent);


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


## Public API:

- setDebugOn(boolean): enable/disable debugging from console.log (default system value: true).
- getDebugOn(): return the current debug state setting.

- setDefaultPageId(pageId): set the default page id, to be shown in case of not specified in the browser URL (default system value: first class page element).
- getDefaultPageId(): return the default page id.

- setTransitionOn(boolean): enable/disable soft transition when switching between the pages (default system value: true).
- getTransitionOn(): return the current transition state setting.

- setSlideModeOn(boolean): enable/disable slide transition (instead of soft) when switching between the pages (default system value: false).
- getSlideModeOn(): return the current slide mode state setting.
