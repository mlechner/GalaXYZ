

function sendAjax(){
	// calls an AJAX query to the file ajax_dbquery
	$.ajax({url: "ajax_dbquery.php", success: function(result){
		//passes result to handleAjax function
		handleAjax(result);
	}});
}

// handles the result of the db ajax query
function handleAjax(result){
	console.log(result);
	var newResult = JSON.parse(result); // convert string to json object
	var coordArray = newResult.coordinates; // set coordinates to array
	console.log(coordArray[0][0]); // lon of a single coord
	console.log(coordArray[0][1]); // lat of a single coord
}

function panelDisplay(){
	// shows and hides the panel
	var panel = $('#panel');
	if(panelDisp == 0){
		panel.show();
		panelDisp = 1
	} else {
		panel.hide();
		panelDisp = 0;
	}
	
}
//adds a feature to the panel when a new feature is created
function panel_addNogo(leaflet_id){

	nogoCount += 1;
	//string containing the HTML to be appended when a nogo is added
	addPoly = '<div class="row nogoitem" id="nogoitem'+leaflet_id+'">\
				<div class="col-xs-2" style="padding-left: 0px; padding-top: 5px;">\
					<span class="glyphicon glyphicon-stop" style="font-size: 2.0em;"></span>\
				</div>\
				<div class="col-xs-9" >\
					<div class="row">\
						<p class="objTitle" onclick="testfunc('+leaflet_id+')">\
							<b>Polygon '+leaflet_id+'</b>\
						</p>\
					</div>\
					<div class="row">\
						<input id="desc'+leaflet_id+'" type="text" class="form-control" placeholder="Add description"\
						style="margin-bottom: 5px;" onfocus="toggleSave(0,'+leaflet_id+')"></input>\
					</div>\
				</div>\
				<div class="col-xs-1" style="padding:0px; padding-top: 10px;">\
					<span class="glyphicon glyphicon-trash" title="Delete feature" onclick="removeNogoPoly('+leaflet_id+')"></span>\
					<span id="saveglyph'+leaflet_id+'" class="glyphicon glyphicon-ok" \
					title="Save description" onclick="saveDesc('+leaflet_id+')"></span>\
				</div>\
			</div>';
	//prepends the nogo area to the nogo HTML list
	$("#managenogo").prepend(addPoly);
}

/**
* Removes the nogo item from the panel given the leaflet id
* 
* @param {number} leaflet_id  -  leaflet id of the nogo area
*/
function panel_delNogo(leaflet_id){
	//removes html element from the nogo list				
	$('#nogoitem'+leaflet_id).remove();
}

function toggleSave(ind,leaflet_id){
	//toggles the save glyphicon depending on the ind val,
	//for the specific icon indivated by the id
	if (ind == 0){
		$('#saveglyph'+leaflet_id).show();	
	} else {
		$('#saveglyph'+leaflet_id).hide();	
	}	
}
//saves the description entered in the panel
function saveDesc(leaflet_id){	
	desc = $('#desc'+leaflet_id).val();
	toggleSave(1,leaflet_id);
	//changes from input element to <p> element with the same value
	$('#desc'+leaflet_id).replaceWith('<p id="desc'+leaflet_id+'" onclick="editDesc('+leaflet_id+')">'+desc+'</p>');
	//get the index of the nogo_poly array item with the specified layer id
	var index = nogo_Poly.map(function(el) {
	  return el.id;
	}).indexOf(leaflet_id);
	//append to the description to the item in the nogo_Poly array 
	nogo_Poly[index]['desc'] = desc;
	console.log(nogo_Poly[index]);
}
function editDesc(leaflet_id){
	desc = $('#desc'+leaflet_id).html();
	html = '<input id="desc'+leaflet_id+'" type="text" class="form-control" placeholder="Add description"\
			style="margin-bottom: 5px;" onfocus="toggleSave(0,'+leaflet_id+')" value="'+desc+'"></input>';
	$('#desc'+leaflet_id).replaceWith(html);
}
//fetches all of the feature data
function getnogo(){
	//calls function to return all the features
	console.log(getAllNogoAreas());
	//print nogo_Poly array
	//console.log(nogo_Poly);
	//console.log(getFromToPoints());
}

function getClosestNode(x,y, callback) {
	//console.log("in get closest node");
	ajax_url = "ajax_closestNodes.php?x="+x+"&y="+y;
	$.ajax({ url: ajax_url, 
		success: function(data, status, xhr){  
       		callback(data);
     	}
	});
}

function nogoDijkstra(){
	var nogos = getAllNogoAreas().polygon;
	try{
		mks = getFromToPoints();
	} catch(err) {
		alert("Please select your start and end  points");
		return;
	}
	
	$.ajax({url: "ajax_nogoDijkstra.php", 
		type: "POST",
		data: {data: JSON.stringify(nogo_Poly), 
			from: mks.from,
			to: mks.to },
		success: function(result){
		//passes result to handleAjax function
		handle_nogo(result);}
	});
}

function handle_nogo(result){
	//console.log(nogo_Poly);
	//console.log("result: ");
	console.log(JSON.parse(result));
}