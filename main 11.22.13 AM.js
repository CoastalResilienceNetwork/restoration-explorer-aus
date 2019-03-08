// Bring in dojo and javascript api classes as well as varObject.json, js files, and content.html
define([
	"dojo/_base/declare", "framework/PluginBase", "dijit/layout/ContentPane", "dojo/dom", "dojo/dom-style", "dojo/dom-geometry", "dojo/text!./obj.json", 
	"dojo/text!./html/content.html", './js/esriapi', './js/clicks', 'dojo/_base/lang'	
],
function ( 	declare, PluginBase, ContentPane, dom, domStyle, domGeom, obj, content, esriapi, clicks, lang ) {
	return declare(PluginBase, {
		// The height and width are set here when an infographic is defined. When the user click Continue it rebuilds the app window with whatever you put in.
		toolbarName: "Restoration Explorer - Beta", showServiceLayersInLegend: true, allowIdentifyWhenActive: false, rendered: false, resizable: false,
		hasCustomPrint: false, size:'custom', width:420, hasHelp:false, 
		
		// First function called when the user clicks the pluging icon. 
		initialize: function (frameworkParameters) {
			// Access framework parameters
			declare.safeMixin(this, frameworkParameters);
			// Define object to access global variables from JSON object. Only add variables to varObject.json that are needed by Save and Share. 
			this.obj = dojo.eval("[" + obj + "]")[0];	
			this.url = "https://services2.coastalresilience.org/arcgis/rest/services/Australia/Restoration_Explorer/MapServer";
			this.layerDefs = [];
		},
		// Called after initialize at plugin startup (why the tests for undefined). Also called after deactivate when user closes app by clicking X. 
		hibernate: function () {
			if (this.appDiv != undefined){
				this.dynamicLayer.setVisibleLayers([-1])
			}
			this.open = "no";
		},
		// Called after hibernate at app startup. Calls the render function which builds the plugins elements and functions.   
		activate: function (showHelpOnStart) {
			if (this.rendered == false) {
				this.rendered = true;							
				this.render();
				$(this.printButton).hide();
			}else{
				this.dynamicLayer.setVisibleLayers(this.obj.visibleLayers);
				$('#' + this.id).parent().parent().css('display', 'flex');
				// this.clicks.updateAccord(this);
			}
			if (showHelpOnStart) {
				this.showHelp();
			}else{
				$('#' + this.id + '-shosu').attr('checked', true);
				$('#' + this.id + 'aus-wrap').show()
				$('#' + this.id + ' .aus-help').hide();
			}	
			this.open = "yes";
		},
		showHelp: function(h){
			$('#' + this.id + ' .aus-wrap').hide()
			$('#' + this.id + ' .aus-help').show()
			// this.clicks.updateAccord(this);			
				
			// Show this help on startup anymore, after the first time 
			// this.app.suppressHelpOnStartup(true);
		},
		// Called when user hits the minimize '_' icon on the pluging. Also called before hibernate when users closes app by clicking 'X'.
		deactivate: function () {
			this.open = "no";	
		},	
		// Called when user hits 'Save and Share' button. This creates the url that builds the app at a given state using JSON. 
		// Write anything to you varObject.json file you have tracked during user activity.		
		getState: function () {
			// remove this conditional statement when minimize is added
			if ( $('#' + this.id ).is(":visible") ){
				// Get slider ids and values when values do not equal min or max
				$.each($('#' + this.id + 'mng-act-wrap .slider'),lang.hitch(this,function(i,v){
					var idArray = v.id.split('-');
					var id = "-" + idArray[1] + "-" + idArray[2];
					var min = $('#' + v.id).slider("option", "min");
					var max = $('#' + v.id).slider("option", "max");
					var values = $('#' + v.id).slider("option", "values");
					if (min != values[0] || max != values[1]){
						this.obj.slIdsVals.push([ id, [values[0], values[1]] ])
					}
				}));	
				// Git ids of checked checkboxes above sliders
				$.each( $('#' + this.id + 'aus-wrap .-slCb'),lang.hitch(this,function(i,v){
					if (v.checked == true){
						var id = "-" + v.id.split('-').pop();
						this.obj.slCbIds.push(id)
					}
				}))
				// Get ids of checked radio buttons
				$.each( $('#' + this.id + ' .aus-radio-indent input'),lang.hitch(this,function(i,v){
					if (v.checked == true){
						var id = "-" + v.id.split('-').pop();
						this.obj.rbIds.push(id)
					}
				}));	
				$.each( $('#' + this.id + ' .aus-radio-indent1 input'),lang.hitch(this,function(i,v){
					if (v.checked == true){
						var id = "-" + v.id.split('-').pop();
						this.obj.rbIds.push(id)
					}
				}));	
				// Get ids of checked checkboxes above radio buttons
				$.each( $('#' + this.id + 'aus-wrap .rb_cb'),lang.hitch(this,function(i,v){
					if (v.checked == true){
						// var id = "-" + v.id.split('-').pop();
						// this.obj.rbCbIds.push(id)
					}
				}));	
				//extent
				this.obj.extent = this.map.geographicExtent;
				this.obj.stateSet = "yes";	
				var state = new Object();
				state = this.obj;
				return state;	
			}
		},
		// Called before activate only when plugin is started from a getState url. 
		//It's overwrites the default JSON definfed in initialize with the saved stae JSON.
		setState: function (state) {
			this.obj = state;
		},
		// Called when the user hits the print icon
		beforePrint: function(printDeferred, $printArea, mapObject) {
			printDeferred.resolve();
		},	
		// Called by activate and builds the plugins elements and functions
		render: function() {
			//this.oid = -1;
			//$('.basemap-selector').trigger('change', 3);
			this.mapScale  = this.map.getScale();
			// BRING IN OTHER JS FILES
			this.esriapi = new esriapi();
			this.clicks = new clicks();
			// ADD HTML TO APP
			// Define Content Pane as HTML parent		
			this.appDiv = new ContentPane({style:'padding:0; color:#000; flex:1; display:flex; flex-direction:column;}'});
			this.id = this.appDiv.id
			dom.byId(this.container).appendChild(this.appDiv.domNode);	
			$('#' + this.id).parent().addClass('flexColumn')
			$('#' + this.id).addClass('accord')
			if (this.obj.stateSet == "no"){
				$('#' + this.id).parent().parent().css('display', 'flex')
			}		
			// Get html from content.html, prepend appDiv.id to html element id's, and add to appDiv
			var idUpdate0 = content.replace(/for="/g, 'for="' + this.id);	
			var idUpdate = idUpdate0.replace(/id="/g, 'id="' + this.id);
			$('#' + this.id).html(idUpdate);
			// Set up variables
			// Create ESRI objects and event listeners	
			this.esriapi.esriApiFunctions(this);
			// Click listeners
			this.clicks.eventListeners(this);
			this.rendered = true;	
		}
	});
});
