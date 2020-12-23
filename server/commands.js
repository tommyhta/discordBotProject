const fetch = require("node-fetch");
const Utility = require("./utility")
// const secret = require("../config/secret.json")

if(!process.env.discordToken){ 
    secret = require("../config/secret.json");
}else{
    secret = process.env;
}
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
        let params = encodeURIComponent(argument);
        let uri = 'https://8ball.delegator.com/magic/JSON/' + params
        fetch(uri)
            .then((res) => {
                if(res.ok){return res.json()
                    .then((json)=>{msg.channel.send(json['magic']['answer'])})
                }else{
                    msg.channel.send("You need to ask the magic 8 ball a question to get an answer")
                }
            })
    },
            // .then((json) =>{msg.channel.send(json['magic']['answer'])})   

    //function to call Pokemon API
    pokemonCommand : function(msg, argument){
        let uri = 'https://pokeapi.co/api/v2/pokemon/'
        let num;
        if(argument.length <1){
            num = Math.floor(Math.random()*807)+1
        }else{
            num = argument
        }
        fetch(uri + num)
            .then((res) => {
                if(res.ok){return res.json()
                    .then((json)=>{
                        let name = json['name'].charAt(0).toUpperCase()+json['name'].slice(1);
                        let img = json['sprites']['front_default'];
                        msg.channel.send("I choose you, **"+name+"**!", {files:[img]});
                    })
                }
                else{msg.channel.send("Oh noes, your pokemon doesn't exist...")}
            })
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
                    }else{
                        msg.channel.send({embed:{
                            color:9442302,
                            title:"Something went wrong.",
                            description:"You must have a location to continue, please use either city or zipcode as location."
                                        +"e.g. `~weather 95125` or `weather San Jose`"
                                        +"\n\nWhen city is used and country code is not present, the default country is US. "
                                        +"To find a city outside of the US, please provide the two-character country code." 
                                        +"\ne.g. `~weather Tokyo, JP` - Please note that there is a comma seperating the city and country."
                        }})
                    }
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
    },

    slapCommand : function(msg, client){
        if(!msg.mentions.members.first()){
            msg.channel.send("You can't just slap nobody, please decide who you want to slap.")
        }else{
            let message;
            let name = msg.mentions.members.first()['nickname'];
            if(!name) name = msg.mentions.members.first()['user']['username']
            if(msg.mentions.has(msg.member.id)) message = "Okay.. but why though?"
            else if(msg.mentions.has(client.user.id)) message = "Wao, why are you rude?"
            else message = "**"+msg.member.displayName + "** wanted to slap you, **"+ name+"**, so here it is..!"       
            msg.channel.send(message, {files:[whichSlap()]})
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


function whichSlap(){
    var slaps = [
        "https://imgur.com/XXIsxYG.gif",
        "https://imgur.com/s82278Y.gif",
        "https://imgur.com/kS5tWMX.gif",
        "https://imgur.com/Xnltjzk.gif",
        "https://imgur.com/Mjm7OJD.gif",
        "https://imgur.com/Z0Xishk.gif",
        "https://imgur.com/uKkrsih.gif",
        "https://imgur.com/fURd5OE.gif",
        "https://imgur.com/yozATGf.gif",
        "https://imgur.com/32g3rcw.gif",
        "https://imgur.com/jYp4sG8.gif",
        "https://imgur.com/cRFdKIX.gif",
        "https://imgur.com/I3buiPf.gif"
    ]
    var n = Math.floor(Math.random()*slaps.length);
    return slaps[n]
}


