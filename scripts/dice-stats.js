//----GLOBAL CONST VALUES----
CLASSOBJ = null;

//Enum of die types,
const DIE_TYPE = {
    D2:     0,
    D3:     1,
    D4:     2,
    D6:     3,
    D8:     4,
    D10:    5,
    D12:    6,
    D20:    7,
    D100:   8
}

//use array as way to convert DIE_TYPE enum to Max value of each die
const DIE_MAX = [2,3,4,6,8,10,12,20,100];

MAX_TO_DIE = new Map();
MAX_TO_DIE.set(2,   DIE_TYPE.D2);
MAX_TO_DIE.set(3,   DIE_TYPE.D3);
MAX_TO_DIE.set(4,   DIE_TYPE.D4);
MAX_TO_DIE.set(6,   DIE_TYPE.D6);
MAX_TO_DIE.set(8,   DIE_TYPE.D8);
MAX_TO_DIE.set(10,  DIE_TYPE.D10);
MAX_TO_DIE.set(12,  DIE_TYPE.D12);
MAX_TO_DIE.set(20,  DIE_TYPE.D20);
MAX_TO_DIE.set(100, DIE_TYPE.D100);



//---- END GLOBAL CONST ----

//Class that defines a player. Players are all connected people to server including gm
//Player has Die Info for each die type they roll & some other misc data
class PLAYER {
    PLAYER_DICE = new Array(DIE_TYPE.length); //Aray of type<DIE_INFO>
    USERNAME = '';
    USERID = 0;
    GM = false;

    constructor(){
        this.USERID = game.user.id;
        this.USERNAME = game.user.name;
        for (let i = 0; i < array.length; i++) {
            this.PLAYER_DICE[i] = new DIE_INFO(DIE_MAX[i]);
        }
    }

    getRolls(dieType){
        return this.PLAYER_DICE[dieType].ROLLS;
    }

    getDieInfo(dieType){
        return this.PLAYER_DICE[dieType];
    }

    saveRoll(isBlind, rollVal, dieType){
        this.PLAYER_DICE[dieType].addRoll(rollVal,isBlind)
    }

}


//Storage Class for Each Die
//Die rolls are stored in array thats size of the die type 
//That way can just incrament each position rather then store array of increasing size
//Ex, D20 roll was 16 -> Rolls[(16-1)]++;
class DIE_INFO {
    TYPE =          0;  //Type of die <DIE_TYPE> varable
    ROLLS =         []; //Array size of die 
    RECENTROLL =    -1;
    STREAK_SIZE =   -1;
    STREAK_INIT =   -1;
    STREAK_ISBLIND = false;
    LONGEST_STREAK =        -1;
    LONGEST_STREAK_INIT =   -1;

    MEAN =      0;
    MEDIAN =    0;
    MODE =      0;

    //Class Constructor function
    //Variable passed in should be max value
    constructor(dieMax = 100){
        this.TYPE = MAX_TO_TYPE.get(dieMax);
        this.RECENTROLL =  -1;
        this.STREAK_SIZE = -1;
        this.STREAK_INIT = -1;
        this.LONGEST_STREAK = 0;
        this.LONGEST_STREAK_INIT = 0;

        this.ROLLS = new Array(dieMax);
        this.ROLLS.fill(0);
    }

    //Streak count how many incramenting die Rolls are made 1234, 456789 ect. 
    //Should prolly only be implemented for d20's but can be implented for others
    //A bit less interesting for smaller die but could be cool to see if someone got a 1,2,3,4 or a 1,2,3,4,5,6
    updateStreak(currentRoll, isBlind){
        //Streak Size will always be at least 1 unless its right after initalization
        if(this.STREAK_INIT + this.STREAK_SIZE != currentRoll){
            //Streak resets
            this.STREAK_SIZE = 1;
            this.STREAK_INIT = currentRoll;
            this.STREAK_ISBLIND = isBlind;
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
    }

    addRoll(roll, isBlind){
        this.RECENTROLL = roll;
        this.ROLLS[roll-1] = this.ROLLS[roll-1]++;
        this.updateStreak(roll, isBlind)

        //Return number of those rolls
        return this.ROLLS[roll-1];
    }

    calculate(){
        MEAN = ROLL_MATH.getMean(this.ROLLS);
        MEDIAN = ROLL_MATH.getMedian(this.ROLLS);
        MODE = ROLL_MATH.getMode(this.ROLLS);
    }
}


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
    }
}


