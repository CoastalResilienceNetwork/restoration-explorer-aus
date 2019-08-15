define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color"
],
function ( declare, Query, QueryTask,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				const mainDropDownLayerDisplay = (val) => {
					t.obj.visibleLayers = []
					if (val == 'wetlands') {
						t.obj.visibleLayers.push(t.obj.wetlandLayer)
					} else if (val == 'mussels') {
						t.obj.visibleLayers.push(t.obj.musselLayer)
					}
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				// on main dropdown menu change ///////////////////////////////////////
				$("#" + t.id + "habitatDropdown").on('change', function (v, ui) {
					mainDropDownLayerDisplay(v.currentTarget.value)

					if(v.currentTarget.value){
						// do something with the dropdown
						if(ui.selected == 'wetlands'){
							t.obj.mainDropDownValue = "wetlands"
							$('.rest-wetlandsWrapper').slideDown()
							$('.rest-musselsWrapper').slideUp()
						}else if(ui.selected == 'mussels'){
							t.obj.mainDropDownValue = "mussels"
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
				$('#' + t.id + 'mussViewRankingText').on('click', function (v) {
					let text = v.currentTarget.textContent;
					if (text == 'View Ranking Thresholds') {
						$('.rest-mussRankingThresholdText').slideDown();
						$(v.currentTarget).html('Hide Ranking Thresholds')
						$(v.currentTarget).css('color', 'rgb(140, 33, 48)')
					} else {
						$('.rest-mussRankingThresholdText').slideUp();
						$(v.currentTarget).html('View Ranking Thresholds');
						$(v.currentTarget).css('color', '#2f6384');
					}
				})
				// wetland functionality ////////////////////////////////////////
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
						
						
						if(t.obj.waterRiseVal == 1){
							t.obj.wetlandLayer = 8
						}else if(t.obj.waterRiseVal == 2){
							t.obj.wetlandLayer = 9
						}else if(t.obj.waterRiseVal == 3){
							t.obj.wetlandLayer = 10
						}else if(t.obj.waterRiseVal == 4){
							t.obj.wetlandLayer = 11
						}
						t.obj.visibleLayers.push(t.obj.wetlandLayer)
						t.obj.viewResultsTracker = 'final'
						// slide down slider bar
						$('.rest-waterRiseWrapper').slideDown()
					}else{
						
						// enable all suitability variables radio buttons
						$.each($('.rest-wetlandsSuitWrapper input'), function(i,v){
							$(v).attr('disabled', false);
						})
						if(t.obj.wetlandVal == 'coastalFlood'){
							if (t.obj.waterRiseVal ==1 ) {
								t.obj.wetlandLayer = 4
							}else if(t.obj.waterRiseVal == 2){
								t.obj.wetlandLayer = 5
							}else if(t.obj.waterRiseVal == 3){
								t.obj.wetlandLayer = 6
							}else if(t.obj.waterRiseVal == 4){
								t.obj.wetlandLayer = 7
							}
							t.obj.visibleLayers.push(t.obj.wetlandLayer)
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
						if (t.obj.waterRiseVal ==1 ) {
							t.obj.wetlandLayer = 4
						}else if(t.obj.waterRiseVal == 2){
							t.obj.wetlandLayer = 5
						}else if(t.obj.waterRiseVal == 3){
							t.obj.wetlandLayer = 6
						}else if(t.obj.waterRiseVal == 4){
							t.obj.wetlandLayer = 7
						}
						t.obj.visibleLayers.push(t.obj.wetlandLayer)
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
						if(t.obj.waterRiseVal == 1){
							t.obj.wetlandLayer = 8
						}else if(t.obj.waterRiseVal == 2){
							t.obj.wetlandLayer = 9
						}else if(t.obj.waterRiseVal == 3){
							t.obj.wetlandLayer = 10
						}else if(t.obj.waterRiseVal == 4){
							t.obj.wetlandLayer = 11
						}
						t.obj.visibleLayers.push(t.obj.wetlandLayer)
					}else if(t.obj.viewResultsTracker == 'individual' && t.obj.wetlandVal  =='coastalFlood'){
						if (t.obj.waterRiseVal ==1 ) {
							t.obj.wetlandLayer = 4
						}else if(t.obj.waterRiseVal == 2){
							t.obj.wetlandLayer = 5
						}else if(t.obj.waterRiseVal == 3){
							t.obj.wetlandLayer = 6
						}else if(t.obj.waterRiseVal == 4){
							t.obj.wetlandLayer = 7
						}
						t.obj.visibleLayers.push(t.obj.wetlandLayer)
					}
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				})

				// mussels section functionality *****************************************************************
				$('.rest-mussResultsRadBtns input').on('click', (evt) => {
					if (evt.currentTarget.value == 'mussFinal') {
						t.obj.mussViewResultsTracker = 'mussFinal'
					} else if (evt.currentTarget.value == 'mussInd'){
						t.obj.mussViewResultsTracker = 'mussInd'
					}
					disableEnableMussIndButtons();
					displayMusselsLayer();
				})

				// on wet/dry toggle button click
				$('.rest-wetDryWrapper input').on('click', (evt)=>{
					if(evt.currentTarget.value == 'wet'){
						t.obj.mussWetDry = "wet"
					}else if(evt.currentTarget.value == 'dry'){
						t.obj.mussWetDry = "dry"
					}
					displayMusselsLayer();
				})

				// on muss individual radio button click
				$('.rest-mussIndVarWrapper input').on('click', (evt) => {
					t.obj.mussIndividualVariableTracker = evt.currentTarget.value;
					displayMusselsLayer()
				})

				// display the correct mussels layer
				const displayMusselsLayer = ()=>{
					t.obj.visibleLayers = [];
					if (t.obj.mussViewResultsTracker == 'mussFinal') {
						if (t.obj.mussWetDry == 'wet'){
							t.obj.musselLayer = 18
						}else{
							t.obj.musselLayer = 19
						}
					} else if (t.obj.mussViewResultsTracker == 'mussInd') {
						if (t.obj.mussWetDry == 'wet') {
							if (t.obj.mussIndividualVariableTracker == 'Temp') {
								t.obj.musselLayer = 17
							}else if(t.obj.mussIndividualVariableTracker == 'Sal') {
								t.obj.musselLayer = 14
							} else if (t.obj.mussIndividualVariableTracker == 'Amm') {
								t.obj.musselLayer = 13
							}
						} else {
							if (t.obj.mussIndividualVariableTracker == 'Temp') {
								t.obj.musselLayer = 16
							} else if (t.obj.mussIndividualVariableTracker == 'Sal') {
								t.obj.musselLayer = 15
							} else if (t.obj.mussIndividualVariableTracker == 'Amm') {
								t.obj.musselLayer = 12
							}
						}
					}
					t.obj.visibleLayers.push(t.obj.musselLayer);
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				// work with muss ind radio buttons enable/disable
				const disableEnableMussIndButtons = ()=>{
					if(t.obj.mussViewResultsTracker == 'mussFinal'){
						// disable rad buttons
						$.each($('.rest-mussIndVarWrapper input'), function (i, v) {
							$(v).attr('disabled', true);
						})
					}else{
						// enable all suitability variables radio buttons
						$.each($('.rest-mussIndVarWrapper input'), function (i, v) {
							$(v).attr('disabled', false);
						})
					}
				}
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
