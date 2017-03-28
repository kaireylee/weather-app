/*global $ */

$(function(){
    var temp = $("#temperature"); 
    var ftemp;
    
    getLocation();
    
    setInterval(function() {
        var date = new Date();
        $('#time').html(
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        );
    }, 500);
    
    $('#temperature').click(function(){
        if(!converttoCel){
          temp.html(ftemp);
          converttoCel = true; 
        }   
        else {
            ftemp = temp.html();
            temp.html((Math.round((parseInt(temp.html(), 10)-32.0)*0.5555).toPrecision(2))+"<sup> °C</sup>");
            converttoCel = false;
        }
    });
    
    $('#city_input').keyup(function(event){
        if(event.keyCode == 13){
            var loc = $(this).val();
            validateLocation(loc); 
            $(this).val('');
            converttoCel = true; 
        }
    });
});

var converttoCel = true;

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(setPage, setDefault, {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000});
    }
};

function setPage(position){
    var weatherkey = "24ecf507e33c95bed55135373bb67681";
    var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude +  "&lon=" + position.coords.longitude + "&units=imperial&APPID=" + weatherkey;
    var forecastAPI = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" +position.coords.latitude+ "&lon=" +position.coords.longitude+"&cnt=7&units=imperial&APPID=" +weatherkey;
    
    $.getJSON(weatherAPI,function(weatherObj){
        setLocation(weatherObj);
        setTemp(weatherObj);
        setConditions(weatherObj);
        forecastJSON(weatherObj);
    });
}

function setDefault(){
    var weatherkey = "24ecf507e33c95bed55135373bb67681";
    var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat=" +37.7749+ "&lon=" +-122.419+"&units=imperial&APPID="+weatherkey;
    var forecastAPI = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" +37.7749+ "&lon=" +-122.419+"&cnt=7&units=imperial&APPID=" +weatherkey;
    
    $.getJSON(weatherAPI,function(weatherObj){
        setLocation(weatherObj);
        setTemp(weatherObj);
        setConditions(weatherObj);
        forecastJSON(weatherObj);
    });
}

function validateLocation(location){
    var weatherkey = "24ecf507e33c95bed55135373bb67681";
    var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&APPID=" + weatherkey;
   
    
    $.getJSON(weatherAPI,function(weatherObj){
        setLocation(weatherObj);
        setTemp(weatherObj);
        setConditions(weatherObj);
        forecastJSON(weatherObj);
    });
}

function forecastJSON(weatherObj){
     var weatherkey = "24ecf507e33c95bed55135373bb67681";
     var forecastAPI = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" +weatherObj.name+ "&cnt=7&units=imperial&APPID=" +weatherkey;
    
     $.getJSON(forecastAPI, function(forecastObj){
        retrieveForecast(forecastObj);
    })
}

function retrieveForecast(forecastObj){
    var weather_array = []; 
    var id_array = []; 
    for(var i = 0; i < 7; i++){
        weather_array.push(forecastObj.list[i].weather);    
    }

    for(var i = 0; i < 7; i++){
        id_array.push(weather_array[i][0].id);    
    }
    
    console.log(id_array);
    setForecast(id_array);
}

function setForecast(array){
    var dayoftheWeek = new Date().getDay();
    $("." + dayoftheWeek).css("font-weight", "Bold");
    $("." + dayoftheWeek).css("color", "red");
    var count = 0; 
    for(var i=0; i < array.length; i++){
        var icon = retrieveIcon(array[i]);
        handleDay(dayoftheWeek, count, icon);
        count++; 
    }
}

function handleDay(dayoftheWeek, count, icon){
    var total = dayoftheWeek + count; 
    if(total > 6)
        total -= 7;
    $("#"+total).attr("src", icon); 
}

function retrieveIcon(weatherID){
    console.log(weatherID);
    if(weatherID < 300){
        return "http://icon-park.com/imagefiles/simple_weather_icons_mixed_rain_and_thunderstorms.png";
    }
    else if(weatherID < 600){
        return "http://icon-park.com/imagefiles/simple_weather_icons_rain.png";
    }
    else if(weatherID < 700){
        return "http://icon-park.com/imagefiles/simple_weather_icons_snow.png";
    }
    else if(weatherID === 800){
        return "http://icon-park.com/imagefiles/simple_weather_icons_sunny.png";
    }
    else if(weatherID <= 803){
        return "http://icon-park.com/imagefiles/simple_weather_icons_partly_cloudy.png";
    }
    else if(weatherID === 804){
        return "http://icon-park.com/imagefiles/simple_weather_icons_cloudy.png";
    }
    else{
        return "http://icon-park.com/icon/simple-weather-icons-scattered-thunderstorms.png";
    }
    
}

function setLocation(weatherObj){
    $('#location').html(weatherObj.name + " <small>" +weatherObj.sys.country + "</small>");
};

function setTemp(weatherObj){
    $('#temperature').html(Math.round(weatherObj.main.temp.toPrecision(4))+ "<sup>°F</sup>");
};

function setConditions(weatherObj){
    var array = []; // create array here
    $.each(weatherObj.weather, function(index, weather) {
        array.push(weather.description); //push values here
    });
    $('#conditions').html(array[0]);
}
