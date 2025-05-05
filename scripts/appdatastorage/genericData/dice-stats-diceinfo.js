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
    type =          DS_GLOBALS.DIE_TYPE.UNKNOWN;    // {int}    Type of die <DIE_TYPE> varable
    max =           0;                              // {int}    MAX Value On Die , ex 6 for d6, 10 for d10, 12, 20

    totalRolls =   0;       // {int}    Total number of rolls made
    rolls = [];             // {int[]}  Size of die to track number of times each value was rolled on the die 

    mean =      0.0;    // {Double} Average
    median =    0;      // {int}    Middle accourances wise 
    mode =      0;      // {int}    Most Common

    streakDir =    0;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
    streakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
    streakInit =   -1;      // {int}    Starting value for streak

    longestStreakDir =    0;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
    longestStreakSize =   -1;      // {int}    Number of incrementing or decrementing rolls
    longestStreakInit =   -1;      // {int}    Starting value for streak

    // ---- ENUMS ----
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
        rolls = new Array(max)

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
     * DESC:
     *  Reset stored values
     *  - Don't rest max die result and die type
     */
    clear(){
        // Dont change die type and die max on clear
        // type = DieInfo.DIE_TYPE.UNKNOWN;
        // max = 0;

        totalRolls =   0;      // {int}    Total number of rolls made
        rolls.fill(0);       // {int[]}  Size of die to track number of times each value was rolled on the die 

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
     * DESC: Add an existing Die info object into this one.
     *  Adds all roll values and overrides streaks if they're bigger than saved streaks
     *  Does not recalculate math funtions.
     * @param {DieInfo} die_info 
     */
    addDieInfo(die_info, hasStreakInfo=false){
        if (die_info.type == this.type && die_info.max == this.max){

            // -- Add roll values --
            this.totalRolls +=   die_info.totalRolls;
            for (roll_value=0; roll_value<this.max; roll_value++){
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
        for (let value of this.rolls){
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