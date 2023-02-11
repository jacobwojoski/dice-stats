//----GLOBAL VALUES----
CLASSOBJ = null;

//----GLOBAL CONST VALUES----

const MODULE_ID = 'DiceStats'

//Get access to handlebars stuff
const TEMPLATES = {
    GLOBALDATAFORM:     'modules/DiceStats/templates/dice-stats-global.hbs',
    PLAYERDATAFORM:     'modules/DiceStats/templates/dice-stats-player.hbs',
    
    //TODO
    STREAKCHATMSGFORM:  'modules/DiceStats/templates/dice-stats-global.hbs',
    ROLLCHATMSGFORM:    'modules/DiceStats/templates/dice-stats-global.hbs'
}

//Currently Every user will store everyone elses data
const SETTINGS = {
    PLAYERS_SEE_SELF: 'players_see_self',       //If players are allowed to view their stats
    PLAYERS_SEE_PLAYERS: 'players_see_players', //if players cant see self they cant see others either
    PLAYERS_SEE_GM:     'players_see_gm',
    PLAYERS_SEE_GLOBAL: 'players_see_global',
    INCLUDE_GM_IN_GLOBAL: 'include_gm_in_global',
    DISABLE_STREAKS: 'disable_streak',
    SEE_BLIND_STREAK: 'see_blind_streaks'              
}

/**
 * If more dice types want to be added or number of dice types changed you need to edit the following:
 * main/NUM_DIE_TYPES
 * main/DIE_TYPE
 * main/DIE_MAX
 * main/MAX_TO_DIE
 * datapack/PLAYER_HANDL_INFO/DICE_ROLL_DATA
 * datapack/GLOBAL_HANDL_INFO/DICE_ROLL_DATA
 */
const NUM_DIE_TYPES = 9;
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

//Storage Class for Each Die
//Die rolls are stored in array thats size of the die type 
//That way can just incrament each position rather then store array of increasing size
//Ex, D20 roll was 16 -> Rolls[(16-1)]++;
class DIE_INFO {
    TYPE =          0;  //Type of die <DIE_TYPE> varable
    TOTAL_ROLLS =   0;
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
        this.TYPE = MAX_TO_DIE.get(dieMax);
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
        this.ROLLS[roll-1] = this.ROLLS[roll-1]+1;
        this.TOTAL_ROLLS++;
        this.updateStreak(roll, isBlind)
    }

    calculate(){
        this.MEAN = DICE_STATS_UTILS.getMean(this.ROLLS);
        this.MEDIAN = DICE_STATS_UTILS.getMedian(this.ROLLS);
        this.MODE = DICE_STATS_UTILS.getMode(this.ROLLS);
    }
}

//Class that defines a player. Players are all connected people to server including gm
//Player has Die Info for each die type they roll & some other misc data
class PLAYER {
    PLAYER_DICE = new Array(NUM_DIE_TYPES); //Aray of type<DIE_INFO>
    USERNAME = '';
    USERID = 0;
    GM = false;

    constructor(userid){
        this.USERID = userid;
        this.USERNAME = game.users.get(userid)?.name;
        this.GM = game.users.get(userid)?.isGM;
        for (let i = 0; i < this.PLAYER_DICE.length; i++) {
            this.PLAYER_DICE[i] = new DIE_INFO(DIE_MAX[i]);
        }
    }

