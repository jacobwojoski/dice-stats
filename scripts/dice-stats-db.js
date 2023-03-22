class DB_INTERACTION 
{
    /**
     * Method to create flags if they dont exist
     */
    static createDB()
    {
        for(let user in game.users)
        {
            if(!hasProperty(user, 'data.flags.'+MODULE_ID+'.'+ROLLDATAFLAG))
            {
                user.setFlag(MODULE_ID,ROLLDATAFLAG,{});
            }
        }
    }

    /**
     * Method called to save user info to the db
     * @param {PLAYER} playerInfo 
     */
    static saveUserData(playerInfo)
    {
        game.user.setFlag(MODULE_ID,'player_roll_data', playerInfo);
        ui.notifications.warn("Saved To Database");
    }

    /**
     * Method used to load all players info from the db
     */
    static loadPlayerData(userId)
    {
        let user = game.user.get(userId);
        if(user)
        {
            if(hasProperty(user, 'data.flags.'+MODULE_ID+'.player_roll_data'))
            {
                return user.getFlag(MODULE_ID,'player_roll_data');
            }
            return null;
        }
        
    }

    //Method used to convert DB info to A player OBJ
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
        }
    */
        tempPlayerObj.USERNAME =    dbDataObj.USERNAME;
        tempPlayerObj.USERID =      dbDataObj.USERID;
        tempPlayerObj.GM =          dbDataObj.GM;

        for(let i=0; i<tempPlayerObj.PLAYER_DICE.length; i++)
        {
            let tempDieObj = tempPlayerObj.PLAYER_DICE[i];
            let dbDieDataObj = dbDataObj.PLAYER_DICE[i];

            tempDieObj.TYPE =          dbDieDataObj.TYPE;
            tempDieObj.TOTAL_ROLLS =   dbDieDataObj.TOTAL_ROLLS;
            tempDieObj.ROLLS =         dbDieDataObj.ROLLS;  
            tempDieObj.BLIND_ROLLS =   dbDieDataObj.BLIND_ROLLS;
            tempDieObj.STREAK_SIZE =   dbDieDataObj.STREAK_SIZE;
            tempDieObj.STREAK_INIT =   dbDieDataObj.STREAK_INIT;
            tempDieObj.STREAK_ISBLIND = dbDieDataObj.STREAK_ISBLIND;
            tempDieObj.LONGEST_STREAK =        dbDieDataObj.LONGEST_STREAK;
            tempDieObj.LONGEST_STREAK_INIT =   dbDieDataObj.LONGEST_STREAK_INIT;

            tempDieObj.MEAN =      dbDieDataObj.MEAN;
            tempDieObj.MEDIAN =    dbDieDataObj.MEDIAN;
            tempDieObj.MODE =      dbDieDataObj.MODE;
        }

        return tempPlayerObj;
    }

    /**
     * method to clear all info from the DB
     * Used if we want users to just keep track of per session stats rather then lifetime stats
     */
    static clearDB()
    {
        for(let user in game.users)
        {
            if(hasProperty(user, 'data.flags.'+MODULE_ID+'.player_roll_data'))
            {
                user.unsetFlag(MODULE_ID,'player_roll_data');
            }
        }
        ui.notifications.warn("Database Cleared");
    } 
}