define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi'
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
				t.inAc = 'yes';
				//make main accrodian
				$( function() {
					$( "#" + t.id + "be_mainAccord" ).accordion({
						heightStyle: "fill"
					});
					$( ".plugin-infographic  #be_infoAccord" ).accordion({
						heightStyle: "fill"
					});
				});
				// Use map resize listener to to track browser window change and refresh accordians
			/*	$(window).resize(function() {
					clearTimeout(window.resizedFinished);
					window.resizedFinished = setTimeout(function(){
						t.clicks.updateAccord(t);
						console.log('Resized finished.');
					}, 250);
				});*/

				t.map.on('resize',lang.hitch(t,function(){
					t.clicks.updateAccord(t);
				}))		
				t.clicks.updateAccord(t);						
				// track when info window is closed
				$('.sidebar-button-bottom button').on('click',lang.hitch(t,function(){
					t.clicks.updateAccord(t);
				}));	
				
				$('#' + t.id + ' .be_minfo').on('click',lang.hitch(t,function(c){
					$('.plugin-help').trigger('click');
					var ben = c.target.id.split("-").pop();
					$( ".plugin-infographic  #be_infoAccord" ).accordion({
						heightStyle: "fill"
					});
					t.inAc = 'yes';
					t.clicks.updateAccord(t);	
					$('.plugin-infographic .' + ben).trigger('click');
					$('.plugin-infographic .sidebar-button-bottom').children('button').html('Back');
					
				}));	
				// Hide/show benefit sections
				$('#' + t.id + ' .be_hs').on('click',lang.hitch(t,function(c){
					if ( $(c.currentTarget).next().is(":hidden") ){
						$('#' + t.id + ' .be_sectionWrap').slideUp();
						$(c.currentTarget).next().slideDown();
					}	
				}));
				// Explain benefits click
				$('#' + t.id + 'moreInfo').on('click',lang.hitch(t,function(c){
					$('#' + t.id + 'moreInfo span').toggle();
					$('#' + t.id + ' .explanations').slideToggle();
				}));	
				// Benefit CB Clicks
				$('#' + t.id + 'cbListener .be_cbBenWrap').on('click',lang.hitch(t,function(c){
					var ben = "";
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0].children[0]).prop("checked", !$(c.currentTarget.children[0].children[0]).prop("checked") )	
						ben = $(c.currentTarget.children[0].children[0]).val()
					}else{
						ben = c.target.value;
					}	
					if ($(c.currentTarget.children[0].children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.be_rangeWrap').slideDown();
						var values = $('#' + t.id + '-' + ben).slider("option", "values");
						$('#' + t.id + '-' + ben).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.be_rangeWrap').slideUp();
						t[ben] = "";
						t.clicks.layerDefsUpdate(t);
						$('#' + t.id + ben + '-range').html("")
						$('#' + t.id + ben + '-unit').hide();
					}	
				}));	
				// Standing Carbon range slider
				$('#' + t.id + '-standingc').slider({range:true, min:0, max:6600, values:[0,6600], change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				// Forest Loss range slider
				$('#' + t.id + '-forloss').slider({range:true, min:0, max:20000, values:[0,20000], change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				// Reforestation Potential range slider
				$('#' + t.id + '-refor').slider({range:true, min:0, max:65100, values:[0,65100], change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});	
				// Freshwater Biodiversity Threats range slider
				$('#' + t.id + '-freshbiot').slider({range:true, min:0, max:10, values:[0,10], change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});	
				// IUCN Listed Terrestrial Species range slider
				$('#' + t.id + '-terrsp').slider({range:true, min:0, max:220, values:[0,220], change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				// Habitat for Pollinators and Impacts on Vitamin A range slider
				$('#' + t.id + '-vita' ).slider({ range: true, min: 0, max: 85, values: [ 0, 85 ], change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				// Habitat for Pollinators and Impacts on Crop Yield Economic Output range slider
				$('#' + t.id + '-agloss' ).slider({ range: true, min: 0, max: 70, values: [ 0, 70 ], change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});
				// Excess Nitrogen range slider
				$('#' + t.id + '-nitrogen' ).slider({ range: true, min: 0, max: 615, values: [ 0, 615 ], change:function(event,ui){t.clicks.sliderChange(event,ui,t)}});	
			},
			sliderChange: function( event, ui, t ){
				var ben  = event.target.id.split("-").pop()
				t[ben] = "(" + ben + " >= " + ui.values[0] + " AND " + ben + " <= " + ui.values[1] + ")";	
				t.clicks.layerDefsUpdate(t);
				var low = 0;
				var high = 0;
				if (ben == 'freshbiot'){
					low = ui.values[0]/10;
					high = ui.values[1]/10;			
				}else{	
					low = t.clicks.numberWithCommas(ui.values[0])
					high = t.clicks.numberWithCommas(ui.values[1])
				}
				if (low == high){						
					$('#' + t.id + ben + '-range').html("(" + low);
				}else{
					$('#' + t.id + ben + '-range').html("(" + low + " - " + high);
				}
				$('#' + t.id + ben + '-unit').css('display', 'inline-block');
			},	
			layerDefsUpdate: function(t){
				t.exp = [t.standingc, t.forloss, t.refor, t.freshbiot, t.terrsp, t.vita, t.agloss, t.nitrogen]
				var exp = "";
				var cnt = 0;
				var nd = "f";
				$.each(t.exp, lang.hitch(t,function(i, v){
					if (v.length > 0){
						if (exp.length == 0){
							exp = v;
							cnt = 1;
						}else{
							exp = exp + " AND " + v;
							cnt = cnt + 1;
						}	
					}	
				}));
				if (cnt == 1){
					$('#' + t.id + 'cbListener input').each(function(i,v){
						if ($(v).prop('checked')){
							t.exp1 = $(v).val() + " = -99";
						}	
					});
					var q = new Query();
					var qt = new QueryTask(t.url + '/0');
					q.where = t.exp1;
					qt.executeForCount(q,function(count){
						var layerDefinitions = [];
						layerDefinitions[1] = exp;
						if (count > 0){
							layerDefinitions[0] = t.exp1;	
							t.obj.visibleLayers = [0,1,2];
						}else{
							t.obj.visibleLayers = [1,2];
						}
						t.dynamicLayer.setLayerDefinitions(layerDefinitions);
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);						
					});
				}else{	
					if (exp.length == 0){
						exp = "OBJECTID < 0";
						t.obj.visibleLayers = [2];
					}else{
						t.obj.visibleLayers = [1,2];
					}		
					var layerDefinitions = [];		
					layerDefinitions[1] = exp;	
					t.dynamicLayer.setLayerDefinitions(layerDefinitions);
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				var query = new Query();
				var queryTask = new QueryTask(t.url + '/0');
				query.where = exp;
				queryTask.executeForCount(query,function(count){
					var cnt = t.clicks.numberWithCommas(count)
					$('#' + t.id + 'basinCnt').html(cnt); 
				});
			},
			updateAccord: function(t){
				var wh = $(window).height();
				var hh = $('header').outerHeight();
				//app accordian
				$('#' + t.id).css('height', wh - hh - 42);
				$( "#" + t.id + "be_mainAccord" ).accordion('refresh');	
				
				//info accordian
				t.infoheight = wh - hh - 50;
				$('.plugin-infographic').css('height', t.infoheight);
				if (t.inAc == 'yes'){
					$( ".plugin-infographic  #be_infoAccord" ).accordion('refresh');				
				}
			},
			numberWithCommas: function(x){
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}			
        });
    }
)