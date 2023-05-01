//----GLOBAL VALUES----
CLASSOBJ = null;
GLOBALFORMOBJ = null;
PLAYERFORMOBJ = null;
GLOBALSCENECONTROLSOBJ = null;
let socket;

//----GLOBAL CONST VALUES----
const MODULE_ID = 'dice-stats'

//Get access to handlebars stuff
const TEMPLATES = {
    GLOBALDATAFORM:     'modules/dice-stats/templates/dice-stats-global.hbs',
    PLAYERDATAFORM:     'modules/dice-stats/templates/dice-stats-player.hbs',
    
    //TODO
    STREAKCHATMSGFORM:  'modules/dice-stats/templates/dice-stats-global.hbs',
    ROLLCHATMSGFORM:    'modules/dice-stats/templates/dice-stats-global.hbs'
}

const FLAGS = {
    ROLLDATAFLAG:'player_roll_data'
}

//Currently Every user will store everyone elses data
const SETTINGS = {
    PLAYERS_SEE_SELF: 'players_see_self',       //If players are allowed to view their stats               [Def: True]      (Global)
    PLAYERS_SEE_PLAYERS: 'players_see_players', //if players cant see self they cant see others either     [Def: True]      (Global)
    PLAYERS_SEE_GM:     'players_see_gm',       //If Players can see GM dice roll stats                    [Def: False]     (Global)
    PLAYERS_SEE_GLOBAL: 'players_see_global',   //If Players Can  Global Dice Stats                        [Def: True]      (Global)
    PLAYERS_SEE_GM_IN_GLOBAL: 'players_see_gm_in_global',   //If GM roll stats get added into global stats [Def: False]     (Global)
    ENABLE_BLIND_STREAK_MSGS: 'enable_blind_streak_msgs',   //Allow strk from a blind roll to be prnt to chat [Def: false]  (Global) 
    SHOW_BLIND_ROLLS_IMMEDIATE: 'enable_blind_rolls_immediate', //Allow blind rolls to be saved immediately   [Def: false]  (Global)
    ENABLE_AUTO_DB: 'enable_auto_db', //Rolling data gets saved to automatically and user load from DB on joining  [Def: false] (Global)
    ENABLE_CRIT_MSGS: 'enable_crit_msgs',       //Choose what dice print crit msgs              [Default: d20]              (Local)
    TYPES_OF_CRIT_MSGS: 'types_of_crit_msgs',   //Choose Type of crits to print                 [Default Both]              (Local)
    ENABLE_STREAK_MSGS: 'enable_streak_msgs',   //Choose what dice to display streak msgs for    [Default : d20]            (Local)
    ENABLE_OTHER_ACCESS_BUTTONS: 'enable_other_access_buttons' //Enable different access buttons [Defaunt : false]          (Local)     
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
    BLIND_ROLLS = [];
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
        this.STREAK_SIZE = -1;
        this.STREAK_INIT = -1;
        this.LONGEST_STREAK = 0;
        this.LONGEST_STREAK_INIT = 0;

        this.ROLLS = new Array(dieMax);
        this.ROLLS.fill(0);

        this.BLIND_ROLLS = new Array(dieMax);
        this.BLIND_ROLLS.fill(0);
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

    clearData(){
        this.TOTAL_ROLLS =   0;
        this.ROLLS.fill(0);
        this.BLIND_ROLLS.fill(0);

        this.STREAK_SIZE =   -1;
        this.STREAK_INIT =   -1;
        this.STREAK_ISBLIND = false;
        this.LONGEST_STREAK =        -1;
        this.LONGEST_STREAK_INIT =   -1;

        this.MEAN =      0;
        this.MEDIAN =    0;
        this.MODE =      0;
    }

    addRoll(roll, isBlind){
        this.TOTAL_ROLLS++;
        this.updateStreak(roll, isBlind)

        var dontHideBlindRolls = game.settings.get(MODULE_ID,SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE);
        if(!isBlind || dontHideBlindRolls){
            this.ROLLS[roll-1] = this.ROLLS[roll-1]+1;
        }else{
            this.BLIND_ROLLS[roll-1] = this.BLIND_ROLLS[roll-1]+1; 
        }
    }

    calculate(){
        this.MEAN = DICE_STATS_UTILS.getMean(this.ROLLS);
        this.MEDIAN = DICE_STATS_UTILS.getMedian(this.ROLLS);
        this.MODE = DICE_STATS_UTILS.getMode(this.ROLLS);
    }

    //method to take blind roll data and push it into normal roll data
    //Reset blind roll data once pushed
    pushBlindRolls(){
        for(let i=0; i<this.BLIND_ROLLS.length; i++){
            this.ROLLS[i] = this.ROLLS[i]+this.BLIND_ROLLS[i];
            this.BLIND_ROLLS[i]=0;
        }
    }

    //method to get total number of blind rolls
    getBlindRollsCount(){
        let tempRollCount = 0;
        for(let i=0; i<this.BLIND_ROLLS.length; i++){
            tempRollCount += this.BLIND_ROLLS[i];
        }

        return tempRollCount;
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
        }else if(len === 1){
            return "No Strings Made"
        }else{
            // this value is index 0, loop starts at 1
            // User can have a streak of 1 
            let tempStr = initNum.toString(); 
            for(let i=1; i<len; i++){
                nextNum = initNum+i;
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

    pushBlindRolls(){
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].pushBlindRolls();
        }
    }

    getBlindRollsCount(){
        let tempRollCount = 0;
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            tempRollCount += this.PLAYER_DICE[i].getBlindRollsCount();
        }
        return tempRollCount;
    }

    clearAllRollData(){
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].clearData();
        }
    }

    clearDieData(DiceType){
        this.PLAYER_DICE[DiceType].clearData();
    }

    //Clear all dice roll data
    clearDiceData(){
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].clearData();
        }
    }

    //clear a specific die's roll data
    clearDieData(DiceType){
        this.PLAYER_DICE[DiceType].clearData();
    }
}

