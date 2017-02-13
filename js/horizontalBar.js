define([
	"dojo/_base/declare", "dojo/dom-style", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', "esri/tasks/query",
	"esri/tasks/QueryTask",'esri/geometry/Extent', 'esri/SpatialReference'
],
function ( declare, domStyle, lang, on, $, ui, Query, QueryTask, Extent, SpatialReference) {
        "use strict";

        return declare(null, {

			updateHbar: function(t,b){
				$.each(b, function(i,v){
					var x = Math.round(v[1]/v[2]*100);
					var n = "";
					var fb = v[1]*10/10
					if (v[0] == 'freshbiot'){
						n = t.clicks.numberWithCommas(fb.toFixed(2));
					}else{	
						n = t.clicks.numberWithCommas(Math.round(v[1]))
					}	
					$('#' + t.id + v[0] + '-bar').animate({left : "0%", width: x+"%"});					
					if (n == -9.9 || n == -99){
						n = "No data"
						$('#' + t.id + v[0] + '-label').hide()	
					}else{	
						$('#' + t.id + v[0] + '-label').show()
					}	
					$('#' + t.id + v[0] + '-amount').html(n)
				})	
			}
        });
    }
);