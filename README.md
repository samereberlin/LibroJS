# WebApp
This is a lightweight (simple and efficient) WEB application framework (library for HTML5 projects), which allow us to fit multiple pages into a single HTML file (following the "Single-page application" concept).

The minimum HTML code required to use WebApp framework is:

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
```

which creates a "two pages" WebApp, where the fist page is accessible through URL `../index.html#firstPage` and the second page `../index.html#secondPage`.
