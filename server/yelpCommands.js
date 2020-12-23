const secret = require("../config/secret.json");
const Utility = require("./utility");

const fetch = require("node-fetch");
const Discord = require("discord.js");

const N = 50;
const uri = "https://api.yelp.com/v3/businesses/search?limit="+N;
const key = secret.yelpAPI;

const errorMessage = {
    color: 9442302,
    title: "Something went wrong.",
    description:"You must have a location to continue."
    +"\nPlease try again using format ~yelp <location>,<search term>"
    +"\ne.g. `~yelp san jose` or `~yelp 95121, japanese food`"
    +"\n\nYou may also search for specific place by using ~yelp <location>,?<name of business>"
    +"\ne.g. `~yelp milpitas, ?taco bell` - the closest match will be returned.\nPlease note that there is no space between '?' and the business's name."
}


module.exports = {
    
    //the function to call the yelp api
    yelpCommand : function(msg, argument){
        let arg = Utility.formatCommand(argument);
        let splitArg = arg.split(',');
        let location = splitArg[0];
        let term = splitArg.slice(1)[0]

        if(term && term.trim().startsWith("?")){
            let searchTerm = term.trim().substr(1);
            return yelpSearch(msg, location, searchTerm, true)
        }else{
            return yelpSearch(msg, location,term, false);
        }
    },
}


function yelpSearch(msg, location, term = null, isSearched){
    if(!term || term.length<1){ //if user doesn't put a second parameter, it will default to food
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
                    if(json['businesses'].length == 0){
                        msg.channel.send("Nothing was found in your search.")
                    }else{
                        replyYelp(json, msg, isSearched);
                    }
                })
            }
            msg.channel.send({embed:errorMessage})
        })  //when there's an error and nothing came in the response due to missing required parameter (location), or search term isn't found.
}

//this function writes the response to display for users
function replyYelp(json, msg, isSearched){
    let n;
    if(!isSearched){
        n = Math.floor(Math.random()*json['businesses'].length) //without using the ?, the random option will be triggered and returned a random restaurant
    }else{
        n = 0 // if the user uses ?before a term, it's a search function.  debated if a list of 5 places should be return or just first one - decided on returning first option
    }

    let rest = json['businesses'][n];
    let imgRating = yelpRating(rest['rating'])

    const embed = new Discord.MessageEmbed()
        .setTitle("**"+rest['name']+"**")
        .setURL(rest['url'])
        .setColor(9442302)
        .setDescription(
            addCategories(rest)
            +"\n("+rest['review_count']+" reviews)"
            +"\n\n"+rest['location']['address1']
            +"\n"+rest['location']['city']+", "+rest['location']['state']+" "+rest['location']['zip_code']
            +"\n"+rest['display_phone']
        )
        .setThumbnail(imgRating)
        .setImage(rest['image_url'])
        .setFooter("Powered by Yelp","https://i.imgur.com/GU9gVal.png")
    msg.channel.send({embed})
}


//this fucntion is used to write the categories into the embed message
function addCategories(rest){
    var str = '';
    for(var i = 0; i<rest['categories'].length; i++){
        str = str+" "+rest['categories'][i]['title']+","
    }
    return str.trim().substr(0, str.length-2); //trim takes care of leading and trailing spaces, substr will get rid of the last comma
}

//determine the rating image base on rating
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