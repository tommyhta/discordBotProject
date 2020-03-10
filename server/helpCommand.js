

module.exports = {

    helpCommand : function(msg){
        msg.channel.send({embed:{
            color: 9442302,
            title: "Help Menu",
            description:"This menu lists all the available commands.\nThis menu be accessed by typing `~help`",
            fields:[
                {
                    name: "**~roll**",
                    value:"This will roll two dice, each with values between 1 and 6."
                },
                {
                    name:"**~coin**",
                    value:"This will flip a coin and return head or tail."
                },
                {
                    name: "**~8ball <question>**",
                    value:"Use this command to ask the magic eight ball a question."
                },
                {
                    name: "**~pokemon**",
                    value:"When this command is used by itself, a random pokemon will be chosen for you.\n `~pokemon <name/id>` will return a specific pokemon"
                },
                {
                    name:"**~weather <location>**",
                    value:"This command will take either a zipcode, city, or city and country code combination.\ne.g. `~weather 95121`, `~weather san jose`, or `~weather tokyo, jp`"
                },
                {
                    name:"**~yelp <location>**",
                    value:"This command will take either a zipcode or a city and return a random restaurant in that area."
                    +"\nA search term can also be used after the location and seperated by a comma to narrow down searches."
                    +" \ne.g `~yelp san jose` or `~yelp 95125, korean bbq`"
                    +"\n\nSpecific search of a business can be used by adding a '?' in front of the search term with no space in between."
                    +"\ne.g. `~yelp san jose, ?tacobell` - The closest match will be return in this case.  When a business has multiple locations, use zipcode to get the closest location."
                }
            ]
        }}
         
        )
    }

}