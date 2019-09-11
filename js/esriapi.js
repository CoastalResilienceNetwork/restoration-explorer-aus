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
				t.url = 'https://services2.coastalresilience.org/arcgis/rest/services/Australia/Habitat_Restoration_Explorer/MapServer'
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				t.map.addLayer(t.dynamicLayer);
				console.log('api functions')
				t.dynamicLayer.on("load", function () {
					// if not state set /////////////////////////////////////////////////////////
					if(t.obj.stateSet == 'yes'){
						t.dynamicLayer.setOpacity(t.obj.opacitySliderVal/100);

						// set value of main dropdown menu and slide down appropriate section
						$('#' + t.id + 'habitatDropdown').val(t.obj.mainDropDownValue)
						// slide down the correct section
						if(t.obj.mainDropDownValue == 'wetlands'){
							$('.rest-wetlandsWrapper').slideDown();
						} else if (t.obj.mainDropDownValue == 'mussels') {
							$('.rest-musselsWrapper').slideDown();
						}
						// check the correct starting mussels checkbox
						$.each($('.rest-mussResultsRadBtns input'), function (i, v) {
							if (v.value == t.obj.mussViewResultsTracker) {
								$(v).attr('checked', true);
							} else {
								$(v).attr('checked', false);
							}
						})
						// handle disabling of ind radio buttons
						if (t.obj.mussViewResultsTracker == 'mussFinal') {
							$.each($('.rest-mussIndVarWrapper input'), function (i, v) {
								$(v).attr('disabled', true)
							})
						} else if (t.obj.mussViewResultsTracker == 'mussInd') {
							$.each($('.rest-mussIndVarWrapper input'), function (i, v) {
								$(v).attr('disabled', false)
							})
						}
						// find out which mussels radio button needs to be checked
						$.each($('.rest-mussIndVarWrapper input'), function (i, v) {
							if (v.value == t.obj.mussIndividualVariableTracker) {
								$(v).attr('checked', true);
							} else {
								$(v).attr('checked', false);
							}
						})
						
						// find out which mussels wet/dry button needs to be checked
						$.each($('.rest-wetDryWrapper input'), function (i, v) {
							if (v.value == t.obj.mussWetDry) {
								$(v).attr('checked', true);
							} else {
								$(v).attr('checked', false);
							}
						})
						

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
						console.log('set extent', t.dynamicLayer.fullExtent)
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
						// muss water rise slider
					$(function() {
					    $("#" + t.id + "mussSldr").slider({ min: 1, max: 4, range: false,values:[t.obj.waterRiseVal] })

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