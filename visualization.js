/**
 * Brainite Visualization
 * @version 1.3.6
 * https://www.brainite.org/visualization/
 * 
 * Copyright (c) 2012-2018, CPNP
 * Dual licensed under the MIT and GPL licenses.
 */

//http://code.google.com/apis/ajax/playground/?type=visualization
//autoload saves one hit but prevents dynamic loading of the brainite library.
//document.write('<script type="text/javascript" src="' + (("https:" == document.location.protocol) ? "https://" : "http://") + 'www.google.com/jsapi?autoload=' + encodeURIComponent('{"modules":[{"name":"visualization","version":"1","callback":"brainite_visualization_prereqs"}]}') + '"></script>');

/* <brainite:remove> */
if (typeof JSON != 'object' || typeof JSON.stringify != 'function') {
  document.write('<script src="//www.json.org/json2.js"></script>');
}
/* </brainite:remove> */

// Init the brainite namespace.
if (typeof brainite != 'object') {
  var brainite = {};
}
brainite.visualization = {
  map: {
    status: 0,
    instances: {},
    load: function(id, f){
      if (this.status == 2) {
        f(id);
      }
      else {
        this.instances[id] = f;
        if (this.status == 0) {
          this.status = 1;
          brainite.loadjs('https://maps.googleapis.com/maps/api/js?callback=brainite.visualization.map.ready', 'google-maps-jsapi');
        }
      }
    },
    ready: function(id){
      for (var i in this.instances) {
        this.instances[i](i);
      }
    }
  }
};

// Function to add SCRIPT tag
brainite.loadjs = function(url, id) {
  var d = document, s = 'script';
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = url;
  fjs.parentNode.insertBefore(js, fjs);
};


