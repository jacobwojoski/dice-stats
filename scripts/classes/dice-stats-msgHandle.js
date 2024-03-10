/**
 * Class is used to interact with any chat messages that got made. 
 */

class DS_MESSAGE_HANDLER {
    /**
     * Check if the message includes any roll data that we want to store
     * @param {*} msg - Chat message object
     * @returns {Boolean} - is the message a roll Message
     */
    static isRollMessage(msg)
    {   // Most systems have an isRoll option in the chat message, Check that first
        if(msg.isRoll){
            return true;

        }else if (game.system === 'pf1e'){
            // PF1 Attack rolls dont use isRoll for attacks
            if(msg.systemRolls?.attacks?.length > 0){
                return true;
            }
        }
        return false;
    }

    /**
     * Get the type of roll that was made (Attack, Damage, Save, ... UNKNOWN)
     * @param {*} msg - Chat message that holds roll info
     * @returns {ROLL_TYPE} - enum ROLL_TYPE object, found in GLOBALS
     */
    static getRollType(msg)
    {

    }

    /**
     * Get the number of rolls in the message 
     * @param {*} msg 
     * @returns {*} 
     */
    static getNumberRolls(msg)
    {

    }

    static getDegreeSuccess(msg, rollInfo)
    {

    }

    /*  ROLL INFO OBJ{
            DIE_TYPE, ROLL_TYPE, ROLL VALUE, IS_BLIND, DEG_SUCCESS
        } 
    */
    /**
     * Array of all rolls that were made in the chat message
     * @param {*} msg 
     * @returns {ROLL_INFO[]} - Array of Roll INFO 
     */
    static getRollInfo(msg)
    {
        let retVal = null;
        if(game.system === "pf1e"){
            retVal = getPf1RollInfo();
        }else{
            retVal = getGenericRollInfo();
        }
        return retVal;
    }
}

/* DIE_TYPE, ROLL_TYPE, ROLL_VALUE, IS_BLIND, DEG_SUCCESS*/
DS_ROLL_INFO = {
    DieType:    0, //{DIE_TYPE}
    RollType:   0, //{ROLL_TYPE}
    RollValue:  0, //{INT}
    IsBlind:    0, //{BOOLEAN}
    DegSuccess: 0, //{DEG_SUCCESS}
}