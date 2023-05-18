

class DICE_STATS_UTILS {
    //Makes an array of all the rolls from every play for a specific die type

    /**
     * Build hook hook that waits for A DsN msg then return
     * This funtion returns after Hook is made so this code returns and now were 
     * waiting at the end of promise fn to get our resolve
     * @param {*} targetMessageId 
     * @returns 
     */
    static async waitFor3DDiceMessage(targetMessageId) {
        function buildHook(resolve) {
            Hooks.once('diceSoNiceRollComplete', (messageId) => {
                //This code ONLY gets called if a DsN roll completed (async code)
                //Is the DsNmsg found, the one we were waiting for?
                if (targetMessageId === messageId){
                    //got msg we wanted so we can return now
                    resolve(true);
                } else {
                    //We got a msg but was wrong one, Need to build a new hook to wait for 
                    //a new msg
                    buildHook(resolve);
                }
            });
        }
        //Promise means the following is async dont return untill we get a result
        return new Promise((resolve, reject) => {
            
            //If 3d Dice is installed build hook (The async thing)
            if(game.dice3d){
                buildHook(resolve);
            } else {
                resolve(true);
            }
        });   
    }

    /**
     * Mode = Most common
     * Find index that has the largest value 
     * result = index+1
     * @param {int[]} RollsAry 
     * @returns 
     */
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

    /**
     * Average
     * Becasue array holds number of each roll instead of each roll value math is more anoying
     * @param {int[]} RollsAry 
     * @returns {float}
     */
    static getMean(RollsAry){
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

    /**
     * Middle number
     * Find Total Number of rolls/2 ()
     * Go through array subtracting each roll untill we find our middle number
     * @param {int[]} RollsAry 
     * @returns {int}
     */
    static getMedian(RollsAry){
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
}