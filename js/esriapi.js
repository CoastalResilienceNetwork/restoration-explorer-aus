define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color"
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color ) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
				console.log('esri functions')


				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				t.map.setMapCursor("pointer");
				t.map.on("zoom-end", function(evt){
					t.map.setMapCursor("pointer");
				});
				//For Chosen options visit https://harvesthq.github.io/chosen/
				//Single deselect only works if the first option in the select tag is blank

				$("#" + t.id + "habitatDropdown").chosen({allow_single_deselect:true,"disable_search": true, width:"200px"})
					.change(function(c){
						// var v = c.target.value;
						// // check for a deselect
						// if (v.length == 0){
						// 	v = "none";
						// }
						// $('#' + c.target.id ).parent().next().find("span").html(v)
					});

				$(function() {
				  $("#" + t.id + "sldr").slider({ min: 1, max: 4, range: false, })
				    // .slider("pips", { rest: "label"})
				    // .slider("float");
				});
				$(function() {
				  $("#" + t.id + "sldr2").slider({ min: 1, max: 3, range: false, })
				    // .slider("pips", { rest: "label"})
				    // .slider("float");
				});

// // Dynamic layer on load ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 				t.dynamicLayer.on("load", function () { 			
// 					t.layersArray = t.dynamicLayer.layerInfos;
					
// 					// trigger clicks on techniques
// 					$.each($('#' + t.id + 'funcWrapper input'),function(i,v){
// 						if (t.obj.enhanceTech == v.value){
// 							$('#' + v.id).trigger('click');	
// 						}	
// 					});
// 					// trigger clicks on sup data radio buttons
// 					$.each($('#' + t.id + 'aus-supDataWrap input'),function(i,v){
// 						if (t.obj.supData == v.value){
// 							$('#' + v.id).trigger('click');	
// 						}	
// 					});
// 					// trigger initial top control clicks
// 					$.each($('#' + t.id + 'aus-viewRadioWrap input'),function(i,v){
// 						if (t.obj.viewRadCBCh == v.value){
// 							$('#' + v.id).trigger('click');	
// 						}	
// 					});

// 					var extent = new Extent(144.1, -38.6, 145.7, -37.6, new SpatialReference({ wkid:4326 }))
// 					if (t.obj.stateSet == "no"){
// 						// t.map.setExtent(t.dynamicLayer.fullExtent.expand(1.2), true)
// 						t.map.setExtent(extent, true)
// 					}
// // Save and Share ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 					// Save and Share Handler					
// 					if (t.obj.stateSet == "yes"){
// 						// // set slider values
// 						// $.each(t.obj.slIdsVals,function(i,v){
// 						// 	$('#' + t.id + v[0]).slider('values', v[1]);
// 						// });	
// 						// // checkboxes for sliders
// 						// $.each(t.obj.slCbIds,function(i,v){
// 						// 	$('#' + t.id + v).trigger('click');
// 						// })
// 						// // set radio buttons to checked state
// 						// $.each(t.obj.rbIds,function(i,v){
// 						// 	$('#' + t.id + v).attr('checked', true);
// 						// })
// 						// // checkboxes for radio buttons
// 						// $.each(t.obj.rbCbIds,function(i,v){
// 						// 	$('#' + t.id + v).trigger('click');
// 						// })
// 						// //extent
// 						// var extent = new Extent(t.obj.extent.xmin, t.obj.extent.ymin, t.obj.extent.xmax, t.obj.extent.ymax, new SpatialReference({ wkid:4326 }))
// 						// t.map.setExtent(extent, true);
// 						// t.obj.stateSet = "no";
// 					}	
					
// 				});					
			}
		});
    }
);