class DiceStatsTracker {
    ALLPLAYERDATA;  //Map of all Players <PlayerID, PLAYER> 

    ID = 'dice-stats'
    IMGM = false;
    SYSTEM;
    PLAYER_DICE_CHECKBOXES = [];
    GLOBAL_DICE_CHECKBOXES = [];

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
        
        this.PLAYER_DICE_CHECKBOXES = new Array(NUM_DIE_TYPES);
        this.GLOBAL_DICE_CHECKBOXES = new Array(NUM_DIE_TYPES);
        this.PLAYER_DICE_CHECKBOXES.fill(true);
        this.GLOBAL_DICE_CHECKBOXES.fill(true);

        // A setting to determine whether players can see gm data
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_GM, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_GM}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_GM}.Hint`
            //restricted: true    // Restric item to gamemaster only 
            //Only used for non world lvl items. All World items are already gm only
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
        game.settings.register(this.ID, SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL}.Hint`,
        })

        // A setting to determine whether players can see global data
        game.settings.register(this.ID, SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE}.Hint`,
        })

        // A setting to let db interaction be automated
        game.settings.register(this.ID, SETTINGS.ENABLE_AUTO_DB , {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.ENABLE_AUTO_DB}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.ENABLE_AUTO_DB}.Hint`,
        })

        // A setting to let the user change access buttons to use something else
        game.settings.register(this.ID, SETTINGS.ENABLE_OTHER_ACCESS_BUTTONS , {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.ENABLE_OTHER_ACCESS_BUTTONS}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.ENABLE_OTHER_ACCESS_BUTTONS}.Hint`,
        })
        /*
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
        */
    }

    //Method used that parses messages from the chat. This is how we know a roll has happened, what die was rolled, and the value
    parseMessage(msg){
        let isBlind = msg.blind;

        //Get Associated player object
        let playerInfo = this.ALLPLAYERDATA.get(msg.user.id);

        //For multiple rolls in chat
        for (let tempRoll = 0; tempRoll < msg.rolls.length; tempRoll++) {
            
            //For multiple dice types per roll
            for(let tempDie=0; tempDie<msg.rolls[tempRoll]?.dice.length ; tempDie++){

                //Get die type
                let sides = msg.rolls[tempRoll]?.dice[tempDie].faces
                let dieType = MAX_TO_DIE.get(sides);
                let newNumbers = [];

                //In case there's more than one die rolled in a single instance as in 
                //  fortune/misfortune rolls or multiple hit dice save each roll
                newNumbers = msg.rolls[tempRoll].dice[tempDie].results.map(result => result.result)

                newNumbers.forEach(element => {
                    playerInfo.saveRoll(isBlind, element, dieType)
                });
            }
            
        }

        //If AutoSave is Enabled by GM
        if(game.settings.get(MODULE_ID,SETTINGS.ENABLE_AUTO_DB)) 
        {
            //If It was my Roll
            this.saveMyPlayerData();
        }
    }

    //Method used to add toll to a specifc player
    addRoll(dieType=7, rolls=[], user=game.user.id, isBlind=false){
        let playerInfo = this.ALLPLAYERDATA.get(user);

        rolls.forEach(element => {
            playerInfo.saveRoll(isBlind, element, dieType)
        });
    }

    //Tell user to move any blind rolls they have saved from the blid roll ary to the data aray so the user can see the rolls on the charts
    pushBlindRolls(){
        for (let user of game.users) {
            this.ALLPLAYERDATA.get(user.id)?.pushBlindRolls();
        }
    }

    //Erase all locally stored data
    clearAllRollData(){
        for (let user of game.users) {
            this.ALLPLAYERDATA.get(user.id)?.clearDiceData();
        }
    }

    //Erase a specific users locally stored data
    clearUsersRollData(userid){
        this.ALLPLAYERDATA.get(userid)?.clearDiceData();
    }

    //Save my players data to the DB
    saveMyPlayerData(){
        let myData = this.ALLPLAYERDATA.get(game.user.id)
        if(myData)
        {
            DB_INTERACTION.saveUserData(myData); 
        }
    }
     
    //Load Every Players Data from the DB
    loadAllPlayerData(){
        for(let tempUser of game.users)
        {
            var dbInfo = DB_INTERACTION.loadPlayerData(tempUser.id);
            if(dbInfo)
            {
                let localPlayerInfo = this.ALLPLAYERDATA.get(tempUser.id);

                DB_INTERACTION.createPlayerObject(localPlayerInfo,dbInfo);
                this.ALLPLAYERDATA.set(tempUser.id,localPlayerInfo);

                if(GLOBALFORMOBJ){
                    GLOBALFORMOBJ.render();
                }

                if(PLAYERFORMOBJ){
                    PLAYERFORMOBJ.render();
                }
            }
        }
    }

    //Load your players data from the data
    loadYourPlayerData(){
        var dbInfo = DB_INTERACTION.loadPlayerData(game.user.id);
        if(dbInfo)
        {
            let localPlayerInfo = this.ALLPLAYERDATA.get(game.user.id);

            DB_INTERACTION.createPlayerObject(localPlayerInfo,dbInfo);
            this.ALLPLAYERDATA.set(tempUser.id,localPlayerInfo);

            if(GLOBALFORMOBJ){
                GLOBALFORMOBJ.render();
            }

            if(PLAYERFORMOBJ){
                PLAYERFORMOBJ.render();
            }
        } 
    }

    //Load other players data from the DB (Not yours)
    loadOthersPlayerData(){
        for(let tempUser of game.users)
        {
            if(tempUser.id != game.user.id) //Dont load your data only other players
            {
                var dbInfo = DB_INTERACTION.loadPlayerData(tempUser.id);
                if(dbInfo)
                {
                    let localPlayerInfo = this.ALLPLAYERDATA.get(tempUser.id);

                    DB_INTERACTION.createPlayerObject(localPlayerInfo,dbInfo);
                    this.ALLPLAYERDATA.set(tempUser.id,localPlayerInfo);

                    if(GLOBALFORMOBJ){
                        GLOBALFORMOBJ.render();
                    }

                    if(PLAYERFORMOBJ){
                        PLAYERFORMOBJ.render();
                    }
                }
            }
        }
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
            dataObject.IS_DIE_DISPLAYED = [...CLASSOBJ.PLAYER_DICE_CHECKBOXES];
            return dataObject;
        }
        return DATA_PACKAGER.PLAYER_HNDL_INFO;
    }


    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;

        let title_txt;
        let context_txt;

        //Handle button events made on the form
        switch(action){
            case 'refresh':
                PLAYERFORMOBJ.render();
                break;
            case 'save':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.save_to_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.save_to_db.context');
                const saveConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (saveConfirmation) {
                    ui.notifications.warn("Your Data Saved");
                    CLASSOBJ.saveMyPlayerData();
                }
                break;
            case 'loadAllFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_all_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_all_db.context');
                const loadConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadConfirmation) {
                    ui.notifications.warn("All Data Loaded");
                    CLASSOBJ.loadAllPlayerData();
                }
                break;
            case 'loadYoursFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_your_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_your_db.context');
                const loadYoursConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadYoursConfirmation) {
                    ui.notifications.warn("Your Data Loaded");
                    CLASSOBJ.loadYourPlayerData();
                }
                break;
            case 'loadOthersFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_others_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_others_db.context');
                const loadOthersConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadOthersConfirmation) {
                    CLASSOBJ.loadOthersPlayerData();
                }
                break;
            case 'clearAllLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_all_local.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_all_local.context');
                const clearAllLocalConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (clearAllLocalConfirmation) {
                    ui.notifications.warn("All Local Data Cleared");
                    CLASSOBJ.clearAllRollData();
                    if(PLAYERFORMOBJ){
                        PLAYERFORMOBJ.render();
                    }
                    if(GLOBALFORMOBJ){
                        GLOBALFORMOBJ.render();
                    } 
                }
                break;
            case 'clearYourLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_local.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_local.context');
                const clearYourLocalConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (clearYourLocalConfirmation) {
                    ui.notifications.warn("Your Local Data Cleared");
                    CLASSOBJ.clearUsersRollData(game.user.id);
                    if(PLAYERFORMOBJ){
                        PLAYERFORMOBJ.render();
                    }
                    if(GLOBALFORMOBJ){
                        GLOBALFORMOBJ.render();
                    } 
                }
                break;
            case 'clearYourDBrollData':
                    title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_db.title');
                    context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_db.context');
                    const dbcon = await Dialog.confirm({
                        title: title_txt,
                        content: context_txt,
                        yes: () => {return true},
                        no: () => {return false},
                        defaultYes: false
                        });
    
                    if (dbcon) {
                        ui.notifications.warn("All Your DB Data Cleared");
                        DB_INTERACTION.clearPlayer(game.user);
                        if(PLAYERFORMOBJ){
                            PLAYERFORMOBJ.render();
                        }
                    }
                    break;
            case 'clearAllPlayerData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_both.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_both.context');
                const dbcon2 = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (dbcon2) {
                    ui.notifications.warn("All Your Data Cleared");
                    CLASSOBJ.clearUsersRollData(game.user.id);
                    DB_INTERACTION.clearPlayer(game.user);
                    if(PLAYERFORMOBJ){
                        PLAYERFORMOBJ.render();
                    }
                }
                break;
            case 'd2checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[0] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[0];
                PLAYERFORMOBJ.render();
                break;
            case 'd3checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[1] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[1];
                PLAYERFORMOBJ.render();
                break;
            case 'd4checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[2] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[2];
                PLAYERFORMOBJ.render();
                break;
            case 'd6checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[3] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[3];
                PLAYERFORMOBJ.render();
                break;
            case 'd8checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[4] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[4];
                PLAYERFORMOBJ.render();
                break;
            case 'd10checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[5] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[5];
                PLAYERFORMOBJ.render();
                break;
            case 'd12checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[6] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[6];
                PLAYERFORMOBJ.render();
                break;
            case 'd20checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[7] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[7];
                PLAYERFORMOBJ.render();
                break;
            case 'd100checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[8] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[8];
                PLAYERFORMOBJ.render();
                break;
            default:
                return;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick);
    }
}

class GlobalStatusPage extends FormApplication{

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


    getData(){
        var includeGM = game.settings.get(MODULE_ID,SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL);

        //Convert Map of PLayers to Array
        let playersAry = [];
        CLASSOBJ.ALLPLAYERDATA.forEach(value => {
            playersAry.push(value);
        })

        let dataObject = DATA_PACKAGER.packageGlobalData(playersAry, includeGM);
        dataObject.IS_DIE_DISPLAYED = [...CLASSOBJ.GLOBAL_DICE_CHECKBOXES];
        return dataObject;
    }

    //Handle button events made on the form
    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;
        
        let title_txt;
        let context_txt;
        let dbconfirmation;

        switch(action){
            case 'refresh':
                GLOBALFORMOBJ.render();
                break;
            case 'pushBlindRolls':
                socket.executeForEveryone("push_sock", game.userId);
                GLOBALFORMOBJ.render();
                break;
            case 'clearAllRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_data.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_data.context');
                const allClear = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });
                if(allClear){
                    ui.notifications.warn("All Player Data Cleared");
                    socket.executeForEveryone("clear_sock", {});
                    DB_INTERACTION.clearDB();
                }
                break;
            case 'clearAllLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_local_data.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_local_data.context');
                const localClear = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (localClear) {
                    ui.notifications.warn("All Local Data Cleared");
                    socket.executeForEveryone("clear_sock", {});
                }
                break;
            case 'clearAllDBrollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_db_data.title');
                    context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_db_data.context');
                    const dbClear = await Dialog.confirm({
                        title: title_txt,
                        content: context_txt,
                        yes: () => {return true},
                        no: () => {return false},
                        defaultYes: false
                        });
    
                    if (dbClear) {
                        ui.notifications.warn("All DB Data Cleared");
                        DB_INTERACTION.clearDB();
                    }
                break;
            case 'd2checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[0] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[0];
                GLOBALFORMOBJ.render();
                break;
            case 'd3checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[1] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[1];
                GLOBALFORMOBJ.render();
                break;
            case 'd4checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[2] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[2];
                GLOBALFORMOBJ.render();
                break;
            case 'd6checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[3] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[3];
                GLOBALFORMOBJ.render();
                break;
            case 'd8checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[4] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[4];
                GLOBALFORMOBJ.render();
                break;
            case 'd10checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[5] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[5];
                GLOBALFORMOBJ.render();
                break;
            case 'd12checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[6] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[6];
                GLOBALFORMOBJ.render();
                break;
            case 'd20checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[7] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[7];
                GLOBALFORMOBJ.render();
                break;
            case 'd100checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[8] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[8];
                GLOBALFORMOBJ.render();
                break;
            default:
                return;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick);
    }
}

//==========================================================
//===================== HOOKS SHIT =========================
//==========================================================

Hooks.on('renderPlayerList', (playerList, html) => {

    const btn = html.find(`[data-user-id="${game.userId}"]`)
    btn.append(
        `<button type="button" title='Global Stats' class="open-player-stats-button flex0" id="globalStatsBtn"><i class="fa-solid fa-earth-americas"></i></button>`
    )

    html.on('click', `#globalStatsBtn`, (event) => {
        GLOBALFORMOBJ = new GlobalStatusPage().render(true);
    })

    //New Players might get added throught the game so update map on playerlist render. Didnt work in the Constructor.
    CLASSOBJ.updateMap();
    // This add icon to ALL players on the player list
    const tooltip = game.i18n.localize('DICE_STATS_TEXT.player-stats-button-title')
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
                PLAYERFORMOBJ = new PlayerStatusPage(user.id).render(true);
            }
        })
    } 
})


