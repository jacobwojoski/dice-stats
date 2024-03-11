/**
 * Parse a generic system parser,
 * All parsers must implment parseMsgRoll
 */
class GENERIC_SYSTEM_MESSAGE_PARSER {

    /**
     * Parse the passed in message
     * @param {*} msg 
     * @returns {ROLL_OBJECT[]} 
     */
    parseMsgRoll(msg){
        let retRollObj = new DS_ROLL_INFO[msg.rolls.length];
        let isBlind = msg.blind;

        //Get Associated player object
        let playerInfo = this.PLAYER_DATA_MAP.get(msg.user.id);

        //For multiple rolls in chat
        for (let tempRoll = 0; tempRoll < msg.rolls.length; tempRoll++) {
            
            //For multiple dice types per roll
            for(let tempDie=0; tempDie<msg.rolls[tempRoll]?.dice.length ; tempDie++){

                //Get die type
                let sides = msg.rolls[tempRoll]?.dice[tempDie].faces;
                let dieType = DS_GLOBALS.MAX_TO_DIE.get(sides);
                let newNumbers = [];
                //Get type of roll (Atack, Save, ect)
                let rollType = DICE_STATS_UTILS.getRollType(msg);

                //In case there's more than one die rolled in a single instance as in 
                //  fortune/misfortune rolls or multiple hit dice save each roll
                newNumbers = msg.rolls[tempRoll].dice[tempDie].results.map(result => result.result)

                newNumbers.forEach(element => {
                    playerInfo.saveRoll(isBlind, element, dieType, rollType)
                });
            }
            
        }

        //If AutoSave is Enabled by GM
        if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB)) 
        {
            //If it was my roll save my data to the db
            if(msg.user.id == game.user.id)
            {
                DB_INTERACTION.saveMyPlayerData();
            }
        }
    }
}