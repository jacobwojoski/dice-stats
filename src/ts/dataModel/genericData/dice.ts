import { NUM_DIE_TYPES, DIE_TYPE, STREAK_DIRECTION, Utils } from "../../constants";
import { IntChartData } from "../displayData/chartData";
/**
 * NAME: DieInfo
 * DESC: 
 *  System Agnostic storage for dice info
 *  - Assume Each Die is seperate for every other roll for generic data
 *  - Die rolls are stored in array thats the size of die
 *  - Allows static size of storage and just increment position in array for number of rolls
 * EX: 
 *  D20 roll was 16 -> this.rolls[16]++;
 */
export class DieInfo {
    name: string =      '';                 // {string} Name of Die EX: D2, D6, etc 
    type: DIE_TYPE =    DIE_TYPE.UNKNOWN;   // {int}    Type of die <DIE_TYPE> varable
    max: number =       0;                  // {int}    MAX Value On Die , ex 6 for d6, 10 for d10, 12, 20

    lastRolledValue = -1;                   // {int}    Last rolled value on Die     (Needed for streaks)
    startingStreak = []                     // {int}    Why? For d10 EX: We parced the follwing rolls from  the incoming message it had multiple rolls:  
                                            //         EX: Imcoming Rolls=[4,5, 9,2, 7,8,9]. 
                                            //     The saved longest streak from the message would be 7,8,9. But if the data model had an ongoing streak of  
                                            //     [1,2,3] The longest streak would actually be 1,2,3,4,5. So we need to Save the initial streak info as well 
                                            //     as the longest streaks to copare with datamodel when a Die Object is getting added in.

    totalRolls:number =     0;              // {int}    Total number of rolls made
    rolls: number[] =       [];             // {int[] 1d array}  Size of this.max to track number of times each value was rolled on the die 

    mean: number =      0.0;                // {Double} Average
    expMean:number =    0.0;                // {Double} Expected Average
    median: number =    0;                  // {int}    Middle accourances wise 
    mode: number =      0;                  // {int}    Most Common

    streakDir: STREAK_DIRECTION =  STREAK_DIRECTION.UNKNOWN;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
    streakSize: number =   -1;              // {int}    Number of incrementing or decrementing rolls
    streakInit: number =   -1;              // {int}    Starting value for streak

    longestStreakDir: STREAK_DIRECTION =    STREAK_DIRECTION.UNKNOWN;       // {DS_GLOBALS.STREAK_DIRECTION} 0=UNKNOWN, 1 = desending, 2 = ascending
    longestStreakSize: number =   -1;       // {int}    Number of incrementing or decrementing rolls
    longestStreakInit: number =   -1;       // {int}    Starting value for streak

    streakString: string = '';
    isDisplayed: boolean = true;         // {Bool} Is this dice info displayed or hidden in the player stats application?
    
