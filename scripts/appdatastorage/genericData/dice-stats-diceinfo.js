import { DS_GLOBALS } from "../../dice-stats-globals.js";
import { DICE_STATS_UTILS } from "../../dice-stats-utils.js";
import { DS_MSG_DIE_ROLL_INFO } from "../dice-stats-rollmsginfo.js";

//Storage Class for Each Die
//Die rolls are stored in array thats size of the die type 
//That way can just incrament each position rather then store array of increasing size
//Ex, D20 roll was 16 -> Rolls[(16-1)]++;
export class DIE_INFO {
    TYPE =          0;  //Type of die <DIE_TYPE> varable
    MAX =           0;  //MAX Value On Die , ex 6, 10, 12, 20
    TOTAL_ROLLS =   0;
    ROLLS =         []; //Array size of die 
    BLIND_ROLLS = [];
    STREAK_DIR =    0;  // 0=UNKNOWN, 1 = increasing, -1 = decreasing
    STREAK_SIZE =   -1;
    STREAK_INIT =   -1;
    STREAK_ISBLIND = false;
    LONGEST_STREAK =        -1;
    LONGEST_STREAK_INIT =   -1;

    MEAN =      0.0; //(avg)
    MEDIAN =    0;
    MODE =      0;

    //Basic Stats About Specific Type of Rolls. Should prolly be called 
    //  D20_MEANS, D20_MEDIANS....etc
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
    PERCEPTION_ROLLS = [];
    INITIATIVE_ROLLS = [];

    ATK_ROLLS_BLIND = [];
    DMG_ROLLS_BLIND = [];
    SAVES_ROLLS_BLIND = [];
    SKILLS_ROLLS_BLIND = [];
    ABILITY_ROLLS_BLIND = [];
    UNKNOWN_ROLLS_BLIND = [];
    PERCEPTION_ROLLS_BLIND = [];
    INITIATIVE_ROLLS_BLIND = [];

    /**
     * constructor set values to defaults
     * @param {int} dieMax - max value the die can be
     */
    constructor(dieType = 9){
        this.MAX = DS_GLOBALS.MAX_DIE_VALUE[dieType];
        this.TYPE = dieType;
        this.STREAK_SIZE = -1;
        this.STREAK_INIT = -1;
        this.LONGEST_STREAK = 0;
        this.LONGEST_STREAK_INIT = 0;

        this.ROLLS = new Array(this.MAX);
        this.ROLLS.fill(0);

        this.BLIND_ROLLS = new Array(this.MAX);
        this.BLIND_ROLLS.fill(0);
        
        this.ROLL_COUNTERS = new Array(DS_GLOBALS.NUM_ROLL_TYPES);
        this.MEANS = new Array(DS_GLOBALS.NUM_ROLL_TYPES);
        this.MEDIANS = new Array(DS_GLOBALS.NUM_ROLL_TYPES);
        this.MODES = new Array(DS_GLOBALS.NUM_ROLL_TYPES);

        this.ATK_ROLLS = new Array(this.MAX);
        this.DMG_ROLLS = new Array(this.MAX);
        this.SAVES_ROLLS = new Array(this.MAX);
        this.SKILLS_ROLLS = new Array(this.MAX);
        this.ABILITY_ROLLS = new Array(this.MAX);
        this.UNKNOWN_ROLLS = new Array(this.MAX);

        this.ATK_ROLLS_BLIND = new Array(this.MAX);
        this.DMG_ROLLS_BLIND = new Array(this.MAX);
        this.SAVES_ROLLS_BLIND = new Array(this.MAX);
        this.SKILLS_ROLLS_BLIND = new Array(this.MAX);
        this.ABILITY_ROLLS_BLIND = new Array(this.MAX);
        this.UNKNOWN_ROLLS_BLIND = new Array(this.MAX);

        this.ROLL_COUNTERS.fill(0);
        this.MEANS.fill(0);
        this.MEDIANS.fill(0);
        this.MODES.fill(0);

        this.ATK_ROLLS.fill(0);
        this.DMG_ROLLS.fill(0);
        this.SAVES_ROLLS.fill(0);
        this.SKILLS_ROLLS.fill(0);
        this.ABILITY_ROLLS.fill(0);
        this.UNKNOWN_ROLLS.fill(0);

        this.ATK_ROLLS_BLIND.fill(0);
        this.DMG_ROLLS_BLIND.fill(0);
        this.SAVES_ROLLS_BLIND.fill(0);
        this.SKILLS_ROLLS_BLIND.fill(0);
        this.ABILITY_ROLLS_BLIND.fill(0);
        this.UNKNOWN_ROLLS_BLIND.fill(0);
        
    }

