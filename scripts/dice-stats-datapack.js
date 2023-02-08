//This file is for packaging data to be used in handlebars functions

class DATA_PACKAGER
{
    //======================================================
    //================ Handlebars Data =====================
    //======================================================
    
    //Data displayed on the Player Handlebars Template Page
    PLAYER_HNDL_INFO = 
    {
        PLAYER_NAME: '',

        //Arrays Use DIE_TYPE to get values for specific dice
        MEAN:   [],
        MEDIAN: [],
        MODE:   [],
        STREAK: [], //Array of strings
        S_IS_B: [],

        TOTAL_ROLLS:    [],
        D2_ROLL_DATA:   [],
        D3_ROLL_DATA:   [],
        D4_ROLL_DATA:   [],
        D6_ROLL_DATA:   [],
        D8_ROLL_DATA:   [],
        D10_ROLL_DATA:  [],
        D12_ROLL_DATA:  [],
        D20_ROLL_DATA:  [],
        D100_ROLL_DATA: [],
    }

    GLOBAL_HNDL_INFO = 
    {
        //Arrays Use DIE_TYPE to get values for specific dice
        MEAN:[],
        MEDIAN:[],
        MODE:[],

        STREAK_PLAYER:[],//Array of Player Names
        STREAK:[], //Array of Strings [..."3,4,5,6", "4,5,6,7"...]
        S_IS_B:[], //Array of boolians to indicate if streak is blind 

        // String of playername per die. 
        // Could have tie's so String is format of "NAME_ONE NAME_TWO NAME_THREE" (Space Delinated)
        ROLLED_MOST_MAX_PLAYER:[], 
        ROLLED_MOST_MAX_ROLLCOUNT:[],
        ROLLED_MOST_MIN_PLAYER:[],
        ROLLED_MOST_MIN_ROLLCOUNT:[],

        TOTAL_ROLLS:    [], // total number of times each die type was rolled
        D2_ROLL_DATA:   [],
        D3_ROLL_DATA:   [],
        D4_ROLL_DATA:   [],
        D6_ROLL_DATA:   [],
        D8_ROLL_DATA:   [],
        D10_ROLL_DATA:  [],
        D12_ROLL_DATA:  [],
        D20_ROLL_DATA:  [],
        D100_ROLL_DATA: [],
    }

    //======================================================
    //================= Player Package =====================
    //======================================================
    
    //Turn PLAYER Object into Handlebars Readable data Object
    //Unsed in player.hbs
    static packagePlayerData(playerInfo)
    {   
        let packedData = {};
        Object.assign(packedData, this.PLAYER_HNDL_INFO);

        packedData.PLAYER_NAME = playerInfo.USERNAME;
        packedData.D2_ROLL_DATA =      [...playerInfo.PLAYER_DICE[0].ROLLS];
        packedData.D3_ROLL_DATA =      [...playerInfo.PLAYER_DICE[1].ROLLS];
        packedData.D4_ROLL_DATA =      [...playerInfo.PLAYER_DICE[2].ROLLS];
        packedData.D6_ROLL_DATA =      [...playerInfo.PLAYER_DICE[3].ROLLS];
        packedData.D8_ROLL_DATA =      [...playerInfo.PLAYER_DICE[4].ROLLS];
        packedData.D10_ROLL_DATA =     [...playerInfo.PLAYER_DICE[5].ROLLS];
        packedData.D12_ROLL_DATA =     [...playerInfo.PLAYER_DICE[6].ROLLS];
        packedData.D20_ROLL_DATA =     [...playerInfo.PLAYER_DICE[7].ROLLS];
        packedData.D100_ROLL_DATA =    [...playerInfo.PLAYER_DICE[8].ROLLS];

        packedData.TOTAL_ROLLS = new Array(9);
        packedData.MEAN =   new Array(9);
        packedData.MEDIAN = new Array(9);
        packedData.MODE =   new Array(9);
        packedData.STREAK = new Array(9);
        packedData.S_IS_B = new Array(9);

        for(let die=0; die<9; die++){
            playerInfo.PLAYER_DICE[die].calculate();
            
            packedData.TOTAL_ROLLS[die] = playerInfo.PLAYER_DICE[die].TOTAL_ROLLS;
            packedData.MEAN[die] = playerInfo.PLAYER_DICE[die].MEAN;
            packedData.MEDIAN[die] = playerInfo.PLAYER_DICE[die].MEDIAN;
            packedData.MODE[die] = playerInfo.PLAYER_DICE[die].MODE;
            packedData.STREAK[die] = playerInfo.getStreakString(die);
            packedData.S_IS_B[die] = playerInfo.PLAYER_DICE[die].STREAK_ISBLIND;
        }
        
        return packedData;
    }

    //======================================================
    //================= Global Package =====================
    //======================================================
    
    //Get stats from the global data (Mean median mode)
    static getGlobalMathStatsData(handlebarsData)
    {
        return handlebarsData;
    }
    
    //Get global streak data from players
    static getGlobalStreakData(players, handlebarsData)
    {
        return handlebarsData;
    }
    
    //Get Max and min values from player data
    static getGlobalMaxMinData(players, handlebarsData)
    {
        return handlebarsData;
    }
    
    //Create Combined Arrays of all players rolls
    //Save Most Max and Most min Roll Data
    static getGlobalRollData(players, handlebarsData)
    {
        return handlebarsData;
    }

    //Turn PLAYER[] into Handlebars Readable data object
    //Used in global.hbs
    static packageGlobalData(playersArry)
    {
        let packedData = {};
        Object.assign(packedData, this.PLAYER_HNDL_INFO);
        
        packedData = getGlobalRollData(playersArry,packedData);
        packedData = getGlobalMaxMinData(playersArry,packedData);
        packedData = getGlobalStreakData(playersArry,packedData);
        packedData = getGlobalMathStatsData(packedData);
        
        return packedData;
    }

    //======================================================
    //================= Global Package =====================
    //======================================================
    
    //Save Global Data to a file to keep track of
    static exportGlobalData(playersArry)
    {
        
    }
}
