//Were using this class as a singleton although its not quite set up correctly as one. 
// This is the main dice stats class. It holds all the data.
class DiceStatsTracker {
    AM_I_GM = false;

    ID = 'dice-stats';

    SYSTEM = '';

    /*PLAYER_ID to PLAYER_INFO map*/
    PLAYER_DATA_MAP = null; //<PLAYER_ID, PLAYER_DATA>

    PLAYER_STATS_FORM_DIE_CHECKBOXES =   [];
    GLOBAL_STATS_FORM_DIE_CHECKBOXES =   [];
    COMPARISON_FORM_DIE_CHECKBOXES =     [];
    COMPARISON_FORM_PLAYER_CHECKBOXES =  [];

    /**
     * Update global map to add a key value pair for every user.
     * key:value = {int}userid:{PLAYER}PLAYER Object
     */
    updateMap(){
        //Add everyplayer to storage. Were tracking all even if we dont need
        for (let user of game.users) {
            if(!this.PLAYER_DATA_MAP.has(user.id)){
                this.PLAYER_DATA_MAP.set(user.id, new PLAYER(user.id))    
            }
        }
    }

    updateComparisonFormCheckboxes(){
        this.COMPARISON_FORM_PLAYER_CHECKBOXES = new Array();
        for(let user of game.users)
        {
            let temp = new ComparePlayerObjUtil(user);
            this.COMPARISON_FORM_PLAYER_CHECKBOXES.push(temp);
        }
    }

