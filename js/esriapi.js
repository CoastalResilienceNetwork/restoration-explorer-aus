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

				var colorRamp = [[0,175,240,233],[3,175,240,222],[7,177,242,212],
			          [11,177,242,198],[15,176,245,183],[19,185,247,178],[23,200,247,178],
			          [27,216,250,177],[31,232,252,179],[35,248,252,179],[39,238,245,162],
			          [43,208,232,135],[47,172,217,111],[51,136,204,88],[55,97,189,66],
			          [59,58,176,48],[63,32,161,43],[67,18,148,50],[71,5,133,58],[75,30,130,62],
			          [79,62,138,59],[83,88,145,55],[87,112,153,50],[91,136,158,46],[95,162,166,41],
			          [99,186,171,34],[103,212,178,25],[107,237,181,14],[111,247,174,2],
			          [115,232,144,2],[119,219,118,2],[123,204,93,2],[127,191,71,2],[131,176,51,2],
			          [135,163,34,2],[139,148,21,1],[143,135,8,1],[147,120,5,1],[151,117,14,2],[155,117,22,5],
			          [159,115,26,6],[163,112,31,7],[167,112,36,8],[171,110,37,9],[175,107,41,11],
			          [179,107,45,12],[183,105,48,14],[187,115,61,28],[191,122,72,40],[155,117,22,5],
			          [159,115,26,6],[163,112,31,7],[167,112,36,8],[171,110,37,9],
			          [175,107,41,11],[179,107,45,12],[183,105,48,14],[187,115,61,28],[191,122,72,40],
			          [155,117,22,5],[159,115,26,6],[163,112,31,7],[167,112,36,8],[171,110,37,9],
			          [175,107,41,11],[179,107,45,12],[183,105,48,14],[187,115,61,28],[191,122,72,40],
			          [195,133,86,57],[199,140,99,73],[203,148,111,90],[207,153,125,109],
			          [213,163,148,139],[217,168,163,160],[223,179,179,179],[227,189,189,189],
			          [231,196,196,196],[235,207,204,207],[239,217,215,217],[243,224,222,224],
			          [247,235,232,235],[251,245,242,245],[255,255,252,255]];



		        //setup default parameters
		        var params = new ImageServiceParameters();
		        var rasterFunction = new RasterFunction();
		        rasterFunction.functionName = "ShadedRelief";
		        var functionArguments = {};
		        functionArguments.Azimuth= parseFloat(215.0); // 215.0;
		        functionArguments.Altitude = parseFloat(60.0);//60.0;
		        functionArguments.ZFactor = parseFloat(30.3);//30.3;
		        functionArguments.Colormap = colorRamp;
		       
		        rasterFunction.functionArguments = functionArguments;
		        rasterFunction.variableName = "Raster";
        		params.renderingRule =rasterFunction;
				
        		console.log(params)

        		// t.url = "https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/CaliforniaDEM/ImageServer"
        		t.url = "https://dev-services.coastalresilience.org/arcgis/rest/services/Australia/Marsh_RestExpl_Combined/ImageServer"
				// t.imageServiceLayer = new ArcGISImageServiceLayer(t.url, {imageServiceParameters:params});
				t.imageServiceLayer = new ArcGISImageServiceLayer(t.url);
				console.log(t.imageServiceLayer.bands)
				console.log(t.imageServiceLayer)
				t.imageServiceLayer.setBandIds([2,1,0])
        		t.map.addLayers([t.imageServiceLayer]);


			
				t.map.setMapCursor("pointer");
				t.map.on("zoom-end", function(evt){
					t.map.setMapCursor("pointer");
				});
				//For Chosen options visit https://harvesthq.github.io/chosen/
				//Single deselect only works if the first option in the select tag is blank

				$("#" + t.id + "habitatDropdown").chosen({allow_single_deselect:true,"disable_search": true, width:"200px"})
					.change(function(c){
					
					});
				// slider year
				$(function() {
				  $("#" + t.id + "sldr").slider({ min: 1, max: 4, range: false, })
				    
				});
				// slider rise
				$(function() {
				  $("#" + t.id + "sldr2").slider({ min: 1, max: 3, range: false, })
				 
				});

// // Dynamic layer on load ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// // Add dynamic map service
				// t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				// t.map.addLayer(t.dynamicLayer);
				// if (t.obj.visibleLayers.length > 0){	
				// 	t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				// }
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