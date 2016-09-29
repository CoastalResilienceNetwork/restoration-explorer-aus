define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui'
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui ) {
        "use strict";

        return declare(null, {
			makeChart: function(t){	
			// symbolize x axis
				var l = $('.vertAndLines').find('.dashedLines');  
				$.each(l, function(i,v){
					if (i == l.length - 1){
						$(v).css({'opacity': '1', 'border-top': '2px solid #000'})
					}
				})
				// calculate width of bars
				var bars = $('.barHolder').find('.sumBarsWrap');
				var lw = $('.dashedLines').css('width').slice(0,-2)
				var sLw = lw/bars.length;
				var bWw = sLw - 4;
				$('.smallLabels').css('width', sLw + 'px')
				$('.sumBarsWrap').css('width', bWw + 'px')
				$('.sumBars').css('width', bWw + 'px')
				
				var a1 = [1,5,3,4]
				t.barChart.updateChart(a1, t)
			},
			updateChart: function(a, t){ 
				var colors = ['#8FB842', '#cec83a', '#CBA62C', '#c8841d','#4052B4', '#406FB4', '#408cb4','#4A8B6D','#4FA84A']
				$('.barHolder').find('.sumBars').each(function(i,v){
					$(v).css("background-color", colors[i]);
					var h = a[i]*20;
					$(v).animate({ height: h + '%'});
				});
			}
        });
    }
);
