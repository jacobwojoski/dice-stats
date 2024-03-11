class MESSAGE_PARSER_FACTORY  {
    
    /* Create a message parser object bassed on the current system*/
    static createMessageParser()
    {
        switch(game.system.id)
        {
            case "pf1e":
                return new PF1E_SYSTEM_MESSAGE_PARSER;
            default :
                return new GENERIC_SYSTEM_MESSAGE_PARSER;
        }
    }
}