function midiQolSupport(){
        /*Add Hook for Midi-QoL */
        Hooks.on("midi-qol.RollComplete", (workflow) => {
            //Deal with Attack Rolls
            if(workflow.attackRollCount > 0){
                let dieType = MAX_TO_DIE.get(workflow.attackRoll.terms[0].faces);
                let isBlind = false;

                if( workflow.attackRoll.options.defaultRollMode != 'publicroll'){
                    isBlind = true;
                }

                let rolls = [];
                for (let i = 0; i < workflow.attackRoll.terms[0].results.length; i++) {
                    rolls.push(workflow.attackRoll.terms[0].results[i].result);
                }

                //Get Associated Player
                let myId = game.userId;
                let owners = Object.keys(workflow.actor.ownership);
                let owner = owners[owners.length-1];
                //If no owner found first pos should be GM ID
                if(owner === undefined){
                    owner = owners[1];
                }
                 
                CLASSOBJ.addRoll(dieType, rolls, owner, isBlind)
            }
              
            //Deal with dmg rolls
            if(workflow.damageRollCount > 0){
                let dieType = MAX_TO_DIE.get(workflow.damageRoll.terms[0].faces);
                let isBlind = false;

                if( workflow.damageRoll.options.defaultRollMode != 'publicroll'){
                    isBlind = true;
                }

                let rolls = []
                for (let i = 0; i < workflow.damageRoll.terms[0].results.length; i++) {
                    rolls.push(workflow.damageRoll.terms[0].results[i].result);
                }

                //Get Associated Player
                let owners = Object.keys(workflow.actor.ownership);
                let owner = owners[owners.length-1];
                //If no owner found first pos should be GM ID
                if(owner === undefined){
                    owner = owners[1];
                }
                 
                CLASSOBJ.addRoll(dieType, rolls, owner, isBlind)
            }
        })
}

