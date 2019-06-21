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
})