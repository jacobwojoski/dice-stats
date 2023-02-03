import * as myUtils from    "dice-stats-utils.js";
import * as myMath from     "dice-stats-math.js";
import * as myForms from    "dice-stats-forms.js";

//----GLOBAL VALUES----
CLASSOBJ = null;
testPlayer = new PLAYER();

//----GLOBAL CONST VALUES----


//Get access to handlebars stuff
const TEMPLATES = {
    GLOBALDATAFORM:     'modules/dice-stats/templates/dice-stats-global.hbs',
    PLAYERDATAFORM:     'modules/dice-stats/templates/dice-stats-player.hbs',
    STREAKCHATMSGFORM:  'modules/dice-stats/templates/dice-stats-global.hbs',
    ROLLCHATMSGFORM:    'modules/dice-stats/templates/dice-stats-global.hbs',
}

//Setting will really only impact button functionality everyone stores everyones rolls... for now
const SETTINGS = {
    PLAYERS_SEE_SELF: 'players_see_self',       //If players are allowed to view their stats
    PLAYERS_SEE_PLAYERS: 'players_see_players', //if players cant see self they cant see others either
    PLAYERS_SEE_GM:     'players_see_gm',
    PLAYERS_SEE_GLOBAL: 'players_see_global',
    DISABLE_STREAKS: 'disable_streak',
    SEE_BLIND_STREAK: 'see_blind_streaks'              
}

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
        this.MEAN = ROLL_MATH.getMean(this.ROLLS);
        this.MEDIAN = ROLL_MATH.getMedian(this.ROLLS);
        this.MODE = ROLL_MATH.getMode(this.ROLLS);
    }
}

class DiceStatsTracker {

    ID = 'roll-tracker'
    ALLPLAYERDATA = new Map();  //Map of all Players <PlayerID, PLAYER> 
    IMGM = false;
    SYSTEM;
    
    constructor(){
        //Add Everyone to storage. Were tracking all even if we dont need
        game.users.forEach(user => {
            this.ALLPLAYERDATA.set(user.id,new PLAYER(user.id)) 
        });

        //Get Settings and Systtem Info
        // Store the current system, for settings purposes. It has to be set here, and not in the parent
        // class, because the system needs to initialize on foundry boot up before we can get its id
        this.SYSTEM = `${game.system.id}`

        // A setting to determine whether players can see their own data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_SELF, {
            name: `ROLL-TRACKER.settings.${SETTINGS.PLAYERS_SEE_SELF}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${SETTINGS.PLAYERS_SEE_SELF}.Hint`,
        })

        // A setting to determine whether players can see other players data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_PLAYERS, {
            name: `ROLL-TRACKER.settings.${SETTINGS.PLAYERS_SEE_PLAYERS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${SETTINGS.PLAYERS_SEE_PLAYERS}.Hint`,
        })

        // A setting to determine whether players can see gm data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_GM, {
            name: `ROLL-TRACKER.settings.${SETTINGS.PLAYERS_SEE_GM}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${SETTINGS.PLAYERS_SEE_GM}.Hint`,
        })

        // A setting to determine whether players can see global data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_GLOBAL, {
            name: `ROLL-TRACKER.settings.${SETTINGS.PLAYERS_SEE_GLOBAL}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${SETTINGS.PLAYERS_SEE_GLOBAL}.Hint`,
        })

        // A setting to determine whether players can see streaks at all
        game.settings.register(this.ID, SETTINGS.DISABLE_STREAKS, {
            name: `ROLL-TRACKER.settings.${SETTINGS.DISABLE_STREAKS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${SETTINGS.DISABLE_STREAKS}.Hint`
        })

        // A setting to determine whether players can see a streak due to blind roll (default of No)
        game.settings.register(this.ID, this.SETTINGS.SEE_BLIND_STREAK, {
            name: `ROLL-TRACKER.settings.${SETTINGS.SEE_BLIND_STREAK}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `ROLL-TRACKER.settings.${SETTINGS.SEE_BLIND_STREAK}.Hint`
        })
    }

    parseMessage(msg){

        isBlind = msg.isBlind;

        //Get die type
        sides = rolls[0]?.dice[0].faces
        type = MAX_TO_DIE.get(sides);
        newNumbers = [];

        //TODO add check if we should store other ppls data?. Could help with player perf

        //In case there's more than one die rolled in a single instance as in fortune/misfortune rolls or multiple hit dice
        newNumbers = rollData.dice[0].results.map(result => result.result)
        playerInfo = this.ALLPLAYERDATA.get(msg.user.id);

        newNumbers.forEach(element => {
            playerInfo.saveRoll(isBlind, element, dieType)
        });
    }
}

//==========================================================
//===================== FORMS SHIT =========================
//==========================================================

class PlayerStatusPage extends FormApplication {
    TESTSTATS = new DIE_INFO(20);
    TESTROLLS = new Array[20];

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
          height: 'auto',
          id: 'player-data',
          template: TEMPLATES.PLAYERDATAFORM,
          title: 'Player Roll Data',
          userId: game.userId,
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    //dataObject<PLAYER> = pointerToPlayerData type class PLAYER
    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
        //this.PLAYERDATA = dataObject;

        this.TESTSTATS.ROLLS[0]=25;
        temp = 50;
        for (let i = 0; i < this.TESTSTATS.ROLLS.length; i++) {
            this.TESTSTATS.ROLLS[i] = temp;
            this.TESTROLLS[i] = temp;
            temp--;
            temp--;
        }
    }

    _render(){
        
    }
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
    //TODO
    //check if fate (3 sided) and coin (2 sided) count as rolls or if somethign special is needed
    if (chatMessage.isRoll) {
        CLASSOBJ.parseMessage(chatMessage)
        CLASSOBJ.displayStreak();
    }
})

// Initialize dialog and settings on foundry boot up
Hooks.once('init', () => {
    CLASSOBJ = new DiceStatsTracker();
})

Hooks.on('renderPlayerList', (playerList, html) => {
    //TODO Incorperate Settings
    
    // This add icon to ALL players on the player list
    const tooltip = game.i18n.localize('ROLL-DICE_STATS_TEXT.player-stats-button-title')
    for (let user of game.users) {
        const buttonPlacement = html.find(`[data-user-id="${user.id}"]`)
        buttonPlacement.append(
            `<button type="button" title='${tooltip}' class="roll-tracker-item-button flex0" id="${user.id}"><i class="fas fa-dice-d20"></i></button>`
        )
        html.on('click', `#${user.id}`, (event) => {
            new PlayerStatusPage(user.id).render(true);
        })
    }
    
})
