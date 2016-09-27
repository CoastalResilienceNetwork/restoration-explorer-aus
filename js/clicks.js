define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi'
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi ) {
        "use strict";

        return declare(null, {
			chosenListeners: function(t){
				// Enable jquery plugin 'chosen'
				require(["jquery", "plugins/coastline-change/js/chosen.jquery"],lang.hitch(this,function($) {
					var configCrs =  { '.chosen-islands' : {allow_single_deselect:false, width:"186px", disable_search:true}}
					for (var selector in configCrs)  { $(selector).chosen(configCrs[selector]); }
				}));
				// User selections on chosen menus 
				require(["jquery", "plugins/coastline-change/js/chosen.jquery"],lang.hitch(t,function($) {	
				t.esriapi = new esriapi();
					//Select CRS 
					$('#' + t.id + 'ch-ISL').chosen().change(lang.hitch(t,function(c, p){
						t.obj.islSelected = c.currentTarget.value;
						if(c.target.value != 'EasternShore'){
							t.obj.islandText = c.target.value + " Island";
							if(t.obj.termSelected == 'long'){
								$('#' + t.id + 'chartTitle').text(t.obj.islandText + ' – Long Term Change')
							}
							if(t.obj.termSelected == 'short'){
								$('#' + t.id + 'chartTitle').text(t.obj.islandText + ' – Short Term Change')
							}
							// create new query and and select features
							var q = new Query();
							q.where = "IslandName = '" + t.obj.islSelected + "'";
							t.islFeat.selectFeatures(q,FeatureLayer.SELECTION_NEW);
							// Hide selected island polygon
							var q1 = new Query();
							q1.where = "IslandName <> '" + t.obj.islSelected + "'";
							t.islandPolygons.selectFeatures(q1,FeatureLayer.SELECTION_NEW);
							
							t.islandPolygons_click.setDefinitionExpression("IslandName <> '" + t.obj.islSelected + "'");
							// Hide selcted island label
							var layerDefinitions = [];
							layerDefinitions[0] = q1.where;
							layerDefinitions[3] = "Island = '" + t.obj.islSelected + "'";
							layerDefinitions[4] = "Island = '" + t.obj.islSelected + "'";
							t.dynamicLayer.setLayerDefinitions(layerDefinitions);
							// check to see if in historical 
							if(t.obj.dataTypeButton == 'hisShoreBtn'){
								t.obj.visibleLayers = [0];
								$('#' + t.id + 'ch-yearCheck .yearCb').each(lang.hitch(t,function(i, v){
									if(v.checked == true){
										var val = v.value;
										$.each(t.layersArray, lang.hitch(t,function(i,v){
											var layerName = v.name;
											if(layerName.split("_")[1] == val){
												t.obj.yearLayerID = v.id;
												t.obj.visibleLayers.push(t.obj.yearLayerID);
												t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
											}
										}));
										t.obj.visibleLayers = []
									}
								}));
							}
							if(t.obj.termSelected == "long" && t.obj.dataTypeButton == 'chRateBtn'){
								t.obj.historicLayers = [0,4];
								t.obj.visibleLayers = t.obj.historicLayers;
								t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
							}
							if(t.obj.termSelected == "short" && t.obj.dataTypeButton == 'chRateBtn'){
								t.obj.historicLayers = [0,3];
								t.obj.visibleLayers = t.obj.historicLayers;
								t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
							}							
							//t.obj.zoomedIn = "yes";
						}else{
							if(t.obj.termSelected == 'long'){
								$('#' + t.id + 'chartTitle').text('Virginia Eastern Shore – Long Term Change')
							}
							if(t.obj.termSelected == 'short'){
								$('#' + t.id + 'chartTitle').text('Virginia Eastern Shore – Short Term Change')
							}
							// Show all island labels
							var layerDefinitions = [];
							layerDefinitions[0] = "IslandName <> 'a'";
							t.dynamicLayer.setLayerDefinitions(layerDefinitions);
							t.islandPolygons_click.setDefinitionExpression("IslandName <> 'xyz'");
							var q1 = new Query();
							q1.where = "IslandName <> 'xyz'";
							t.islandPolygons.selectFeatures(q1,FeatureLayer.SELECTION_NEW);
							// zoom to eastern shore
							t.map.setExtent(t.obj.initialExtent, true);
							//t.obj.zoomedIn = "no";
							t.esriapi.esriStartUp(t);
						}
						
						
						if(t.obj.trigger != 'mapClick'){
							var query = new esri.tasks.Query();
							query.where = "IslandName = '" + t.obj.islSelected + "'"
							t.islandPolygons_click.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW);
							t.obj.trigger = 'dropDown'
						}
					}));
				}));
				// HANDLE INDIVIDUAL SHORELINE CHECKBOX CLICKS AND CHECK ALL YEAR SHORELINES///////////////////////////////////////////////////////////////////////////////////
				$('#' + t.id + 'ch-yearCheck .yearCbWrap').on('click',lang.hitch(this,function(c){
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0]).prop("checked", !$(c.currentTarget.children[0]).prop("checked") )	
					}
					t.obj.checkYearArray = [0];
					t.obj.checkedMultiYears = [];
					$('#' + t.id + 'ch-yearCheck .yearCb').each(lang.hitch(t,function(i, v){
						if(v.checked == true){
							var lyr = v.value + " Shoreline";
							$.each(t.layersArray, lang.hitch(t,function(j,w){
								if (lyr == w.name){
									t.obj.checkYearArray.push(w.id)
									t.obj.checkedMultiYears.push("ch-" + v.value);
								}	
							}));	
						}
					}));
					t.obj.historicLayers = t.obj.checkYearArray;
					t.obj.visibleLayers = t.obj.historicLayers;
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}));
				// SET UP SLIDER AND ADD EVENT LISTENER //////////////////
				var vals = 13;
				var labels = ['1850s','1910s','1940s', '1962', '1970s', '1985-6', '1994', '2002', '2004', '2006', '2009', '2011', '2013', '2014'];
				for (var i = 0; i <= vals; i++) {
					var el = $('<label>'+(labels[i])+'</label>').css('left',(i/vals*100)+'%');
					$('#' + t.id + 'multiShoreSlider').append(el);
				}
				$('#' + t.id + 'multiShoreSlider').on('slide', lang.hitch(this,function(w,evt){
					t.obj.sliderCounter = evt.value;
					$.each(t.layersArray, lang.hitch(t,function(i,v){
						if ( t.obj.sliderCounter == v.id){
							t.obj.yearLayerID = v.id;
							t.obj.historicLayers = [t.obj.yearLayerID];
							t.obj.visibleLayers = t.obj.historicLayers;
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						}	
					}));
					if (t.sliderPlayBtn  == 'play'){
						t.sliderPlayBtn  == ''
						$('#' + t.id + 'sliderStop').trigger('click');
					}
				}));
				// slider play button click
				$('#' + t.id + 'sliderPlay').on('click', lang.hitch(t,function(){
					$('#' + t.id + 'sliderPlay').addClass('hide');
					$('#' + t.id + 'sliderStop').removeClass('hide');
					t.sliderPlayBtn  = 'play' 
					t.setInt = setInterval(function(){
						$('#' + t.id + 'multiShoreSlider').slider('value',t.obj.sliderCounter);
						var x  = t.obj.sliderCounter;
						t.obj.historicLayers = [0, x];
						t.obj.visibleLayers = t.obj.historicLayers;
						t.obj.yearLayerID = t.obj.sliderCounter;
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
						t.obj.sliderCounter++
						if(t.obj.sliderCounter>20){
							t.obj.sliderCounter = 7
						}
						
					}, 1000);
				}));
				//slider stop button click
				$('#' + t.id + 'sliderStop').on('click', lang.hitch(t,function(){
					$('#' + t.id + 'sliderPlay').removeClass('hide');
					$('#' + t.id + 'sliderStop').addClass('hide');
					clearInterval(t.setInt);
					t.sliderPlayBtn  = '';
				}));
				//FUTURE CLICKS ////////////////////
				//inlet arrays
				t.inlet1 = ['Future Scenarios: High - Greater NE - None','Future Scenarios: Highest - Greater NE - None',
							'Future Scenarios: High - Greater NE - Wallops', 'Future Scenarios: High - Greater NE - Assateague',
							'Future Scenarios: High - Greater NE - Both', 'Future Scenarios: Highest - Greater NE - Wallops',
							'Future Scenarios: Highest - Greater NE - Assateague', 'Future Scenarios: Highest - Greater NE - Both'];
				t.inlet2 = ['Future Scenarios: High - Lesser NE - Both', 'Future Scenarios: Highest - Lesser NE - Both'];
				// click on any of the buttons in the future wrapper section.
				$('#' + t.id + 'futButtonWrapper .togBtn').on('click', lang.hitch(t,function(c){
					t.obj.visibleLayers = [];
					var nm = c.target.innerText;		
					// Add conditional logic based on id of parent div
					var pid = $('#' + c.currentTarget.id).parent().parent().prop('id');
					if (pid == t.id + "riseWrapper"){
						t.obj.seaLevelValue = nm;
						t.obj.riseBtn = "-" + c.target.id.substr(c.target.id.indexOf("-") + 1);
					}
					if (pid == t.id + "waveWrapper"){
						t.obj.waveValue = " - " + nm;
						t.obj.waveBtn = "-" + c.target.id.substr(c.target.id.indexOf("-") + 1);
					}
					if (pid == t.id + "nourWrapper"){
						t.obj.nourValue = " - " + nm;
						t.obj.nourBtn = "-" + c.target.id.substr(c.target.id.indexOf("-") + 1);						
					}
					t.obj.fsLyrName = "Future Scenarios: " + t.obj.seaLevelValue + t.obj.waveValue + t.obj.nourValue;
					if (t.obj.nourValue == ' - Wallops'){
						t.obj.visibleLayers.push(24)
					}
					if (t.obj.nourValue == ' - Assateague'){
						t.obj.visibleLayers.push(23)
					}
					if (t.obj.nourValue == ' - Both'){
						t.obj.visibleLayers.push(23)
						t.obj.visibleLayers.push(24)
					}
					$.each(t.inlet1, lang.hitch(t,function(i,v){
						if 	(t.obj.fsLyrName == v){
							t.obj.visibleLayers.push(21)	
						}	
					}))
					$.each(t.inlet2, lang.hitch(t,function(i,v){
						if 	(t.obj.fsLyrName == v){
							t.obj.visibleLayers.push(22)	
						}	
					}))					
					$.each(t.layersArray, lang.hitch(t,function(i,v){
						if (t.obj.fsLyrName == v.name){
							t.obj.visibleLayers.push(v.id);
							t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
							$.each(t.futurePercents, lang.hitch(t,function(j,w){
								if (w.cleanName == v.name){
									var a = JSON.parse(w.percentArray);
									a.reverse();
									t.barChart.updateChart(a, t)
								}	
							}));							
						}	
					}));	
				}));
			}
        });
    }
);