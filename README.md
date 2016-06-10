<h1>WebApp</h1>
<p>WebApp is a lightweight (simple and efficient) WEB application framework (library for HTML5 projects), which allow us to fit multiple pages into a single HTML file (following the "single-page application" concept).</p>


<h4>Minimum code required:</h4>
<p>The following HTML crumb is the minimum code required to use WebApp framework. As you can easily guess, it creates an application containing two simple pages (<em>firstPage</em> and <em>secondPage</em>), accessible through the corresponding file URLs <em>../index.html#firstPage</em> and <em>../index.html#secondPage</em> (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_minimum.html#firstPage" target="_blank">live preview</a>).</p>

<div class="highlight highlight-text-html-basic">
<pre>
&lt;body&gt;

&lt;div class="page" id="firstPage"&gt;
	&lt;h1&gt;First Page&lt;/h1&gt;
	&lt;a href="#secondPage"&gt;go to the second page&lt;/a&gt;
&lt;/div&gt;

&lt;div class="page" id="secondPage"&gt;
	&lt;h1&gt;Second Page&lt;/h1&gt;
	&lt;a href="#firstPage"&gt;go to the first page&lt;/a&gt;
&lt;/div&gt;

&lt;script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"&gt;&lt;/script&gt;

&lt;/body&gt;
</pre>
</div>

<p>Where:</p>
<ul>
<li><code>&lt;div class="page" id="firstPage"&gt;</code> is the element required for page creation, which must have <em>page</em> class, contains a unique <em>id</em>, and be placed as a <em>body child</em> element. Considering that it is the first <em>body child</em> page element, it will also be considered the <em>default application page</em>, which means that requests to basic URL <em>../myApp.html</em> (without page specification) or invalid URL <em>../myApp.html#inexistentPage</em> (invalid page specification) will be redirected to <em>../myApp.html#firstPage</em> (unless you decide to define another default page, by using <em>WebApp.setDefaultPage</em> function, as explained later in the Public API section).</li>
<li><code>&lt;h1&gt;First Page&lt;/h1&gt;</code> and <code>&lt;a href="#secondPage"&gt;go to the second page&lt;/a&gt;</code> represent the content of page <em>firstPage</em> (as every other content inside the same page class element). And the link to <em>href="#secondPage"</em> establishes the connection from the first to the second page (note that only hash data is required, instead of full destination page URL)</li>
<li><code>&lt;script src="https://cdn.rawgit.com/samereberlin/WebApp/master/www/WebApp.js"&gt;&lt;/script&gt;</code> is the inclusion of WebApp framework library, which can be obtained remotely (as here it is, using GitHub <em>cdn</em> URL) or locally (stored beside your <em>html</em> file).</li>
</ul>

<p>Note that for simplicity reasons, the above html code does not include any header definition, but it is strongly recommended. Please include at least the <em>title</em> and the basic <em>responsive</em> meta tag <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code> (<a href="https://cdn.rawgit.com/samereberlin/WebApp/master/www/index_responsive.html#firstPage" target="_blank">live preview</a>).</p>

<h4>Global elements:</h4>
<p>Coming soon...</p>

<h4>Public API:</h4>
<p>Coming soon...</p>
