define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi', "dojo/dom",
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi, dom ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
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
					var ben = "";
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0].children[0]).prop("checked", !$(c.currentTarget.children[0].children[0]).prop("checked") )	
						ben = $(c.currentTarget.children[0].children[0]).val()
					}else{
						ben = c.target.value;
					}	
					if ($(c.currentTarget.children[0].children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.sty_rangeWrap').slideDown();
						var values = $('#' + t.id + '-' + ben).slider("option", "values");
						$('#' + t.id + '-' + ben).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.sty_rangeWrap').slideUp();
						t[ben] = "";
						t.clicks.layerDefsUpdate(t);
						$('#' + t.id + ben + '-range').html("")
						$('#' + t.id + ben + '-unit').hide();
					}	
				}));	
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
					$('#' + t.id + 'basinByBensWrap input').each(function(i,v){
						if ($(v).prop('checked')){
							t.exp1 = $(v).val() + " = -99";
						}	
					});
					var q = new Query();
					var qt = new QueryTask(t.url + '/' + t.hbNoData);
					q.where = t.exp1;
					qt.executeForCount(q,function(count){
						t.layerDefinitions = [];
						t.layerDefinitions[t.hbFil] = exp;
						t.layerDefinitions[t.selHb] = t.selHbDef;
						if (count > 0){
							t.layerDefinitions[t.hbNoData] = t.exp1;	
							t.obj.visibleLayers = [t.hbNoData, t.hbFil, t.hbSwh];
						}else{
							t.obj.visibleLayers = [t.hbFil, t.hbSwh];
						}
						if (t.selHbDef.length > 0){
							t.obj.visibleLayers.push(t.selHb)
						}
						t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);						
					}); 
				}else{	
					if (exp.length == 0){
						exp = "OBJECTID < 0";
						t.obj.visibleLayers = [t.hbSwh];
					}else{
						t.obj.visibleLayers = [t.hbFil, t.hbSwh];
					}		
					if (t.selHbDef.length > 0){
						t.obj.visibleLayers.push(t.selHb)
					}
					t.layerDefinitions = [];		
					t.layerDefinitions[t.hbFil] = exp;
					t.layerDefinitions[t.selHb] = t.selHbDef;					
					t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				var query = new Query();
				var queryTask = new QueryTask(t.url + '/' + t.hbNoData);
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
			numberWithCommas: function(x){
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}			
        });
    }
)