handleChatMsgHook = (chatMessage) => {
    if (chatMessage.isRoll) {
        CLASSOBJ.parseMessage(chatMessage)
    }
}

Hooks.on('createChatMessage', handleChatMsgHook);

// Initialize dialog and settings on foundry boot up
Hooks.once('init', () => {
    CLASSOBJ = new DiceStatsTracker();
    DB_INTERACTION.createDB();

    //Updates for Other system support. 
    //Needs to be after init hook to see active system and modules
    /*MIDI-QOL SUPPORT */
    if(game.modules.get("midi-qol")?.active){
        midiQolSupport();
    }
})

playerToolsObj1 =
{
    name: 'Sadie',
    title: 'Sadie Title',
    icon: 'fas fa-dice-d20',
    visible: true ,
    toggle: false,
    active: false,
    button: true, 
    onClick: () => {console.log("Test1")}
}

playerToolsObj2 =
{
    name: 'Jacob',
    title: 'Wojo Title',
    icon: 'fas fa-dice-d20',
    visible: true ,
    toggle: false,
    active: true,
    button: true, 
    onClick: () => {console.log("Test2")}
}

playerToolsObj3 =
{
    name: 'Custom',
    title: 'My Custom',
    icon: 'fas fa-dice-d20',
    visible: true ,
    toggle: false,
    active: false,
    button: true, 
    onClick: () => {console.log("Test3")}
}