    getStreakString(dieType){
        let len = this.PLAYER_DICE[dieType].LONGEST_STREAK
        let initNum = this.PLAYER_DICE[dieType].LONGEST_STREAK_INIT
        let nextNum = 0;
        if(len === -1){
            return "NO DICE ROLLED"
        }else{
            // this value is index 0, loop starts at 1
            // User can have a streak of 1 
            let tempStr = initNum.toString(); 
            for(let i=1; i<len; i++){
                nextNum = initNum+i+1;
                tempStr = tempStr+','+nextNum.toString();
            }
            return tempStr;
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

class DiceStatsTracker {
    ALLPLAYERDATA;  //Map of all Players <PlayerID, PLAYER> 

    ID = 'DiceStats'
    IMGM = false;
    SYSTEM;
    
    updateMap(){
        //Add everyplayer to storage. Were tracking all even if we dont need
        for (let user of game.users) {
            if(!this.ALLPLAYERDATA.has(user.id)){
                this.ALLPLAYERDATA.set(user.id, new PLAYER(user.id))    
            }
        }
    }

    constructor(){
        //Get Settings and Systtem Info
        // Store the current system, for settings purposes. It has to be set here, and not in the parent
        // class, because the system needs to initialize on foundry boot up before we can get its id
        this.SYSTEM = `${game.system.id}`
        this.ALLPLAYERDATA = new Map();

        // A setting to determine whether players can see their own data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_SELF, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_SELF}.Name`,
            default: true,
            type: Boolean,
            scope: 'world', //world = db, client = local
            config: true,   // show in module config
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_SELF}.Hint`,
        })

        // A setting to determine whether players can see other players data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_PLAYERS, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_PLAYERS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_PLAYERS}.Hint`,
        })

        // A setting to determine whether players can see gm data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_GM, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_GM}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_GM}.Hint`
            //restricted: true    // Restric item to gamemaster only
        })

        // A setting to determine whether players can see global data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_GLOBAL, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_GLOBAL}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_GLOBAL}.Hint`,
        })

        // A setting to determine whether players can see global data
        game.settings.register(this.ID, SETTINGS.INCLUDE_GM_IN_GLOBAL, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.INCLUDE_GM_IN_GLOBAL}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.INCLUDE_GM_IN_GLOBAL}.Hint`,
        })

        // A setting to determine whether players can see streaks at all
        game.settings.register(this.ID, SETTINGS.DISABLE_STREAKS, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.DISABLE_STREAKS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.DISABLE_STREAKS}.Hint`
        })

        // A setting to determine whether players can see a streak due to blind roll (default of No)
        game.settings.register(this.ID, SETTINGS.SEE_BLIND_STREAK, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.SEE_BLIND_STREAK}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.SEE_BLIND_STREAK}.Hint`
        })
    }

    parseMessage(msg){
        let isBlind = msg.blind;

        //Get die type
        let sides = msg.rolls[0]?.dice[0].faces
        let dieType = MAX_TO_DIE.get(sides);
        let newNumbers = [];

        //TODO add check here if we should store other ppls data?. Could help with player performance?

        //In case there's more than one die rolled in a single instance as in fortune/misfortune rolls or multiple hit dice
        newNumbers = msg.rolls[0].dice[0].results.map(result => result.result)
        let playerInfo = this.ALLPLAYERDATA.get(msg.user.id);

        newNumbers.forEach(element => {
            playerInfo.saveRoll(isBlind, element, dieType)
        });
    }
}

//==========================================================
//===================== FORMS SHIT =========================
//==========================================================

class PlayerStatusPage extends FormApplication {
    static TESTSTATS;
    static TESTROLLS;
    SEL_PLAYER = 0;

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
          height: 'auto',
          id: 'player-data',
          template: TEMPLATES.PLAYERDATAFORM,
          userId: game.userId,
          title: 'Player Dice Stats',
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    //dataObject<PLAYER> = pointerToPlayerData type class PLAYER
    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
        this.SEL_PLAYER = userId;
        //this.PLAYERDATA = dataObject;
    }

    getData(){
        if(CLASSOBJ.ALLPLAYERDATA.has(this.SEL_PLAYER)){
            let playerObj = CLASSOBJ.ALLPLAYERDATA.get(this.SEL_PLAYER);
            var dataObject = DATA_PACKAGER.packagePlayerData(playerObj);
            return dataObject;
        }
        return DATA_PACKAGER.PLAYER_HNDL_INFO;
    }
}

class GlobalStatusPage extends FormApplication{
    INCLUDE_GM_ROLLS = false;

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
          height: 'auto',
          id: 'global-data',
          template: TEMPLATES.GLOBALDATAFORM,
          userId: game.userId,
          title: 'Global Dice Stats',
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    constructor(options={}, dataObject = null) {
        this.INCLUDE_GM_ROLLS = game.settings.get(MODULE_ID,SETTINGS.INCLUDE_GM_IN_GLOBAL);
    }

    getData(){
        let playersAry = CLASSOBJ.ALLPLAYERDATA;
        let dataObject = DATA_PACKAGER.getGlobalData(playersAry, this.INCLUDE_GM_ROLLS);
        return dataObject;
    }
}

//==========================================================
//===================== HOOKS SHIT =========================
//==========================================================

Hooks.on('createChatMessage', (chatMessage) => {
    //TODO
    //check if fate (3 sided) and coin (2 sided) count as rolls or if somethign special is needed
    if (chatMessage.isRoll) {
        CLASSOBJ.parseMessage(chatMessage)
    }
})

// Initialize dialog and settings on foundry boot up
Hooks.once('init', () => {
    CLASSOBJ = new DiceStatsTracker();
})

Hooks.on('renderPlayerList', (playerList, html) => {
    //TODO Incorperate Settings

    //New Players might get added throught the game so update map on playerlist render. Didnt work in the Constructor.
    CLASSOBJ.updateMap();
    // This add icon to ALL players on the player list
    const tooltip = game.i18n.localize('ROLL-DICE_STATS_TEXT.player-stats-button-title')
    for (let user of game.users) {

        //add user ID to associated button
        const buttonPlacement = html.find(`[data-user-id="${user.id}"]`)
        buttonPlacement.append(
            `<button type="button" title='${tooltip}' class="open-player-stats-button flex0" id="${user.id}"><i class="fas fa-dice-d20"></i></button>`
        )

        //Create button with eacu user id 
        html.on('click', `#${user.id}`, (event) => {
            let canSeeGM = game.settings.get(MODULE_ID,SETTINGS.PLAYERS_SEE_GM);
            let amIGM = game.users.get(game.userId)?.isGM;
            if(canSeeGM === false && user.isGM && !amIGM){
                //do nothing, Dont allow ability to see gm data if setting is off
                ui.notifications.warn("No Accesss to GM Data, Ask GM For Permission");
            }else{
                new PlayerStatusPage(user.id).render(true);
            }
        })
    }


    let buttons = super._getHeaderButtons();


    //Get Global w/o Gm Data
    buttons.splice(0, 0, {
        class: "fa-solid fa-earth-americas",
        icon: "fas fa-download",
        onclick: ev => {
            //Check Setting to see if global settings include gm rolls
            new GlobalStatusPage().render(true);
        }
    })


    /* TODO
    //Export data button
    buttons.splice(1, 0, {
        class: "roll-tracker-form-export",
        icon: "fas fa-download",
        onclick: ev => {
            //TODO
        }
    })


     //If I am GM
     if(game.user.isGM){
        //Get Global Stats (Stats include GM Rolls)
        buttons.splice(2, 0, {
            class: "roll-tracker-form-export",
            icon: "fas fa-download",
            onclick: ev => {
                //TODO
            }
        })
    }
    */
})



//==========================================================
//================== HANDLEBARS SHIT =======================
//==========================================================

//handlebars fn used to tell if a die was rolled. 
//If not display something different then charts and dice stats
Handlebars.registerHelper('ifDieUsed', function (var1, options) {
    if(var1 != 0){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});

//Handlebars fn used to see if a streak had a blind roll in it.
//If there was a blind roll we dont want to potentally point the result so dont display it for now
Handlebars.registerHelper('ifStreakIsBlind', function (var1, options) {
    if(var1 != true){
        
    }else{
        return options.inverse(this);
    }
});

//TODO Display Warning and close popup if user Has no roll data
Handlebars.registerHelper('ifUserHasData', function (var1, options) {
    ui.notifications.warn("No roll data to export");
    return options.inverse(this);
});
