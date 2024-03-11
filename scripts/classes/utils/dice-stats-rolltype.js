/* This class is used to get the ROLL_TYPE for any system */
/* ROLL_TYPE */
class DS_ROLL_TYPE_PARSER {
    static ROLL_TYPE= {        //Types of rolls the user can roll
        ATK: 0,     /* Rolling to Attack */
        DMG: 1,     /* Rolling Damage */
        SAVE: 2,    /* Rolling Will, Fortitude, Reflex*/
        SKILL: 3,   /* Rolling Stealth, Perception, Nature ETC*/
        ABILITY: 4, /* Rolling STR, CON, DEX ETC */
        /* UNKNOWN includes flat checks. No way to distingush them as there is no "flat check roll. 
        Its just has no details. Same output as typing /r 1d20 in chat and using result for something. 
        Its not assigned as Damage or atack ect */
        UNKNOWN: 5    
    };

    /** PATHFINDER SECOND EDITION PARSER
     * Get the roll type of any Pathfinder Second Edition roll msg
     * @param {*} msg - chat message that we're trying to parse
     * @returns {ROLL_TYPE} - enum ROLL_TYPE value
     */
    static getPF2erollType(msg){
        if(game.system.id == "pf2e")
        {
            //Check if damage Roll
            if(msg.isDamageRoll)
            {
                return DS_GLOBALS.ROLL_TYPE.DMG;
            }
            
            let domains = msg.rolls[0].options.domains;
            //Check if Save | Atack roll | Skill check
            if(domains)
            {
                for (var i=0; i<domains.length; i++) {
                    if(domains[i].match("attack"))
                    {
                        return DS_GLOBALS.ROLL_TYPE.ATK;
                    }
                    else if (domains[i].match("saving-throw"))
                    {
                        return DS_GLOBALS.ROLL_TYPE.SAVE;
                    }
                    else if(domains[i].match("skill-check"))
                    {
                        return DS_GLOBALS.ROLL_TYPE.SKILL
                    }
                }
                return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
            }
            //unknown so return unknown type
            return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
        }
        return DS_GLOBALS.UNKNOWN
    }

    /** DUNGEONS AND DRAGONS PARSER
     *  Get the roll type of any DnD5e Rolls 
     * @param {CHAT_MSG} msg - the chat message object
     * @returns {ROLL_TYPE}
     */
    static getDND5ErollType(msg){
        if (game.system.id == "dnd5e")
        {// D&D System is annoying and doesn't have a good way to see the type of roll. Need to parse a String to find out

            let rollType = msg?.flags?.dnd5e?.roll?.type;
            if(rollType == "skill"){
                return DS_GLOBALS.ROLL_TYPE.SKILL;

            }else if(rollType == "ability"){
                return DS_GLOBALS.ROLL_TYPE.ABILITY;

            }else if(rollType == "attack"){
                return DS_GLOBALS.ROLL_TYPE.ATK;

            }else if(rollType == "damage"){
                return DS_GLOBALS.ROLL_TYPE.DMG;

            }else if(rollType == "save"){
                return DS_GLOBALS.ROLL_TYPE.SAVE;

            }else{
                return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
            }
        }
        return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
    }

    /** DRAGONBANE PARSER
     *  Get the roll type of any Dragonbane Rolls 
     * @param {CHAT_MSG} msg - the chat message object
     * @returns {ROLL_TYPE}
     */
    static getDRAGONBANErollType(msg){
        if(game.system.id == "dragonbane")
        {// Dragonbane also doesn't have a nice way to parse rolls. Need to pull flavor text.
            // Flavor text doesnt have a good way to see different types of skill rolls
            let flavorString = msg.flavor;
            if(flavorString.includes("Skill")){
                return DS_GLOBALS.ROLL_TYPE.SKILL;
                
            }else if(   flavorString.includes("Attack") || flavorString.includes("Topple") || 
                        flavorString.includes("Disarm") || flavorString.includes("Parry")){
                return DS_GLOBALS.ROLL_TYPE.ATK;

            }else if(flavorString.includes("Attribute")){
                return DS_GLOBALS.ROLL_TYPE.ABILITY;

            }else if(flavorString.includes("Damage")){
                return DS_GLOBALS.ROLL_TYPE.DMG;
                
            }else{
                return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
            }
        }
        return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
    }

    /**
     *  Get the roll type of any Pathfinder 1st Edition Rolls 
     * @param {CHAT_MSG} msg - the chat message object
     * @param {ROLL_INFO[]} roll_info_ary - Array of all roll objects. 
     *                                    L-----> If the roll was an attack & damage we need the obj to add both
     * @returns {ROLL_TYPE}
     */
    static getPF1ErollType(msg, roll_info_ary){
        if(game.system.id == "pf1e")
        {

        }
        return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
    }

    /** 
     * Call the Specific system funtion to get the ROLL_TYPE
     * @param {*} - CHAT_MESSAGE_OBJECT
     */
    static getRollType(msg){
        switch(game.system.id)
        {
            case "dragonbane":
                return DS_ROLL_TYPE_PARSER.getDRAGONBANErollType(msg);
            case "pf2e":
                return DS_ROLL_TYPE_PARSER.getPF2erollType(msg);
            case "dnd5e":
                return DS_ROLL_TYPE_PARSER.getDND5ErollType(msg);
            default :
                return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
        }
    }

}