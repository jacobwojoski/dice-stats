//This file is for packaging data to be used in handlebars functions

class DATA_PACKAGER
{
    //Data displayed on the Player Handlebars Template Page
    PLAYER_HNDL_INFO = 
    {
        //Arrays Use DIE_TYPE to get values for specific dice
        MEAN:[],
        MEDIAN:[],
        MODE:[],
        STREAK:[], //Array of strings

        //2D array to hold Dice Roll Data
        DICE_ROLL_DATA:[[],[],[],[],[],[],[],[],[]]
    }

    GLOBAL_HNDL_INFO = 
    {
        //Arrays Use DIE_TYPE to get values for specific dice
        MEAN:[],
        MEDIAN:[],
        MODE:[],

        STREAK_PLAYER:[],//Array of Player Names
        STREAK:[], //Array of Strings [..."3,4,5,6", "4,5,6,7"...] 

        ROLLED_MOST_MAX_PLAYER:[],
        ROLLED_MOST_MAX_ROLLCOUNT:[],
        ROLLED_MOST_MIN_PLAYER:[],
        ROLLED_MOST_MIN_ROLLCOUNT:[],

        //2D array to hold Dice Roll Data
        DICE_ROLL_DATA:[[],[],[],[],[],[],[],[],[]]
    }

    //Turn PLAYER Object into Handlebars Readable data Object
    //Unsed in player.hbs
    static packagePlayerData(playerInfo)
    {
        return PLAYER_HNDL_INFO;
    }


    //Create Combined Arrays of all players rolls
    //Save Most Max and Most min Roll Data
    static createCombinedArrays(playersAry)
    {
        combinedAry = [];
        return combinedAry;
    }

    //Create Streak Data for whoever got longest streaks
    //For tie's Return Player with Larger Numbers (19,20,21 beats a 4,5,6)
    static createStreakData(playersAry)
    {
    
    }

    //User Object of combined arrays to get mean median and mode for each die type
    static createMathStats(dataObject)
    {

    }

    //Turn PLAYER[] into Handlebars Readable data object
    //Used in global.hbs
    static packageGlobalData(playersArry)
    {
        globalData = new PLAYER_HNDL_INFO
        for(player in playersArry)
        {

        }
    }

    //Save Global Data to a file to keep track of
    static exportGlobalData(playersArry)
    {
        
    }
}