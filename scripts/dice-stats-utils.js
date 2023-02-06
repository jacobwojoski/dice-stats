//Convert Streak data to string to be printed on form
Handlebars.registerHelper('getPlayerStreak', function (streakData) {
    //Streakdata Should be 
        //StreakData.StartPos
        //StreakData.Length
});

class DICE_STATS_UTILS {
    //Makes an array of all the rolls from every play for a specific die type
    static makeCombinedArray(players,dieType){
        outputDieInfo = new DIE_INFO(dieType);

        //For every player get Die rolls
        for (let i = 0; i < players.length; i++) {
            info = players[i].getDieInfo(dieType)?.ROLLS;
            

            for (let j = 0; j < array.length; j++) {
                outputDieInfo.ROLLS[j] = tempAry[j]+info[j];
                
            }
        }
        return outputDieInfo;
    }

    //Build hook hook that waits for A DsN msg then return
    //This funtion returns after Hook is made so this code returns and now were 
    //waiting at the end of promise fn to get our resolve
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

    //DATA = PLAYERS[], dietpe=DIE_TYPE
    static getGlobalDieStats(players, dietype){
        combinedAry = [];

        output = {
            allUserMean: 0,
            allUserMedian: 0,
            allUserMode: 0,
            totalUserMaxRolls: 0,
            totalUserMinRolls: 0,
            totalNumEachRoll:        [],

            mostMaxRollsName:   '',
            numMaxRolls:        0,

            mostMinRollsName:       '',
            numMinRolls:        0,
        }

        return output
    }
}