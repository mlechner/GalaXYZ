<?php
	//php goes here
	

?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset = "UTF-8"/>
		<meta name = "viewport" content="width=device-width, initial-scale=1"/>
		<title>GalaXYZ</title>

		<link rel="stylesheet" href="lib/bootstrap-3.3.7/dist/css/bootstrap.min.css">
		<link rel="stylesheet" href="lib/leafletdraw/leaflet.draw.css">
		
		<script src="lib/jquery.min.js"></script>
		
		<link rel="stylesheet" href="lib/leaflet/leaflet.css" />
		<script src="lib/leaflet/leaflet.js"></script>
		<script src="lib/leaflet/leaflet-ant-path" type="text/javascript"></script>
		<script type="text/javascript" src="lib/leaflet/leafletembed.js"></script>

		<link rel="stylesheet" href="lib/stylesheet.css">
		
		<script src="lib/leafletdraw/leaflet.draw.js"></script>
		<script src="lib/turf/turf.min.js"></script>


		<script type="text/javascript" src="js/map.plugins.js"></script>
		<script type="text/javascript" src="js/draw.events.js"></script>
		<script type="text/javascript" src="js/toolset.js"></script>
		<script type="text/javascript" src="js/routing.js"></script>
		<script type="text/javascript" src="js/galaxyz.js"></script>
		<script type="text/javascript" src="js/geocoder.js"></script>
		
		
		<!--- style created in lib/stylesheet -->
		<style>
        	
        	
		</style> 
				
	</head>
	
	<body>
		<!--test comment-->
		<div id="titleParent" style="margin:0px;">
			<div class="row">
				<div class="col-sm-12" style="border-bottom: 1px solid black;">
					<h1>GalaXYZ Routing</h1>
				</div>
			</div>
		</div>
		<div id="map-container" class="row">
			<!-- Div occupied by map -->
			<div id='map' style=""></div>
			<!-- geocoder html -->
			<div class="row" style="margin-top: 25px;">
				<input type="search" class="form-control col-sm-4" style="margin-left: 15px;" id="geocoder" list="address" cols="50" value="Address Search" ></input>
				<button type="button" id="geocButton" style="margin-left: 5px; padding: 6px;" class="btn btn-default">GO</button>
			</div>
			<!-- menu html -->
			<div id="menu">
				<div id="panel" style="float: right; width: 300px;">
					<h2 style="margin-top: 0px; border-bottom: 1px solid lightgrey">NoGo Areas</h2>	
					<!--<div class="row">				
						<button type="button" style="margin-top: 5px; margin-left: 15px; float: left;" id="NoGoButton" class="btn btn-primary" onclick="nogoDijkstra()">Calculate Route</button>
						<div class="loader" id="NoGoLoader"></div>
					</div>-->	
					<div class="row" style="padding-left: 15px;">
						<div style="float: left;">
							<label class="fileContainer btn btn-primary" 
							data-toggle="tooltip" title=".json, shapefile.zip, shp collection">Upload
								<input type="file" name="files[]" id="fileInput" name="fileInput" 
								onchange="upload()"	data-multiple-caption="{count} files selected" multiple />
							</label>
						</div>
						<div style="float: left; margin-left: 5px;">
							<button class="btn btn-primary" data-toggle="tooltip" title="downloads json file" onclick="downloadJson()">Download</button>
							<div id="downloadContainer" style="display: none;"><!-- hidden for download --></div>
						</div>
					</div>
						
					<div id="managenogo">
						<!--populated by javascript -->						
					</div>	
				</div>
				<button id="btn_panel" type="button" class="btn btn-default" onclick="panelDisplay()">
					<span class = "glyphicon glyphicon-menu-hamburger"></span>
				</button>
					
				
			</div>
		</div>
		
		<script type="text/javascript">

			var closestNodeID;

			var panelDisp = 1; // indicator for panel displayed
			var nogoCount = 0; // count of nogo areas for panel display
			initmap(); // initialises the leaflet map from leafletembed.js
			addAllMapPlugins(); // At the map.plugins.js file
			registerDrawEvents(); // At the draw.events.js file

			var route;

		</script>

		
	
	</body>
