# Visualization

Visualization is an HTML5 wrapper to Google Visualizations to avoid dealing with any JavaScript directly. Instead, simply add the appropriate &lt;script&gt; tag and then add HTML5 data attributes to the page.

## Including the JavaScript File

Link directly to a hosted version of the script:

1. Use directly: <a href="https://www.brainite.org/visualization/dist/visualization.min.js">https://www.brainite.org/visualization/dist/visualization.min.js</a>
1. Download the file to your server:
   1. Use either link above
   1. Access from Github: <a href="https://github.com/brainite/visualization">https://github.com/brainite/visualization</a>

## Include the HTML5 Data Attributes

The following configurations are for Brainite Visualization:

| Name | Default | Description |
| ---- | ------- | ----------- |
| `data-gv-image="[true|print]"` | `""` | Convert the chart to an image client-side for easier copy-paste. If set to "true", then the image is created at web resolution. If set to "print", then the image is created at 4x web resolution. |
| `data-gv-datatable="[HTML ID]"` | N/A | The ID of the HTML table that contains the data. This is unnecessary if the table is inside the chart &lt;div&gt;. |
| `data-gv-datatablehide="1"` | `"0"` | Hide the HTML table that contains the data. This only applies to tables outside of the chart &lt;div&gt;. |
| `data-gv-datatablerotate="1"` | `"0"` | Rotate the data from the HTML table so that the series exist in rows rather than columns. |

The JavaScript converts all other data-gv-VARNAME attributes to Google Visualization option parameters.

## Other examples

- [Basic line chart example with series in rows using Brainite Visualization](basic-line-chart-rows)
- [Basic line chart example using Brainite Visualization](basic-line-chart-cols)

## External Resources

- [jQuery](https://jquery.com/): Used for interface manipulation
- [Google Visualizations](https://developers.google.com/chart/interactive/docs/reference): Create visualizations based on data
- [canvg](https://github.com/canvg/canvg): Convert visualizations to jpeg/png


<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script type="text/javascript" src="https://www.brainite.org/visualization/dist/visualization.min.js"></script>
