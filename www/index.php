<?php
	//php goes here
	

?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset = "UTF-8"/>
		<meta name = "viewport" content="width=device-width, initial-scale=1"/>
		<title>GalaXYZ</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.13/leaflet.draw.css">


		<script src="lib/jquery.min.js"></script>
		<link rel="stylesheet" href="lib/leaflet/leaflet.css" />
		<script src="lib/leaflet/leaflet.js"></script>
		<script src="https://unpkg.com/leaflet-ant-path" type="text/javascript"></script>
		<script type="text/javascript" src="lib/leaflet/leafletembed.js"></script>

		<link rel="stylesheet" href="lib/stylesheet.css">
		
		<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.13/leaflet.draw.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/Turf.js/5.0.4/turf.min.js"></script>


		<script type="text/javascript" src="js/map.plugins.js"></script>
		<script type="text/javascript" src="js/draw.events.js"></script>
		<script type="text/javascript" src="js/toolset.js"></script>
		<script type="text/javascript" src="js/routing.js"></script>
		<script type="text/javascript" src="js/galaxyz.js"></script>
		
		
		<!--- style created in lib/stylesheet -->
		<style>
        	
        	
		</style> 
				
	</head>
	
	<body>
		<!--test comment-->
		<div class="row">
			<div class="col-sm-12" style="border-bottom: 1px solid black;">
				<h1>GalaXYZ Routing</h1>
			</div>
		</div>
		<div id="map-container" class="row">
			<!-- Div occupied by map -->
			<div id='map' style=""></div>
			<!-- menu html -->
			<div id="menu">
				<div id="panel" style="float: right; width: 300px;">
					<h2 style="margin-top: 0px; border-bottom: 1px solid lightgrey">Connect to DB</h2>
					<button type="button" class="btn btn-default" onclick="sendAjax()">Click Me!</button>
					<br><br><p>*open console (F12)</p>
					<p>This button executes a SQL query, returning geometry of a polygon</p>
					<div style="border-bottom: 1px solid lightgrey;"></div>
					<button type="button" style="margin-top: 5px;" class="btn btn-default" onclick="nogoDijkstra()">get nogo</button>
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

			var panelDisp = 0; // indicator for panel displayed
			var nogoCount = 0; // count of nogo areas for panel display
			initmap(); // initialises the leaflet map from leafletembed.js
			addAllMapPlugins(); // At the map.plugins.js file
			registerDrawEvents(); // At the draw.events.js file




		</script>

		
	
	</body>
