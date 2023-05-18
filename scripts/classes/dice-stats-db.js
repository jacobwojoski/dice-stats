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
    static saveUserData(playerInfo)
    {
        let userid = playerInfo.USERID;
        let objCpy = Object.assign({},playerInfo);
        if(userid)
        {
            game.users.get(userid)?.setFlag(MODULE_ID,'player_roll_data', objCpy);
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
            if(user.getFlag(MODULE_ID,'player_roll_data'))
            {
                return user.getFlag(MODULE_ID,'player_roll_data');
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
            tempDieObj.ROLLS =         [... dbDieDataObj.ROLLS];  
            tempDieObj.BLIND_ROLLS =   [... dbDieDataObj.BLIND_ROLLS];
            tempDieObj.STREAK_SIZE =   dbDieDataObj.STREAK_SIZE;
            tempDieObj.STREAK_INIT =   dbDieDataObj.STREAK_INIT;
            tempDieObj.STREAK_ISBLIND = dbDieDataObj.STREAK_ISBLIND;
            tempDieObj.LONGEST_STREAK =        dbDieDataObj.LONGEST_STREAK;
            tempDieObj.LONGEST_STREAK_INIT =   dbDieDataObj.LONGEST_STREAK_INIT;

            tempDieObj.MEAN =      dbDieDataObj.MEAN;
            tempDieObj.MEDIAN =    dbDieDataObj.MEDIAN;
            tempDieObj.MODE =      dbDieDataObj.MODE;
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
                if(aUser.getFlag(MODULE_ID,'player_roll_data'))
                {
                    aUser.unsetFlag(MODULE_ID,'player_roll_data');
                }
            }
        }
    } 

    /**
     * Method used to clear a specific users data
     * @param {game.user} user
     */
    static clearPlayer(user)
    {
        if(user)
        {
            if(user.getFlag(MODULE_ID,'player_roll_data'))
            {
                user.unsetFlag(MODULE_ID,'player_roll_data');
            }
        }
    }
}