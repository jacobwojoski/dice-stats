//----GLOBAL VALUES----
CLASSOBJ = null;
GLOBALFORMOBJ = null;
PLAYERFORMOBJ = null;
GLOBALSCENECONTROLSOBJ = null;
let socket;

//----GLOBAL CONST VALUES----
const MODULE_ID_DS = 'dice-stats'

//Get access to handlebars stuff
const TEMPLATES = {
    GLOBALDATAFORM:     'modules/dice-stats/templates/dice-stats-global.hbs',
    PLAYERDATAFORM:     'modules/dice-stats/templates/dice-stats-player.hbs',
    COMPAREFORM:        'modules/dice-stats/templates/dice-stats-compare.hbs',
    
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
    ENABLE_AUTO_DB: 'enable_auto_db', //Rolling data gets saved to automatically and user load from DB on joining  [Def: true] (Global)
    OTHER_ACCESS_BUTTON_ICONS: 'player_access_icons', //Change player icons to use custom       [Default: fas fa-dice-d20]  (Global)
    ENABLE_CRIT_MSGS: 'enable_crit_msgs',       //Choose what dice print crit msgs              [Default: d20]              (Local)
    TYPES_OF_CRIT_MSGS: 'types_of_crit_msgs',   //Choose Type of crits to print                 [Default Both]              (Local)
    ENABLE_STREAK_MSGS: 'enable_streak_msgs',   //Choose what dice to display streak msgs for    [Default : d20]            (Local)
    ENABLE_OTHER_ACCESS_BUTTONS: 'enable_other_access_buttons' //Enable different access buttons [Defaunt : true]         (Local)
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

class DiceStatsTracker {
    ALLPLAYERDATA;  //Map of all Players <PlayerID, PLAYER> 

    ID = 'dice-stats'
    IMGM = false;
    SYSTEM;
    PLAYER_DICE_CHECKBOXES = [];
    GLOBAL_DICE_CHECKBOXES = [];

    /**
     * Update global map to add a key value pair for every user.
     * key:value = {int}userid:{PLAYER}PLAYER Object
     */
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
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.ENABLE_AUTO_DB}.Hint`,
        })

        // A setting to let the user change access buttons to use something else
        game.settings.register(this.ID, SETTINGS.ENABLE_OTHER_ACCESS_BUTTONS , {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.ENABLE_OTHER_ACCESS_BUTTONS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${SETTINGS.ENABLE_OTHER_ACCESS_BUTTONS}.Hint`,
        })

        // A Setting to change access icons when using the new access items
        game.settings.register(this.ID, SETTINGS.OTHER_ACCESS_BUTTON_ICONS, {
            name: `DICE_STATS_TEXT.settings.${SETTINGS.OTHER_ACCESS_BUTTON_ICONS}.Name`,
            default: 'fas fa-dice-d20',
            type: String,
            scope: 'world',
            config: true,
            hint: game.i18n.localize(`DICE_STATS_TEXT.settings.${SETTINGS.OTHER_ACCESS_BUTTON_ICONS}.Hint`),
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

    /**
     * Method used that parses messages from the chat. This is how we know a roll has happened, what die was rolled, and the value
     * @param {Message} msg - chat message object
     */
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
        if(game.settings.get(MODULE_ID_DS,SETTINGS.ENABLE_AUTO_DB)) 
        {
            //If It was my Roll
            this.saveMyPlayerData();
        }
    }

    /**
     * Method used to add toll to a specifc player
     * @param {DIE_TYPE} dieType 
     * @param {int[]} rolls - array of rolled values in chat. might get array from things like advantage ect 
     * @param {String} user - userid 
     * @param {bool} isBlind 
     */
    addRoll(dieType=7, rolls=[], user=game.user.id, isBlind=false){
        let playerInfo = this.ALLPLAYERDATA.get(user);

        rolls.forEach(element => {
            playerInfo.saveRoll(isBlind, element, dieType)
        });
    }

    /**
     * Tell user to move any blind rolls they have saved from the blind roll ary 
     * to the data aray so the user can see the rolls on the charts
     */
    pushBlindRolls(){
        for (let user of game.users) {
            this.ALLPLAYERDATA.get(user.id)?.pushBlindRolls();
        }
    }

    /**
     * Erase all locally stored data
     */
    clearAllRollData(){
        for (let user of game.users) {
            this.ALLPLAYERDATA.get(user.id)?.clearDiceData();
        }
    }

    /**
     * Erase a specific users locally stored data
     * @param {String} userid 
     */
    clearUsersRollData(userid){
        this.ALLPLAYERDATA.get(userid)?.clearDiceData();
    }

    /**
     * Save my players data to the DB
     */
    saveMyPlayerData(){
        let myData = this.ALLPLAYERDATA.get(game.user.id)
        if(myData)
        {
            DB_INTERACTION.saveUserData(myData); 
        }
    }
     
    /**
     * Load Every Players Data from the DB
     */
    loadAllPlayerData(){
        for(let tempUser of game.users)
        {
            var dbInfo = DB_INTERACTION.loadPlayerData(tempUser.id);
            if(dbInfo)
            {
                let localPlayerInfo = this.ALLPLAYERDATA.get(tempUser.id);

                if(localPlayerInfo)
                {
                    DB_INTERACTION.createPlayerObject(localPlayerInfo,dbInfo); //Puts db info into local player obj
                    this.ALLPLAYERDATA.set(tempUser.id,localPlayerInfo);

                    if(GLOBALFORMOBJ != null){
                        GLOBALFORMOBJ.render();
                    }

                    if(PLAYERFORMOBJ != null){
                        PLAYERFORMOBJ.render();
                    }
                }
            }
            else
            {
                //DB returned null, save an empty user data
                console.log("Warning: No DB data Found, Setting local value to 0");
                let tempPlayer = this.ALLPLAYERDATA.get(tempUser.id);
                tempPlayer.clearAllRollData();

                DB_INTERACTION.saveUserData(tempPlayer);

                // Update local player var with 0 values too
                let localPlayerInfo = this.ALLPLAYERDATA.get(tempUser.id);
                if(localPlayerInfo)
                {
                    //Update map with 0 values 
                    this.ALLPLAYERDATA.set(tempUser.id,localPlayerInfo);
                }

                if(GLOBALFORMOBJ != null){
                    GLOBALFORMOBJ.render();
                }

                if(PLAYERFORMOBJ != null){
                    PLAYERFORMOBJ.render();
                }
            }
        }
    }

    /**
     * Load your players data from the data
     */
    loadYourPlayerData(){
        var dbInfo = DB_INTERACTION.loadPlayerData(game.user.id);
        if(dbInfo)
        {
            let localPlayerInfo = this.ALLPLAYERDATA.get(game.user.id);

            DB_INTERACTION.createPlayerObject(localPlayerInfo,dbInfo);
            this.ALLPLAYERDATA.set(game.user.id,localPlayerInfo);

            if(GLOBALFORMOBJ){
                GLOBALFORMOBJ.render();
            }

            if(PLAYERFORMOBJ){
                PLAYERFORMOBJ.render();
            }
        } 
    }

    /**
     * Load other players data from the DB (Not yours)
     */
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

    /**
     * Clear DB values
     */
    clear_database()
    {
        DB_INTERACTION.clearDB();
    }
}
