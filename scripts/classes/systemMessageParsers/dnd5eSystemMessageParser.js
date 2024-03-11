class DND5E_SYSTEM_MESSAGE_PARSER
{
    /* ROLL_INFO Vars:
        DieType=    0; //{DIE_TYPE}
        RollType=   0; //{ROLL_TYPE}
        RollValue=  0; //{INT}
        IsBlind=    0; //{BOOLEAN}
        DegSuccess= 0; //{DEG_SUCCESS}
        MissBy=  -1;
        HitBy=   -1;
        MissFromAdv = false;
        HitFromAdv = false;
    */
    /**
     * Parse the passed in message
     * @param {*} msg 
     * @returns {ROLL_OBJECT[]} 
     */
    parseMsgRoll(msg){
    }

    /**
     * Get Roll Type, This will be overriden for specific system parsing
     * @param {*} msg 
     * @returns {ROLL_TYPE} - type of roll object
     */
    static getRollType(msg)
    {
        return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
    }

}