class MESSAGE_PARSER_FACTORY  {
    
    /* Create a message parser object bassed on the current system Different systems need to do different stuff to parse the msg*/
    static createMessageParser(systemid)
    {
        if(!systemid){
            systemid = game.system.id
        }

        switch(systemid)
        {
            case "pf1e":
                return new PF1E_SYSTEM_MESSAGE_PARSER;
            case "pf2e" :
                return new PF2E_SYSTEM_MESSAGE_PARSER;
            case "dnd5e" :
                return new DND5E_SYSTEM_MESSAGE_PARSER;
            case "dragonbane" :
                return new DRAGONBANE_SYSTEM_MESSAGE_PARSER;
            
            case "daggerheart" :
            case "mcdmrpg" : 
            default :
                return new GENERIC_SYSTEM_MESSAGE_PARSER;
        }
    }
}