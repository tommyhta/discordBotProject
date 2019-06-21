const fetch = require("node-fetch");

module.exports = {

    helpCommand : function(msg){
        msg.channel.send("```~help - all available commands \n~roll - roll dices \n~8ball <question> - to get a response from the magic eight ball```")
    },
    
    rollCommand : function(msg){
        let n1 = Math.floor(Math.random()*6)+1;
        let n2 = Math.floor(Math.random()*6)+1;
        msg.channel.send("```\u{1F3B2} You rolled a " + n1 + " and " + n2 + ".\nYour total is: "+ (n1+n2)+"```")
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

    }
}
