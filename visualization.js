// http://code.google.com/apis/chart/image/docs/chart_playground.html
// http://code.google.com/apis/ajax/playground/?type=visualization
//document.write('<script type="text/javascript" src="' + (("https:" == document.location.protocol) ? "https://" : "http://") + 'www.google.com/jsapi?autoload=' + encodeURIComponent('{"modules":[{"name":"visualization","version":"1","packages":["charteditor"]}]}') + '"></script>');
document.write('<script type="text/javascript" src="' + (("https:" == document.location.protocol) ? "https://" : "http://") + 'www.google.com/jsapi?autoload=' + encodeURIComponent('{"modules":[{"name":"visualization","version":"1"}]}') + '"></script>');
if (typeof console == 'undefined') {
	console = {"log" : function(){}};
}
(function($){
	var _uniq_id = 0;
	function uniq_id() {
		_uniq_id++;
		return 'html5-gv-id-' + _uniq_id;
	}
	var html5load = function() {
		$(this).each(function(){
			$(this).attr('data-gv-applied', 'true');
			$(this).change(function(){
				$(this).removeAttr('data-gv-applied');
			});
			console.log(this.id + ": loading");
			$(this).append('<p>Loading chart...</p>');
			if (!this.id) {
				this.id = uniq_id();
			}
			
			/*
			 * chartType: Table, ColumnChart
			 */
			var cfg = {
				'chartType' : 'Table',
				'containerId' : this.id,
				'dataTable' : null,
				'options' : {
				}
			};
			
			// Set a minimum height if necessary.
			if ($(this).width() / $(this).height() > 20) {
				$(this).height(250);
			}
			
			console.log(this.id + ": setting defaults");
			// Customize the config using HTML5 attributes.
			var map = {
				/* Readability adjustments. */
				"type" : "chartType",
			};
			$([
			   'axisTitlesPosition',
			   'backgroundColor',
			   'chartArea',
			   'enableInteractivity',
			   'fontSize',
			   'fontName',
			   'gridlineColor',
			   'hAxis',
			   'isStacked',
			   'legendTextStyle',
			   'logScale',
			   'maxAlternation',
			   'maxValue',
			   'minValue',
			   'reverseCategories',
			   'showTextEvery',
			   'slantedText',
			   'slantedTextAngle',
			   'strokeWidth',
			   'textPosition',
			   'textStyle',
			   'titlePosition',
			   'titleTextStyle',
			   'tooltipTextStyle',
			   'vAxes',
			   'vAxis',
			   'viewWindowMode',
			   'viewWindow'
			   ]).each(function(){map[this.toLowerCase()] = this});
			console.log(this.id + ": parsing config");
			for (var i = 0; i < this.attributes.length; i++) {
				var k = this.attributes[i].name.toLowerCase();
				var v = this.attributes[i].value;
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
					if (typeof map[k] != 'undefined') {
						k = map[k];
					}
					if (typeof cfg[k] == 'undefined') {
						tgt = cfg.options;
					}
					else {
						tgt = cfg;
					}
					while (k.indexOf('.') != -1) {
						var k1 = k.substr(0, k.indexOf('.'));
						if (typeof map[k1] != 'undefined') {
							k1 = map[k1];
						}
						k = k.substr(k1.length + 1);
						if (typeof tgt[k1] == 'undefined') {
							tgt[k1] = {};
						}
						tgt = tgt[k1];
					}
					if (typeof map[k] != 'undefined') {
						k = map[k];
					}
					tgt[k] = v;
				}
			}
			
			// Build the DataTable.
			console.log(this.id + ": loading datatable");
			var wrap_ready = function(){};
			var dt = new google.visualization.DataTable();
			var table = null;
			cfg.dataTable = dt;
			if ($('table:has(tbody):not(.google-visualization-table-table)', this).length == 1) {
				// Look for a table within this element.
				table = $('table:has(tbody)', this);
				$('caption:first', table).each(function(){
					cfg.options['title'] = $(this).text();
				});
				table.insertAfter(this).hide();
				dt_load_table(dt, table);
			}
			else if ($(this).eq(0).attr('data-gv-datatable')) {
				console.log(this.id + ": loading datatable by id");
				
				table = document.getElementById($(this).eq(0).attr('data-gv-datatable'));
				if (table) {
					dt_load_table(dt, table);
					$(this).append('<p>Load dt ' + '</p>');
					if (cfg.chartType == 'Table') {
						$(table).hide();
					}
					else if (cfg.options.datatablehide) {
						$(table).hide();
					}
					$(this).append('<p>Load dt ' + '</p>');
				}
			}
			else {
				console.log(this.id + ": error");
				$(this).append('Unable to locate datatable');
				return;
			}
			
			if (cfg.options['image'] == 'true' || cfg.options['image'] == 'print') {
				// Load canvg JS.
				if (typeof canvg != 'function') {
					$.getScript('http://canvg.googlecode.com/svn/trunk/rgbcolor.js');
					$.getScript('http://canvg.googlecode.com/svn/trunk/canvg.js');
				}
				var $vis = $(this);
				wrap_ready = function(){
					// Wait for supporting libraries to load.
					if (typeof canvg != 'function' || typeof RGBColor != 'function') {
						setTimeout(wrap_ready, 500);
						return;
					}
					
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
			
			console.log(this.id + ": drawing chart");
	        var wrap = new google.visualization.ChartWrapper(cfg);
	        google.visualization.events.addListener(wrap, 'ready', wrap_ready);
	        wrap.draw();
	        $(this).data('gv_wrapper', wrap);
		});
	}
	
	function dt_load_table(dt, table) {
		$('thead tr', table).children('td,th').each(function(ix){
			var cell = $('tbody tr:first', table).children('td,th').eq(ix);
			if (cell.is('th') || isNaN(cell.text())) {
				dt.addColumn('string', $(this).text());
			}
			else {
				dt.addColumn('number', $(this).text());
			}
		});
		$('tbody tr', table).each(function(){
			var row = [];
			$('th,td', this).each(function(){
				var t = $(this).text();
				if (t == '') {
					row.push(null);
				}
				else {
					switch (dt.getColumnType(row.length)) {
					case 'number':
						row.push(1 * t);
						break;
					default:
						row.push(t);
						break;
					}
				}
			});
			dt.addRow(row);
		});
	}		
	
	
	$.fn.gv = function(k, v) {
		$(this).attr('data-gv-' + k, v).removeAttr('data-gv-applied').change();
	}
	$.fn.gv_edit = function() {
		var target_chart = $(this)[0];
		var wrapper = $(this).eq(0).data('gv_wrapper');
		google.load('visualization', '1', {
			"packages" : ['charteditor'],
			"callback" : function() {
				var editor = new google.visualization.ChartEditor();
				google.visualization.events.addListener(editor, 'ok', function() { 
					wrapper = editor.getChartWrapper();  
					wrapper.draw(target_chart); 
			  	}); 
				editor.openDialog(wrapper);
			}
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
		google.setOnLoadCallback(function(){
			var s = '*[data-gv-type]:not([data-gv-applied])';
			if (typeof $.fn.on == 'function') {
				$(document).on('change', s, html5load);
			}
			else {
				$(document).delegate(s, 'change', html5load);
			}
			$(s).change();
		});
	});
})(jQuery);