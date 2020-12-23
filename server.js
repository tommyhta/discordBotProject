// const secret = require("./config/secret.json");

const Discord = require("discord.js");
const client = new Discord.Client();


const Messages = require("./server/messages")
const Utility = require("./server/utility")

if(!process.env.discordToken){ 
    secret = require("./config/secret.json");
}else{
    secret = process.env;
}
 

client.login(secret.discordToken)

client.on("ready", ()=>{
    console.log("Connected as " + client.user.tag)
    Utility.fetchStatus(client);
})

client.on('message', (msg) =>{
    if(msg.author == client.user){
        return
    }
    if(msg.content.startsWith("~")){
        return Messages.processCommand(msg, client);
    }
    if(msg.mentions){
        if(msg.mentions.members.get(secret.me)!=null){
            msg.channel.send("What did you need my master for?");
        }

        if(msg.mentions.has(client.user)){
            msg.channel.send("Hello, **"+msg.member.displayName+"**. You may access a list of available commands by using `~help`")
        }
    }
})

client.on('disconnect', () =>{
    console.log(client.user.tag + " is disconnected.");
})
