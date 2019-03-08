define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", 
	"dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color", 
	"esri/layers/ArcGISImageServiceLayer", "esri/layers/ImageServiceParameters", "esri/layers/RasterFunction"
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color, 
			ArcGISImageServiceLayer, ImageServiceParameters, RasterFunction ) {
        "use strict";

        return declare(null, {

			esriApiFunctions: function(t){	
				// Dynamic layer on load ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// Add dynamic map service
				t.url = 'https://dev-services.coastalresilience.org/arcgis/rest/services/Australia/Habitat_Restoration_Explorer/MapServer'
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				t.dynamicLayer.on("load", function () {


					// if not state set /////////////////////////////////////////////////////////
					if(t.obj.stateSet == 'yes'){
						t.dynamicLayer.setOpacity(t.obj.opacitySliderVal/100);
						// figure out which main radio button needs to be checked
						$.each($('.rest-resultsRadBtns input'), function(i,v){
							if(v.value == t.obj.viewResultsTracker){
								$(v).attr('checked', true);
							}else{
								$(v).attr('checked', false);
							}
						})
						// find out which wetlands radio button needs to be checked
						$.each($('.rest-wetlandsSuitWrapper input'), function(i,v){
							if(v.value == t.obj.wetlandVal){
								$(v).attr('checked', true);
							}else{
								$(v).attr('checked', false);
							}
						})
						
						// handle when the individula rad buttons are disabled
						if(t.obj.viewResultsTracker == 'final'){
							$.each($('.rest-wetlandsSuitWrapper input'), function(i,v){
								$(v).attr('disabled', true)
							})
							$('.rest-waterRiseWrapper').slideDown()

						}else if(t.obj.viewResultsTracker == 'individual'){
							$.each($('.rest-wetlandsSuitWrapper input'), function(i,v){
								$(v).attr('disabled', false)
							})
							if(t.obj.wetlandVal == 'coastalFlood'){
								$('.rest-waterRiseWrapper').slideDown()
							}else{
								$('.rest-waterRiseWrapper').slideUp()
							}
						}
					}else{
						t.map.setExtent(t.dynamicLayer.fullExtent.expand(1.2), true)
					}


					// get layers array, set extent, change map cursor 			
					t.layersArray = t.dynamicLayer.layerInfos;
					t.map.setMapCursor("pointer");
					t.map.on("zoom-end", function(evt){
						t.map.setMapCursor("pointer");
					});


					//For Chosen options visit https://harvesthq.github.io/chosen/
					//Single deselect only works if the first option in the select tag is blank
					$("#" + t.id + "habitatDropdown").chosen({allow_single_deselect:true,"disable_search": true, width:"200px"})
						.change(function(c){
						
						});
					// opacity slider
					$(function() {
					    $("#" + t.id + "opacity-slider").slider({ min: 1, max: 100, range: false, values:[t.obj.opacitySliderVal] })
					    // on opacity slide
					    $("#" + t.id + "opacity-slider").on('slide', function(v,ui){
					    	t.obj.opacitySliderVal = ui.value
					  		t.dynamicLayer.setOpacity(ui.value/100); // set init opacity
					    })
					});
					// water rise slider
					$(function() {
					    $("#" + t.id + "sldr").slider({ min: 1, max: 4, range: false,values:[t.obj.waterRiseVal] })

					});
					// slider rise
					$(function() {
					  $("#" + t.id + "sldr2").slider({ min: 1, max: 3, range: false, })
					 
					});
					// build a name layers array
					t.layersNameArray = []
					$.each(t.layersArray, function(i,v){
						t.layersNameArray.push(v.name);
					})
				}) // end of layer load function
			}
		});
    }
);