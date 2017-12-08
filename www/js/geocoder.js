$(document).ready(function(){

    //Access Credentials
    //Valid till March 8 2018
    var app_id = "VArrXyHCf6xwnR8Wwp5X";
    var app_code = "4PrsrNN9oitLO0DPSEncLg";

    //String to Search
    var search_text = "main";

    //Area to search in
    var map_view = "42.3902%2C-71.1293%3B42.3312%2C-71.0228";

    $( "#geocoder" ).click(function() {
        $("#geocoder").attr("value", "");

        // send Geocoding request
        var url_geocodrequest =
                `<action="https://geocoder.cit.api.here.com/6.2/geocode.json?app_id=`+app_id+`&app_code=`+app_code+`&searchtext=`+search_text+`&mapview=`+map_view+`" method="GET" accept-charset="UTF-8">`;

        $.get(url_geocodrequest, function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
    });

});