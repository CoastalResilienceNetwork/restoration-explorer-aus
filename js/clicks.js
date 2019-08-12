define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color"
],
function ( declare, Query, QueryTask,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				// on main dropdown menu change
				$("#" + t.id + "habitatDropdown").on('change', function (v, ui) {
					// console.log(ui, v)
					if(v.currentTarget.value){
						// do something with the dropdown
						if(ui.selected == 'wetlands'){
							$('.rest-wetlandsWrapper').slideDown()
							$('.rest-musselsWrapper').slideUp()
						}else if(ui.selected == 'mussels'){
							$('.rest-musselsWrapper').slideDown()
							$('.rest-wetlandsWrapper').slideUp()
						}
					}else{
						// no value selected, and slide up both wrappers
						$('.rest-wetlandsWrapper').slideUp();
						$('.rest-musselsWrapper').slideUp();
					}
				})
				// handle the wetland help text click event
				$('#' + t.id + 'viewRankingText').on('click', function(v){
					let text = v.currentTarget.textContent;
					if(text == 'View Ranking Thresholds'){
						$('.rest-rankingThresholdText').slideDown();
						$(v.currentTarget).html('Hide Ranking Thresholds')
						$(v.currentTarget).css('color', 'rgb(140, 33, 48)')
					}else{
						$('.rest-rankingThresholdText').slideUp();
						$(v.currentTarget).html('View Ranking Thresholds');
						$(v.currentTarget).css('color', '#2f6384');
					}
				})
				$('#' + t.id + 'viewChangeText').on('click', function(v){
					let text = v.currentTarget.textContent;
					if(text == 'View Change Scenarios'){
						$('.rest-floodText').slideDown();
						$(v.currentTarget).html('Hide Change Scenarios')
						$(v.currentTarget).css('color', 'rgb(140, 33, 48)')
					}else{
						$('.rest-floodText').slideUp();
						$(v.currentTarget).html('View Change Scenarios');
						$(v.currentTarget).css('color', '#2f6384');
					}
				})

				// main wetland rad buttons click
				$('.rest-resultsRadBtns input').on('click', function(evt){
					t.obj.visibleLayers = []
					if(evt.currentTarget.value == 'final'){
						// disable all suitability variables radio buttons
						$.each($('.rest-wetlandsSuitWrapper input'), function(i,v){
							$(v).attr('disabled', true);
						})
						// turn on summed raster when final rad button is cliked, use the waterRiseTracker
						let layer;
						if(t.obj.waterRiseVal == 1){
							layer = 8
						}else if(t.obj.waterRiseVal == 2){
							layer = 9
						}else if(t.obj.waterRiseVal == 3){
							layer = 10
						}else if(t.obj.waterRiseVal == 4){
							layer = 11
						}
						t.obj.visibleLayers.push(layer)
						t.obj.viewResultsTracker = 'final'
						// slide down slider bar
						$('.rest-waterRiseWrapper').slideDown()
					}else{
						let layerVal;
						// enable all suitability variables radio buttons
						$.each($('.rest-wetlandsSuitWrapper input'), function(i,v){
							$(v).attr('disabled', false);
						})
						if(t.obj.wetlandVal == 'coastalFlood'){
							if (t.obj.waterRiseVal ==1 ) {
								layerVal = 4
							}else if(t.obj.waterRiseVal == 2){
								layerVal = 5
							}else if(t.obj.waterRiseVal == 3){
								layerVal = 6
							}else if(t.obj.waterRiseVal == 4){
								layerVal = 7
							}
							t.obj.visibleLayers.push(layerVal)
						}else{
							t.obj.visibleLayers.push(t.layersNameArray.indexOf(t.obj.wetlandVal))
						}

						t.obj.viewResultsTracker = 'individual'
						// slide up slider bar
						if(t.obj.wetlandVal != 'coastalFlood'){
							$('.rest-waterRiseWrapper').slideUp()
						}
					}
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				})
				// on individual wetland radio button click
				$('.rest-wetlandsSuitWrapper input').on('click', function(evt){
					t.obj.visibleLayers = []
					t.obj.wetlandVal = evt.currentTarget.value;
					if(t.obj.wetlandVal == 'coastalFlood'){
						// display the layer based on the water rise slider
						let layerVal;
						if (t.obj.waterRiseVal ==1 ) {
							layerVal = 4
						}else if(t.obj.waterRiseVal == 2){
							layerVal = 5
						}else if(t.obj.waterRiseVal == 3){
							layerVal = 6
						}else if(t.obj.waterRiseVal == 4){
							layerVal = 7
						}
						t.obj.visibleLayers.push(layerVal)
						// slide up slider bar
						$('.rest-waterRiseWrapper').slideDown()
					}else{
						// display layer based on the value passed
						t.obj.visibleLayers.push(t.layersNameArray.indexOf(t.obj.wetlandVal))
						// slide up slider bar
						$('.rest-waterRiseWrapper').slideUp()
					}
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				})
				// on wetland water rise slide
				$("#" + t.id + "sldr").on('slide', function(v, ui){
					t.obj.waterRiseVal = ui.value
					t.obj.visibleLayers = []
					if(t.obj.viewResultsTracker == 'final'){
						let layer;
						if(t.obj.waterRiseVal == 1){
							layer = 8
						}else if(t.obj.waterRiseVal == 2){
							layer = 9
						}else if(t.obj.waterRiseVal == 3){
							layer = 10
						}else if(t.obj.waterRiseVal == 4){
							layer = 11
						}
						t.obj.visibleLayers.push(layer)
					}else if(t.obj.viewResultsTracker == 'individual' && t.obj.wetlandVal  =='coastalFlood'){
						let layerVal;
						if (t.obj.waterRiseVal ==1 ) {
							layerVal = 4
						}else if(t.obj.waterRiseVal == 2){
							layerVal = 5
						}else if(t.obj.waterRiseVal == 3){
							layerVal = 6
						}else if(t.obj.waterRiseVal == 4){
							layerVal = 7
						}
						t.obj.visibleLayers.push(layerVal)
					}
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				})

				

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
