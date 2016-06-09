# WebApp
WebApp is a lightweight (simple and efficient) WEB application framework (library for HTML5 projects), which allow us to fit multiple pages into a single HTML file (following the "Single-page application" concept).




#### Minimum code required:

The following tiny HTML crumb is the minimum code required to use WebApp framework. As you can easily guess, it creates an application containing two simple pages (_firstPage_ and _secondPage_), accessible through the URLs _../myApp.html#firstPage_ and _../myApp.html#secondPage_ (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_minimum.html#firstPage" target="_blank">live preview</a>).

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




#### Minimum code explanation:

I know that it is completely obvious, at least for WEB developers, but let's explain the above example just to make it clear.

- `<div class="page" id="firstPage">...</div>`: every _div_ class _page_ elements generates an application page. Important notes:
  - It must have an unique id, in order to be accessible through the URL _../myApp.html#firstPage_.
  - It must have the _body_ as its parent node, in order to be considered as an application page.
- `<script src="http://...WebApp.js"></script>`: it is the WebApp framework library, which can be obtained remotely (using the above _cdn_) or locally (stored beside your _html_ file).