DiceStatsLayerObj =
{
    name: 'dstats',
    title: 'diceStatsButton',
    layer: 'controls',
    icon: 'fas fa-dice-d20',
    visible: true,
    tools: [playerToolsObj1,playerToolsObj2,playerToolsObj3],
}

Hooks.on("getSceneControlButtons", controls => {
    
    if(game && game.settings.get(MODULE_ID,SETTINGS.ENABLE_OTHER_ACCESS_BUTTONS)){
        
 
        if(GLOBALSCENECONTROLSOBJ == null){
            let toolsMade = 0;
            playersAsTools = [];

            playersAsTools.push(new CustomSceneControlToolGlobal());

            for(user in game.users){
                playersAsTools.push(new CustomSceneControlToolPlayer(user.name, user.id, 'fas fa-dice-d20'));
                toolsMade++;
            }
            
            GLOBALSCENECONTROLSOBJ = new CustomSceneControl(playersAsTools);
        }

        if(GLOBALSCENECONTROLSOBJ!=null && !controls.includes(DiceStatsLayerObj))
        {
            controls.push(DiceStatsLayerObj)
        }
    
        console.log(controls);
    }
    
    // if(GLOBAL_CONTROLS_OBJ == null)
    // {
    //     myTools = []
    //     myTools.push();
    //     for()
    //     {
    //         myTools.push(new CustomSceneControlToolPlayer())
    //     }
        
    //     GLOBAL_CONTROLS_OBJ = new CustomSceneControl(myTools);
    // }
});

