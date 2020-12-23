module.exports = {
    
    //Comebine argument array to one string seperate each term with space
    formatCommand : function(arg){
        let str = '';
        for(var i = 0; i<arg.length; i++){
            str+=arg[i]+" "
        }
        return str
    },
    fetchStatus : function(client){
        let statuses = [
            "Korean Drama",
            "Rose taking shots of soju",
            "Taeyeon unnie eating ice cream",
            "Running Man",
            "Anime",
            "Cat videos",
            "Netflix",
            "YouTube",
            "Titanic on 2 VHS tapes from Blockbuster",
            "403 - Forbidden",
            "Peter vs chicken",
            "Loch Ness monster asking for tree fiddy",
            "DeerClops destroys your base",
        ]

        let n = Math.floor(Math.random()*statuses.length)
        let status = statuses[n]
        client.user.setActivity(status, {type:"WATCHING"})
        console.log("Status: "+status)
        setInterval(()=>{
            let n = Math.floor(Math.random()*statuses.length)
            let status = statuses[n]
            client.user.setActivity(status, {type:"WATCHING"})
            console.log("Status: "+status)
        }, 600000)
    }
    
}