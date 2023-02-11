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
    static globalMathStatsHelpter(dieType,rollAry,handlebarsData)
    {
        handlebarsData.MEAN[dieType] = DICE_STATS_UTILS.getMean(rollAry);
        handlebarsData.MEDIAN[dieType] = DICE_STATS_UTILS.getMedian(rollAry);
        handlebarsData.MODE[dieType] = DICE_STATS_UTILS.getMode(rollAry);
        return handlebarsData;
    }

    static getGlobalMathStatsData(handlebarsData)
    {
        //For Every die type get stats
        handlebarsData = globalMathStatsHelpter(0,handlebarsData.D2_ROLL_DATA,handlebarsData); 
        handlebarsData = globalMathStatsHelpter(1,handlebarsData.D3_ROLL_DATA,handlebarsData); 
        handlebarsData = globalMathStatsHelpter(2,handlebarsData.D4_ROLL_DATA,handlebarsData); 
        handlebarsData = globalMathStatsHelpter(3,handlebarsData.D6_ROLL_DATA,handlebarsData); 
        handlebarsData = globalMathStatsHelpter(4,handlebarsData.D8_ROLL_DATA,handlebarsData); 
        handlebarsData = globalMathStatsHelpter(5,handlebarsData.D10_ROLL_DATA,handlebarsData); 
        handlebarsData = globalMathStatsHelpter(6,handlebarsData.D12_ROLL_DATA,handlebarsData); 
        handlebarsData = globalMathStatsHelpter(7,handlebarsData.D20_ROLL_DATA,handlebarsData); 
        handlebarsData = globalMathStatsHelpter(8,handlebarsData.D100_ROLL_DATA,handlebarsData);
        return handlebarsData;
    }
    
    static globalStreakDataHelper(dieType, player, handlebarsData, lengthData){
        if(player.PLAYER_DICE[dieType].LONGEST_STREAK > lengthData[dieType])
        {
            lengthData[dieType] = player.PLAYER_DICE[dieType].LONGEST_STREAK;
            handlebarsData.STREAK_PLAYER[dieType] = player.USERNAME;
            handlebarsData.STREAK[dieType] = player.getStreakString(dieType);
        }
    }

    //Get global streak data from players
    static getGlobalStreakData(players, handlebarsData,includeGMrolls)
    {
        var streakLength = new Array(9);
        streakLength.fill(0);
        //Player.getStreakString(dieType)

        for(plyr in players){
            //See if we should skip adding data becasue its GM's
            if(plyr.GM && !includeGMrolls){continue};

            //For every die type
            for (let i = 0; i < 9; i++) {
                globalStreakDataHelper(i,plyr,handlebarsData,streakLength);
            }
        }
        return handlebarsData;
    }
    
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
            if(maxRoll > handlebarsData.ROLLED_MOST_MIN_ROLLCOUNT[dieType]){
                handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT[dieType] = maxRoll;
                handlebarsData.ROLLED_MOST_MAX_PLAYER[dieType] = username;
            }else if(maxRoll === handlebarsData.ROLLED_MOST_MAX_ROLLCOUNT[dieType]){
                //Tied For Most Min Rolls, Append username
                handlebarsData.ROLLED_MOST_MAX_PLAYER[dieType] += " "+username;
            }
        }
        return handlebarsData;
    }

    //Get Max and min values from player data
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
        for(plyr in players){
            //See if we should skip adding ply data becasue its GM's stats
            if(plyr.GM && !includeGMrolls){continue};

            myUsername = plyr.USERNAME;
            //D2 Data
                minRoll = plyr.PLAYER_DICE[0].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[0].ROLLS[1];

                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 0, myUsername, handlebarsData)
            //D3 Data
                minRoll = plyr.PLAYER_DICE[1].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[1].ROLLS[2];
                
                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 1, myUsername, handlebarsData)
            //D4 Data
                minRoll = plyr.PLAYER_DICE[2].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[2].ROLLS[3];
                
                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 2, myUsername, handlebarsData)
            //D6 Data
                minRoll = plyr.PLAYER_DICE[3].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[3].ROLLS[5];
                
                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 3, myUsername, handlebarsData)
            //D8 Data
                minRoll = plyr.PLAYER_DICE[4].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[4].ROLLS[7];
                
                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 4, myUsername, handlebarsData)
            //D10 Data
                minRoll = plyr.PLAYER_DICE[5].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[5].ROLLS[9];
                
                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 5, myUsername, handlebarsData)
            //D12 Data
                minRoll = plyr.PLAYER_DICE[6].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[6].ROLLS[11];
                
                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 6, myUsername, handlebarsData)
            //D20 Data
                minRoll = plyr.PLAYER_DICE[7].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[7].ROLLS[19];
    
                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 0, myUsername, handlebarsData)
            //D100 Data
                minRoll = plyr.PLAYER_DICE[8].ROLLS[0];
                maxRoll = plyr.PLAYER_DICE[8].ROLLS[99];

                handlebarsData = globalMaxMinHelper(minRoll, maxRoll, 0, myUsername, handlebarsData)   
        }
        return handlebarsData;
    }
    
    //Create Combined Arrays of all players rolls
    //Save Most Max and Most min Roll Data
    static getGlobalRollData(players, handlebarsData,includeGMrolls)
    {
        for(plyr in players){
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

    //Initalize array size and set default values in arrays
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

        packedData.TOTAL_ROLLS = new Array(9);
        packedData.MEAN =   new Array(9);
        packedData.MEDIAN = new Array(9);
        packedData.MODE =   new Array(9);

        packedData.STREAK_PLAYER = new Array(9),
        packedData.STREAK = new Array(9);
        packedData.S_IS_B = new Array(9);

        packedData.ROLLED_MOST_MAX_PLAYER =     new Array(9), 
        packedData.ROLLED_MOST_MAX_ROLLCOUNT =  new Array(9),
        packedData.ROLLED_MOST_MIN_PLAYER =     new Array(9),
        packedData.ROLLED_MOST_MIN_ROLLCOUNT =  new Array(9)

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

        packedData.TOTAL_ROLLS.fill(0);
        packedData.MEAN.fill(0);
        packedData.MEDIAN.fill(0);
        packedData.MODE.fill(0);

        packedData.STREAK_PLAYER.fill("");
        packedData.STREAK.fill(0);
        packedData.S_IS_B.fill(0);

        packedData.ROLLED_MOST_MAX_PLAYER.fill(""), 
        packedData.ROLLED_MOST_MAX_ROLLCOUNT.fill(0),
        packedData.ROLLED_MOST_MIN_PLAYER.fill(""),
        packedData.ROLLED_MOST_MIN_ROLLCOUNT.fill(0);

        return handlebarsData;
    }

    //Turn PLAYER[] into Handlebars Readable data object
    //Used in global.hbs
    static packageGlobalData(playersArry, includeGMrolls)
    {
        //TODO. packedData should be passed By ref so update fn's for that behavior
        let packedData = {};
        Object.assign(packedData, this.PLAYER_HNDL_INFO);
        packedData = this.setGlobalDefaultData(packedData);
        
        packedData = getGlobalRollData(playersArry,packedData,includeGMrolls);
        packedData = getGlobalMaxMinData(playersArry,packedData,includeGMrolls);
        packedData = getGlobalStreakData(playersArry,packedData,includeGMrolls);
        packedData = getGlobalMathStatsData(packedData);
        
        return packedData;
    }

    //======================================================
    //================= Export Package =====================
    //======================================================
    
    //Save Global Data to a file to keep track of
    static exportGlobalData(playersArry)
    {
        
    }
}
