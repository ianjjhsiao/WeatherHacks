

/** This is a sample code for your bot**/
var flag=true;
function MessageHandler(context, event) {
    
    //yes
    if(event.message.toLowerCase()=="yes"){
        if(context.simpledb.roomleveldata.latS!=0&& context.simpledb.roomleveldata.langS!=0){
            //fetches forecast for location
        context.simplehttp.makeGet("http://api.wunderground.com/api/4f133964832884fd/forecast/q/"+  context.simpledb.roomleveldata.latS +","+ context.simpledb.roomleveldata.langS+".json");
        //causes the next forecast text not to run
        flag=false;
        }
        else{
            //fetches forecast for address or zip code
             context.simplehttp.makeGet("http://api.wunderground.com/api/4f133964832884fd/forecast/q/"+context.simpledb.roomleveldata.msg2S+"/"+context.simpledb.roomleveldata.msg1S+".json"); 
            //causes the next forecast text to not run
             flag=false;
        }
    }else if(event.message.toLowerCase()=="no"){
        context.sendResponse("Thank you for using this weather bot, reply with another location for more weather data.\nEnter a city name with the state (eg. San Francisco, CA), or enter a zip code with the state (eg. 94087, CA) \n");
    flag=false;
    // return;
    }
    //resetting data
    context.simpledb.roomleveldata.latS = 0;
    context.simpledb.roomleveldata.langS = 0;
    context.simpledb.roomleveldata.msg1S = "x";
    context.simpledb.roomleveldata.msg2S = "x";
    if(flag){
    if(event.messageobj!== undefined && event.messageobj.type=='location')
    {
        var lat = event.messageobj.latitude;
        context.simpledb.roomleveldata.latS = lat;
        var lang = event.messageobj.longitude;
        context.simpledb.roomleveldata.langS = lang;
        context.simplehttp.makeGet("http://api.wunderground.com/api/4f133964832884fd/conditions/q/"+ lat +","+lang+".json");
        
    }
    else
    {
        var msg1 = event.message.substring(0,1).toUpperCase()+event.message.substring(1,event.message.length-4).toLowerCase();
        context.simpledb.roomleveldata.msg1S = msg1;
        var msg2 = event.message.substring(event.message.length-2,event.message.length).toUpperCase();
        context.simpledb.roomleveldata.msg2S = msg2;
        if(Number.isNaN(msg1)){
            msg1 = msg1.substring(0,1).toUpperCase() + msg1.substring(1,msg.length).toLowerCase();
            var x = 0;
            while(msg1.substring(x, msg1.length-1).includes(' ')) {
                msg1=msg1.substring(0,x+1) + msg1.substring(x+1,x+2).toUpperCase()+msg1.substring(x+1,msg1.length);
                x = msg1.indexOf(' ')+1;
            }
            msg1=msg1.replace(' ','_');
        }
        context.simplehttp.makeGet("http://api.wunderground.com/api/4f133964832884fd/conditions/q/"+msg2+"/"+ msg1 +".json");
       
    }
    }
    if(flag){
     var contextParam = JSON.stringify(event.contextobj);
         var url = "https://api.gupshup.io/sm/api/bot/"+event.botname+"/msg";
         var param = "context="+contextParam+"&message=Would you like to know tommorow's forecast? (Yes/No)";
         var header = {"apikey":"ecc756265b9d4be1cb0594cdd33db138","Content-Type": "application/x-www-form-urlencoded"};
         context.simplehttp.makePost(url,param,header);
         
    }
    flag=false;
    return;
   
    
}
/** Functions declared below are required **/
function EventHandler(context, event) {
    if(!context.simpledb.botleveldata.numinstance)
        context.simpledb.botleveldata.numinstance = 0;
    numinstances = parseInt(context.simpledb.botleveldata.numinstance) + 1;
    context.simpledb.botleveldata.numinstance = numinstances;
context.sendResponse("Brought to you by Wunderground\nEither give your location, enter a city name with the state (eg. San Francisco, CA), or enter a zip code with the state (eg. 94087, CA) \n");
   
}

function HttpResponseHandler(context, event) {
    // if(event.geturl === "http://ip-api.com/json")
    var response = "";
    context.console.log(event.getresp);
    data = JSON.parse(event.getresp);
    
    if(data !== null && data.hasOwnProperty('forecast')) {
        response += "Forecast for tommorow: " + data.forecast.txt_forecast.forecastday[0].title + "\n" + data.forecast.txt_forecast.forecastday[0].fcttext + "\n" + data.forecast.txt_forecast.forecastday[0].fcttext_metric;
        flag=true;  
       var contextParam = JSON.stringify(event.contextobj);
         var url = "https://api.gupshup.io/sm/api/bot/"+event.botname+"/msg";
         var param = "context="+contextParam+"&message=Thank you for using this weather bot, reply with another location for more weather data.\nEnter a city name with the state (eg. San Francisco, CA), or enter a zip code with the state (eg. 94087, CA) \n";
         var header = {"apikey":"ecc756265b9d4be1cb0594cdd33db138","Content-Type": "application/x-www-form-urlencoded"};
         context.simplehttp.makePost(url,param,header);
              
    }
    else if(data !== null && data.hasOwnProperty('current_observation'))
    {
        response += "Local time: " + data.current_observation.local_time_rfc822 + "\n";
        response += "Temperature: " + data.current_observation.temperature_string + "\n";
        response += "Wind: " + data.current_observation.wind_string + ", " + data.current_observation.wind_dir + "\n";
        response += "Precipitation Today: " + data.current_observation.precip_today_string + "\n";
        response += "Humidity: " + data.current_observation.relative_humidity + "\n";
    }
    context.sendResponse(response);
    
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
}


