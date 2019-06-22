

module.exports = {

    helpCommand : function(msg){
        msg.channel.send({embed:{
            color: 3447003,
            title: "Help Menu",
            description:"This menu lists all the available commands.\nThis menu be accessed by typing `~help`",
            fields:[
                {
                    name: "```~roll```",
                    value:"This will roll two dice, each with values between 1 and 6."
                },
                {
                    name: "```~8ball <question>```",
                    value:"Use this command to ask the magic eight ball a question."
                },
                {
                    name: "```~pokemon```",
                    value:"When this command is used by itself, a random pokemon will be chosen for you.\n `~pokemon <name/id>` will return a specific pokemon"
                },
                {
                    name:"```~weather <parameter>```",
                    value:"This command will take either a zipcode, city, or city and country code combination.\ne.g. ~weather 95121, ~weather san jose, or ~weather tokyo, jp"
                }
            ]
        }}
         
        )
    }

}