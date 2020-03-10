const YTDL = require('ytdl-core');

module.exports = {
    playMusic : function(message, argument){
        // if(!message.guild){
        //     return
        // }
        const vChannel = message.member.voiceChannel;
        if(!vChannel){
            console.log("vchannel "+vChannel)
            message.reply("You need to be in a voice channel first!");
        }else{
            if(argument == "oh"){
                if(message.guild.voiceConnection){
                        console.log("client.voicechannel is true")
                        message.guild.voiceConnection.playStream(YTDL('https://www.youtube.com/watch?v=3ymwOvzhwHs&list=RD4HG_CJzyX6A&index=2', {filter:'audioonly', quality: "highestaudio"}))
                }else{
                    console.log("client.voicechannel is not true")
                    vChannel.join()
                    .then(connection =>{
                        const dispatcher = connection.playStream(YTDL('https://www.youtube.com/watch?v=3ymwOvzhwHs&list=RD4HG_CJzyX6A&index=2', {filter:'audioonly',  quality:"highestaudio"}))
        
                        dispatcher.on("end", () =>{
                            message.channel.send("I shall leave, as my job is finished.")
                            vChannel.leave();
                        })
                    }).catch(console.log)
                }
            }
            else{
                message.reply("bye")
            }
        }
    }
}