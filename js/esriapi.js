define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/graphic", "dojo/_base/Color", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui'
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, Graphic, Color, lang, on, $, ui) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url);
				t.map.addLayer(t.dynamicLayer);
				t.dynamicLayer.on("load", lang.hitch(t, function () { 			
					if (t.obj.visibleLayers.length > 0){	
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
					t.layersArray = t.dynamicLayer.layerInfos;
					t.clicks.layerDefUpdate(t);
					t.map.setMapCursor("pointer");
				}));	
				var sym = new SimpleFillSymbol( SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
					SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 2 ), new Color([0,0,0,0.1])
				);
				t.basinFl = new FeatureLayer(t.url + "/1", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				t.basinFl.setSelectionSymbol(sym);
				t.map.addLayer(t.basinFl);
				t.basinFl.on('selection-complete', lang.hitch(t,function(evt){
					if (evt.features.length > 0){
						$('#' + t.id + 'hydroHeader').html('Selected hydrobasin');
						var atts = evt.features[0].attributes;
						var co2 = atts.CO2;
						if (co2 == -99){
							co2 = 0;	
						}	
						var a = [atts.IUCN, co2, atts.ForLoss, atts.HMI]
						t.barChart.updateChart(a,t);
						$('#' + t.id + 'barGraphWrap').slideDown(); 
						/* Code for filling atts as text 
						$.each($('#' + t.id + ' .atts'), lang.hitch(t,function(i,v){
							var a = $(v).prop('id').substr($(v).prop('id').indexOf("-") + 1);
							$(v).html(atts[a])
						}));
						$('#' + t.id + 'attDiv').slideDown(); */
					}else{
						$('#' + t.id + 'hydroHeader').html('Click map to select a hydrobasin');
						//$('#' + t.id + 'attDiv').slideUp();
						$('#' + t.id + 'barGraphWrap').slideUp(); 
					}	
				}));	
				t.map.on("click", lang.hitch(t, function(evt) {
					var pnt = evt.mapPoint;
					var q = new Query();
					q.geometry = pnt;
					t.basinFl.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
				}));
				t.map.on("zoom-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));
				t.map.on("update-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));				
			}
		});
    }
);