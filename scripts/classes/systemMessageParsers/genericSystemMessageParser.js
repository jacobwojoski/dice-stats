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
    CheckDiff=  null;       //{INT}
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
            retRollInfoAry.push(new DS_ROLL_INFO);

            retRollInfoAry[tempRoll] = this.updateRollInfo(msg, retRollInfoAry[tempRoll]);

            //For multiple dice types per roll
            for(let tempDieType=0; tempDieType<msg.rolls[tempRoll]?.dice.length; tempDieType++){

                //For results of every die roll of that dice type
                for(let rollResult=0; rollResult < msg.rolls[tempRoll].dice[tempDieType].results.length; rollResult++){
                    
                    // Create new ROLL_INFO obj to ass to array
                    let newDieRollInfo = new DS_DIE_ROLL_INFO;
                    
                    // See if it was a blind roll
                    newDieRollInfo.IsBlind = msg.blind;

                    // Get die type
                    let sides = msg.rolls[tempRoll]?.dice[tempDieType].faces;
                    let dieType = DS_GLOBALS.MAX_TO_DIE.get(sides);
                    newDieRollInfo.DieType = dieType;

                    //Get type of roll (Atack, Save, ect) 
                    // Generally this should always return unknown as specific system parsers are the only ones that can get this info
                    newDieRollInfo.RollType = this.getRollType(msg);

                    // Get roll value (int)
                    newDieRollInfo.RollValue = msg.rolls[tempRoll].dice[tempDieType].results[rollResult];

                    retRollInfoAry[tempRoll].DiceInfo.push(newDieRollInfo);
                
                } // end results
            } // end dice in rolls
        } // end rolls
    }

    /**
     * Update roll obj with any info that system holds.
     * Generic sytsem doesnt so anything here but specific systems do
     */
    updateRollInfo(msg, rollObj){
        return rollObj
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

} //enc GENERIC_SYSTEM_MESSAGE_PARSER