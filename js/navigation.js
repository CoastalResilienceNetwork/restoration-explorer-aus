define([
	"dojo/_base/declare", "dojo/dom-style", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', "esri/tasks/query",
	"esri/tasks/QueryTask",'esri/geometry/Extent', 'esri/SpatialReference'
],
function ( declare, domStyle, lang, on, $, ui, Query, QueryTask, Extent, SpatialReference) {
        "use strict";

        return declare(null, {

			navListeners: function(t){				
				$('#' + t.id + 'futureBtn').on('click', lang.hitch(t,function(){
					$.each($('.basemap-selector-list ul li'), lang.hitch(t,function(i,v){
						if ($(v).html() == 'Basic Dark Gray'){
							$(v).trigger('click')
						}	
					}));
					$('.basemap-selector').hide();
					t.map.hideZoomSlider();
					t.map.disableDoubleClickZoom();
					t.map.disableRubberBandZoom();
					t.map.disableScrollWheelZoom();
					t.obj.section = 'futureBtn';
					t.histExtent = t.map.extent;
					var futureExtent = new Extent( -76.1, 37.0, -75.2, 38.1, new SpatialReference({ wkid:4326 }) );
					t.map.setExtent(futureExtent.expand(1));
					if (t.sliderPlayBtn  == 'play'){
						t.sliderPlayBtn  == ''
						$('#' + t.id + 'sliderStop').trigger('click');
					}
					$('#' + t.id + 'historicalWrapper').slideUp();
					$('#' + t.id + 'futureWrapper').slideDown();
					$('#' + t.id + t.obj.riseBtn).trigger('click');
					$('#' + t.id + t.obj.waveBtn).trigger('click');
					$('#' + t.id + t.obj.nourBtn).trigger('click');
				}));
				$('#' + t.id + 'historicalBtn').on('click', lang.hitch(t,function(){
					$.each($('.basemap-selector-list ul li'), lang.hitch(t,function(i,v){
						if ($(v).html() == 'Imagery'){
							$(v).trigger('click')
						}	
					}));
					$('.basemap-selector').show();
					t.map.showZoomSlider();
					t.map.enableDoubleClickZoom();
					t.map.enableRubberBandZoom();
					t.map.enableScrollWheelZoom();
					if (t.obj.section == 'futureBtn'){
						t.map.setExtent(t.histExtent);
					}
					t.obj.section = 'historicalBtn';
					t.obj.visibleLayers = t.obj.historicLayers;
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					$('#' + t.id + 'futureWrapper').slideUp();
					$('#' + t.id + 'historicalWrapper').slideDown();
				}));
				$('#' + t.id + 'longBtn').on('click', lang.hitch(t,function(){
					t.obj.termSelected = 'long';
					$('#' + t.id + 'chartTitle').text('Virginia Eastern Shore – Long Term Change')
					t.esriapi.esriStartUp(t);
					t.obj.historicLayers = [0,4];
					t.obj.visibleLayers = t.obj.historicLayers;
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}));
				// short button click
				$('#' + t.id + 'shortBtn').on('click', lang.hitch(t,function(){
					t.obj.termSelected = 'short';
					$('#' + t.id + 'chartTitle').text('Virginia Eastern Shore – Short Term Change')
					t.esriapi.esriStartUp(t);
					t.obj.historicLayers = [0,3];
					t.obj.visibleLayers = t.obj.historicLayers;
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}));
// SHORELINE CHECKBOXES //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				$('#' + t.id + 'chRateBtn').on('click', lang.hitch(t,function(){
					clearInterval(t.setInt);
					t.obj.dataTypeButton = 'chRateBtn';
					$('#' + t.id + 'multiShoreLine, #' + t.id + 'historicalShoreWrapper').slideUp();
					$('#' + t.id + 'chartWrapper, #' + t.id + 'termWrapper').slideDown();
					if(t.obj.termSelected == 'long'){
						t.obj.historicLayers = [0,4];
						t.obj.visibleLayers = t.obj.historicLayers;
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}else{
						t.obj.historicLayers = [0,3];
						t.obj.visibleLayers = t.obj.historicLayers;
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
				}));
				// Historical shorelines button click
				$('#' + t.id + 'hisShoreBtn').on('click', lang.hitch(t,function(){
					t.obj.dataTypeButton = 'hisShoreBtn';
					$('#' + t.id + 'multiShoreLine, #' + t.id + 'historicalShoreWrapper').slideDown();
					$('#' + t.id + 'chartWrapper, #' + t.id + 'termWrapper').slideUp();
					if(t.obj.yearSliderMulti == 'sliderBtn'){
						t.obj.historicLayers = [0,t.obj.yearLayerID];
						t.obj.visibleLayers = t.obj.historicLayers;
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
					if(t.obj.yearSliderMulti == 'multiBtn'){
						t.obj.historicLayers = [0, t.obj.checkYearArray]
						t.obj.visibleLayers = t.obj.historicLayers;
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
				}));
				// slider button click
				$('#' + t.id + 'sliderBtn').on('click', lang.hitch(t,function(){
					t.obj.yearSliderMulti = 'sliderBtn';
					$('#' + t.id + 'multiShoreCheck').slideUp();
					$('#' + t.id + 'singleShore').slideDown();
					
					t.obj.historicLayers = [0,t.obj.yearLayerID];
					t.obj.visibleLayers = t.obj.historicLayers;
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					
				}));
				// multi button click
				$('#' + t.id + 'multiBtn').on('click', lang.hitch(t,function(){	
					t.obj.yearSliderMulti = 'multiBtn';
					if (t.obj.checkYearArray.length < 3){
						$('#' + t.id + 'ch-yearCheck .yearCb').each(lang.hitch(t,function(i, v){
							$(v).prop('checked', false);
						}));
						t.obj.checkYearArray = [0,t.obj.yearLayerID];
						$.each(t.layersArray, lang.hitch(t,function(j,w){
							if ( t.obj.yearLayerID == w.id ){
								var name = w.name.split(" ")[0];
								$('#' + t.id + 'ch-' + name).prop('checked', true);
							}
						}));
					}
					t.obj.visibleLayers = t.obj.checkYearArray
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					if (t.sliderPlayBtn  == 'play'){
						$('#' + t.id + 'sliderStop').trigger('click');
					}
					$('#' + t.id + 'multiShoreCheck').slideDown();
					$('#' + t.id + 'singleShore').slideUp();
				}));
				// Handle Class changes on all togBtn clicks
				$('#' + t.id + ' .togBtn').on('click', lang.hitch(t,function(c){		
					// Go to parent of selected button, find all elements with class togBtn, and remove togBtnSel from each one
					$.each($(c.currentTarget).parent().find('.togBtn'), lang.hitch(t,function(i, x){
						$(x).removeClass('togBtnSel');
					}))
					// Add togBtnSel class to selected button
					$(c.currentTarget).addClass('togBtnSel');
				}));
			},
			setNavBtns: function(t){
				$('#' + t.id + t.obj.section).trigger('click');
				if (t.obj.section == 'historicalBtn'){
					$('#' + t.appDiv.id + 'ch-ISL').val(t.obj.islSelected).trigger('chosen:updated').trigger('change');
					// click change rate or historic shorelines
					$('#' + t.id + t.obj.dataTypeButton).trigger('click');
					// click slider or multiple button as selected 				
					$('#' + t.appDiv.id + t.obj.yearSliderMulti).trigger('click');
					// check boxes for multi
					$(t.obj.checkedMultiYears).each(lang.hitch(t,function(i, v){
						$('#' + t.appDiv.id + v).prop("checked", true);
					}));	
					$('#' + t.id + 'multiShoreSlider').slider('value', t.obj.sliderCounter);	
					
				}	
			}	
        });
    }
);