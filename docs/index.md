---
title: Visualization
---

Visualization is an HTML5 wrapper to Google Visualizations to avoid dealing with any JavaScript directly. Instead, simply add the appropriate &lt;script&gt; tag and then add HTML5 data attributes to the page.

## Including the JavaScript File

Link directly to a hosted version of the script:

<ol><li>
		Use directly from Github: <a href="https://stack.payne.run/wcdn/l/lib/visualization/visualization.min.js">https://stack.payne.run/wcdn/l/lib/visualization/visualization.min.js</a></li>
</ol><p>Download the file to your server:</p>
<ol><li>
		Use either link above</li>
	<li>
		Access from Github: <a href="https://github.com/wittiws/visualization">https://github.com/wittiws/visualization</a></li>
</ol><h2>
	Include the HTML5 Data Attributes</h2>
<p>The following configurations are for Witti Visualization:</p>
<table border="1" cellpadding="1" cellspacing="1" style="width: 100%;"><thead><tr><th scope="col">
				Name</th>
			<th scope="col">
				Default</th>
			<th scope="col">
				Description</th>
		</tr></thead><tbody><tr><td>
				data-gv-image="[true|print]"</td>
			<td>
				""</td>
			<td>
				Convert the chart to an image client-side for easier copy-paste. If set to "true", then the image is created at web resolution. If set to "print", then the image is created at 4x web resolution.</td>
		</tr><tr><td>
				data-gv-datatable="[HTML ID]"</td>
			<td>
				N/A</td>
			<td>
				The ID of the HTML table that contains the data. This is unnecessary if the table is inside the chart &lt;div&gt;.</td>
		</tr><tr><td>
				data-gv-datatablehide="1"</td>
			<td>
				"0"</td>
			<td>
				Hide the HTML table that contains the data. This only applies to tables outside of the chart &lt;div&gt;.</td>
		</tr><tr><td>
				data-gv-datatablerotate="1"</td>
			<td>
				"0"</td>
			<td>
				Rotate the data from the HTML table so that the series exist in rows rather than columns.</td>
		</tr></tbody></table><p>The JavaScript converts all other data-gv-VARNAME attributes to Google Visualization option parameters.</p>

## Other examples

- [Basic line chart example with series in rows using Brainite Visualization](basic-line-chart-rows)
- [Basic line chart example using Brainite Visualization](basic-line-chart-cols)


<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script type="text/javascript" src="https://stack.payne.run/wcdn/l/lib/visualization/visualization.min.js"></script>

