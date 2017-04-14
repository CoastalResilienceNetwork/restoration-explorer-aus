define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color"
],
function ( declare, Query, QueryTask,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				// layer ids
				
				//t.techLyr = 1;
				

				// leave help button
				// $('#' + t.id + 'getHelpBtn').on('click', function(c){
				// 	$('#' + t.id + ' .aus-wrap').show()
				// 	$('#' + t.id + ' .aus-help').hide()
				// })
				// info icon clicks
				// $('#' + t.id + ' .infoIcon').on('click',function(c){
				// 	t.showHelp();
				// 	var ben = c.target.id.split("-").pop();
				// 	$('#' + t.id + 'getHelpBtn').html('Back to aus Floodplain Explorer');
				// 	t.clicks.updateAccord(t);	
				// 	$('#' + t.id + 'infoAccord .' + ben).trigger('click');
				// });
				// suppress help on startup click
				// $('#' + t.id + '-shosu').on('click',function(c){
				// 	if (c.clicked == true){
				// 		t.app.suppressHelpOnStartup(true);
				// 	}else{
				// 		t.app.suppressHelpOnStartup(false);
				// 	}
				// })

// work with Radio buttons (how would you like to view shoreline data) ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				$('#' + t.id + 'aus-viewRadioWrap input').on('click',function(c){
					var val = c.target.value
					if (val == 'all'){
						t.obj.visibleLayers = [0]
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						console.log('all');
						$('#' + t.id + 'aus-enhanceFuncWrap').slideUp()
					}
					if (val == 'ind'){
						t.obj.visibleLayers = [t.techLyr]
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						console.log('ind');
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
							console.log(t.techLyr);
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
							t.obj.visibleLayers = [v.id];
					 		t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}
						if(val == 'None'){
							console.log('none', t.techLyr);
							t.obj.visibleLayers = [t.techLyr];
					 		t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}
					});
				});
// feature layer init ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				t.attributeData = new FeatureLayer(t.url + "/5", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// Map click ////////////////////////////////////////
				t.map.on("click", function(evt) {
					console.log(evt);
					if(t.open == 'yes'){
						t.obj.pnt = evt.mapPoint;
						var q = new Query();
						q.geometry = t.obj.pnt;
						t.attributeData.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
					}
					
				
				});
// // On selection complete ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				t.attributeData.on('selection-complete', function(evt){
					console.log(evt);
					
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
