const secret = require("./config/secret.json");

const Discord = require("discord.js");
const client = new Discord.Client();

const Messages = require("./server/messages")

client.login(secret.discordToken)

client.on("ready", ()=>{
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("Korean Drama", {type:"WATCHING"})
})

client.on('message', (msg) =>{
    if(msg.author == client.user){
        return
    }
    if(msg.content.startsWith("~")){
        Messages.processCommand(msg);
    }
    if(msg.mentions){
        if(msg.mentions.members.get("367805965480886275")!=null){
            msg.channel.send("What did you need my master for?");
        }
        if(msg.isMemberMentioned(client.user)){
            msg.channel.send("Hello, **"+msg.member.displayName+"**. You may access a list of available commands by using `~help`")
        }
    }
})