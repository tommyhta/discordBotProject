const fetch = require("node-fetch");
const Utility = require("./utility")
const secret = require("../config/secret.json")


module.exports = {
 
    //simple dice toss
    rollCommand : function(msg){
        let n1 = Math.floor(Math.random()*6)+1; // randomly generate a number between 1 and 6 
        let n2 = Math.floor(Math.random()*6)+1;
        msg.channel.send("\u{1F3B2} **"+msg.member.displayName+"** rolled " + n1 + " and " + n2 + ".\nThe total is **"+(n1+n2)+"**.")
    },

    //simple coin toss function
    coinCommand : function(msg){
        let face = '';
        let n = Math.floor(Math.random()*2); //randomly return 0 or 1
        n==0 ? face="head":face="tail" // if 0, it's head, otherwise, it's tail
        msg.channel.send("**"+msg.member.displayName+"** flipped a coin and got **"+face+"**!")
    },

    // function to call magic 8 ball API
    magicBall : function(msg, argument){
        if(argument.length < 1){
            msg.channel.send("You need to ask magic eight ball a question to get an answer.") //an argument (question) is required, although the actual content doesn't matter
        }else{
            let params = encodeURIComponent(argument);
            let uri = 'https://8ball.delegator.com/magic/JSON/' + params
            try{
                fetch(uri)
                    .then((response)=>{return response.json()})
                    .then((json) =>{msg.channel.send(json['magic']['answer'])})
            }catch(err){console.log(err)}
        }
    },

    //function to call Pokemon API
    pokemonCommand : function(msg, argument){
        let uri = 'https://pokeapi.co/api/v2/'
        if(argument.length < 1){ // if user didn't input an additional parameter, a random pokemon will be returned
            try{
                fetch(uri+'pokemon-species/?limit=0') //get the length of the array (number of pokemon)
                    .then((response)=>{return response.json()})
                    .then((json) =>{
                        let count = json['count']
                        let num = Math.floor(Math.random()*count)+1; //return a random number between 1 and number of pokemon to be used as index
                        fetch(uri+'pokemon/'+num) //fetch a random pokemon using the previously obtained number
                            .then((res)=>{return res.json()})
                            .then((json)=>{
                                let name = json['name'].charAt(0).toUpperCase()+json['name'].slice(1);
                                let img = json['sprites']['front_default'];
                                msg.channel.send("I choose you, "+name+"!", {files:[img]});
                            })
                    })
            }catch(err){console.log(err)}
        }else{
            fetch(uri+'pokemon/'+argument) //if user input an argument (name or id), that specific pokemon will be returned
                .then((response)=>{
                        if(response.ok){
                            return response.json()
                                .then((json) =>{
                                    let name = json['name'].charAt(0).toUpperCase()+json['name'].slice(1);
                                    let img = json['sprites']['front_default'];
                                    msg.channel.send(name+" is happy to be chosen by you!", {files:[img]});
                            })
                        }
                        msg.channel.send("Oh noes, your pokemon doesn't exist...");
                })
        }
    },

    //function to call the weather API
    weatherCommand : function(msg, argument){
        let parsed = parseInt(argument);
        let uri = "https://api.openweathermap.org/data/2.5/weather?";
        let key = "&APPID="+secret.weatherAPI
        if(isNaN(parsed)){ //Since the api uses two different parameters keys, user's input must be processed before making the call
            let arg = Utility.formatCommand(argument);// in this case, if input is NOT integers, the parameter will be for city or city,country code
            let splitArg = arg.split(',');
            let city = splitArg[0];
            let country = splitArg.slice(1)
            if(!country || country.length < 1){ //if there's no country parameter is added, US is the default
                country = "US"
            }
            fetch(uri+"q="+city+","+country+key)
                .then((res)=>{
                    if(res.ok){return res.json()
                    .then((json)=>{
                        replyWeather(json, msg);
                    })
                    }
                    msg.channel.send({embed:{
                        color:9442302,
                        title:"Something went wrong.",
                        description:"You must have a location to continue, please use either city or zipcode as location."
                                    +"e.g. `~weather 95125` or `weather San Jose`"
                                    +"\n\nWhen city is used and country code is not present, the default country is US. "
                                    +"To find a city outside of the US, please provide the two-character country code." 
                                    +"\ne.g. `~weather Tokyo, JP` - Please note that there is a comma seperating the city and country."
                    }})
                    // msg.channel.send("I can't seem to find this location.\nTry to use <city,country code> format\ne.g. `~weather San Jose` or `~weather Tokyo, JP`\nIf no country is input, the US will be the default country.")
                })  //if there's an error where the location can't be found, an error will return with further instruction to use the command
        }else{ //if the input is an integer, a zipcode parameter will be used
            fetch(uri+"zip="+argument+key)
                .then((response)=>{
                    if(response.ok){return response.json()
                        .then((json)=>{
                            replyWeather(json, msg);
                        })
                    }
                    msg.channel.send("You entered: "+argument+", which isn't a real zipcode.")
                })  //when the zipcode is invalid
        }
    }
}

//Kelvin to Fahrenheit
function kelvinToF(kelvin){
    let temp = (kelvin - 273.15)*9/5 + 32
    return temp
}


//function used to write a response to the user
function replyWeather(json, msg){
    let city = json['name']
    let country = json['sys']['country']
    let temp = kelvinToF(json['main']['temp']).toFixed(2)
    let tempHigh = kelvinToF(json['main']['temp_max']).toFixed(2)
    let tempLow = kelvinToF(json['main']['temp_min']).toFixed(2)
    msg.channel.send(
        {embed:{
            color: 3447003,
            title:"__**Weather Report**__",
            description:"City: "+city+"\nCountry: "+country+"",
            fields:[
                {
                    name:"__**Details:**__",
                    value:"Condition: "+json['weather'][0]['main']
                    +"\nTemperature: "+temp+"\u{00B0}F"
                    +"\nLow: "+tempLow+"\u{00B0}F"
                    +"\nHigh: "+tempHigh+"\u{00B0}F"
                    +"\nHumidity: "+json['main']['humidity']+"%"
                },                                   
            ],
            footer:{
                icon_url: 'https://imgur.com/IrQqBQT.png',
                text:"Powered by OpenWeatherMap"
            }
        }}
    )
}





