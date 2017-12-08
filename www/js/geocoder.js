$(document).ready(function () {

    //Access Credentials
    //Valid till March 8 2018
    var app_id = "VArrXyHCf6xwnR8Wwp5X";
    var app_code = "4PrsrNN9oitLO0DPSEncLg";

    //Area to search in
    var map_view = "49.0464002604%2C8.29539476408%3B48.9734287523%2C8.50387130644";
    //var map_view = "42.3902%2C-71.1293%3B42.3312%2C-71.0228";


    //Geocoder Click
    $("#geocoder").click(function () {
        $("#geocoder").attr("value", "");

        //Edit Geocoder Text
        $("#geocoder").on('input', function () {

            //Delete former result List
            $("#geocoder").empty();
            var searchAutocom_text = $("#geocoder").val();

            if (searchAutocom_text.length > 0) {
                //Autocomplete suggestions
                var url_autocompleterequest =
                    "http://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json?app_id=" + app_id + "&app_code=" + app_code + "&query=" + searchAutocom_text + "&mapview=" + map_view;

                $.getJSON(url_autocompleterequest, function (data, success) {
                    var suggestions = data['suggestions'];

                    //Add List to Geocoder HTML
                    $("#geocoder").append("<datalist id=\"adress\"></datalist>");
                    //Iterate all found Adresses and add to List
                    for (i = 0; i < suggestions.length; i++) {
                        var currAdress = JSON.stringify((suggestions[i]['label']));
                        $("#adress").append("<option value=" + currAdress + "></datalist>");
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
        if (search_text.length < 1 || search_text == "Please choose a Adress!" || search_text == "Adress Search") {
            $("#geocoder").attr("value", "Please choose a Adress!");
        }

        //Continue with Geocoding
        else {
            //URL Request
            var url_geocodrequest =
                "https://geocoder.cit.api.here.com/6.2/geocode.json?app_id=" + app_id + "&app_code=" + app_code + "&searchtext=" + search_text + "&mapview=" + map_view;

            // send Geocoding request
            $.getJSON(url_geocodrequest, function (data, success) {
                if (success == "success") {
                    var location = data['Response']['View']['0']['Result']['0']['Location'];
                    var coor = location['DisplayPosition'];

                    //Use "Display Position" to right Object Coordinates
                    var lat = coor['Latitude'];
                    var long = coor['Longitude'];
                    console.log("Coordinates of found Adress: ", lat, long);

                    //!!Add Marker with retrieved Coordinates!!

                }
                else {
                    console.log("Get JSON: " + url_geocodrequest + " " + success);
                }
            });
        }
    });

});