import { NUM_DIE_TYPES, DIE_TYPE, STREAK_DIRECTION, Utils } from "../../constants";
/**
 * NAME: DieInfo
 * DESC: 
 *  System Agnostic storage for dice info
 *  - Die rolls are stored in array thats the size of die
 *  - Allows static size of storage and just increment position in array for number of rolls
 * EX: 
 *  D20 roll was 16 -> Rolls[(16-1)]++;
 */
export class DieInfo {
    type: DIE_TYPE =    DIE_TYPE.UNKNOWN;   // {int}    Type of die <DIE_TYPE> varable
    max: number =       0;                  // {int}    MAX Value On Die , ex 6 for d6, 10 for d10, 12, 20

    totalRolls:number =     0;              // {int}    Total number of rolls made
    rolls: number[] =       [];             // {int[]}  Size of die to track number of times each value was rolled on the die 

    mean:number =       0.0;                // {Double} Average
    median: number =    0;                  // {int}    Middle accourances wise 
    mode: number =      0;                  // {int}    Most Common

    streakDir: STREAK_DIRECTION =  STREAK_DIRECTION.UNKNOWN;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
    streakSize: number =   -1;      // {int}    Number of incrementing or decrementing rolls
    streakInit: number =   -1;      // {int}    Starting value for streak

    longestStreakDir: STREAK_DIRECTION =    STREAK_DIRECTION.UNKNOWN;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
    longestStreakSize: number =   -1;      // {int}    Number of incrementing or decrementing rolls
    longestStreakInit: number =   -1;      // {int}    Starting value for streak

    /**
     * Constructor should be private and only called by the static fn above
     */
    constructor(die_type: DIE_TYPE){
        this.type =          die_type;                               // {int}    Type of die <DIE_TYPE> varable
        this.max =           Utils.getDieMax(die_type);         // {int}    MAX Value On Die , ex 6 for d6, 10 for d10, 12, 20
        this.rolls = new Array(this.max)

        this.clear()
    }

    /**
     * DESC:
     *  Reset stored values
     *  - Don't rest max die result and die type
     */
    clear(){
        // Dont change die type and die max on clear
        // type = DieInfo.DIE_TYPE.UNKNOWN;
        // max = 0;

        this.totalRolls =   0;      // {int}    Total number of rolls made
        this.rolls.fill(0);       // {int[]}  Size of die to track number of times each value was rolled on the die 

        this.mean =      0.0;    // {Double} Average
        this.median =    0;      // {int}    Middle accourances wise 
        this.mode =      0;      // {int}    Most Common

        this.streakDir =    STREAK_DIRECTION.UNKNOWN;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
        this.streakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
        this.streakInit =   -1;      // {int}    Starting value for streak

        this.longestStreakDir =    STREAK_DIRECTION.UNKNOWN;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
        this.longestStreakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
        this.longestStreakInit =   -1;      // {int}    Starting value for streak
    }

    /**
     * DESC: Add an existing Die info object into this one.
     *  Adds all roll values and overrides streaks if they're bigger than saved streaks
     *  Does not recalculate math funtions.
     * @param {DieInfo} die_info 
     */
    addDieInfo(die_info:DieInfo, hasStreakInfo=false){
        if (die_info.type == this.type && die_info.max == this.max){

            // -- Add roll values --
            this.totalRolls +=   die_info.totalRolls;
            for (var roll_value=0; roll_value<this.max; roll_value++){
                this.rolls[roll_value] += die_info.rolls[roll_value]
            }

            // Only need to calc mean median and mode when displaying data. Dont recalc here
            // mean =      0.0;    // {Double} Average
            // median =    0;      // {int}    Middle accourances wise 
            // mode =      0;      // {int}    Most Common

            // -- Add Streak info --
            if (hasStreakInfo){
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
    }

    /**
     * DESC: Add raw roll value
     * @param {int} roll_value 
     */
    addNewRoll(roll_value:number){
        // ---- Add roll to array of roll values ----
        this.rolls[roll_value]++;

        // ---- Check Streaks ----
        // If first streak then always save
        if (this.streakSize < 1){
            this.streakSize = 1;
            this.streakInit = roll_value;
            this.streakDir = STREAK_DIRECTION.UNKNOWN
        }else{
            // See if roll is next expected value
            if ( (this.streakDir == STREAK_DIRECTION.UNKNOWN || this.streakDir == STREAK_DIRECTION.ASCENDING) && roll_value == this.streakInit+this.streakSize){
                this.streakDir = STREAK_DIRECTION.ASCENDING
                this.streakSize++

            }else if( (this.streakDir == STREAK_DIRECTION.UNKNOWN || this.streakDir == STREAK_DIRECTION.DESCENDING) && roll_value == this.streakInit-this.streakSize){
                this.streakDir = STREAK_DIRECTION.DESCENDING
                this.streakSize++
            }else{
                // Set current value as begining of streak
                this.streakDir = STREAK_DIRECTION.UNKNOWN
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
        var total = 0;
        for (let value of this.rolls){
            total += value;
        }
        return total
    }

    // Calculate average
    calculateMean(){
        if(!this.rolls || this.rolls.length == 0 )
        {return 0}

        var numberOfRolls=0;
        var sum = 0;

        //For every elm in array
        //Sum = Arrayindex+1(die Roll) * array value(number of times value was rolled)
        for(let i=0; i<this.rolls.length; i++){
            numberOfRolls += this.rolls[i];
            sum = sum+((i+1)*this.rolls[i]);
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
        if(!this.rolls || this.rolls.length == 0 )
        {return 0}

        let totalRolls = 0;
        for(let i=0; i<this.rolls.length; i++){
            totalRolls += this.rolls[i];
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

            for(let i=0; i<this.rolls.length; i++){
                var indxlValue = this.rolls[i]; //Number of that roll (i+1) is die number
                while(indxlValue!=0 && middleIndex!=0){
                    middleIndex--;
                    indxlValue--;
                }

                if(middleIndex===0){
                    return i+1; //index+1 = die number
                }
            }

        }else if(totalRolls === 1){
            for(let i=0; i<this.rolls.length; i++){
                if(this.rolls[i] === 1){
                    return i+1;
                }
            }
        }
        return 0;
    }

    // Calculate most common number
    calculateMode(){
        if(!this.rolls || this.rolls.length == 0 )
        {return 0}
        
        var indexOfMax = 0;
        var maxValue = 0;

        for(let i=0; i<this.rolls.length; i++){
            if(this.rolls[i] > maxValue){
                indexOfMax = i;
                maxValue = this.rolls[i];
            }
        }

        return indexOfMax+1;
    }

    public static createDieInfoAry(){
        var diceAry = new Array(NUM_DIE_TYPES);
        for (var die_type=0; die_type<NUM_DIE_TYPES; die_type++){
            diceAry[die_type] = new DieInfo(die_type)
        }
        return diceAry;
    }
}