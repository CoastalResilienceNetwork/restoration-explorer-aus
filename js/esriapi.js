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
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				t.dynamicLayer.on("load", lang.hitch(t, function () { 			
					if (t.obj.visibleLayers.length > 0){	
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
					t.layersArray = t.dynamicLayer.layerInfos;
					// Start with empty expressions
					t.standingc = ""; 
					t.forloss = "";
					t.refor = "";
					t.freshbiot = "";
					t.terrsp = "";
					t.vita = "";
					t.agloss = "";
					t.nitrogen = "";
					t.clicks.layerDefsUpdate(t);
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
						$('#' + t.id + 'hydroHeader').html('<b>Selected Hydrobasin Attributes</b>');
						var atts = evt.features[0].attributes;
						var b = [['standingc',atts.standingc,6568.95], ['forloss',atts.forloss,19429.33], ['refor',atts.refor,65038.4], ['freshbiot',atts.freshbiot/10,1], 
								 ['terrsp',atts.terrsp,219], ['vita',atts.vita,84.06], ['agloss',atts.agloss,68], ['nitrogen',atts.nitrogen,611.6]];
						t.hbar.updateHbar(t,b);
						
						if ($('#' + t.id + 'cbListener').is(":visible")){
							$('#' + t.id + 'hbbHeader').trigger('click');
						};
						if ($('#' + t.id + 'supDataWrap').is(":visible")){
							$('#' + t.id + 'sdWrap').trigger('click');
						};
						if ($('#' + t.id + 'hydroWrap').is(":hidden")){
							$('#' + t.id + 'hydroSection').trigger('click');
						};
						$('#' + t.id + 'graphWrap').slideDown();
					}else{
						$('#' + t.id + 'hydroHeader').html('Click map to select a hydrobasin');
						$('#' + t.id + 'graphWrap').slideUp();
							
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