const Commands = require("./commands")

module.exports = {

    processCommand : function(msg){
        let fullCommand = msg.content.substr(1);
        let splitCommand = fullCommand.split(" ");
        let primaryCommand = splitCommand[0];
        let argument = splitCommand.slice(1);

        switch(primaryCommand){
            case "help":
                return Commands.helpCommand(msg);
            case "roll":
                return Commands.rollCommand(msg);
            case "8ball":
                return Commands.magicBall(msg, argument);
        }
    }

}