    /**
     * Constructor should be private and only called by the static fn above
     */
    constructor(die_type: DIE_TYPE){
        this.type =          die_type;                          // {int}    Type of die <DIE_TYPE> varable
        this.name =          Utils.getDieName(die_type)         // {string} Name for the die
        this.max =           Utils.getDieMax(die_type);         // {int}    MAX Value On Die , ex 6 for d6, 10 for d10, 12, 20
        this.expMean =       Utils.getDieAverage(die_type)      // {Double} Expected average of die EX: 3.5 for a d6
        this.rolls = new Array(this.max+1)                      // Add 1 to include 0 as option and not req index adjustment from roll value

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
    addDieInfo(die_info:DieInfo, hasStreakInfo=false, hasSingleRoll = false){
        // Adding a singled rolled value to storage
        if (hasSingleRoll && die_info.type == this.type && die_info.lastRolledValue > -1 && die_info.lastRolledValue <= this.max){
            this.addNewRoll(die_info.lastRolledValue)
        // Adding a die with multiple rolls to storage 
        }else if (die_info.type == this.type && die_info.max == this.max){

            // -- Add roll values --
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
        }else{
            Utils.dsLogError("Failed to add "+die_info+" to "+this)
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

    calculateStreakString(){
        let streakAsStr = ''
        if(this.longestStreakSize <= 1){
            streakAsStr = 'No Streak Created'
        }else if(this.longestStreakDir == STREAK_DIRECTION.ASCENDING){
            streakAsStr = String(this.longestStreakInit);
            for (let i=1; i<this.longestStreakSize; i++){
                streakAsStr + ','+String(this.longestStreakInit+i)
            }
        }else{ // Decending streak
            streakAsStr = String(this.longestStreakInit);
            for (let i=1; i<this.longestStreakSize; i++){
                streakAsStr + ','+String(this.longestStreakInit-i)
            }
        }
        this.streakString = streakAsStr;
    }

    public calculateAll(){
        this.calculateMean();
        this.calculateMedian();
        this.calculateMode();
        this.calculateStreakString();
        this.calculateTotalRolls();
    }

    public static createDieInfoAry(){
        var diceAry = new Array(NUM_DIE_TYPES);
        for (var die_type=0; die_type<NUM_DIE_TYPES; die_type++){
            diceAry[die_type] = new DieInfo(die_type)
        }
        return diceAry;
    }

    public getChartData(): IntChartData {
        let chartJsDataObj:any = {
            type: 'bar',
            datasets: [
                {
                    label: 'Die Result Roll Count',
                    data: [, ...this.rolls],                         // Skip first element as its a 0 and there are no 0's rolled
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ],
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: '',
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    }
                }
            }
        }

        switch (this.type){
            case DIE_TYPE.D2:
                chartJsDataObj.labels = ['1','2'];
                chartJsDataObj.options.plugins.title.text = 'D-2 Rolls';
                break;
            case DIE_TYPE.D3:
                chartJsDataObj.labels = ['1','2','3']; 
                chartJsDataObj.options.plugins.title.text = 'D-3 Rolls';
                break; 
            case DIE_TYPE.D4:
                chartJsDataObj.labels = ['1','2','3','4']; 
                chartJsDataObj.options.plugins.title.text = 'D-4 Rolls';
                break; 
            case DIE_TYPE.D6:
                chartJsDataObj.labels = ['1','2','3','4','5','6']; 
                chartJsDataObj.options.plugins.title.text = 'D-6 Rolls';
                break;
            case DIE_TYPE.D8:
                chartJsDataObj.labels = ['1','2','3','4','5','6','7','8']; 
                chartJsDataObj.options.plugins.title.text = 'D-8 Rolls';
                break;
            case DIE_TYPE.D10:
                chartJsDataObj.labels = ['1','2','3','4','5','6','7','8','9','10']; 
                chartJsDataObj.options.plugins.title.text = 'D-10 Rolls';
                break;
            case DIE_TYPE.D12:
                chartJsDataObj.labels = ['1','2','3','4','5','6','7','8','9','10','11','12']; 
                chartJsDataObj.options.plugins.title.text = 'D-12 Rolls';
                break;
            case DIE_TYPE.D20:
                chartJsDataObj.labels = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']; 
                chartJsDataObj.options.plugins.title.text = 'D-20 Rolls';
                break;
            case DIE_TYPE.D50:
                chartJsDataObj.labels = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25',
                                      '26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50'];
                chartJsDataObj.options.plugins.title.text = 'D-50 Rolls';
                break;
            case DIE_TYPE.D100:
                chartJsDataObj.labels = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25',
                                      '26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50',
                                      '51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75',
                                      '76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'];
                chartJsDataObj.options.plugins.title.text = 'D-100 Rolls';
                break;
            case DIE_TYPE.UNKNOWN:
                chartJsDataObj.labels = ['UNKOWN']
            default:
                chartJsDataObj.labels = ['UNKOWN']
        }

        this.calculateAll()

        let returnValue = new IntChartData(chartJsDataObj.options.plugins.title.text, chartJsDataObj, this.totalRolls, this.mean, this.expMean, this.median, this.mode, this.streakString, this.isDisplayed)
        return returnValue
    }
    
}