    /**
     * Update and save streak info (Streaks are series of incrementing dice rolls)
     * @param {int} currentRoll - current die roll value
     * @param {bool} isBlind was the roll a blind roll or not
     */
    updateStreak(currentRoll, isBlind){
        //Streak Size will always be at least 1 unless its right after initalization
        if(this.STREAK_INIT + this.STREAK_SIZE != currentRoll && 
            this.STREAK_INIT - this.STREAK_SIZE != currentRoll
        ){
            //Streak resets
            this.STREAK_SIZE = 1;
            this.STREAK_INIT = currentRoll;
            this.STREAK_ISBLIND = isBlind;
            this.STREAK_DIR = 1;
        }else{
            //Streak Incramented
            this.STREAK_SIZE++;
            this.STREAK_ISBLIND = this.STREAK_ISBLIND || isBlind;
            //Check if longest streak and update if it is
            if(this.STREAK_SIZE > this.LONGEST_STREAK){
                this.LONGEST_STREAK = this.STREAK_SIZE;
                this.LONGEST_STREAK_INIT = this.STREAK_INIT;
            }
        }

        // increasing streak
        if(this.STREAK_DIR >= 0 && this.STREAK_INIT + this.STREAK_SIZE == currentRoll){
            this.STREAK_SIZE++;
            this.STREAK_ISBLIND = this.STREAK_ISBLIND || isBlind;
            //Check if longest streak and update if it is
            if(this.STREAK_SIZE > this.LONGEST_STREAK){
                this.LONGEST_STREAK = this.STREAK_SIZE;
                this.LONGEST_STREAK_INIT = this.STREAK_INIT;
            }
            this.STREAK_DIR = 1;

        // decreasing streak
        }else if(this.STREAK_DIR <= 0 && this.STREAK_INIT - this.STREAK_SIZE == currentRoll){
            this.STREAK_SIZE++;
            this.STREAK_ISBLIND = this.STREAK_ISBLIND || isBlind;
            //Check if longest streak and update if it is
            if(this.STREAK_SIZE > this.LONGEST_STREAK){
                this.LONGEST_STREAK = this.STREAK_SIZE;
                this.LONGEST_STREAK_INIT = this.STREAK_INIT;
            }
            this.STREAK_DIR = -1;

        // reset
        }else{
            //Streak resets
            this.STREAK_SIZE = 1;
            this.STREAK_INIT = currentRoll;
            this.STREAK_ISBLIND = isBlind;
            this.STREAK_DIR = 0;
        }
    }

    /**
     * Clear all die info
     */
    clearData(){
        this.TOTAL_ROLLS =   0;
        this.ROLLS.fill(0);
        this.BLIND_ROLLS.fill(0);

        this.ROLL_COUNTERS.fill(0);
        this.MEANS.fill(0);
        this.MEDIANS.fill(0);
        this.MODES.fill(0);

        this.ATK_ROLLS.fill(0);
        this.DMG_ROLLS.fill(0);
        this.SAVES_ROLLS.fill(0);
        this.SKILLS_ROLLS.fill(0);
        this.ABILITY_ROLLS.fill(0);
        this.UNKNOWN_ROLLS.fill(0);

        this.ATK_ROLLS_BLIND.fill(0);
        this.DMG_ROLLS_BLIND.fill(0);
        this.SAVES_ROLLS_BLIND.fill(0);
        this.SKILLS_ROLLS_BLIND.fill(0);
        this.ABILITY_ROLLS_BLIND.fill(0);
        this.UNKNOWN_ROLLS_BLIND.fill(0);

        this.STREAK_SIZE =   -1;
        this.STREAK_INIT =   -1;
        this.STREAK_ISBLIND = false;
        this.STREAK_DIR = 0;
        this.LONGEST_STREAK =        -1;
        this.LONGEST_STREAK_INIT =   -1;

        this.MEAN =      0.0;
        this.MEDIAN =    0;
        this.MODE =      0;
    }

