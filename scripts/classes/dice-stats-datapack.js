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

        //Is Auto DB feature enabled (Auto Save & Load)
        AUTO_DB_ACTIVE: false,

        //array<bools>[num_of_dice] Used by checkboxes on UI
        IS_DIE_DISPLAYED: [],

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

        BLIND_ROLL_COUNT: 0,
    }

    GLOBAL_HNDL_INFO = 
    {   
        //array<bools>[num_of_dice] Used by checkboxes on UI
        IS_DIE_DISPLAYED: [],

        //Is Auto DB feature enabled (Auto Save & Load)
        AUTO_DB_ACTIVE: false,
        
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

        TOTAL_BLIND_ROLL_COUNT: 0,
    }

    //======================================================
    //================= Player Package =====================
    //======================================================
    
    //Turn PLAYER Object into Handlebars Readable data Object
    //Convert PLAYER Object into DATA_PACKAGER::PLAYER_HNDL_INFO
    //Unsed in player.hbs
    static packagePlayerData(playerInfo)
    {   
        let packedData = {};
        Object.assign(packedData, this.PLAYER_HNDL_INFO);

        packedData.AUTO_DB_ACTIVE = game.settings.get(MODULE_ID_DS,SETTINGS.ENABLE_AUTO_DB);

        packedData.IS_DIE_DISPLAYED = new Array(9);
        packedData.IS_DIE_DISPLAYED.fill(true);

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
        
        packedData.BLIND_ROLL_COUNT = playerInfo.getBlindRollsCount();
        return packedData;
    }

    //======================================================
    //================= Global Package =====================
    //======================================================
    
    /**
     * Get stats from the global data (Mean median mode)
     * @param {DIE_TYPE} dieType 
     * @param {int[]} rollAry 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @returns {GLOBAL_HNDL_INFO} with updated values 
     */
    static globalMathStatsHelper(dieType,rollAry,handlebarsData)
    {
        handlebarsData.MEAN[dieType] = DICE_STATS_UTILS.getMean(rollAry);
        handlebarsData.MEDIAN[dieType] = DICE_STATS_UTILS.getMedian(rollAry);
        handlebarsData.MODE[dieType] = DICE_STATS_UTILS.getMode(rollAry);
        return handlebarsData;
    }

    /**
     * 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @returns {GLOBAL_HNDL_INFO} with updated values
     */
    static getGlobalMathStatsData(handlebarsData)
    {
        //For Every die type get stats
        handlebarsData = this.globalMathStatsHelper(0,handlebarsData.D2_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(1,handlebarsData.D3_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(2,handlebarsData.D4_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(3,handlebarsData.D6_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(4,handlebarsData.D8_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(5,handlebarsData.D10_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(6,handlebarsData.D12_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(7,handlebarsData.D20_ROLL_DATA,handlebarsData); 
        handlebarsData = this.globalMathStatsHelper(8,handlebarsData.D100_ROLL_DATA,handlebarsData);
        return handlebarsData;
    }
    
    /**
     * method used to save the longest streak playername and streak values to handlebars data
     * @param {DIE_TYPE} dieType 
     * @param {PLAYER} player 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     */
    static globalStreakDataHelper(dieType, player, handlebarsData){
        if(player.PLAYER_DICE[dieType].LONGEST_STREAK > 0)
        {
            handlebarsData.STREAK_PLAYER[dieType] = player.USERNAME;
            handlebarsData.STREAK[dieType] = player.getStreakString(dieType);
        }
    }

    /**
     * Get global streak data from players
     * @param {PLAYER[]} players 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @param {boolean} includeGMrolls 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static getGlobalStreakData(players, handlebarsData,includeGMrolls)
    {
        for(let itr = 0; itr < players.length; itr++){
            let plyr = players[itr];
            //See if we should skip adding data becasue its GM's
            if(plyr.GM && !includeGMrolls){continue};

            //For every die type
            for (let i = 0; i < 9; i++) {
                this.globalStreakDataHelper(i,plyr,handlebarsData);
            }
        }
        return handlebarsData;
    }
    
    /**
     * Method used to save info of player info to Handlebars data if they rolled the most MIN or most MAX for that die
     * @param {int} minRoll 
     * @param {int} maxRoll 
     * @param {DIE_TYPE} dieType 
     * @param {String} username 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static globalMaxMinDataHelper(minRoll, maxRoll, dieType, username, handlebarsData){
        //If num Rolls is 0, Number wasnt rolled by user so skip processing data
        //Most Min Rolls
        if(minRoll != 0){
            if(minRoll > handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT[dieType]){
                handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT[dieType] = minRoll;
                handlebarsData.ROLLED_MOST_MIN_PLAYER[dieType] = username;
            }else if(minRoll === handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT[dieType]){
                //Tied For Most Min Rolls, Append username
                handlebarsData.ROLLED_MOST_MIN_PLAYER[dieType] += " "+username;
            }
        }

        //Most Max Rolls
        if(maxRoll != 0){
            if(maxRoll > handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT[dieType]){
                handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT[dieType] = maxRoll;
                handlebarsData.ROLLED_MOST_MAX_PLAYER[dieType] = username;
            }else if(maxRoll === handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT[dieType]){
                //Tied For Most Min Rolls, Append username
                handlebarsData.ROLLED_MOST_MAX_PLAYER[dieType] += " "+username;
            }
        }
        return handlebarsData;
    }

    /**
     * //Get Max and min values from player data
     * @param {PLAYER[]} players 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @param {bool} includeGMrolls 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static getGlobalMaxMinData(players, handlebarsData,includeGMrolls)
    {
        //NOTE Cant use loops to pack data because Global Data Obj cant use 2d Arrays (Handlbars is lame)
        /**
        ROLLED_MOST_MAX_PLAYER:[], //Array of String
        ROLLED_MOST_MAX_ROLLCOUNT:[], //Array of ints
        ROLLED_MOST_MIN_PLAYER:[],  //Array of Strings
        ROLLED_MOST_MIN_ROLLCOUNT:[], //Array of Ints
         */
        let minRoll = 0;
        let maxRoll = 0;
        for(let itr = 0; itr < players.length; itr++){
            let plyr = players[itr];
            //See if we should skip adding ply data becasue its GM's stats
            if(plyr.GM && !includeGMrolls){continue};

            let myUsername = plyr.USERNAME;
            //D2 Data
                minRoll = plyr.PLAYER_DICE[0].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[0].ROLLS[1];

                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 0, myUsername, handlebarsData)
            //D3 Data
                minRoll = plyr.PLAYER_DICE[1].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[1].ROLLS[2];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 1, myUsername, handlebarsData)
            //D4 Data
                minRoll = plyr.PLAYER_DICE[2].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[2].ROLLS[3];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 2, myUsername, handlebarsData)
            //D6 Data
                minRoll = plyr.PLAYER_DICE[3].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[3].ROLLS[5];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 3, myUsername, handlebarsData)
            //D8 Data
                minRoll = plyr.PLAYER_DICE[4].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[4].ROLLS[7];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 4, myUsername, handlebarsData)
            //D10 Data
                minRoll = plyr.PLAYER_DICE[5].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[5].ROLLS[9];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 5, myUsername, handlebarsData)
            //D12 Data
                minRoll = plyr.PLAYER_DICE[6].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[6].ROLLS[11];
                
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 6, myUsername, handlebarsData)
            //D20 Data
                minRoll = plyr.PLAYER_DICE[7].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[7].ROLLS[19];
    
                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 7, myUsername, handlebarsData)
            //D100 Data
                minRoll = plyr.PLAYER_DICE[8].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[8].ROLLS[99];

                handlebarsData = this.globalMaxMinDataHelper(minRoll, maxRoll, 8, myUsername, handlebarsData)   
        }
        return handlebarsData;
    }
    
    
    /**
     * Create Combined Arrays of all players rolls
     * Save Most Max and Most min Roll Data
     * @param {PLAYER[]} players 
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @param {bool} includeGMrolls 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static getGlobalRollData(players, handlebarsData,includeGMrolls)
    {
        for(let itr = 0; itr < players.length; itr++){
            let plyr = players[itr];
            //See if we should skip adding ply data becasue its GM's stats
            if(plyr.GM && !includeGMrolls){continue};
            
            for (let i = 0; i < handlebarsData.D2_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[0] += plyr.PLAYER_DICE[0].ROLLS[i];
                handlebarsData.D2_ROLL_DATA[i] = handlebarsData.D2_ROLL_DATA[i] + plyr.PLAYER_DICE[0].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D3_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[1] += plyr.PLAYER_DICE[1].ROLLS[i];
                handlebarsData.D3_ROLL_DATA[i] = handlebarsData.D3_ROLL_DATA[i] + plyr.PLAYER_DICE[1].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D4_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[2] += plyr.PLAYER_DICE[2].ROLLS[i];
                handlebarsData.D4_ROLL_DATA[i] = handlebarsData.D4_ROLL_DATA[i] + plyr.PLAYER_DICE[2].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D6_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[3] += plyr.PLAYER_DICE[3].ROLLS[i];
                handlebarsData.D6_ROLL_DATA[i] = handlebarsData.D6_ROLL_DATA[i] + plyr.PLAYER_DICE[3].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D8_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[4] += plyr.PLAYER_DICE[4].ROLLS[i];
                handlebarsData.D8_ROLL_DATA[i] = handlebarsData.D8_ROLL_DATA[i] + plyr.PLAYER_DICE[4].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D10_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[5] += plyr.PLAYER_DICE[5].ROLLS[i];
                handlebarsData.D10_ROLL_DATA[i] = handlebarsData.D10_ROLL_DATA[i] + plyr.PLAYER_DICE[5].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D12_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[6] += plyr.PLAYER_DICE[6].ROLLS[i];
                handlebarsData.D12_ROLL_DATA[i] = handlebarsData.D12_ROLL_DATA[i] + plyr.PLAYER_DICE[6].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D20_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[7] += plyr.PLAYER_DICE[7].ROLLS[i];
                handlebarsData.D20_ROLL_DATA[i] = handlebarsData.D20_ROLL_DATA[i] + plyr.PLAYER_DICE[7].ROLLS[i];
            }
            for (let i = 0; i < handlebarsData.D100_ROLL_DATA.length; i++) {
                handlebarsData.TOTAL_ROLLS[8] += plyr.PLAYER_DICE[8].ROLLS[i];
                handlebarsData.D100_ROLL_DATA[i] = handlebarsData.D100_ROLL_DATA[i] + plyr.PLAYER_DICE[8].ROLLS[i];
            }
        }
        return handlebarsData;
    }

    /**
     * Initalize array size and set default values in arrays
     * @param {GLOBAL_HNDL_INFO} handlebarsData 
     * @returns {GLOBAL_HNDL_INFO}
     */
    static setGlobalDefaultData(handlebarsData){
        //Initalize Arrays
        handlebarsData.D2_ROLL_DATA = new Array(2);
        handlebarsData.D3_ROLL_DATA = new Array(3);
        handlebarsData.D4_ROLL_DATA = new Array(4);
        handlebarsData.D6_ROLL_DATA = new Array(6);
        handlebarsData.D8_ROLL_DATA = new Array(8);
        handlebarsData.D10_ROLL_DATA = new Array(10);
        handlebarsData.D12_ROLL_DATA = new Array(12);
        handlebarsData.D20_ROLL_DATA = new Array(20);
        handlebarsData.D100_ROLL_DATA = new Array(100);

        handlebarsData.TOTAL_ROLLS = new Array(9);
        handlebarsData.MEAN =   new Array(9);
        handlebarsData.MEDIAN = new Array(9);
        handlebarsData.MODE =   new Array(9);

        handlebarsData.STREAK_PLAYER = new Array(9),
        handlebarsData.STREAK = new Array(9);
        handlebarsData.S_IS_B = new Array(9);

        handlebarsData.ROLLED_MOST_MAX_PLAYER =     new Array(9), 
        handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT =  new Array(9),
        handlebarsData.ROLLED_MOST_MIN_PLAYER =     new Array(9),
        handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT =  new Array(9)

        //Set default Values in Arrays
        handlebarsData.D2_ROLL_DATA.fill(0);
        handlebarsData.D3_ROLL_DATA.fill(0);
        handlebarsData.D4_ROLL_DATA.fill(0);
        handlebarsData.D6_ROLL_DATA.fill(0);
        handlebarsData.D8_ROLL_DATA.fill(0);
        handlebarsData.D10_ROLL_DATA.fill(0);
        handlebarsData.D12_ROLL_DATA.fill(0);
        handlebarsData.D20_ROLL_DATA.fill(0);
        handlebarsData.D100_ROLL_DATA.fill(0);

        handlebarsData.TOTAL_ROLLS.fill(0);
        handlebarsData.MEAN.fill(0.0);
        handlebarsData.MEDIAN.fill(0);
        handlebarsData.MODE.fill(0);

        handlebarsData.STREAK_PLAYER.fill("");
        handlebarsData.STREAK.fill(0);
        handlebarsData.S_IS_B.fill(0);

        handlebarsData.ROLLED_MOST_MAX_PLAYER.fill(""), 
        handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT.fill(0),
        handlebarsData.ROLLED_MOST_MIN_PLAYER.fill(""),
        handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT.fill(0);

        handlebarsData.TOTAL_BLIND_ROLL_COUNT = 0;

        return handlebarsData;
    }

    /**
     * Turn PLAYER[] into Handlebars Readable data object {GLOBAL_HNDL_INFO}
     * @param {PLAYER[]} playersArry 
     * @param {bool} includeGMrolls 
     * @returns GLOBAL_HNDL_INFO
     */
    static packageGlobalData(playersArry, includeGMrolls)
    {
        //TODO. packedData should be passed By ref so update fn's for that behavior
        let packedData = {};
        Object.assign(packedData, this.PLAYER_HNDL_INFO);

        packedData.AUTO_DB_ACTIVE = game.settings.get(MODULE_ID_DS,SETTINGS.ENABLE_AUTO_DB);
        
        packedData = this.setGlobalDefaultData(packedData);
        
        packedData = this.getGlobalRollData(playersArry,packedData,includeGMrolls);
        packedData = this.getGlobalMaxMinData(playersArry,packedData,includeGMrolls);
        packedData = this.getGlobalStreakData(playersArry,packedData,includeGMrolls);
        packedData = this.getGlobalMathStatsData(packedData);
        
        for(let itr = 0; itr < playersArry.length; itr++){
            packedData.TOTAL_BLIND_ROLL_COUNT += playersArry[itr].getBlindRollsCount();
        }

        return packedData;
    }

    //======================================================
    //================= Export Package =====================
    //======================================================
    
    /**
     * Save Global Data to a file to allow for importing
     * @param {PLAYER[]} playersArry 
     */
    static exportGlobalDataAsJson(playersArry)
    {
        
    }

    /**
     * Save Global Data to a file to keep track off in external program (Excel/google sheets/ect)
     * @param {PLAYER[]} playersArry 
     */
    static exportGlobalDataAsCSV(playersArry)
    {

    }
}
