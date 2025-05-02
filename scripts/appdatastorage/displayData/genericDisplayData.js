import { DS_GLOBALS } from "../../dice-stats-globals.js";
import {PLAYER} from "../genericData/dice-stats-player.js"

/* Convert PLAYER into a class that can be more easily parsed by handlebars */
export class PlayerDisplayData {
    // ====== Settings ======
    is_auto_db_active   = false;
    is_die_displayed    = [DS_GLOBALS.NUM_DIE_TYPES];

    // ====== player info ======

    // ====== Dice Info ======

    // ====== Misc Info ======
    player_name: '',
    //Is Auto DB feature enabled (Auto Save & Load)
    AUTO_DB_ACTIVE: false,

    //array<bools>[num_of_dice] Used by checkboxes on UI
    IS_DIE_DISPLAYED: [DS_GLOBALS.NUM_DIE_TYPES],

    //Arrays Use DIE_TYPE to get values for specific dice
    MEAN:   [DS_GLOBALS.NUM_DIE_TYPES],
    MEDIAN: [DS_GLOBALS.NUM_DIE_TYPES],
    MODE:   [DS_GLOBALS.NUM_DIE_TYPES],
    STREAK: [DS_GLOBALS.NUM_DIE_TYPES], //Array of strings
    S_IS_B: [DS_GLOBALS.NUM_DIE_TYPES],

    TOTAL_ROLLS:    [DS_GLOBALS.NUM_DIE_TYPES],
    D2_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D2]],
    D3_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D3]],
    D4_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D4]],
    D6_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D6]],
    D8_ROLL_DATA:   [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D8]],
    D10_ROLL_DATA:  [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D10]],
    D12_ROLL_DATA:  [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D12]],
    D20_ROLL_DATA:  [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
    D100_ROLL_DATA: [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D100]],

    // -------- SUBCATAGORIZE DICE INFO --------
    // -- Only support D20's for PF2e 

    // Bool Array of Size NUM_DICE_TYPES
    HAVE_DICE_SUB_CATAGORIES: [DS_GLOBALS.NUM_DIE_TYPES],

    //D20 Info
    D20_ATK:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
    D20_DMG:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
    D20_SAVE:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
    D20_SKILL:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
    D20_ABILITY:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
    D20_UNKNOWN:[DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],

    D20_MEAN:       [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
    D20_MEDIAN:     [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],
    D20_MODE:       [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.DIE_TYPE.D20]],

    //Size= NUM_ROLL_TYPES, total [atk, Dmg, save, skill, unknown] rolls
    D20_ROLLCOUNT:  [DS_GLOBALS.MAX_DIE_VALUE[DS_GLOBALS.NUM_ROLL_TYPES]], 

    BLIND_ROLL_COUNT: 0,

    /* ---- START ROLL DATA ---- */
    ROLL_DATA_IS_TRACKED: false,

    // Attack Info
    ATK_OUTCOME_TRACKER: [DS_GLOBALS.NUM_ROLL_TYPES],        // {INT[]} Degree success for every attack; length=DEGREE_SUCCESS.size 
    NUM_UNTARGETED_ATKS: 0,      // {INT}
    TOTAL_ATTACKS: 0,            // {INT}

    // Save Info
    SAVE_OUTCOME_TRACKER: [DS_GLOBALS.NUM_ROLL_TYPES],       // {INT[]} Degree success for Saves length=DEGREE_SUCCESS.size 
    NUM_UNTARGETED_SAVES: 0,     // {INT}
    TOTAL_SAVES: 0,              // {INT}


    
    constructor(player:PLAYER){
        
    }
}

