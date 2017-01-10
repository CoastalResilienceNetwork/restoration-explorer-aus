define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi', "dojo/dom",
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi, dom ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
<<<<<<< HEAD
				//make accrodians
				$( function() {
					$( "#" + t.id + "mainAccord" ).accordion({heightStyle: "fill"}); 
					$( "#" + t.id + "infoAccord" ).accordion({heightStyle: "fill"});
				});
				// update accordians on window resize - map resize is much cleaner than window resize
				t.map.on('resize',lang.hitch(t,function(){
					t.clicks.updateAccord(t);
				}))								
				// leave the get help section
				$('#' + t.id + 'getHelpBtn').on('click',lang.hitch(t,function(c){
					if ( $('#' + t.id + 'mainAccord').is(":visible") ){
						$('#' + t.id + 'infoAccord').show();
						$('#' + t.id + 'mainAccord').hide();
						$('#' + t.id + 'getHelpBtn').html('Back to Benefits Explorer');
						t.clicks.updateAccord(t);
						$('#' + t.id + 'infoAccord .infoDoc').trigger('click');
					}else{
						$('#' + t.id + 'infoAccord').hide();
						$('#' + t.id + 'mainAccord').show();
						$('#' + t.id + 'getHelpBtn').html('Back to Documentation');
						t.clicks.updateAccord(t);
					}					
				}));
				// info icon clicks
				$('#' + t.id + ' .sty_infoIcon').on('click',lang.hitch(t,function(c){
					$('#' + t.id + 'mainAccord').hide();
					$('#' + t.id + 'infoAccord').show();
					$('#' + t.id + 'getHelpBtnWrap').show();
					var ben = c.target.id.split("-").pop();
					t.clicks.updateAccord(t);	
					$('#' + t.id + 'infoAccord .' + ben).trigger('click');
					$('#' + t.id + 'getHelpBtn').html('Back to Benefits Explorer');
				}));		
				// Benefit CB Clicks
				$('#' + t.id + 'basinByBensWrap .sty_cbWrap').on('click',lang.hitch(t,function(c){
=======
				// Infographic section clicks
				$('.plugin-infographic .be_accordHeader').on('click',lang.hitch(t,function(c){
					if ( $(c.currentTarget).next().is(":hidden") ){
						$('.plugin-infographic .be_exWrap').slideUp();
						$(c.currentTarget).next().slideDown();
					}	
				}));
				$('#' + t.id + ' .be_minfo').on('click',lang.hitch(t,function(c){
					var ben = c.target.id.split("-").pop();
					$('.plugin-help').trigger('click');
					$('.plugin-infographic .' + ben).trigger('click');
					$('.plugin-infographic .be_infoWrap').siblings('span').children().html('Back');
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
>>>>>>> origin/development
					var ben = "";
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0].children[0]).prop("checked", !$(c.currentTarget.children[0].children[0]).prop("checked") )	
						ben = $(c.currentTarget.children[0].children[0]).val()
					}else{
						ben = c.target.value;
					}	
					if ($(c.currentTarget.children[0].children[0]).prop('checked') === true){
<<<<<<< HEAD
						$(c.currentTarget).parent().find('.sty_rangeWrap').slideDown();
						var values = $('#' + t.id + '-' + ben).slider("option", "values");
						$('#' + t.id + '-' + ben).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.sty_rangeWrap').slideUp();
=======
						$(c.currentTarget).parent().find('.be_rangeWrap').slideDown();
						var values = $('#' + t.id + '-' + ben).slider("option", "values");
						$('#' + t.id + '-' + ben).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.be_rangeWrap').slideUp();
>>>>>>> origin/development
						t[ben] = "";
						t.clicks.layerDefsUpdate(t);
						$('#' + t.id + ben + '-range').html("")
						$('#' + t.id + ben + '-unit').hide();
					}	
				}));	
<<<<<<< HEAD
				// Sup data CB Clicks
				$('#' + t.id + 'supDataWrap .sty_cbStackedWrap').on('click',lang.hitch(t,function(c){
					var val = "";
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0].children[0]).prop("checked", !$(c.currentTarget.children[0].children[0]).prop("checked") )	
						val = $(c.currentTarget.children[0].children[0]).val()
					}else{
						val = c.target.value;
					}	
					var lyr = Number( val.split("-").pop() )
					$('#' + t.id + 'supDataWrap .sty_cb').each(lang.hitch(t,function(i,v){
						if ( v.value != val ){
							$(v).prop('checked', false)
							var rl = Number( v.value.split("-").pop() )
							var index = t.obj.visibleLayers.indexOf(rl);
							if (index > -1) {
								t.obj.visibleLayers.splice(index, 1);
							}
						}
					}));
					if ($(c.currentTarget.children[0].children[0]).prop('checked') === true){
						t.obj.visibleLayers.push(lyr);
					}else{
						var index = t.obj.visibleLayers.indexOf(lyr);
						if (index > -1) {
							t.obj.visibleLayers.splice(index, 1);
						}
					}	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}));	
=======
>>>>>>> origin/development
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
<<<<<<< HEAD
				$('#' + t.id + ben + '-unit').css('display', 'inline-block');
=======
				$('#' + t.id + ben + '-unit').show();
>>>>>>> origin/development
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
<<<<<<< HEAD
					$('#' + t.id + 'basinByBensWrap input').each(function(i,v){
=======
					$('#' + t.id + 'cbListener input').each(function(i,v){
>>>>>>> origin/development
						if ($(v).prop('checked')){
							t.exp1 = $(v).val() + " = -99";
						}	
					});
					var q = new Query();
<<<<<<< HEAD
					var qt = new QueryTask(t.url + '/4');
					q.where = t.exp1;
					qt.executeForCount(q,function(count){
						var layerDefinitions = [];
						layerDefinitions[5] = exp;
						if (count > 0){
							layerDefinitions[4] = t.exp1;	
							t.obj.visibleLayers = [4,5,6];
						}else{
							t.obj.visibleLayers = [5,6];
						}
						t.dynamicLayer.setLayerDefinitions(layerDefinitions);
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);						
					}); 
				}else{	
					if (exp.length == 0){
						exp = "OBJECTID < 0";
						t.obj.visibleLayers = [6];
					}else{
						t.obj.visibleLayers = [5,6];
					}		
					var layerDefinitions = [];		
					layerDefinitions[5] = exp;	
=======
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
>>>>>>> origin/development
					t.dynamicLayer.setLayerDefinitions(layerDefinitions);
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				var query = new Query();
<<<<<<< HEAD
				var queryTask = new QueryTask(t.url + '/4');
				query.where = exp;
				queryTask.executeForCount(query,function(count){
					var cnt = t.clicks.numberWithCommas(count)
					$('#' + t.id + 'basinCnt').html(cnt); 
				});
			},
			updateAccord: function(t){
				$( "#" + t.id + "mainAccord" ).accordion('refresh');	
				$( "#" + t.id +  "infoAccord" ).accordion('refresh');				
			},
=======
				var queryTask = new QueryTask(t.url + '/0');
				query.where = exp;
				queryTask.executeForCount(query,function(count){
					$('#' + t.id + 'basinCnt').html(count); 
				});
			},
>>>>>>> origin/development
			numberWithCommas: function(x){
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}			
        });
    }
)