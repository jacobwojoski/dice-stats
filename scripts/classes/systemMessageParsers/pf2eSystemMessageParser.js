class PF2E_SYSTEM_MESSAGE_PARSER
{
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

            // If it was an attack Roll get some extra info
            if( retRollInfoAry[tempRoll]?.type == "attack-roll" )
            {
                retRollInfoAry[tempRoll] = this.getDegSuccessInfo(msg, retRollInfoAry[tempRoll]);
                retRollInfoAry[tempRoll] = this.getHitOrMissBy(msg, retRollInfoAry[tempRoll], msg.rolls[tempDieType] );
                retRollInfoAry[tempRoll] = this.getIsHitMissFromAdvantage(msg, retRollInfoAry[tempRoll]);
            }

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
     * Get Roll Type, This will be overriden for specific system parsing
     * NOTE: There are no Ability Rolls in pf2e
     * @param {*} msg 
     * @returns {ROLL_TYPE} - type of roll object
     */
    getRollType(msg)
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

    /**
     * Get hit and miss info from the attack roll
     * @param {*} msg - Chat Message Object
     * @param {DS_ROLL_INFO} newRollInfo - Current Roll info Obj without Hit Info
     * @returns {DS_ROLL_INFO} updatedNewRollInfo 
     * 
     * DEG_SUCCESS 
     * UNKNOWN:        0,
        CRIT_FAIL:      1,
        FAIL:           2,
        SUCCESS:        3,
        CRIT_SUCCESS:   4,
        DOWNBEAT:       5, //NOT USED FOR PF2
        MIXEDBEAT:      6  //NOT USED FOR PF2
        UPBEAT:         6  //NOT USED FOR PF2
     */
    getDegSuccessInfo(msg, newRollInfo)
    {
        //let targetDc = msg.flags.pf2e.context.dc.value;
        let outcome = msg.flags.pf2e?.context?.outcome;
        switch(outcome){
            case "criticalFailure":
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.CRIT_FAIL;
                break;
            case "failure":
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.FAIL;
                break;
            case "success":
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.SUCCESS;
                break;
            case "criticalsuccess":
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.CRIT_SUCCESS;
                break;
            default:
                newRollInfo.DegSuccess = DS_GLOBALS.DEGREE_SUCCESS.UNKNOWN;

        }
        return newRollInfo;
    }

    getHitOrMissBy(msg, newRollInfo, rollValue)
    {
        let dc = msg?.flags?.pf2e?.context?.dc?.value;
        let rollTotal = rollValue?._total;
        newRollInfo.CheckDiff = (dc - rollTotal);
        return newRollInfo;
    }

    getIsHitMissFromAdvantage(msg, newRollInfo)
    {
        let finalResult = msg.flags?.pf2e?.context?.outcome;
        let originalResult = msg.flags?.pf2e?.context?.unadjustedOutcome;

        // Check if we hit because of "advantage"
        if( (originalResult == "criticalFailure" || originalResult == "Failure") && 
            (finalResult == "success" || finalResult == "criticalSuccess") ){
            newRollInfo.HitFromAdv = true;
        
        // Check if we missed because of "disadvantage"
        }else if( (finalResult == "criticalFailure" || finalResult == "Failure") && 
        (originalResult == "success" || originalResult == "criticalSuccess")){
            newRollInfo.MissFromAdv = true;
        }
        
        return newRollInfo;
    }
}