class DB_INTERACTION 
{
    /**
     * Method to create flags if they dont exist
     */
    static createDB()
    {
        for(let user in game.users)
        {
            if(!hasProperty(user, 'data.flags.'+MODULE_ID+'.player_roll_data'))
            {
                user.setFlag(MODULE_ID,'player_roll_data',{});
            }
        }
    }

    /**
     * Method called to save user info to the db
     * @param {PLAYER} playerInfo 
     */
    static saveUserData(playerInfo)
    {
        game.user.setFlag(MODULE_ID,'player_roll_data', playerInfo)
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

    /**
     * method to clear all info from the DB
     * Used if we want users to just keep track of per session stats rather then lifetime stats
     */
    static clearDB()
    {
        for(let user in game.users)
        {
            user.unsetFlag(MODULE_ID,'player_roll_data');
        }
    } 
}