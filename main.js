// Pull in your favorite version of jquery 
require({ 
	packages: [{ name: "jquery", location: "http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/", main: "jquery.min" }] 
});
// Bring in dojo and javascript api classes as well as varObject.json, js files, and content.html
define([
	"dojo/_base/declare", "framework/PluginBase", "dijit/layout/ContentPane", "dojo/dom", "dojo/dom-style", "dojo/dom-geometry", "dojo/_base/lang", "dojo/text!./obj.json", 
	"jquery", "dojo/text!./html/content.html", './js/jquery-ui-1.11.2/jquery-ui', './js/navigation', './js/esriapi', './js/clicks', './js/barChart'
],
function ( 	declare, PluginBase, ContentPane, dom, domStyle, domGeom, lang, obj, 
			$, content, ui, navigation, esriapi, clicks, barChart ) {
	return declare(PluginBase, {
		// The height and width are set here when an infographic is defined. When the user click Continue it rebuilds the app window with whatever you put in.
		toolbarName: "Benefits Explorer", showServiceLayersInLegend: true, allowIdentifyWhenActive: false, rendered: false, resizable: false,
		hasCustomPrint: true, usePrintPreviewMap: true, previewMapSize: [1000, 550], height:"560", width:"400",
		
		// First function called when the user clicks the pluging icon. 
		initialize: function (frameworkParameters) {
			// Access framework parameters
			declare.safeMixin(this, frameworkParameters);
			// Set initial app size based on split screen state
			this.con = dom.byId('plugins/benefits_explorer-0');
			this.con1 = dom.byId('plugins/benefits_explorer-1');
			if (this.con1 != undefined){
				domStyle.set(this.con1, "width", "400px");
				domStyle.set(this.con1, "height", "560px");
			}else{
				domStyle.set(this.con, "width", "400px");
				domStyle.set(this.con, "height", "560px");
			}	
			// Define object to access global variables from JSON object. Only add variables to varObject.json that are needed by Save and Share. 
			this.obj = dojo.eval("[" + obj + "]")[0];	
			this.url = "http://dev.services2.coastalresilience.org:6080/arcgis/rest/services/Water_Blueprint/BenefitsExplorer/MapServer";
			this.layerDefs = [];
		},
		// Called after initialize at plugin startup (why all the tests for undefined). Also called after deactivate when user closes app by clicking X. 
		hibernate: function () {
			if (this.appDiv != undefined){
				this.map.removeLayer(this.dynamicLayer);
				this.map.removeLayer(this.basinFl);
				this.map.graphics.clear();
			}
		},
		// Called after hibernate at app startup. Calls the render function which builds the plugins elements and functions.   
		activate: function () {
			if (this.rendered == false) {
				this.rendered = true;							
				this.render();
				// Hide the print button until a hex has been selected
				$(this.printButton).hide();
				this.dynamicLayer.setVisibility(true);
			}else{
				this.map.addLayer(this.dynamicLayer);
				this.map.addLayer(this.basinFl);
				// on set state it calls activate twice. on the second call render is true so it call this else. layer infos isn't done yet so if you call setNavBtns it can't use layer infos
				if (this.obj.stateSet == "no"){	
					//this.navigation.setNavBtns(this);	
				}else{
					this.obj.stateSet = "no";
				}	
			}		
		},
		// Called when user hits the minimize '_' icon on the pluging. Also called before hibernate when users closes app by clicking 'X'.
		deactivate: function () {
				
		},	
		// Called when user hits 'Save and Share' button. This creates the url that builds the app at a given state using JSON. 
		// Write anything to you varObject.json file you have tracked during user activity.		
		getState: function () {
			this.obj.extent = this.map.geographicExtent;
			this.obj.stateSet = "yes";	
			var state = new Object();
			state = this.obj;
			return state;	
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
		// Resizes the plugin after a manual or programmatic plugin resize so the button pane on the bottom stays on the bottom.
		// Tweak the numbers subtracted in the if and else statements to alter the size if it's not looking good.
		resize1: function(w, h) {
			cdg = domGeom.position(this.container);
			if (cdg.h == 0) { this.sph = this.height - 40; }
			else { this.sph = cdg.h - 32; }
			// test
			/*if (cdg.h == 0) { this.sph = this.height - 80; }
			else { this.sph = cdg.h - 62; }*/
			domStyle.set(this.appDiv.domNode, "height", this.sph + "px"); 
		},
		// Called by activate and builds the plugins elements and functions
		render: function() {
			
			$('.basemap-selector').trigger('change', 3);
			// BRING IN OTHER JS FILES
			this.barChart = new barChart();
			this.navigation = new navigation();
			this.esriapi = new esriapi();
			this.clicks = new clicks();
			// ADD HTML TO APP
			// Define Content Pane as HTML parent		
			this.appDiv = new ContentPane({style:'padding:8px 8px 8px 8px; position:relative;'});
			this.id = this.appDiv.id
			dom.byId(this.container).appendChild(this.appDiv.domNode);					
			// Get html from content.html, prepend appDiv.id to html element id's, and add to appDiv
			var idUpdate = content.replace(/id='/g, "id='" + this.id);	
			$('#' + this.id).html(idUpdate);
			// bar chart
			this.barChart.makeChart(this);
			// Click listeners
			this.clicks.clickListener(this);
			// CALL NAVIGATION BUTTON EVENT LISTENERS 
			this.navigation.navListeners(this);
			// CREATE ESRI OBJECTS AND EVENT LISTENERS	
			this.esriapi.esriApiFunctions(this);
			
			this.rendered = true;	
			// resize the container in the render function after the container is built.
			this.resize1();
		},
	});
});