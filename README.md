# WebApp
This is a lightweight (simple and efficient) WEB application framework (library for HTML5 projects), which allow us to fit multiple pages into a single HTML file (following the "Single-page application" concept).

## Minimum code required:

The following tiny HTML crumb is the minimum code required to use WebApp framework. As you can easily guess, it creates an application containing two simple pages (`firstPage` and `secondPage`), accessible through the URLs `../myApp.html#firstPage` and `../myApp.html#secondPage` (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_minimum.html#firstPage" target="_blank">live preview</a>).

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
