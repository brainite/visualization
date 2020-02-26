---
title: Basic line chart example with series in rows using Witti Visualization
---

<p>The demo below shows a very basic application of the visualization library to create a line chart from a simple HTML table. The HTML table is converted to a DataTable, and the HTML data-* attributes on the div tag are converted to Google Visualization parameters. This particular approach signficantly reduces the logic that has to be implemented using the server-side language.</p>

<h2>
	Instructions</h2>
<p>If you have the data in an HTML table, there are only a couple extra steps you'll need to take. This example assumes that the data for each series is stored in table rows. By default, series are expected to appear in columns as in <a href="/blog/2012/10/10/basic-line-chart-example-using-witti-visualization">this example</a>.</p>
<h3>
	Add JavaScript to the page</h3>
<p>Add the JS to the page. If you use the witti CDN, the script tag would look like this:</p>
<pre class="brush:jscript">
&lt;script type="text/javascript" src="https://stack.payne.run/wcdn/l/lib/visualization/visualization.min.js"&gt;&lt;/script&gt;</pre>
<h3>
	Add properly formatted HTML table to the page</h3>
<ol>
	<li>
		Use the &lt;thead&gt; and &lt;th&gt; tags on the first row</li>
	<li>
		Use the &lt;tbody&gt; tag for the table content</li>
	<li>
		Optionally use the table's &lt;caption&gt; tag for the chart title</li>
</ol>
<h3>
	Wrap the table in a div tag with the chart configurations</h3>
<ol>
	<li>
		Add a &lt;div data-gv-type="LineChart" data-gv-datatablerotate="true"&gt; tag around the table. The data-gv-type attribute is the bare essential for loading a line chart.</li>
	<li>
		Other Google Visualization properties can be set as HTML5 data tags with the extra prefix for a total prefix of "data-gv-".</li>
	<li>
		For example, the legend could be moved above the chart using data-gv-legend="top".</li>
</ol>
<h2>
	Demo (Example Line Chart)</h2>
<div data-gv-datatablerotate="true" data-gv-legend="right" data-gv-type="LineChart" style="width:100%; height:300px;">
	<table border="1" cellpadding="1" cellspacing="0" style="width: 100%;">
		<caption>
			Example Table</caption>
		<thead>
			<tr>
				<th scope="col">
					Year</th>
				<th scope="col">
					Company A</th>
				<th scope="col">
					Company B</th>
				<th scope="col">
					Company C</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>
					Y2001</td>
				<td>
					1</td>
				<td>
					2</td>
				<td>
					3</td>
			</tr>
			<tr>
				<td>
					Y2002</td>
				<td>
					2</td>
				<td>
					3</td>
				<td>
					4</td>
			</tr>
			<tr>
				<td>
					Y2003</td>
				<td>
					2</td>
				<td>
					4</td>
				<td>
					5</td>
			</tr>
			<tr>
				<td>
					Y2004</td>
				<td>
					3</td>
				<td>
					5</td>
				<td>
					5</td>
			</tr>
			<tr>
				<td>
					Y2005</td>
				<td>
					2</td>
				<td>
					4</td>
				<td>
					6</td>
			</tr>
			<tr>
				<td>
					Y2006</td>
				<td>
					2</td>
				<td>
					7</td>
				<td>
					9</td>
			</tr>
			<tr>
				<td>
					Y2007</td>
				<td>
					2</td>
				<td>
					7</td>
				<td>
					5</td>
			</tr>
			<tr>
				<td>
					Y2008</td>
				<td>
					3</td>
				<td>
					4</td>
				<td>
					5</td>
			</tr>
			<tr>
				<td>
					Y2009</td>
				<td>
					4</td>
				<td>
					6</td>
				<td>
					7</td>
			</tr>
		</tbody>
	</table>

<script type="text/javascript" src="https://stack.payne.run/wcdn/l/lib/visualization/visualization.min.js"></script>