if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/gm, '');
  };
}
(function($){
  var _uniq_id = 0;
  var i, j, k, v, row;
  function uniq_id() {
    _uniq_id++;
    return 'html5-gv-id-' + _uniq_id;
  }
  
  var _loaders = {
    "Table" : {
      "type" : "google",
      "packages" : ["table"]
    },
    "google.visualization.Table" : {
      "type" : "google",
      "packages" : ["table"]
    },
  };

  /* <brainite:remove match="@_log\(.*?\);@s"> */
  var _log = null;
  if (typeof console != 'object') {
    _log = function(el, m) {
      $(el).append('<div>' + m + '</div>');
    };
  }
  else {
    _log = function(el, m) {
      console.log(el.id + ": " + m);
    };
  }
  /* </brainite:remove> */

  // Create a key-pair hash to translate case and/or any aliases to match Google's naming scheme.
  var _map = {"type" : "chartType"};
  $('axisTitlesPosition backgroundColor chartArea enableInteractivity fontSize fontName gridlineColor hAxis isStacked legendTextStyle logScale maxAlternation maxValue minValue reverseCategories showTextEvery slantedText slantedTextAngle strokeWidth textPosition textStyle titlePosition titleTextStyle tooltipTextStyle vAxes vAxis viewWindowMode viewWindow'
      .split(' ')).each(function(){_map[this.toLowerCase()] = this});

  // Load the charts from the HTML5 configurations.
  var _html5load_detect_recurse = false;
  function html5load() {
    $(this).each(function(){
      var chart_element = this;
      $(this).attr('data-gv-applied', 'true');
      $(this).change(function(){
	$(this).removeAttr('data-gv-applied');
      });
      _log(this, 'Preparing to load chart');
      if (!this.id) {
	this.id = uniq_id();
	_log(this, "Set id to " + this.id);
      }

      /*
       * chartType: Table, ColumnChart
       * Rather than containerId, we're going to pass the element at the end
       *   to provide better compatibility (fixed issues in IE6/IE7).
       */
      var cfg = {
	'chartType' : 'Table',
	'dataTable' : null,
	'options' : {
	}
      };
      _log(this, "Chart will load in " + this.id);

      // Set a minimum height if necessary.
      if ($(this).width() / $(this).height() > 20) {
	$(this).height(250);
      }

      // Customize the config using HTML5 attributes.
      _log(this, "Parsing config");
      for (i = 0; i < this.attributes.length; i++) {
	k = this.attributes[i].name.toLowerCase();
	v = this.attributes[i].value;
	if (k.indexOf('_') != -1) {
	  var k1 = k.substr(k.indexOf('_') + 1);
	  k = k.substr(0, k.indexOf('_'));
	  if (k1 == 'csv') {
	    var v1 = [];
	    while (v.indexOf(',') != -1) {
	      var tmp = v.substr(0, v.indexOf(','));
	      v = v.substr(tmp.length + 1);
	      v1.push(tmp);
	    }
	    if (v != '') {
	      v1.push(v);
	    }
	    v = v1;
	  }
	  else if (k1 == 'json') {
	    if (v.indexOf('"') == -1 && v.indexOf("'") != -1) {
	      v = v.replace(/'/g, '"');
	    }
	    v = $.parseJSON(v);
	  }
	}
	if (k.substr(0, 8) == 'data-gv-') {
	  k = k.substr(8);
	  if (typeof _map[k] != 'undefined') {
	    k = _map[k];
	  }
	  if (typeof cfg[k] == 'undefined') {
	    tgt = cfg.options;
	  }
	  else {
	    tgt = cfg;
	  }
	  while (k.indexOf('.') != -1) {
	    var k1 = k.substr(0, k.indexOf('.'));
	    if (typeof _map[k1] != 'undefined') {
	      k1 = _map[k1];
	    }
	    k = k.substr(k1.length + 1);
	    if (typeof tgt[k1] == 'undefined') {
	      tgt[k1] = {};
	    }
	    tgt = tgt[k1];
	  }
	  if (typeof _map[k] != 'undefined') {
	    k = _map[k];
	  }
	  tgt[k] = v;
	}
      }

      // Build the DataTable.
      _log(this, "loading datatable");
      var wrap_ready = function(){};
      var dt = new google.visualization.DataTable();
      var table = null;
      cfg.dataTable = dt;
      if ($('table:has(tbody):not(.google-visualization-table-table)', this).length == 1) {
	// Look for a table within this element.
	// The sticky-* class logic is a Drupal optimization.
	table = $("table:has(tbody):not(.sticky-header)", this).removeClass('sticky-table sticky-enabled');
	$('caption:first', table).each(function(){
	  cfg.options['title'] = $(this).text().trim();
	});
	table.insertAfter(this).hide();
	$("table.sticky-header", this).remove();
	dt_load_table(dt, table, this, cfg.options);
      }
      else if ($(this).eq(0).attr('data-gv-datatable')) {
	_log(this, 'Loading data by id');
	table = document.getElementById($(this).eq(0).attr('data-gv-datatable'));
	if (table) {
	  _log(this, 'loading the data');
	  dt_load_table(dt, table, this, cfg.options);
	  if (cfg.chartType == 'Table') {
	    $(table).hide();
	  }
	  else if (cfg.options.datatablehide) {
	    $(table).hide();
	  }
	}
      }
      else {
	_log(this, "datatable error - unable to locate dt");
	return;
      }
      $(this).data('gv-datatable-object', dt);
      
      // Handle special cases
      if (cfg.chartType == "X-MapMarkers") {
        _log(this, "Loading X-MapMarkers");
        var load_markers = function(id) {
          v = {
            "title":null,
            "lat":null,
            "lon":null
          };
          for (j = dt.getNumberOfColumns() - 1; j >= 0; j--) {
            k = dt.getColumnLabel(j).toLowerCase();
            if (k == "title") {
              v.title = j;
            }
            else if (k == "lat" || k == "latitude") {
              v.lat = j;
            }
            else if (k == "lon" || k == "longitude") {
              v.lon = j;
            }
          }
          if (v.lat === null) {
            $(this).before('<p>ERROR: No Latitude column found</p>');
            return;
          }
          if (v.lon === null) {
            $(this).before('<p>ERROR: No Longitude column found</p>');
            return;
          }
          
          // By default, center of US.
          var center = new google.maps.LatLng(37.09024, -95.712891);
          var map = new google.maps.Map(document.getElementById(id), {
            zoom: 3,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
          
          // Build the markers.
          var marker;
          var marker_bounds  = new google.maps.LatLngBounds();
          for (i = dt.getNumberOfRows() - 1; i >= 0; i--) {
            // Get the row values. Will look for lat/long/count
            row = {
              "lat" : dt.getValue(i, v.lat),
              "lon" : dt.getValue(i, v.lon),
              "title" : (v.title === null ? null : dt.getValue(i, v.title))
            };
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(row.lat, row.lon),
              map: map,
              title: "" + row.title
            });
            marker_bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
          }
          
          var $map = $('#' + id);
          if ($map.height() < 200) {
            $map.height(400);
          }
          
          // Zoom and center based on the markers
          map.fitBounds(marker_bounds);
          map.panToBounds(marker_bounds); 
        };
        brainite.visualization.map.load(this.id, load_markers);
        return;
      }
      if (cfg.chartType == "X-MapMarkerCluster") {
        _log(this, "Loading X-MapMarkerCluster");
        var load_markercluster = function(id) {
          v = {
            "cnt":null,
            "lat":null,
            "lon":null
          };
          for (j = dt.getNumberOfColumns() - 1; j >= 0; j--) {
            k = dt.getColumnLabel(j).toLowerCase();
            if (k == "count") {
              v.cnt = j;
            }
            else if (k == "lat" || k == "latitude") {
              v.lat = j;
            }
            else if (k == "lon" || k == "longitude") {
              v.lon = j;
            }
          }
          if (v.lat === null) {
            $(this).before('<p>ERROR: No Latitude column found</p>');
            return;
          }
          if (v.lon === null) {
            $(this).before('<p>ERROR: No Longitude column found</p>');
            return;
          }
          var markers = [], marker;
          var marker_bounds  = new google.maps.LatLngBounds();
          for (i = dt.getNumberOfRows() - 1; i >= 0; i--) {
            // Get the row values. Will look for lat/long/count
            row = {
              "lat" : dt.getValue(i, v.lat),
              "lon" : dt.getValue(i, v.lon),
              "cnt" : (v.cnt === null ? 1 : dt.getValue(i, v.cnt))
            };
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(row.lat, row.lon),
              title: "" + row.cnt
            });
            markers.push(marker);
            marker_bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
          }
          
          var $map = $('#' + id);
          if ($map.height() < 200) {
            $map.height(400);
          }
          // By default, center of US.
          var center = new google.maps.LatLng(37.09024, -95.712891);
          var map = new google.maps.Map(document.getElementById(id), {
            zoom: 3,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
          var options = {
            imagePath: 'https://www.brainite.ws/wcdn/l/lib/visualization/dist/images/m',
            minimumClusterSize: 1
          };
          var markerCluster = new MarkerClusterer(map, markers, options);
          
          // Zoom and center based on the markers
          map.fitBounds(marker_bounds);
          map.panToBounds(marker_bounds); 
        };
        brainite.visualization.map.load(this.id, load_markercluster);
        return;
      }

      // Convert the chart to an image.
      if (cfg.options['image'] == 'true' || cfg.options['image'] == 'print') {
	// Load canvg JS.
	if (typeof canvg != 'function') {
          $.getScript('//gabelerner.github.io/canvg/rgbcolor.js');
          $.getScript('//gabelerner.github.io/canvg/StackBlur.js');
	  $.getScript('//gabelerner.github.io/canvg/canvg.js');
	}
	var $vis = $(this);
	wrap_ready = function(){
	  // Wait for supporting libraries to load.
	  if (typeof canvg != 'function' || typeof RGBColor != 'function') {
	    setTimeout(wrap_ready, 500);
	    return;
	  }

	  /**
	   * @todo Remove reliance on canvg
	   * This can be done internally if we remove the 'print' resolution support.
	   *     chart_wrapper.getChart().getImageURI();
	   */
	  
	  // Create a new (hidden) canvas.
	  var m = (cfg.options['image'] == 'print') ? 4 : 1;
	  var c = $('<canvas style="display:none;">').attr('id', this.id + "-canvas");
	  c.width($vis.width() * m).height($vis.height() * m);
	  $vis.after(c);
	  var svg = $vis.gv_svg(0);
	  var f = function(s, attr) {
	    var r = '', part = [];
	    var parts = s.split(' ' + attr + '="');
	    if (parts.length == 1 || m == 1) {
	      return s;
	    }
	    r = parts.shift();
	    while (parts.length != 0) {
	      r += ' ' + attr + '="';
	      part = parts.shift().split('"');
	      r += part.shift() * m;
	      r += '"' + part.join('"');
	    }
	    return r;
	  }
	  var fd = function (s) {
	    var r = '', part = [], c='', tmp = '';
	    var parts = s.split(' d="M');
	    if (parts.length == 1 || m == 1) {
	      return s;
	    }
	    r = parts.shift();
	    while (parts.length != 0) {
	      r += ' d="M';
	      part = parts.shift();
	      while (part.length != 0) {
		c = part.charAt(0);
		part = part.substr(1);
		if (c == '"') {
		  r += (tmp * m) + c + part;
		  break;
		}
		if ('-0123456789.'.indexOf(c) == -1) {
		  r += (tmp * m) + c;
		  tmp = '';
		}
		else {
		  tmp += c;
		}
	      }
	    }
	    return r;
	  }
	  svg = f(f(f(f(svg, 'x'), 'y'), 'width'), 'height');
	  svg = f(f(svg, 'font-size'), 'stroke-width');
	  svg = fd(svg);

	  canvg(this.id + '-canvas', svg);
	  c.width(c.width() * m).height(c.height() * m);
	  var im = $('<img>').attr('src', $('#' + this.id + '-canvas')[0].toDataURL('image/png'));
	  im.width($vis.width()).height($vis.height());
	  $vis.html(im);
	  c.remove();
	};
      }

      /* <brainite:remove> */
      _log(this, JSON.stringify(cfg));
      for (i in cfg) {
	_log(this, i + " = " + JSON.stringify(cfg[i]));
      }
      /* </brainite:remove> */

      _log(this, "drawing chart");
      var draw_wrapper = function() {
        var wrap = new google.visualization.ChartWrapper(cfg);
        google.visualization.events.addListener(wrap, 'ready', wrap_ready);
        wrap.draw($(chart_element)[0]);
        $(chart_element).data('gv_wrapper', wrap);
      }
      
      if (typeof _loaders[cfg.chartType] != "undefined" && eval('with (google.visualization) {typeof ' + cfg.chartType + ';}') == 'undefined') {
	if (_loaders[cfg.chartType].type == 'google') {
	  google.charts.load("current", {
	    "packages" : _loaders[cfg.chartType].packages
	  });
	  google.charts.setOnLoadCallback(draw_wrapper);
	}
      }
      else {
	draw_wrapper();
      }
    });
  }

  function dt_load_table(dt, table, $log, options) {
    function myIsNaN(n) {
      // If it is clearly a number, return quickly.
      if (!isNaN(n)) {
        return false;
      }
      
      // Allow standard US formats with commas as 3-digit separators
      return !(/^-?[0-9]+(,[0-9]{3})+(\.[0-9]+)?$/m).test(n);
    }
    
    if (options.datatablerotate) {
      _log($log, 'Rotating the datatable.');
      var colIndex = 0;
      var colType = 'string';
      $('tr', table).each(function(){
	var rowIndex = -1;
	$(this).children('td,th').each(function(ix){
	  var cell = $(this);
	  if (rowIndex == -1) {
	    var firstData = cell.next('td,th');
	    if (firstData.is('th') || myIsNaN(firstData.text().trim())) {
	      _log($log, 'Adding string column: ' + $(this).text().trim());
	      colType = 'string';
	    }
	    else {
	      _log($log, 'Adding number column: ' + $(this).text().trim());
	      colType = 'number';
	    }
	    dt.addColumn(colType, $(this).text().trim());
	  }
	  else {
	    var t = cell.text().trim();
	    if (t == '') {
	      t = null;
	    }
	    else {
	      switch (colType) {
	      case 'number':
		// type-cast to number.
		t = 1 * t.replace(/[, ]/g, '');
		break;
	      default:
		// keep as string.
		break;
	      }
	    }

	    if (colIndex == 0) {
	      _log($log, 'New row ' + rowIndex + ' to:' + t);
	      dt.addRow([t]);
	    }
	    else {
	      _log($log, 'Set ' + rowIndex + ',' + colIndex + ' to:' + t);
	      dt.setCell(rowIndex, colIndex, t);
	    }
	  }
	  rowIndex++;
	});
	colIndex++;
      });
    }
    else {
      $('thead tr', table).children('td,th').each(function(ix){
	var cell = $('tbody tr:first', table).children('td,th').eq(ix);
	if (cell.is('th') || myIsNaN(cell.text().trim())) {
	  _log($log, 'Adding string column: ' + $(this).text().trim());
	  dt.addColumn('string', $(this).text().trim());
	}
	else {
	  _log($log, 'Adding number column: ' + $(this).text().trim());
	  dt.addColumn('number', $(this).text().trim());
	}
      });
      $('tbody tr', table).each(function(){
	var row = [];
	$('th,td', this).each(function(){
	  var t = $(this).text().trim();
	  if (t == '') {
	    row.push(null);
	  }
	  else {
	    switch (dt.getColumnType(row.length)) {
	    case 'number':
	      row.push(1 * t.replace(/[, ]/g, ''));
	      break;
	    default:
	      row.push(t);
	    break;
	    }
	  }
	});
	_log($log, 'Added row: ' + row.join(', '));
	dt.addRow(row);
      });
    }
  }		


  $.fn.gv = function(k, v) {
    $(this).attr('data-gv-' + k, v).removeAttr('data-gv-applied').change();
  }
  $.fn.gv_edit = function() {
    var target_chart = $(this)[0];
    var wrapper = $(this).eq(0).data('gv_wrapper');
    google.charts.load('current', {
      "packages" : ['charteditor']
    });
    google.charts.setOnLoadCallback(function() {
      var editor = new google.visualization.ChartEditor();
      google.visualization.events.addListener(editor, 'ok', function() { 
        wrapper = editor.getChartWrapper();  
        wrapper.draw(target_chart); 
      }); 
      editor.openDialog(wrapper);
    });
  }
  $.fn.gv_svg = function(open_window) {
    var h = '';
    try {
      h = $(this).find('svg').eq(0).parent().html();
    } catch (e) {
      h = $(this).eq(0).find('iframe').contents().find('body').html() + "";
    }
    if (h.indexOf('<svg') == -1) {
      alert('Sorry, but the export to SVG only works when viewing a chart.');
      return;
    }
    h = h.substring(h.indexOf('<svg') + 4, h.indexOf('</svg>') + 6);
    h = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"' + h;
    if (open_window) {
      h = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(h);
      if (open_window && open_window != -1) {
	window.open(h, 'svg_' + $(this).eq(0).attr('id'));
      }
    }
    return h;
  }


  $(document).ready(function(){
    var s = '*[data-gv-type]:not([data-gv-applied])';
    if (typeof $.fn.on == 'function') {
      $(document).on('change', s, html5load);
    }
    else {
      $(document).delegate(s, 'change', html5load);
    }

    if (typeof google == 'undefined') {
      var script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(script);
      brainite_visualization_prereqs();
    }
    else {
      brainite_visualization_prereqs();
    }
  });
})(jQuery);

//Load the prereq libraries from Google.
var brainite_visualization_prereqs = function() {
  // If google.charts does not exist, then wait.
  if (typeof google == 'undefined' || typeof google.charts == 'undefined') {
    setTimeout(brainite_visualization_prereqs, 50);
    return;
  }
  
  // @TODO - Slow-load the table package rather than always loading it upfront.
  google.charts.load("current", {
    "packages" : ["corechart"]});
  google.charts.setOnLoadCallback(function() {
    jQuery('*[data-gv-type]').change();
  });
};
