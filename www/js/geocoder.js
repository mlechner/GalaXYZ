$(document).ready(function () {

    //Access Credentials
    //Valid till March 8 2018
    var app_id = "VArrXyHCf6xwnR8Wwp5X";
    var app_code = "4PrsrNN9oitLO0DPSEncLg";

    //Area to search in
    // BBox from config file (just preference no Exclusion!)
    // searchDistance to Exclude serach outside BBox completely
    $.getJSON("config.json", function (data) {
        var coor = data['geo_bbox'];
        var latUpLeft = coor['1'];
        var longUpLeft = coor['0'];
        var latDownRight = coor['3'];
        var longDownRight = coor['2'];
        var map_view = latUpLeft + "%2C" + longUpLeft + "%3B" + latDownRight + "%2C" + longDownRight + "";
        var searchDistance = data['searchDistance_geocoder'];

        //Geocoder Click
        $("#geocoder").one('click', function () {
            $("#geocoder").attr("value", "");

            //Edit Geocoder Text, Fired Once
            $("#geocoder").on('keyup', function (event) {

                //Delete former result List
                $("#geocoder").empty();
                var searchAutocom_text = $("#geocoder").val();

                if (searchAutocom_text.length > 0) {
                    //Autocomplete suggestions
                    var url_autocompleterequest =
                        "http://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json?app_id="
                        + app_id + "&app_code=" + app_code + "&query=" + searchAutocom_text
                        + "&mapview=" + map_view;

                    $.getJSON(url_autocompleterequest, function (data, success) {
                        var suggestions = "";
                        suggestions = data['suggestions'];
                        //Add List to Geocoder HTML
                        $("#geocoder").append("<datalist id=\"address\"></datalist>");

                        //Iterate all found Addresses
                        for (i = 0; (i < suggestions.length); i++) {
                            // if ~ in bbox, within searchdistance -> map_view setting just preference
                            if (suggestions[i]['distance'] < searchDistance) {
                                var currAddress = suggestions[i]['label'];
                                //Address without Country information
                                var addressNoC = currAddress.split(",");
                                addressNoC.reverse().pop();
                                var adressAppend = addressNoC.join();
                                $("#address").append("<option>" + adressAppend + "</datalist>");
                            }
                        }
                    });
                }
            });
        });

        //Run forward Geocode
        $("#geocButton").click(function () {

            //String to Search
            var search_text = $("#geocoder").val();

            //search_Text empty or invalid
            if (search_text.length < 1 || search_text == "Please choose a Address!" || search_text == "Address Search") {
                $("#geocoder").attr("value", "Please choose a Address!");
            }

            //Continue with Geocoding
            else {
                //URL Request
                var url_geocodrequest =
                    "https://geocoder.cit.api.here.com/6.2/geocode.json?app_id="
                    + app_id + "&app_code=" + app_code + "&searchtext=" + search_text
                    + "&mapview=" + map_view;

                // send Geocoding request
                $.getJSON(url_geocodrequest, function (data, success) {
                    if (success == "success") {
                        var location = data['Response']['View']['0']['Result']['0']['Location'];
                        var coor = location['DisplayPosition'];

                        //Use "Display Position" to right Object Coordinates
                        var lat = coor['Latitude'];
                        var long = coor['Longitude'];
                        console.log("Coordinates of found Address: ", lat, long);

                        //Add Marker with retrieved Coordinates
                        addDirectionPoint(long, lat);
                    }
                    else {
                        console.log("Get JSON: " + url_geocodrequest + " " + success);
                    }
                });
            }
        });
    });
});