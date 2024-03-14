class PF1E_SYSTEM_MESSAGE_PARSER
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

        //For multiple rolls in chat (Any roll made from a card)
        for (let tempRoll = 0; tempRoll < msg.rolls.length; tempRoll++) {
            retRollInfoAry.push(new DS_ROLL_INFO);

            retRollInfoAry[tempRoll] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], tempRoll);

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
                    if(dieType)
                    {
                        newDieRollInfo.DieType = dieType;

                        //Get type of roll (Atack, Save, ect) 
                        // Generally this should always return unknown as specific system parsers are the only ones that can get this info
                        newDieRollInfo.RollType = this.getRollType(msg);

                        // Get roll value (int)
                        newDieRollInfo.RollValue = msg.rolls[tempRoll].dice[tempDieType].results[rollResult].result;

                        retRollInfoAry[tempRoll].DiceInfo.push(newDieRollInfo);
                    }
                
                } // end results
            } // end dice in rolls
        } // end rolls

        /* ================== ATTACK ROLLS LOOP ============= */
        // PF1 Splits rolls into 'ROLLS' and 'SYSTEM ROLLS'. 
        //  The latter are used when a player presses a card on their character sheer
        //For multiple rolls in chat (Any roll made from a card)
        for (let tempRoll = 0; tempRoll < msg.systemRolls.attacks.length; tempRoll++) {
            retRollInfoAry.push(new DS_ROLL_INFO);
            let rollObjSel = msg.systemRolls.attacks[tempRoll].attack;

            retRollInfoAry[tempRoll] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], rollObj);

            //For multiple dice types per roll
            for(let tempDieType=0; rollObjSel.dice.length; tempDieType++){
                let dieTypeSel = rollObjSel.dice[tempDieType];
                let sides = dieTypeSel.faces;
                let dieType = DS_GLOBALS.MAX_TO_DIE.get(sides);

                //For results of every die roll of that dice type
                for(let rollResult=0; rollResult < dieTypeSel.results.length; rollResult++){
                    
                    // Create new ROLL_INFO obj to ass to array
                    let newDieRollInfo = new DS_DIE_ROLL_INFO;

                    let rollResSel = dieType.results[rollResult];
                    
                    // See if it was a blind roll
                    newDieRollInfo.IsBlind = msg.blind;
                    
                    // Get die type
                    if(dieType)
                    {
                        newDieRollInfo.DieType = dieType;

                        //Get type of roll (Atack, Save, ect) 
                        // Generally this should always return unknown as specific system parsers are the only ones that can get this info
                        newDieRollInfo.RollType = this.getRollType(msg);

                        // Get roll value (int)
                        newDieRollInfo.RollValue = rollResSel.result;

                        retRollInfoAry[tempRoll].DiceInfo.push(newDieRollInfo);
                    }
                
                } // end results
            } // end dice in rolls
        } // end rolls


        /* ================== DAMAGE ROLLS LOOP ============= */
        for (let tempRoll = 0; tempRoll < msg.systemRolls.damage.length; tempRoll++) {
            retRollInfoAry.push(new DS_ROLL_INFO);
            let rollObjSel = msg.systemRolls.attacks[tempRoll].damage;

            for(let tempdmgRoll = 0; tempdmgRoll < rollObjSel.damage.length; tempdmgRoll++)
            {
                retRollInfoAry[tempRoll] = this.updateRollInfo(msg, retRollInfoAry[tempRoll], rollObj);

                //For multiple dice types per roll
                for(let tempDieType=0; rollObjSel.dice.length; tempDieType++){
                    let dieTypeSel = rollObjSel.dice[tempDieType];
                    let sides = dieTypeSel.faces;
                    let dieType = DS_GLOBALS.MAX_TO_DIE.get(sides);

                    //For results of every die roll of that dice type
                    for(let rollResult=0; rollResult < dieTypeSel.results.length; rollResult++){
                        
                        // Create new ROLL_INFO obj to ass to array
                        let newDieRollInfo = new DS_DIE_ROLL_INFO;

                        let rollResSel = dieType.results[rollResult];
                        
                        // See if it was a blind roll
                        newDieRollInfo.IsBlind = msg.blind;
                        
                        // Get die type
                        if(dieType)
                        {
                            newDieRollInfo.DieType = dieType;

                            //Get type of roll (Atack, Save, ect) 
                            // Generally this should always return unknown as specific system parsers are the only ones that can get this info
                            newDieRollInfo.RollType = this.getRollType(msg);

                            // Get roll value (int)
                            newDieRollInfo.RollValue = rollResSel.result;

                            retRollInfoAry[tempRoll].DiceInfo.push(newDieRollInfo);
                        }
                    
                    } // end results
                } // end dice in rolls
            }// end damage roll loop
        } // end rolls

        return retRollInfoAry;
    }

    /**
     * Update roll obj with any info that system holds in roll compared to specific dice info
     * NOTE: THESE ARE ONLY ACCESSABLE IF THE USER HAS A PLAYER TARGETED, IF NOT, ITS NOT TRACKED
     */
    /**
     * 
     * @param {*} msg - chat message obj (Prob not needed now that we have the rollObj)
     * @param {DS_ROLL_INFO} retRollInfoObj - data struct that were going to modify and return
     * @param {MSG.ROLL_INFO} rollOBJ - Roll Obj We want to parse
     * @returns retRollInfoObj
     */
    updateRollInfo(msg, retRollInfoObj, rollObj){

        // For PF2e, If it was an attack Roll get some extra info
        if( rollToParse?.type == "attack-roll" ){

        }else if(rollToParse?.type == "saving-throw" ){
            // How Did the save faire
        }else if(rollToParse?.type?.includes("skill-check")){
            // Was it some check vs a DC? Means the roll was a skill of some kinds
        }else if(msg?.isDamageRoll){
            // Was a dmg roll? We could tally total damage done 
            //NOTE: (Wont be super reliable as all flat checks will count as dmg)
        }else if(rollToParse?.type?.includes("perception-check")){

        }else if(rollToParse?.type?.includes("initiative")){

        }
        return retRollInfoObj;
    }
}