const fetch = require("node-fetch");
const secret = require("../config/secret.json")
const Discord = require("discord.js")

module.exports = {
 
    rollCommand : function(msg){
        let n1 = Math.floor(Math.random()*6)+1;
        let n2 = Math.floor(Math.random()*6)+1;
        msg.channel.send("```\u{1F3B2} "+msg.author.username+" rolled a " + n1 + " and " + n2 + ".\nThe total is "+(n1+n2)+".```")
    },

    coinCommand : function(msg){
        let face = '';
        let n = Math.floor(Math.random()*2);
        n==0 ? face="head":face="tail"
        msg.channel.send("```"+msg.author.username+" flipped a coin and got "+face+"!```")
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
    },

    yelpCommand : function(msg, argument){
        let uri = "https://api.yelp.com/v3/businesses/search?limit=20";
        let key = secret.yelpAPI;
        let arg = formatCommand(argument);
        let splitArg = arg.split(',');
        let location = splitArg[0];
        let term = splitArg.slice(1)
        if(!term || term.length<1){
            term = "food"
        }
        fetch(uri+"&location="+location+"&term="+term, {
            method: "GET",
            headers:{
                'Authorization': "Bearer "+key
            }
        })
            .then((response)=>{
                if(response.ok){return response.json()
                    .then((json)=>{
                        replyYelp(json, msg);
                    })
                }
                msg.channel.send("```Something went wrong, you must have a location to continue.\nPlease try again using format ~yelp <location>,<search term>\ne.g. ~yelp san jose or ~yelp san jose, japanese food```")
            })
    }
}


function kelvinToF(kelvin){
    let temp = (kelvin - 273.15)*9/5 + 32
    return temp
}

function formatCommand(arg){
    let str = '';
    for(var i = 0; i<arg.length; i++){
        str+=arg[i]+" "
    }
    return str
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

function replyYelp(json, msg){
    let length = json['businesses'].length;
    let n = Math.floor(Math.random()*length);
    let rest = json['businesses'][n];
    let imgRating = yelpRating(rest['rating'])

    const embed = new Discord.RichEmbed()
        .setTitle("**"+rest['name']+"**")
        .setURL(rest['url'])
        .setColor(3447003)
        .setDescription(
            "("+rest['review_count']+" reviews)"
            +"\n\n"+rest['location']['address1']
            +"\n"+rest['location']['city']+", "+rest['location']['state']+" "+rest['location']['zip_code']
            +"\n"+rest['display_phone']
        )
        .setThumbnail(imgRating)
        .setImage(rest['image_url'])
        .setFooter("Powered by Yelp","https://i.imgur.com/GU9gVal.png")

    msg.channel.send({embed})
}

function yelpRating(n){
    imgUrl = '';
    switch(n){
        case 0:
            imgUrl = "https://i.imgur.com/uLDUaw8.png";
            break;
        case 1:
            imgUrl = "https://i.imgur.com/gwmUHUy.png"
            break;
        case 1.5:
            imgUrl = "https://i.imgur.com/G1bfo3F.png";
            break;
        case 2:
            imgUrl = "https://imgur.com/gDN3pdN.png";
            break;
        case 2.5:
            imgUrl = "https://imgur.com/IxE8yaX.png";
            break;
        case 3:
            imgUrl = "https://imgur.com/UdkMz6g.png";
            break;
        case 3.5:
            imgUrl = "https://imgur.com/CwbfFQK.png";
            break;
        case 4:
            imgUrl = "https://imgur.com/CEhIPov.png";
            break;
        case 4.5:
            imgUrl = "https://i.imgur.com/53xR9dZ.png";
            break;
        case 5:
            imgUrl = "https://i.imgur.com/wRhspXo.png";
            break
    }
    return imgUrl
}