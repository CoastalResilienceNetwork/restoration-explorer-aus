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
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url);
				t.map.addLayer(t.dynamicLayer);
				t.dynamicLayer.on("load", lang.hitch(t, function () { 
					t.obj.visibleLayers = t.obj.historicLayers;				
					if (t.obj.visibleLayers.length > 0){	
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
					t.layersArray = t.dynamicLayer.layerInfos;
					t.histExtent = t.map.extent;
					t.navigation.setNavBtns(t);
					
					t.basemap = $('.basemap-selector-title').html().substr(0, $('.basemap-selector-title').html().indexOf('<'))
				}));
				
				t.islFeat = new FeatureLayer(t.url + "/1", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				t.islFeat.on('selection-complete', lang.hitch(t,function(evt){
					t.obj.IslandName = evt.features[0].attributes.IslandName;
					var islExtent = evt.features[0].geometry.getExtent();
					t.map.setExtent(islExtent, true);
					
					if(t.obj.termSelected == 'long'){
						$.each(t.dataObject, lang.hitch(this, function(i,v){
							if(evt.features[0].attributes.IslandName == v.IslandName){
								var perAccretionLong = v.perAccretionLong;
								var perErosionLong = v.perErosionLong;
								var perAccretionShort = v.perAccretionShort;
								var perErosionShort = v.perErosionShort;
								//blue bar
								$('#' + t.id + 'bar2').animate({left : perAccretionLong +"%", width: perErosionLong +"%"});
								// orange bar 
								$('#' + t.id + 'bar1').animate({left : "0%", width: perAccretionLong +"%"});
								$('#' + t.id + 'bar2L').html(perErosionLong+"%")
								$('#' + t.id + 'bar1L').html(perAccretionLong+"%")
							}
						}));
					}
					if(t.obj.termSelected == 'short'){
						$.each(t.dataObject, lang.hitch(this, function(i,v){
							if(evt.features[0].attributes.IslandName == v.IslandName){
								var perAccretionLong = v.perAccretionLong;
								var perErosionLong = v.perErosionLong;
								var perAccretionShort = v.perAccretionShort;
								var perErosionShort = v.perErosionShort;
								//blue bar
								$('#' + t.id + 'bar2').animate({left : perAccretionShort +"%", width: perErosionShort +"%"});
								// orange bar 
								$('#' + t.id + 'bar1').animate({left : "0%", width: perAccretionShort +"%"});
								
								$('#' + t.id + 'bar2L').html(perErosionShort+"%")
								$('#' + t.id + 'bar1L').html(perAccretionShort+"%")
							}
						}));
					}
				}));
				
				// add feature layers for coastline change app
				t.islandPolygons = new FeatureLayer(t.url + "/2", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				t.islandPolygons_click = new FeatureLayer(t.url + "/2", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				//t.islandChangeLong = new FeatureLayer(t.url + "/4", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				//t.islandChangeShort = new FeatureLayer(t.url + "/3", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				
				t.selSymbolBh1 = new SimpleFillSymbol( SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
					SimpleLineSymbol.STYLE_SOLID, new Color([0,128,255]), 2 ), new Color([0,0,0,0.1])
				);
				t.selSymbolBh2 = new SimpleFillSymbol( SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
					SimpleLineSymbol.STYLE_SOLID, new Color([44, 96, 124, .5]), 10 ), new Color([0,0,0,0.1])
				);
				
				t.q = new Query();
				t.q.returnGeometry = false;
				t.q.outFields = ['OBJECTID_1','IslandName'];
				t.q.where = "OBJECTID_1 > -1"
				t.islandPolygons.selectFeatures(t.q,FeatureLayer.SELECTION_NEW);
				
				// add map feature layers
				t.map.addLayer(t.islandPolygons);
				t.map.addLayer(t.islandPolygons_click);
				
				// Turn the code on below to enable hover for long term change rate info below graphic
				///////////////////////////////////////////////////////////////////
				// t.islandChangeLong.on('mouse-over', lang.hitch(t,function(evt){
					// $('#' + t.id + 'transectWrapper').slideDown();
					
					// var lngTermChangeRate = evt.graphic.attributes.LRrate;
					// var lngTermDateRange = evt.graphic.attributes.xmax;
					// var lngTermNumPos = evt.graphic.attributes.N;
					
					// $('#' + t.id + 'lngChangeRate').text('Long Term Change Rate: ' + lngTermChangeRate);
					// $('#' + t.id + 'longDateRange').text('Long Term Date Range: ' + lngTermDateRange);
					// $('#' + t.id + 'longNumPositions').text('Long Term Number of Positions: ' + lngTermNumPos);

					// t.map.setMapCursor("pointer");
					// var highlightGraphic = new Graphic(evt.graphic.geometry,t.selSymbolBh2);
					// t.map.graphics.add(highlightGraphic);
				// }));
				
				// t.islandChangeLong.on('mouse-out', lang.hitch(t,function(evt){
					// t.map.setMapCursor("default");
				// }));
				
				t.islandPolygons_click.on('selection-complete',lang.hitch(t,function(evt){
					if(evt.features.length > 0){
						if(t.obj.trigger == 'mapClick'){
							var islandValue = evt.features[0].attributes.IslandName;
							$('#' + t.id + 'ch-ISL').val(islandValue).trigger('chosen:updated').trigger('change');
						}
						t.map.graphics.clear();
						
					}
				}));
				
				t.islandPolygons.on('mouse-over',lang.hitch(t,function(evt){
					if ( t.obj.section == 'historicalBtn' ) {
						t.map.setMapCursor("pointer");
						var highlightGraphic = new Graphic(evt.graphic.geometry,t.selSymbolBh1);
						t.map.graphics.add(highlightGraphic);
					}	
				}));
				t.map.graphics.on("mouse-out", lang.hitch(t,function(){
					if ( t.obj.section == 'historicalBtn' ) {
						t.map.setMapCursor("default");
						t.map.graphics.clear();
					}	
				}));
				// handle on click of map to query out attributes
				t.map.on("click", lang.hitch(t, function(evt) {
					if ( t.obj.section == 'historicalBtn' ) {
						var pnt = evt.mapPoint;
						t.hQuery = new esri.tasks.Query();
						t.hQuery.geometry = pnt;
						// query for the island polygons click
						var query = new esri.tasks.Query();
						query.geometry = t.hQuery.geometry;
						//query.where = 'perErosionLong > 90'
						t.obj.trigger = 'mapClick'
						t.islandPolygons_click.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW);
					}	
				}));
			},

			esriStartUp: function(t){
				// get future array
				t.futurePercents = [];
 				var cq = new Query();
				var cqt = new QueryTask(t.url + "/61");
				cq.where = "OBJECTID > 0";
				cq.returnGeometry = false;
				cq.outFields = ["cleanName, percentArray"];
				cqt.execute(cq, lang.hitch(t,function(e){
					$.each(e.features, lang.hitch(t,function(i,v){
						t.futurePercents.push(v.attributes);
					}));
				}))	
				t.dataObject = [];
				var ltQueryTask = new QueryTask(t.url + "/2")
				var ltQuery = new Query();
				ltQuery.returnGeometry = false;
				ltQuery.outFields = ['IslandName','perErosionLong','perAccretionLong', 'perErosionShort','perAccretionShort'];
				ltQuery.where = "OBJECTID_1 > -1"
				ltQueryTask.execute(ltQuery, lang.hitch(this, function(results){
					var f = results.features;
					$.each(f, lang.hitch(t,function(i,v){
						t.dataObject.push(v.attributes);
					}));
					if(t.obj.termSelected == 'long'){
						$.each(t.dataObject, lang.hitch(t,function(i,v){
							if(v.IslandName == "EasternShore"){
								var perAccretionLong = v.perAccretionLong;
								var perErosionLong = v.perErosionLong;
								var perAccretionShort = v.perAccretionShort;
								var perErosionShort = v.perErosionShort;
								//blue bar
								$('#' + t.id + 'bar2').animate({left : perAccretionLong +"%", width: perErosionLong +"%"});
								// orange bar 
								$('#' + t.id + 'bar1').animate({left : "0%", width: perAccretionLong +"%"});
								$('#' + t.id + 'bar2L').html(perErosionLong +"%")
								$('#' + t.id + 'bar1L').html(perAccretionLong +"%")
							}
						}));
					}
					if(t.obj.termSelected == 'short'){
						$.each(t.dataObject, lang.hitch(t,function(i,v){
							if(v.IslandName == "EasternShore"){
								var perAccretionLong = v.perAccretionLong;
								var perErosionLong = v.perErosionLong;
								var perAccretionShort = v.perAccretionShort;
								var perErosionShort = v.perErosionShort;
								//blue bar
								$('#' + t.id + 'bar2').animate({left : perAccretionShort +"%", width: perErosionShort +"%"});
								// orange bar 
								$('#' + t.id + 'bar1').animate({left : "0%", width: perAccretionShort +"%"});
								$('#' + t.id + 'bar2L').html(perErosionShort+"%")
								$('#' + t.id + 'bar1L').html(perAccretionShort+"%")
							}
						}));
					}
					
				}));
			}
		});
    }
);