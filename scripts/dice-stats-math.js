//Math Class, Used for all math stuff we need
class ROLL_MATH {

    //Most common
    //Find index that has the largest value 
    //result = index+1
    static getMode(RollsAry){
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

    //Average
    //Becasue array holds number of each roll instead of each roll value math is more anoying
    static getMean(RollsAry){
        var numberOfRolls=0;
        var sum = 0;

        //For every elm in array
        //Sum = Arrayindex+1(die Roll) * array value(number of times value was rolled)
        for(let i=0; i<RollsAry.length; i++){
            numberOfRolls += RollsAry[i];
            sum = sum+((i+1)*RollsAry[i]);
        }

        return Math.round(sum/numberOfRolls);
    }

    //Middle number
    //Make array of every number we have
    //Find middle index
    //Return value at index
    static getMedian(RollsAry){
        tempAry = [];

        for(let i=0; i<RollsAry.length; i++){
            var value = RollsAry[i]; //Number of that roll (i+1)
            while(value!=0){
                tempAry.push(i+1);
                value--;
            }
        }

        var middleIndex = tempAry.length/2;

        if(tempAry.length>=middleIndex){
            return tempAry[i];
        }else{
            return 0
        }
    }
}