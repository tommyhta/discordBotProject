const fetch = require("node-fetch");
const secret = require("../config/secret.json")

module.exports = {
 
    rollCommand : function(msg){
        let n1 = Math.floor(Math.random()*6)+1;
        let n2 = Math.floor(Math.random()*6)+1;
        msg.channel.send("```\u{1F3B2} You rolled a " + n1 + " and " + n2 + ".\nYour total is "+(n1+n2)+".```")
    },

    magicBall : function(msg, argument){
        if(argument.length < 1){
            msg.channel.send("```You need to ask magic eight ball a question to get an answer.```")
        }else{
            let params = encodeURIComponent(argument);
            let uri = 'https://8ball.delegator.com/magic/JSON/' + params
            try{
                fetch(uri)
                    .then((response)=>{return response.json()})
                    .then((json) =>{msg.channel.send("```"+ json['magic']['answer'] +"```")})
            }catch(err){console.log(err)}
        }
    },
    
    pokemonCommand : function(msg, argument){
        let uri = 'https://pokeapi.co/api/v2/'
        if(argument.length < 1){
            try{
                fetch(uri+'pokemon-species/?limit=0')
                    .then((response)=>{return response.json()})
                    .then((json) =>{
                        let count = json['count']
                        let num = Math.floor(Math.random()*count)+1;
                        fetch(uri+'pokemon/'+num)
                            .then((res)=>{return res.json()})
                            .then((json)=>{
                                let name = json['name'].charAt(0).toUpperCase()+json['name'].slice(1);
                                let img = json['sprites']['front_default'];
                                msg.channel.send("```I choose you, "+name+"!```", {files:[img]});
                            })
                    })
            }catch(err){console.log(err)}
        }else{
            fetch(uri+'pokemon/'+argument)
                .then((response)=>{
                        if(response.ok){
                            return response.json()
                                .then((json) =>{
                                    let name = json['name'].charAt(0).toUpperCase()+json['name'].slice(1);
                                    let img = json['sprites']['front_default'];
                                    msg.channel.send("```"+name+" is happy to be chosen by you!```", {files:[img]});
                            })
                        }
                        msg.channel.send("```Oh noes, your pokemon doesn't exist...```");
                })
        }
    },

    weatherCommand : function(msg, argument){
        let parsed = parseInt(argument);
        let uri = "https://api.openweathermap.org/data/2.5/weather?";
        let key = "&APPID="+secret.weatherAPI
        if(isNaN(parsed)){
            let arg = formatCommand(argument);
            let splitArg = arg.split(',');
            let city = splitArg[0];
            let country = splitArg.slice(1)

            if(!country || country.length < 1){
                country = "US"
            }

            fetch(uri+"q="+city+","+country+key)
                .then((res)=>{
                    if(res.ok){return res.json()
                    .then((json)=>{
                        replyWeather(json, msg);
                    })
                    }
                    msg.channel.send("```I can't seem to find this location.\n\nTry to use <city,country code> format\n\ne.g. ~weather San Jose, US or Tokyo, JP\n\nIf no country is input, the US will be the default country.```")
                })

        }else{
            fetch(uri+"zip="+argument+key)
                .then((response)=>{
                    if(response.ok){return response.json()
                        .then((json)=>{
                            replyWeather(json, msg);
                        })
                    }
                    msg.channel.send("```You entered: "+argument+", which isn't a real zipcode.```")
                })
        }
    }
}


function kelvinToF(kelvin){
    let temp = (kelvin - 273.15)*9/5 + 32
    return temp
}

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
            description:"**City: "+city+"\nCountry: "+country+"**",
            fields:[
                {
                    name:"__**Details:**__",
                    value:"**Condition: "+json['weather'][0]['main']
                    +"\nTemperature: "+temp+"\u{00B0}F"
                    +"\nLow: "+tempLow+"\u{00B0}F"
                    +"\nHigh: "+tempHigh+"\u{00B0}F"
                    +"\nHumidity: "+json['main']['humidity']+"%"
                    +"**"
                },                                   
            ]
        }}
    )
}

function formatCommand(arg){
    let str = '';
    for(var i = 0; i<arg.length; i++){
        str+=arg[i]+" "
    }
    return str
}