    /**
     * Add a roll for whatever die we currently are
     * @param {DS_MSG_DIE_ROLL_INFO} msgDieInfo 
     */
    addRoll(msgDieInfo){
        // Guard for being in wrong die object & we got a valid roll value
        if(msgDieInfo.DieType != this.TYPE && msgDieInfo.RollValue <= this.MAX ){
            return;}

        let roll = msgDieInfo.RollValue;
        let isBlind = msgDieInfo.IsBlind;
        let rollType = msgDieInfo.RollType;

        this.TOTAL_ROLLS++;
        this.ROLL_COUNTERS[rollType] ++;
        this.updateStreak(roll, isBlind)

        var dontHideBlindRolls = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE);
        if(!isBlind || dontHideBlindRolls){
            this.ROLLS[roll-1] = this.ROLLS[roll-1]+1;
        }else{
            this.BLIND_ROLLS[roll-1] = this.BLIND_ROLLS[roll-1]+1; 
        }

        //Add roll to sub type array
        switch(rollType)
        {
            case DS_GLOBALS.ROLL_TYPE.ATK :
                if(isBlind){
                    this.ATK_ROLLS_BLIND[roll-1] = this.ATK_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.ATK_ROLLS[roll-1] = this.ATK_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.DMG :
                if(isBlind){
                    this.DMG_ROLLS_BLIND[roll-1] = this.DMG_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.DMG_ROLLS[roll-1] = this.DMG_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.SAVE :
                if(isBlind){
                    this.SAVES_ROLLS_BLIND[roll-1] = this.SAVES_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.SAVES_ROLLS[roll-1] = this.SAVES_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.SKILL :
                if(isBlind){
                    this.SKILLS_ROLLS_BLIND[roll-1] = this.SKILLS_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.SKILLS_ROLLS[roll-1] = this.SKILLS_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.ABILITY :
                if(isBlind){
                    this.ABILITY_ROLLS_BLIND[roll-1] = this.ABILITY_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.ABILITY_ROLLS[roll-1] = this.ABILITY_ROLLS[roll-1]+1;
                }
                break;
            case DS_GLOBALS.ROLL_TYPE.PERCEPTION:
            case DS_GLOBALS.ROLL_TYPE.INITIATIVE:
            case DS_GLOBALS.ROLL_TYPE.UNKNOWN :
                if(isBlind){
                    this.UNKNOWN_ROLLS_BLIND[roll-1] = this.UNKNOWN_ROLLS_BLIND[roll-1]+1;
                }else{
                    this.UNKNOWN_ROLLS[roll-1] = this.UNKNOWN_ROLLS[roll-1]+1;
                }
                break;
        }
    }

    /**
     * Calculate mean median and mode for the die and for each type of roll of that die
     */
    calculate(){
        this.MEAN = DICE_STATS_UTILS.getMean(this.ROLLS);
        this.MEDIAN = DICE_STATS_UTILS.getMedian(this.ROLLS);
        this.MODE = DICE_STATS_UTILS.getMode(this.ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.ATK] = DICE_STATS_UTILS.getMean(this.ATK_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.ATK] = DICE_STATS_UTILS.getMedian(this.ATK_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.ATK] = DICE_STATS_UTILS.getMode(this.ATK_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.DMG] = DICE_STATS_UTILS.getMean(this.DMG_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.DMG] = DICE_STATS_UTILS.getMedian(this.DMG_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.DMG] = DICE_STATS_UTILS.getMode(this.DMG_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.SAVE] = DICE_STATS_UTILS.getMean(this.SAVES_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.SAVE] = DICE_STATS_UTILS.getMedian(this.SAVES_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.SAVE] = DICE_STATS_UTILS.getMode(this.SAVES_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.SKILL] = DICE_STATS_UTILS.getMean(this.SKILLS_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.SKILL] = DICE_STATS_UTILS.getMedian(this.SKILLS_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.SKILL] = DICE_STATS_UTILS.getMode(this.SKILLS_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.ABILITY] = DICE_STATS_UTILS.getMean(this.ABILITY_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.ABILITY] = DICE_STATS_UTILS.getMedian(this.ABILITY_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.ABILITY] = DICE_STATS_UTILS.getMode(this.ABILITY_ROLLS);

        this.MEANS[DS_GLOBALS.ROLL_TYPE.UNKNOWN] = DICE_STATS_UTILS.getMean(this.UNKNOWN_ROLLS);
        this.MEDIANS[DS_GLOBALS.ROLL_TYPE.UNKNOWN] = DICE_STATS_UTILS.getMedian(this.UNKNOWN_ROLLS);
        this.MODES[DS_GLOBALS.ROLL_TYPE.UNKNOWN] = DICE_STATS_UTILS.getMode(this.UNKNOWN_ROLLS);
    }

    /**
     * method to take blind roll data and push it into normal roll data
     * Reset blind roll data once pushed
     */
    pushBlindRolls(){
        //Push All rolls ary
        for(let i=0; i<this.BLIND_ROLLS.length; i++){
            this.ROLLS[i] = this.ROLLS[i]+this.BLIND_ROLLS[i];
            this.BLIND_ROLLS[i]=0;
        }

        //Atk Rolls ary
        for(let i=0; i<this.ATK_ROLLS_BLIND.length; i++){
            this.ATK_ROLLS[i] = this.ATK_ROLLS[i]+this.ATK_ROLLS_BLIND[i];
            this.ATK_ROLLS_BLIND[i]=0;
        }

        //DMG Rolls ary
        for(let i=0; i<this.DMG_ROLLS_BLIND.length; i++){
            this.DMG_ROLLS[i] = this.DMG_ROLLS[i]+this.DMG_ROLLS_BLIND[i];
            this.DMG_ROLLS_BLIND[i]=0;
        }

        //SAVE Rolls ary
        for(let i=0; i<this.SAVES_ROLLS_BLIND.length; i++){
            this.SAVES_ROLLS[i] = this.SAVES_ROLLS[i]+this.SAVES_ROLLS_BLIND[i];
            this.SAVES_ROLLS_BLIND[i]=0;
        }

        //SKILL Rolls ary
        for(let i=0; i<this.SKILLS_ROLLS_BLIND.length; i++){
            this.SKILLS_ROLLS[i] = this.SKILLS_ROLLS[i]+this.SKILLS_ROLLS_BLIND[i];
            this.SKILLS_ROLLS_BLIND[i]=0;
        }

        //Ability Rolls array
        for(let i=0; i<this.ABILITY_ROLLS_BLIND.length; i++){
            this.ABILITY_ROLLS[i] = this.ABILITY_ROLLS[i]+this.ABILITY_ROLLS_BLIND[i];
            this.ABILITY_ROLLS_BLIND[i]=0;
        }

        //UNKNOWN / FLATCHECK Rolls ary
        for(let i=0; i<this.UNKNOWN_ROLLS_BLIND.length; i++){
            this.UNKNOWN_ROLLS[i] = this.UNKNOWN_ROLLS[i]+this.UNKNOWN_ROLLS_BLIND[i];
            this.UNKNOWN_ROLLS_BLIND[i]=0;
        }
    }

    /**
     * method to get total number of blind rolls
     * @returns {int} - total number of blind rolls for this die
     */
    getBlindRollsCount(){
        let tempRollCount = 0;
        for(let i=0; i<this.BLIND_ROLLS.length; i++){
            tempRollCount += this.BLIND_ROLLS[i];
        }

        return tempRollCount;
    }
}

export class DieInfo {
    type =          DS_GLOBALS.DIE_TYPE.UNKNOWN;    // {int}    Type of die <DIE_TYPE> varable
    max =           0;                              // {int}    MAX Value On Die , ex 6 for d6, 10 for d10, 12, 20

    total_rolls =   0;      // {int}    Total number of rolls made
    roll_counts = [];       // {int[]}  Size of die to track number of times each value was rolled on the die 

    mean =      0.0;    // {Double} Average
    median =    0;      // {int}    Middle accourances wise 
    mode =      0;      // {int}    Most Common

    streakDir =    0;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
    streakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
    streakInit =   -1;      // {int}    Starting value for streak

    longestStreakDir =    0;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
    longestStreakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
    longestStreakInit =   -1;      // {int}    Starting value for streak

    /**
     * @returns {DieInfo[]}
     */
    static createGenericDiceData(){
        dice = []
        for (dieType in DS_GLOBALS.DIE_TYPE){
            dice.append(DieInfo(dieType))
        }
    }

    static STREAK_DIRECTION= {
        UNKNOWN: 0,
        DECENDING: 1,
        ASCENDING: 2
    }

    static NUM_DIE_TYPES= 10;   //Size of {DIE_TYPE}
    static DIE_TYPE= {          //TYPES of DICE I TRACK
        UNKNOWN: 0,
        D2:     1,
        D3:     2,
        D4:     3,
        D5:     4,
        D6:     5,
        D7:     6,
        D8:     7,
        D9:     8,
        D10:    9,
        D12:    10,
        D20:    11,
        D50:    12,
        D100:   13,
    };

    static getDieMax(die_type){
        switch(die_type){
            case this.DIE_TYPE.UNKNOWN: return 0;
            case this.DIE_TYPE.D2: return 2;
            case this.DIE_TYPE.D3: return 3;
            case this.DIE_TYPE.D4: return 4;
            case this.DIE_TYPE.D5: return 5;
            case this.DIE_TYPE.D6: return 6;
            case this.DIE_TYPE.D7: return 7;
            case this.DIE_TYPE.D8: return 8;
            case this.DIE_TYPE.D9: return 9;
            case this.DIE_TYPE.D10: return 10;
            case this.DIE_TYPE.D12: return 12;
            case this.DIE_TYPE.D20: return 20;
            case this.DIE_TYPE.D50: return 50;
            case this.DIE_TYPE.D100: return 100;
        }
    }

    /**
     * Constructor should be private and only called by the static fn above
     */
    constructor(die_type){
        type =          die_type;                               // {int}    Type of die <DIE_TYPE> varable
        max =           DS_GLOBALS.getDieMax(die_type);         // {int}    MAX Value On Die , ex 6 for d6, 10 for d10, 12, 20

        totalRolls =   0;      // {int}    Total number of rolls made
        rollCounts = new Array(max)

        mean =      0.0;    // {Double} Average
        median =    0;      // {int}    Middle accourances wise 
        mode =      0;      // {int}    Most Common

        streakDir =    0;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
        streakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
        streakInit =   -1;      // {int}    Starting value for streak

        longestStreakDir =    0;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
        longestStreakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
        longestStreakInit =   -1;      // {int}    Starting value for streak
    }

    clear(){
        // Dont change die type and die max on clear
        // type = DieInfo.DIE_TYPE.UNKNOWN;
        // max = 0;

        totalRolls =   0;      // {int}    Total number of rolls made
        rollCounts.fill(0);       // {int[]}  Size of die to track number of times each value was rolled on the die 

        mean =      0.0;    // {Double} Average
        median =    0;      // {int}    Middle accourances wise 
        mode =      0;      // {int}    Most Common

        streakDir =    0;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
        streakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
        streakInit =   -1;      // {int}    Starting value for streak

        longestStreakDir =    0;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
        longestStreakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
        longestStreakInit =   -1;      // {int}    Starting value for streak
    }

    /**
     * 
     * @param {DieInfo} die_info 
     */
    addDieInfo(die_info){
        if (die_info.type == this.type && die_info.max == this.max){

            this.total_rolls +=   die_info.total_rolls;
            for (roll_value=0; roll_value<this.max; roll_value++){
                this.roll_counts[roll_value] += die_info.roll_counts[roll_value]
            }

            // Only need to calc mean median and mode when displaying data. Dont recalc here
            // mean =      0.0;    // {Double} Average
            // median =    0;      // {int}    Middle accourances wise 
            // mode =      0;      // {int}    Most Common

            // Take streak if its longer than current streak
            if (die_info.streakSize > this.streakSize){
                this.streakDir = die_info.streakDir;
                this.streakInit = die_info.streakInit;
                this.streakSize = die_info.streakSize;
            }

            // Take longest streak info if its longer than current
            if (die_info.longestStreakSize > this.longestStreakSize){
                this.longestStreakSize = die_info.longestStreakSize;
                this.longestStreakSize = die_info.longestStreakSize;
                this.longestStreakSize = die_info.longestStreakSize;
            }
        }
    }

    addNewRoll(roll_value){
        // ---- Add roll to array of roll values ----
        this.roll_counts[roll_value]++;

        // ---- Check Streaks ----
        // If first streak then always save
        if (this.streakSize < 1){
            this.streakSize = 1;
            this.streakInit = roll_value;
            this.streakDir = DieInfo.STREAK_DIR.UNKNOWN
        }else{
            // See if roll is next expected value
            if ( (this.streakDir = DieInfo.STREAK_DIR.UNKNOWN | this.streakDir == DieInfo.STREAK_DIR.ASCENDING) && roll_value == this.streakInit+this.streakSize){
                this.streakDir = DieInfo.STREAK_DIR.ASCENDING
                this.streakSize++

            }else if( (this.streakDir = DieInfo.STREAK_DIR.UNKNOWN | this.streakDir == DieInfo.STREAK_DIR.DECENDING) && roll_value == this.streakInit-this.streakSize){
                this.streakDir = DieInfo.STREAK_DIR.DECENDING
                this.streakSize++
            }else{
                // Set current value as begining of streak
                this.streakDir = DieInfo.STREAK_DIR.UNKNOWN
                this.streakSize = 1
                this.streakInit = roll_value
            }

            // If streak is longest, save to longest streak
            if (this.streakSize > this.longestStreakSize){
                this.longestStreakDir = this.streakDir
                this.longestStreakInit = this.streakInit
                this.longestStreakSize = this.streakSize
            }
        }
    }

    // ====== Calculations with Local Data ======
    calculateTotalRolls(){
        total = 0;
        for (value in this.rollCounts){
            total += value;
        }
        return total
    }

    // Calculate average
    calculateMean(){
        if(!RollsAry || RollsAry.length == 0 )
        {return 0}

        var numberOfRolls=0;
        var sum = 0;

        //For every elm in array
        //Sum = Arrayindex+1(die Roll) * array value(number of times value was rolled)
        for(let i=0; i<RollsAry.length; i++){
            numberOfRolls += RollsAry[i];
            sum = sum+((i+1)*RollsAry[i]);
        }

        if(numberOfRolls>0)
        {
            let float = sum/numberOfRolls;
            return float.toFixed(2);
        }
        return 0;
    }

    // Calculate middle number (Equal number rolled higher and lower than this value)
    calculateMedian(){
        if(!RollsAry || RollsAry.length == 0 )
        {return 0}

        let totalRolls = 0;
        for(let i=0; i<RollsAry.length; i++){
            totalRolls += RollsAry[i];
        }

        if(totalRolls > 1){
            //Get Middle roll number
            let middleIndex = 0;
            if(totalRolls%2 === 0){
                //Even Number of rolls
                middleIndex = Math.floor(totalRolls/2);
            }else{
                //Odd Number of rolls
                middleIndex = Math.floor(totalRolls/2)+1;
            }

            for(let i=0; i<RollsAry.length; i++){
                var indxlValue = RollsAry[i]; //Number of that roll (i+1) is die number
                while(indxlValue!=0 && middleIndex!=0){
                    middleIndex--;
                    indxlValue--;
                }

                if(middleIndex===0){
                    return i+1; //index+1 = die number
                }
            }

        }else if(totalRolls === 1){
            for(let i=0; i<RollsAry.length; i++){
                if(RollsAry[i] === 1){
                    return i+1;
                }
            }
        }
        return 0;
    }

    // Calculate most common number
    calculateMode(){
        if(!RollsAry || RollsAry.length == 0 )
        {return 0}
        
        var indexOfMax = 0;
        var maxValue = 0;

        for(let i=0; i<RollsAry.length; i++){
            if(RollsAry[i] > maxValue){
                indexOfMax = i;
                maxValue = RollsAry[i];
            }
        }

        return indexOfMax+1;
    }

}