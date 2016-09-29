define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi'
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
				// Handle Class changes on all togBtn clicks
				$('#' + t.id + ' .togBtn').on('click', lang.hitch(t,function(c){		
					// Go to parent of selected button, find all elements with class togBtn, and remove togBtnSel from each one
					$.each($(c.currentTarget).parent().find('.togBtn'), lang.hitch(t,function(i, x){
						$(x).removeClass('togBtnSel');
					}))
				}));
				// Update visibility on togBtn clicks
				$('#' + t.id + ' .togBtnWrap .togBtn').on('click', lang.hitch(t,function(c){	
					$(c.currentTarget).addClass('togBtnSel');
					t.clicks.layerDefUpdate(t);
				}));
				// checkbox clicks
				$('#' + t.id + 'cbListener .cbWrap').on('click',lang.hitch(this,function(c){
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0]).prop("checked", !$(c.currentTarget.children[0]).prop("checked") )	
					}
					if ($(c.currentTarget.children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.benefitWrap').slideDown();
					}else{
						$(c.currentTarget).parent().find('.benefitWrap').slideUp();
						$.each($(c.currentTarget).parent().find('.togBtn'), lang.hitch(t,function(i, x){
							$(x).removeClass('togBtnSel');
						}))
						t.clicks.layerDefUpdate(t);
					}	
				}));
			},
			layerDefUpdate: function(t){
				var expArray = [];
				$.each($('#' + t.id + ' .togBtnWrap .togBtn'), lang.hitch(t,function(i, v){
					if ($(v).hasClass('togBtnSel')){
						var lngId = $(v).prop('id').substr($(v).prop('id').indexOf("-") + 1);
						var field = lngId.substr(0, lngId.indexOf('-'));
						var val = lngId.slice(-1);
						expArray.push(field + " = " + val ); 
					}	
				}));
				var exp = "OBJECTID < 0";
				if (expArray.length > 0){
					$.each(expArray, lang.hitch(t,function(i,v){
						if (i == 0){
							exp = v;	
						}else{
							exp = exp + " AND " + v;
						}	
					}))	
				}	
				var layerDefinitions = [];
				layerDefinitions[0] = exp;
				t.dynamicLayer.setLayerDefinitions(layerDefinitions);
				var query = new Query();
				var queryTask = new QueryTask(t.url + '/0');
				query.where = exp;
				queryTask.executeForCount(query,function(count){
					$('#' + t.id + 'basinCnt').html(count); 
				});
			}	
        });
    }
);