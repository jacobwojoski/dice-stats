class DB_INTERACTION 
{
    /**
     * Method to create flags if they dont exist
     */
    static createDB()
    {
        //Not needed
    }

    /**
     * Method called to save user info to the db, Can only save your own data!
     * @param {PLAYER} playerInfo 
     */
    static async saveUserData(playerInfo)
    {
        // Get Deep Copy rather than shallow copy the player object
        let objCpy = JSON.parse(JSON.stringify(playerInfo));

        //Get user ID
        let userid = objCpy.USERID;

        //Save copy into DB
        if(userid)
        {
            /*
            * the underlies update fn that set Flag calls seems to mess up and not update the DB causing the ERROR. 
            * Uncommenting this should fix it but leaving it out to not interact with DB more than needed
            * await DB_INTERACTION.clearPlayer(game.user);
            */
            await game.users.get(userid)?.setFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG, objCpy);
        }
    }

    /**
     * Method used to load all players info from the db
     * @param {String} userId //Long string of letters and numbers unique to each user
     */
    static loadPlayerData(userId)
    {
        let user = game.users.get(userId);
        if(user)
        {
            if(user.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG))
            {
                return user.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG);
            }
        }
        return null;
    }

    /**
     * Method used to convert DB info to A player OBJ
     * Objects are pass by ref so dont need to return
     * @param {PLAYER} tempPlayerObj Object were putting data in
     * @param {PLAYER (DB VERSION)} dbDataObj Object were taking data from
     */

    // TODO: This should validate that the DBOBJ has the value were trying to add before adding it.
    static createPlayerObject(tempPlayerObj, dbDataObj)
    {
        /*
        ----Info We need Coppied----
        class PLAYER {
            PLAYER_DICE = new Array(NUM_DIE_TYPES); //Aray of type<DIE_INFO>
            USERNAME = '';
            USERID = 0;
            GM = false;
        }

        class DIE_INFO {
            TYPE =          0;  //Type of die <DIE_TYPE> varable
            TOTAL_ROLLS =   0;
            ROLLS =         []; //Array size of die 
            BLIND_ROLLS = [];
            STREAK_SIZE =   -1;
            STREAK_INIT =   -1;
            STREAK_ISBLIND = false;
            LONGEST_STREAK =        -1;
            LONGEST_STREAK_INIT =   -1;

            MEAN =      0;
            MEDIAN =    0;
            MODE =      0;

            //Used for Specific Die Info (Currently only D20 on pf2e)
            MEANS = [];
            MEDIANS = [];
            MODES = [];
            ROLL_COUNTERS = [];

            ATK_ROLLS = [];
            DMG_ROLLS = [];
            SAVES_ROLLS = [];
            SKILLS_ROLLS = [];
            ABILITY_ROLLS = [];
            UNKNOWN_ROLLS = [];

            ATK_ROLLS_BLIND = [];
            DMG_ROLLS_BLIND = [];
            SAVES_ROLLS_BLIND = [];
            SKILLS_ROLLS_BLIND = [];
            ABILITY_ROLLS_BLIND = [];
            UNKNOWN_ROLLS_BLIND = [];
        }
    */
        dbDataObj.USERNAME  ? tempPlayerObj.USERNAME = dbDataObj.USERNAME   : "";
        dbDataObj.USERID    ? tempPlayerObj.USERID = dbDataObj.USERID       : "";
        dbDataObj.GM        ? tempPlayerObj.GM = dbDataObj.GM               : "";
        
        for(let i=0; i<tempPlayerObj.PLAYER_DICE.length; i++)
        {
            let tempDieObj = tempPlayerObj.PLAYER_DICE[i];
            let dbDieDataObj = dbDataObj.PLAYER_DICE[i];

            // If the die obj doesnt exist no db values will exist so skip.
            if(!dbDieDataObj)
            {
                continue;
            }

            dbDieDataObj.TYPE ?         tempDieObj.TYPE =           dbDieDataObj.TYPE                   : "";
            dbDieDataObj.TOTAL_ROLLS ?  tempDieObj.TOTAL_ROLLS =    dbDieDataObj.TOTAL_ROLLS            : "";
            dbDieDataObj.ROLLS ?        tempDieObj.ROLLS =          [... dbDieDataObj.ROLLS]            : "";  
            dbDieDataObj.BLIND_ROLLS ?  tempDieObj.BLIND_ROLLS =    [... dbDieDataObj.BLIND_ROLLS]      : "";
            dbDieDataObj.STREAK_SIZE ?  tempDieObj.STREAK_SIZE =    dbDieDataObj.STREAK_SIZE            : "";
            dbDieDataObj.STREAK_INIT ?  tempDieObj.STREAK_INIT =    dbDieDataObj.STREAK_INIT            : "";
            dbDieDataObj.STREAK_ISBLIND ? tempDieObj.STREAK_ISBLIND = dbDieDataObj.STREAK_ISBLIND       : "";
            dbDieDataObj.LONGEST_STREAK ? tempDieObj.LONGEST_STREAK = dbDieDataObj.LONGEST_STREAK       : "";
            dbDieDataObj.LONGEST_STREAK_INIT ? tempDieObj.LONGEST_STREAK_INIT = dbDieDataObj.LONGEST_STREAK_INIT : "";

            dbDieDataObj.MEAN   ? tempDieObj.MEAN =     dbDieDataObj.MEAN   : "";
            dbDieDataObj.MEDIAN ? tempDieObj.MEDIAN =   dbDieDataObj.MEDIAN : "";
            dbDieDataObj.MODE   ? tempDieObj.MODE =     dbDieDataObj.MODE   : "";

            if(i == DS_GLOBALS.DIE_TYPE.D20)
            {
                dbDieDataObj.MEANS         ? tempDieObj.MEANS =          [...dbDieDataObj.MEANS]   : "";
                dbDieDataObj.MEDIANS       ? tempDieObj.MEDIANS =        [...dbDieDataObj.MEDIANS] : "";
                dbDieDataObj.MODES         ? tempDieObj.MODES =          [...dbDieDataObj.MODES]   : "";
                dbDieDataObj.ROLL_COUNTERS ? tempDieObj.ROLL_COUNTERS =  [...dbDieDataObj.ROLL_COUNTERS] : "";

                dbDieDataObj.ATK_ROLLS      ? tempDieObj.ATK_ROLLS =      [...dbDieDataObj.ATK_ROLLS]       : "";
                dbDieDataObj.DMG_ROLLS      ? tempDieObj.DMG_ROLLS =      [...dbDieDataObj.DMG_ROLLS]       : "";
                dbDieDataObj.SAVES_ROLLS    ? tempDieObj.SAVES_ROLLS =    [...dbDieDataObj.SAVES_ROLLS]     : "";
                dbDieDataObj.SKILLS_ROLLS   ? tempDieObj.SKILLS_ROLLS =   [...dbDieDataObj.SKILLS_ROLLS]    : "";
                dbDieDataObj.ABILITY_ROLLS  ? tempDieObj.ABILITY_ROLLS =  [...dbDieDataObj.ABILITY_ROLLS]   : "";
                dbDieDataObj.UNKNOWN_ROLLS  ? tempDieObj.UNKNOWN_ROLLS =  [...dbDieDataObj.UNKNOWN_ROLLS]   : "";

                dbDieDataObj.ATK_ROLLS_BLIND        ? tempDieObj.ATK_ROLLS_BLIND =        [...dbDieDataObj.ATK_ROLLS_BLIND]     : "";
                dbDieDataObj.DMG_ROLLS_BLIND        ? tempDieObj.DMG_ROLLS_BLIND =        [...dbDieDataObj.DMG_ROLLS_BLIND]     : "";
                dbDieDataObj.SAVES_ROLLS_BLIND      ? tempDieObj.SAVES_ROLLS_BLIND =      [...dbDieDataObj.SAVES_ROLLS_BLIND]   : "";
                dbDieDataObj.SKILLS_ROLLS_BLIND     ? tempDieObj.SKILLS_ROLLS_BLIND =     [...dbDieDataObj.SKILLS_ROLLS_BLIND]  : "";
                dbDieDataObj.ABILITY_ROLLS_BLIND    ? tempDieObj.ABILITY_ROLLS_BLIND =    [...dbDieDataObj.ABILITY_ROLLS_BLIND] : "";
                dbDieDataObj.UNKNOWN_ROLLS_BLIND    ? tempDieObj.UNKNOWN_ROLLS_BLIND =    [...dbDieDataObj.UNKNOWN_ROLLS_BLIND] : "";
            }
        }
    }

    /**
     * method to clear all info from the DB
     * Used if we want users to just keep track of per session stats rather then lifetime stats
     */
    static clearDB()
    {
        for(let aUser of game.users)
        {
            if(aUser)
            {
                if(aUser.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG))
                {
                    aUser.unsetFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG);
                }
            }
        }
    } 

    /**
     * Method used to clear a specific users data
     * @param {game.user} user
     */
    static async clearPlayer(user)
    {
        if(user)
        {
            if(user.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG))
            {
                await user.unsetFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG);
            }
        }
    }
}