    constructor(){
        //Get Settings and System Info
        // Store the current system, for settings purposes. It has to be set here, and not in the parent
        // class, because the system needs to initialize on foundry boot up before we can get its id
        //DS_GLOBALS.GAME_SYSTEM_ID = `${game.system.id}`;
        this.SYSTEM = `${game.system.id}`

        this.PLAYER_DATA_MAP = new Map();
        
        this.PLAYER_STATS_FORM_DIE_CHECKBOXES =   new Array(DS_GLOBALS.NUM_DIE_TYPES);
        this.GLOBAL_STATS_FORM_DIE_CHECKBOXES =   new Array(DS_GLOBALS.NUM_DIE_TYPES);
        this.COMPARISON_FORM_DIE_CHECKBOXES =     new Array(DS_GLOBALS.NUM_DIE_TYPES);
        // This can only be update when game system is ready to know player count
        //COMPARISON_FORM_PLAYER_CHECKBOXES =  []; 

        this.PLAYER_STATS_FORM_DIE_CHECKBOXES.fill(true);
        this.GLOBAL_STATS_FORM_DIE_CHECKBOXES.fill(true);
        this.COMPARISON_FORM_DIE_CHECKBOXES.fill(true);

        let ID = 'dice-stats';

        // A setting to determine whether players can see gm data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM}.Hint`
            //restricted: true    // Restric item to gamemaster only 
            //Only used for non world lvl items. All World items are already gm only
        })

        // A setting to determine whether players can see global data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GLOBAL, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GLOBAL}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GLOBAL}.Hint`,
        })

        // A setting to determine whether players can see global data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL}.Hint`,
        })

        // A setting to determine whether players can see global data
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE}.Hint`,
        })

        // A setting to let db interaction be automated
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB , {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB}.Name`,
            default: true,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB}.Hint`,
        })

        // A Setting to change access icons when using the new access items
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.OTHER_ACCESS_BUTTON_ICONS, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.OTHER_ACCESS_BUTTON_ICONS}.Name`,
            default: 'fas fa-dice-d20',
            type: String,
            scope: 'world',
            config: true,
            hint: game.i18n.localize(`DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.OTHER_ACCESS_BUTTON_ICONS}.Hint`),
        })

        // A setting to limit players to only see global stats
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS}.Name`,
            default: true,
            type: Boolean,
            scope: 'world', //world = db, client = local
            config: true,   // show in module config
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS}.Hint`,
            restricted: true,
        })

        // A setting that creates a popup for the gm everytime they join the game asking if they want to "clear all player data"
        // This clears all DB values and local values
        game.settings.register(ID, DS_GLOBALS.MODULE_SETTINGS.GLOBAL_ENABLE_CLEAR_ALL_STATS_POPUP, {
            name: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.GLOBAL_ENABLE_CLEAR_ALL_STATS_POPUP}.Name`,
            default: true,
            type: Boolean,
            scope: 'world', //world = db, client = local
            config: true,   // show in module config
            hint: `DICE_STATS_TEXT.settings.${DS_GLOBALS.MODULE_SETTINGS.GLOBAL_ENABLE_CLEAR_ALL_STATS_POPUP}.Hint`,
            restricted: true,
        })
    }

    /**
     * Method used that parses messages from the chat. This is how we know a roll has happened, what die was rolled, and the value
     * @param {Message} msg - chat message object
     */
    parseMessage(msg){
        let isBlind = msg.blind;

        //Get Associated player object
        let playerInfo = this.PLAYER_DATA_MAP.get(msg.user.id);

        //For multiple rolls in chat
        for (let tempRoll = 0; tempRoll < msg.rolls.length; tempRoll++) {
            
            //For multiple dice types per roll
            for(let tempDie=0; tempDie<msg.rolls[tempRoll]?.dice.length ; tempDie++){

                //Get die type
                let sides = msg.rolls[tempRoll]?.dice[tempDie].faces;
                let dieType = DS_GLOBALS.MAX_TO_DIE.get(sides);
                let newNumbers = [];
                //Get type of roll (Atack, Save, ect)
                let rollType = DICE_STATS_UTILS.getRollType(msg);

                //In case there's more than one die rolled in a single instance as in 
                //  fortune/misfortune rolls or multiple hit dice save each roll
                newNumbers = msg.rolls[tempRoll].dice[tempDie].results.map(result => result.result)

                newNumbers.forEach(element => {
                    playerInfo.saveRoll(isBlind, element, dieType, rollType)
                });
            }
            
        }

        //If AutoSave is Enabled by GM
        if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_AUTO_DB)) 
        {
            //If it was my roll save my data to the db
            if(msg.user.id == game.user.id)
            {
                this.saveMyPlayerData();
            }
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
        let playerInfo = this.PLAYER_DATA_MAP.get(user);

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
            this.PLAYER_DATA_MAP.get(user.id)?.pushBlindRolls();
        }
    }

    /**
     * Erase all locally stored data
     */
    clearAllRollData(){
        for (let user of game.users) {
            this.PLAYER_DATA_MAP.get(user.id)?.clearDiceData();
        }
    }

    /**
     * Erase a specific users locally stored data
     * @param {String} userid 
     */
    clearUsersRollData(userid){
        this.PLAYER_DATA_MAP.get(userid)?.clearDiceData();
    }

    /**
     * Save my players data to the DB
     */
    saveMyPlayerData(){
        let myData = this.PLAYER_DATA_MAP.get(game.user.id)
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
                let localPlayerInfo = this.PLAYER_DATA_MAP.get(tempUser.id);

                if(localPlayerInfo)
                {
                    DB_INTERACTION.createPlayerObject(localPlayerInfo,dbInfo); //Puts db info into local player obj
                    this.PLAYER_DATA_MAP.set(tempUser.id,localPlayerInfo);
                }
            }
            else
            {
                //DB returned null clear local data
                console.log("Warning: No DB data Found, Setting local value to 0");
                let tempPlayer = this.PLAYER_DATA_MAP.get(tempUser.id);
                tempPlayer.clearAllRollData();
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
            let localPlayerInfo = this.PLAYER_DATA_MAP.get(game.user.id);

            DB_INTERACTION.createPlayerObject(localPlayerInfo, dbInfo);
            this.PLAYER_DATA_MAP.set(game.user.id, localPlayerInfo);
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
                    let localPlayerInfo = this.PLAYER_DATA_MAP.get(tempUser.id);

                    DB_INTERACTION.createPlayerObject(localPlayerInfo, dbInfo);
                    this.PLAYER_DATA_MAP.set(tempUser.id, localPlayerInfo);
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