//controls[0].tools.push(newControl);
//Autoload DB info on connection if setting is checked
Hooks.on('ready', () => {
    if(game.settings.get(MODULE_ID,SETTINGS.ENABLE_AUTO_DB)) 
    {
        CLASSOBJ.loadAllPlayerData();
    }
});

Hooks.on('userConnected', (userid, isConnecting) => {
    //Unused for now
});

//==========================================================
//================== HANDLEBARS SHIT =======================
//==========================================================

//handlebars fn used to tell if a die was rolled. 
//If not display something different then charts and dice stats
Handlebars.registerHelper('diceStats_ifDieUsed', function (var1, options) {
    if(var1 != 0){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});

//Handlebars fn used to see if a streak had a blind roll in it.
//If there was a blind roll we dont want to potentally point the result so dont display it for now
Handlebars.registerHelper('diceStats_ifStreakIsBlind', function (var1, options) {
    if(var1 != true){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});

//Handlebars uses this to check if the user has a streak
Handlebars.registerHelper('diceStats_ifHaveStreak', function (streakValue, options) {
    //If the string has more then 1 number
    if(streakValue.length > 1){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});

//Handlebars if Used to check if A Max Or Min Number of the die Was rolled
Handlebars.registerHelper('diceStats_ifRolledCrit', function (rollCount, options) {
    if(rollCount > 0){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});

//TODO Display Warning and close popup if user Has no roll data
Handlebars.registerHelper('diceStats_ifUserHasData', function (var1, options) {
    ui.notifications.warn("No roll data to export");
    return options.inverse(this);
});


//Handlebars helper used to display check on or off on the checkboxes
Handlebars.registerHelper('diceStats_IsChecked', function (bool, options) {
    if(bool){
        return 'checked="checked"'
    }
    return ""
});

//Handlebars helper used to see if we should render die info.
Handlebars.registerHelper('diceStats_ifDisplayDieInfo', function (bool, options) {
    if(bool){
        return options.fn(this);
    }
    return options.inverse(this);
});

//Handlebars helper used to check if the client is the GM
Handlebars.registerHelper('diceStats_ifIsGM', function (options){
    if(game.user.isGM){
        return options.fn(this);
    }
    return options.inverse(this);
});

//Handlebars helper to see if there are any blind rolls stored
Handlebars.registerHelper('diceStats_ifHaveBlindRolls', function (blindRollCount, options){
    if(blindRollCount > 0){
        return options.fn(this);
    }
    return options.inverse(this);
});

//Handlebars helper to check if were opening our own dice stats
Handlebars.registerHelper('diceStats_ifIsMe', function (plyrName, options){
    if(plyrName === game.user.name){
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('diceStats_ifAutoDbActive', function (isAutoDBactive, options){
    if(isAutoDBactive == true){
        return options.fn(this);
    }
    return options.inverse(this);
});

//==========================================================
//==================== SOCKET SHIT =========================
//==========================================================

// Global Method to load socket stuff
Hooks.once("socketlib.ready", () => {
	socket = socketlib.registerModule("dice-stats");

    socket.register("push_sock", pushPlayerBlindRolls_sock);
    socket.register("clear_sock", clearRollData_sock);
});

//Socket fn call. This funtion is triggered by the gm to tell all users that they can 
//  inclide the blind roll data to the charts
function pushPlayerBlindRolls_sock(userid) {
	CLASSOBJ.pushBlindRolls();
    if(GLOBALFORMOBJ){
        GLOBALFORMOBJ.render();
    }
        
    if(PLAYERFORMOBJ){
        PLAYERFORMOBJ.render();
    }
}

function clearRollData_sock() {
    CLASSOBJ.clearAllRollData();

    if(GLOBALFORMOBJ){
        GLOBALFORMOBJ.render();
    }
        
    if(PLAYERFORMOBJ){
        PLAYERFORMOBJ.render();
    }
        
}