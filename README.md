# WebApp
WebApp is a lightweight (simple and efficient) WEB application framework (library for HTML5 projects), which allow us to fit multiple pages into a single HTML file (following the "single-page application" concept).


####Minimum code required:
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


#### Default Application Page:
The default application page is the first _body's child_ class _page_ element, which means that the first request to the basic URL _../index.html_ (without page specification) or invalid URL _../index.html#nonexistentPage_ (invalid page specification) will be redirected to _../index.html#firstPage_. If for you need to set any other element, use _WebApp.setDefaultPageId('secondPage')_ function API, as the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_setDefaultPageId.html#secondPage" target="_blank">live preview</a>):


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

<script>
	// Set default application page id:
	WebApp.setDefaultPageId('secondPage')
</script>

</body>

</html>
```

**Important Note:** WebApp function APIs must be called after the inclusion of WebApp framework library.


####Global elements:
Global elements are components that must always be displayed (common between the pages, e.g.: toolbar, statusbar, menus, etc). To define an element as global, place it as a _body's child_ element (exactly as a regular page), but without the class _page_, as the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_globalelement.html#firstPage" target="_blank">live preview</a>):

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WebApp</title>
</head>

<body>

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

</body>

</html>
```


####Page Transitions:
A basic page transition (fade in style) is enabled by default, but if you need to disable it, use _WebApp.setTransitionOn(false)_ function API. And if you prefer slide Left/Right transition, instead of traditional fade effect, use _WebApp.setSlideModeOn(true)_ function API. Both transition effects can be observed in the following example (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_setTransitionOn.html#firstPage" target="_blank">live preview</a>):

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WebApp</title>
</head>

<body>

<div style="border: 1px solid gray; padding: .4em;">
	Transition settings:
	<label style="padding-left: 1em; white-space:nowrap;">
		<input type="checkbox" onchange="WebApp.setTransitionOn(this.checked); document.getElementById('slideModeSet').disabled = !this.checked;" checked>
		Enable Transition.
	</label>
	<label style="padding-left: 1em; white-space:nowrap;">
		<input type="checkbox" onchange="WebApp.setSlideModeOn(this.checked);" id="slideModeSet">
		Enable SlideMode.
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

</body>

</html>
```

**Important Note:** Slide transition direction depends on the page ordering. If switching from the first to the second page, the slide occurs from the right to the left side. And if switching back from the second to the first page, the slide occurs from the left to the right side.


####Application life cycle callbacks:
Coming soon... (not documented yet, but already implemented and explained into index.html template)


####Canvas screen support:
Coming soon...


####Internationalization support:
Coming soon...


####Public API:

- setDebugOn(boolean): enable/disable debugging from console.log (default system value: true).
- getDebugOn(): return the current debug state setting.

- setDefaultPageId(pageId): set the default page id, to be shown in case of not specified in the browser URL (default system value: first class page element).
- getDefaultPageId(): return the default page id.

- setTransitionOn(boolean): enable/disable soft transition when switching between the pages (default system value: true).
- getTransitionOn(): return the current transition state setting.

- setSlideModeOn(boolean): enable/disable slide transition (instead of soft) when switching between the pages (default system value: false).
- getSlideModeOn(): return the current slide mode state setting.
