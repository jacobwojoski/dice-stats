// -----------------------------------------
// ------------ GLOBAL VALUES --------------
// -----------------------------------------

class DS_GLOBALS {
    /* ------ SYSTEM GLOBALS ------*/
    static GAME_SYSTEM_ID= '';
    static MODULE_SOCKET= null;
    static MODULE_ID= 'dice-stats';
    static MODULE_FLAGS = {
        ROLLDATAFLAG:'player_roll_data'
    };
    static MODULE_TEMPLATES= {
        GLOBALDATAFORM:     'modules/dice-stats/templates/dice-stats-global.hbs',
        COMPAREFORM:        'modules/dice-stats/templates/dice-stats-compare.hbs',
        TABEDPLAYERBASE:    'modules/dice-stats/templates/partial/tab_player_base.hbs',
        TABEDPLAYER_ALL:   'modules/dice-stats/templates/partial/tab_player_stats_all_dice.hbs',
        TABEDPLAYER_D20:   'modules/dice-stats/templates/partial/tab_player_stats_d20.hbs',
        TEBEDPLAYER_2DX:   'modules/dice-stats/templates/partial/tab_player_stats_2dx.hbs',
        TABEDPLAYER_ERROR: 'modules/dice-stats/templates/partial/tab_player_unsupported_info.hbs'
    };
    static MODULE_SETTINGS= {
        PLAYERS_SEE_PLAYERS:        'players_see_players', //if players cant see self they cant see others either     [Def: True]      (Global)
        PLAYERS_SEE_GM:             'players_see_gm',       //If Players can see GM dice roll stats                    [Def: False]     (Global)
        PLAYERS_SEE_GLOBAL:         'players_see_global',   //If Players Can  Global Dice Stats                        [Def: True]      (Global)
        PLAYERS_SEE_GM_IN_GLOBAL:   'players_see_gm_in_global',   //If GM roll stats get added into global stats [Def: False]     (Global) 
        SHOW_BLIND_ROLLS_IMMEDIATE: 'enable_blind_rolls_immediate', //Allow blind rolls to be saved immediately   [Def: false]  (Global)
        ENABLE_AUTO_DB:             'enable_auto_db', //Rolling data gets saved to automatically and user load from DB on joining  [Def: true] (Global)
        OTHER_ACCESS_BUTTON_ICONS:  'player_access_icons', //Change player icons to use custom       [Default: fas fa-dice-d20]  (Global)
    
        GLOBAL_ENABLE_OTHER_DB:         'global_enable_other_db',       //Enable the .json file db version (Turn off flags DB)
        LOCAL_DISABLE_OTHER_DP_POPUP:   'local_enable_other_db_popup',  //Disable the popup notifcation for the file DB version
    };
    /* ------ GLOBAL DS OBJECTS ------- */
    static DS_OBJ_GLOBAL= null;
    static FORM_GL_STATS= null;
    static FORM_GL_COMPARE= null;
    static FORM_PLAYER_STATS= null;
    static SCENE_CONTROL_BTNS= null;

    /* ------ UTIL GLOBALS ------- */
    /**
     * If more dice types want to be added or number of dice types changed you need to edit the following:
     * main/NUM_DIE_TYPES
     * main/DIE_TYPE
     * main/DIE_MAX
     * main/MAX_TO_DIE
     * datapack/PLAYER_HANDL_INFO/DICE_ROLL_DATA
     * datapack/GLOBAL_HANDL_INFO/DICE_ROLL_DATA
     */
    static NUM_DIE_TYPES= 9;   //Size of {DIE_TYPE}
    static DIE_TYPE= {         //TYPES of DICE I TRACK
        D2:     0,
        D3:     1,
        D4:     2,
        D6:     3,
        D8:     4,
        D10:    5,
        D12:    6,
        D20:    7,
        D100:   8
    };
    
    /** Adding a roll type involves updating the following
     *      DB interaction
     *      datapack (player section)
     *      diceinfo
     *      utils (Parser)
     *      
     *      hbs
     */ 
    static NUM_ROLL_TYPES= 6;  //Size of {ROLL_TYPE}
    static ROLL_TYPE= {        //Types of rolls the user can roll
        ATK: 0,     /* Rolling to Attack */
        DMG: 1,     /* Rolling Damage */
        SAVE: 2,    /* Rolling Will, Fortitude, Reflex*/
        SKILL: 3,   /* Rolling Stealth, Perception, Nature ETC*/
        ABILITY: 4, /* Rolling STR, CON, DEX ETC */
        /* UNKNOWN includes flat checks. No way to distingush them as there is no "flat check roll. 
        Its just has no details. Same output as typing /r 1d20 in chat and using result for something. 
        Its not assigned as Damage or atack ect */
        UNKNOWN: 5    
    };

    //Convert {DIE_TYPE} to the max value you can roll on that die
    static MAX_DIE_VALUE= [2,3,4,6,8,10,12,20,100];

    //Convert Max value of Die to Associated {GL_DIE_TYPE}
    //Used when parcing message. Message sends Number of faces. We need to convert to DIE_TYPE enum
    static MAX_TO_DIE=         new Map();
}

//Load {MAP} MAX_TO_DIE To be used in DICE_STATS message parsing
DS_GLOBALS.MAX_TO_DIE.set(2,   DS_GLOBALS.DIE_TYPE.D2);
DS_GLOBALS.MAX_TO_DIE.set(3,   DS_GLOBALS.DIE_TYPE.D3);
DS_GLOBALS.MAX_TO_DIE.set(4,   DS_GLOBALS.DIE_TYPE.D4);
DS_GLOBALS.MAX_TO_DIE.set(6,   DS_GLOBALS.DIE_TYPE.D6);
DS_GLOBALS.MAX_TO_DIE.set(8,   DS_GLOBALS.DIE_TYPE.D8);
DS_GLOBALS.MAX_TO_DIE.set(10,  DS_GLOBALS.DIE_TYPE.D10);
DS_GLOBALS.MAX_TO_DIE.set(12,  DS_GLOBALS.DIE_TYPE.D12);
DS_GLOBALS.MAX_TO_DIE.set(20,  DS_GLOBALS.DIE_TYPE.D20);
DS_GLOBALS.MAX_TO_DIE.set(100, DS_GLOBALS.DIE_TYPE.D100);

// -------------------------------------------
// ---------- END GLOBAL VALUES --------------
// -------------------------------------------