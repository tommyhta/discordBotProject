
module.exports = {
    
    //Comebine argument array to one string seperate each term with space
    formatCommand : function(arg){
        let str = '';
        for(var i = 0; i<arg.length; i++){
            str+=arg[i]+" "
        }
        return str
    }
    
}