class RollTracker {
    ID = 'roll-tracker'
    ALLPLAYERDATA = new Map();  //Map of all Players <PlayerID, PLAYER> 
    IMGM = false;
    SYSTEM;

    TEMPLATES = {
        ROLLTRACK: `modules/${this.ID}/templates/${this.ID}.hbs`,
        CHATMSG: `modules/${this.ID}/templates/${this.ID}-chat.hbs`,
        COMPARISONCARD: `modules/${this.ID}/templates/${this.ID}-comparison-card.hbs`
    }

    SETTINGS = {
        GM_SEE_PLAYERS: 'gm_see_players',
        PLAYERS_SEE_PLAYERS: 'players_see_players',
        ROLL_STORAGE: 'roll_storage',
        COUNT_HIDDEN: 'count_hidden',
        STREAK_MESSAGE_HIDDEN: 'streak_message_hidden',
        STREAK_BEHAVIOUR: 'streak_behaviour',
        DND5E: {
            RESTRICT_COUNTED_ROLLS: 'restrict_counted_rolls'
        },
        PF2E: {
            RESTRICT_COUNTED_ROLLS: 'restrict_counted_rolls'
        }
    }
    
    constructor(){
        //user.id (game.userId === user.id -> user.isSelf
        if(game.user.isGM){
            game.users.forEach(user => {
                //Add Everyone including myself to map
                this.ALLPLAYERDATA.set(user.id,new PLAYER(user.id)) 
            });
        }else{
            //Add only myself to map
            this.ALLPLAYERDATA.set(game.user.id,new PLAYER(game.user.id))
        }


        //Get Settings and Systtem Info
        // Store the current system, for settings purposes. It has to be set here, and not in the parent
        // class, because the system needs to initialize on foundry boot up before we can get its id
        this.SYSTEM = `${game.system.id}`

        // A setting to toggle whether the GM can see the icon allowing them access to player roll
        // data or not
        game.settings.register(this.ID, this.SETTINGS.GM_SEE_PLAYERS, {
            name: `ROLL-TRACKER.settings.${this.SETTINGS.GM_SEE_PLAYERS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${this.SETTINGS.GM_SEE_PLAYERS}.Hint`,
            onChange: () => ui.players.render()
        })

        // A setting to determine how many rolls should be stored at any one time
        game.settings.register(this.ID, this.SETTINGS.ROLL_STORAGE, {
            name: `ROLL-TRACKER.settings.${this.SETTINGS.ROLL_STORAGE}.Name`,
            default: 50,
            type: Number,
            range: {
                min: 10,
                max: 500,
                step: 10
            },
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${this.SETTINGS.ROLL_STORAGE}.Hint`,
        })

        // A setting to determine whether players can see their own tracked rolls
        game.settings.register(this.ID, this.SETTINGS.PLAYERS_SEE_PLAYERS, {
            name: `ROLL-TRACKER.settings.${this.SETTINGS.PLAYERS_SEE_PLAYERS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${this.SETTINGS.PLAYERS_SEE_PLAYERS}.Hint`,
            onChange: () => ui.players.render()
        })

        // A setting to determine whether blind GM rolls that PLAYERS make are tracked
        // Blind GM rolls that GMs make are always tracked
        game.settings.register(this.ID, this.SETTINGS.COUNT_HIDDEN, {
            name: `ROLL-TRACKER.settings.${this.SETTINGS.COUNT_HIDDEN}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${this.SETTINGS.COUNT_HIDDEN}.Hint`,
        })

        game.settings.register(this.ID, this.SETTINGS.STREAK_BEHAVIOUR, {
            name: `ROLL-TRACKER.settings.${this.SETTINGS.STREAK_BEHAVIOUR}.Name`,
            default: true,
            type: String,
            scope: 'world',
            config: true,
            // hint: `ROLL-TRACKER.settings.${this.SETTINGS.STREAK_BEHAVIOUR}.Hint`,
            choices: {
                hidden: game.i18n.localize(`ROLL-TRACKER.settings.${this.SETTINGS.STREAK_BEHAVIOUR}.hidden`),
                disable: game.i18n.localize(`ROLL-TRACKER.settings.${this.SETTINGS.STREAK_BEHAVIOUR}.disable`),
                shown: game.i18n.localize(`ROLL-TRACKER.settings.${this.SETTINGS.STREAK_BEHAVIOUR}.shown`)
            }
        })

        // System specific settings
        switch(this.SYSTEM) {
            case 'dnd5e':
                // A setting to specify that only rolls connected to an actor will be counted, not just
                // random '/r 1d20s' or the like
                game.settings.register(this.ID, this.SETTINGS.DND5E.RESTRICT_COUNTED_ROLLS, {
                    name: `ROLL-TRACKER.settings.dnd5e.${this.SETTINGS.DND5E.RESTRICT_COUNTED_ROLLS}.Name`,
                    default: true,
                    type: Boolean,
                    scope: 'world',
                    config: true,
                    hint: `ROLL-TRACKER.settings.dnd5e.${this.SETTINGS.DND5E.RESTRICT_COUNTED_ROLLS}.Hint`,
                })
                break;
            case 'pf2e':
                // A setting to specify that only rolls connected to an actor will be counted, not just
                // random '/r 1d20s' or the like
                game.settings.register(this.ID, this.SETTINGS.PF2E.RESTRICT_COUNTED_ROLLS, {
                    name: `ROLL-TRACKER.settings.pf2e.${this.SETTINGS.PF2E.RESTRICT_COUNTED_ROLLS}.Name`,
                    default: true,
                    type: Boolean,
                    scope: 'world',
                    config: true,
                    hint: `ROLL-TRACKER.settings.pf2e.${this.SETTINGS.PF2E.RESTRICT_COUNTED_ROLLS}.Hint`,
                })
                break;
        } 

    }

    parseMessage(msg){

        isBlind = msg.isBlind;

        //Get die type
        sides = rolls[0]?.dice[0].faces
        type = MAX_TO_DIE.get(sides);
        const newNumbers = [];

        if(game.user.isGM){
            playerInfo = this.ALLPLAYERDATA.get(msg.user.id);
            //GM Saves all Player Info
            // In case there's more than one d20 roll in a single instance as in fortune/misfortune rolls
            newNumbers = rollData.dice[0].results.map(result => result.result)
            newNumbers.forEach(element => {
                playerInfo.saveRoll(isBlind, element, dieType)
            });
            
        }else if(msg.user.isSelf){
            playerInfo = this.ALLPLAYERDATA.get(msg.user.id);
            //Not gm so only save your info
            newNumbers = rollData.dice[0].results.map(result => result.result)
            newNumbers.forEach(element => {
                playerInfo.saveRoll(isBlind, element, dieType)
            });
        }
    }
}

class UTILS {

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
     static comparePlayers(players, dietype){
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


class GlobalStatsPage extends FormApplication {
    //Global Stats               
        //D2 info
            //Graph of Each Number And Rolled Amount
            //Mean, Median, Mode
            //Plyer with Most Low Rolls & Number
            //Player with Most highest Roll & Number
            //Longest Streak Number & Player

        //D3 info
            //Graph of Each Number And Rolled Amount
            //Mean, Median, Mode
            //Plyer with Most Low Rolls & Number
            //Player with Most highest Roll & Number
            //Longest Streak Number & Player
}

class PlayerStatusPage extends FormApplication {
    //Player Data * x         
        //D2 Info
            //Graph of number of each rolls
            //Mean, Median, Mode
            //Longest Streak
        //D3 Info
            //Graph of number of each rolls
            //Mean, Median, Mode
            //Longest Streak
}

//==========================================================
//===================== HOOKS SHIT =========================
//==========================================================

Hooks.on('createChatMessage', (chatMessage) => {
    if (chatMessage.isRoll) {
        CLASSOBJ.parseMessage(chatMessage)
        CLASSOBJ.displayStreak();
    }
})

// Initialize dialog and settings on foundry boot up
Hooks.once('init', () => {
    CLASSOBJ = new RollTracker();
})
