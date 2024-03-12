/**
 * Parse a generic system parser,
 * All parsers must implment parseMsgRoll
 */
class GENERIC_SYSTEM_MESSAGE_PARSER {

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
        let retRollInfoAry = [];

        //For multiple rolls in chat
        for (let tempRoll = 0; tempRoll < msg.rolls.length; tempRoll++) {
            
            //For multiple dice types per roll
            for(let tempDie=0; tempDie<msg.rolls[tempRoll]?.dice.length ; tempDie++){

                //For results of every die roll of that dice type
                for(let rollResult=0; rollResult < msg.rolls[tempRoll].dice[tempDie].results.length; rollResult++)
                {
                    //Create new ROLL_INFO obj to ass to array
                    let newRollInfo = new DS_ROLL_INFO;

                    //See if it was a blind roll
                    newRollInfo[tempDie].IsBlind = msg.blind;

                    //Get die type
                    let sides = msg.rolls[tempRoll]?.dice[tempDie].faces;
                    let dieType = DS_GLOBALS.MAX_TO_DIE.get(sides);
                    newRollInfo[tempDie].DieType = dieType;

                    //Get type of roll (Atack, Save, ect) 
                    // Generally this should always return unknown as specific system parsers are the only ones that can get this info
                    newRollInfo[tempDie].RollType = DICE_STATS_UTILS.getRollType(msg);

                    //Get roll value (int)
                    newRollInfo[tempDie].RollValue = msg.rolls[tempRoll].dice[tempDie].results[rollResult];

                    retRollInfoAry.push(newRollInfo);
                
                } // end results
            } // end dice in rolls
        } // end rolls

    } // end parseMsgRoll()

    /**
     * Get Roll Type, This will be overriden for specific system parsing
     * @param {*} msg 
     * @returns {ROLL_TYPE} - type of roll object
     */
    static getRollType(msg)
    {
        return DS_GLOBALS.ROLL_TYPE.UNKNOWN;
    }

} //enc GENERIC_SYSTEM_MESSAGE_PARSER