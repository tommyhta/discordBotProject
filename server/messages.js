const Commands = require("./commands")
const Help = require("./helpCommand")

module.exports = {

    processCommand : function(msg){
        let fullCommand = msg.content.substr(1);
        let splitCommand = fullCommand.split(" ");
        let primaryCommand = splitCommand[0];
        let argument = splitCommand.slice(1);
        splitCommand.shift()
        let addArg = splitCommand

        switch(primaryCommand){
            case "help":
                return Help.helpCommand(msg);
            case "roll":
                return Commands.rollCommand(msg);
            case "8ball":
                return Commands.magicBall(msg, argument);
            case "pokemon":
                return Commands.pokemonCommand(msg, argument);
            case "weather":
                return Commands.weatherCommand(msg, addArg);
        }
    }

}