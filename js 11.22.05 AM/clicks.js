define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color"
],
function ( declare, Query, QueryTask,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
// work with Radio buttons (how would you like to view shoreline data) ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				$('#' + t.id + 'aus-viewRadioWrap input').on('click',function(c){
					var val = c.target.value
					if (val == 'all'){
						t.techLyr = 1
						t.obj.visibleLayers = [t.techLyr]
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						$('#' + t.id + 'aus-enhanceFuncWrap').slideUp()
						$('#' + t.id + 'sup1').prop('checked', true);
					}
					if (val == 'ind'){
						$('#' + t.id + 'sup1').prop('checked', true);
						if(t.obj.indInit == 'yes'){
							t.techLyr = 2;
							t.obj.visibleLayers = [t.techLyr]
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
							t.obj.indInit = 'no'
						}else{
							$.each($( '#' + t.id +'funcWrapper input'),function(i,v){
								if(v.checked == true){
									var val = v.value;
									$.each($(t.layersArray),function(i,v){
										var lyrName = v.name;
										if(val == lyrName){
											t.techLyr = v.id
										}
									});
								}
							});
							t.obj.visibleLayers = [t.techLyr]
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}
						$('#' + t.id + 'aus-enhanceFuncWrap').slideDown()
					}
				})
// work with Radio buttons indiv. techniques ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				$('#' + t.id + 'funcWrapper input').on('click',function(c){
					var val = c.target.value
					$.each($(t.layersArray),function(i,v){
						var lyrName = v.name;
						if(val == lyrName){
							t.techLyr = v.id
							t.obj.visibleLayers = [v.id];
					 		t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}
					});
				})
// work with Radio buttons sup data section ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				$('.aus-supDataWrap input').on('click',function(c){
					var val = c.target.value
					$.each($(t.layersArray),function(i,v){
						var lyrName = v.name;
						if(val == lyrName){
							t.techLyr = v.id
							t.obj.visibleLayers = [v.id];
					 		t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}
						if(val == 'None'){
							$.each($( '#' + t.id +'aus-viewRadioWrap input'),function(i,v){
								if (v.checked == true){
									if(v.value == 'all'){
										$( '#' + v.id).trigger('click');
									}else{
										$.each($( '#' + t.id +'aus-enhanceFuncWrap input'),function(i,v){
											if(v.checked == true){
												$( '#' + v.id).trigger('click');
											}
										});
									}
								}
							});
						}
					});
				});
// feature layer init ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				t.attributeData = new FeatureLayer(t.url + "/6", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// Map click ////////////////////////////////////////
				t.map.on("click", function(evt) {
					if(t.open == 'yes'){
						t.obj.pnt = evt.mapPoint;
						var q = new Query();
						q.geometry = t.obj.pnt;
						t.attributeData.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
					}
				});
// // On selection complete ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				t.attributeData.on('selection-complete', function(evt){
					if(evt.features.length > 0){
						t.layerDefs = []
						var OID = evt.features[0].attributes.OBJECTID;
						var beach = evt.features[0].attributes.beach
						var exposure = evt.features[0].attributes.exposure
						var mm = evt.features[0].attributes.mm
						var slope = evt.features[0].attributes.slope
						// Handle converting attributes to html text
						if(beach == 1){
							beach = 'Present'
						}else{
							beach = 'Not Present'
						}
						if(mm == 1){
							mm = 'Present'
						}else{
							mm = 'Not Present'
						}
						if(exposure == 10){
							exposure = 'Low'
						}else if(exposure == 7){
							exposure = 'Medium'
						}else{
							exposure = 'High'
						}

						if(slope == 10){
							slope = 'Flat'
						}else if(slope == 7){
							slope = 'Moderate'
						}else{
							slope = 'Steep'
						}
						$('#' + t.id + 'aus-attWrap').slideDown()
						$('#' + t.id + 'clickInst').slideUp()
						t.layerDefs[0] = 'OBJECTID = ' + OID;
						t.dynamicLayer.setLayerDefinitions(t.layerDefs);
						t.obj.visibleLayers = [0,t.techLyr];
						$('#' + t.id + 'attExp').html(exposure);
						$('#' + t.id + 'attSlope').html(slope);
						$('#' + t.id + 'attBP').html(beach);
						$('#' + t.id + 'attMM').html(mm);
						
					}else{
						$('#' + t.id + 'clickInst').slideDown()
						$('#' + t.id + 'aus-attWrap').slideUp()
						t.obj.visibleLayers = [t.techLyr];
					}
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				});
				// use this area to colapse attributes and check sup data to none.
				$('#' + t.id + 'aus-viewRadioWrap input ,#' + t.id + 'funcWrapper input, #' + t.id + 'aus-supDataWrap').on('click',function(c){
					//$('#' + t.id + 'sup1').trigger('click');
					$('#' + t.id + 'aus-attWrap').slideUp();
					$('#' + t.id + 'clickInst').slideDown();
				});
			},
			
			commaSeparateNumber: function(val){
				while (/(\d+)(\d{3})/.test(val.toString())){
					val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				}
				return val;
			},
			abbreviateNumber: function(num) {
			    if (num >= 1000000000) {
			        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
			     }
			     if (num >= 1000000) {
			        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
			     }
			     if (num >= 1000) {
			        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
			     }
			     return num;
			}
        });
    }
);
