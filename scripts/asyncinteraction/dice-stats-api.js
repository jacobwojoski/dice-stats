import { DS_GLOBALS } from "../dice-stats-globals.js";
import { DiceStatsTracker } from "../dice-stats-main.js";

/**
 * This class is the API for dice stats. Used to allow other modules & macros easily access the data.
 * 
 * Different Functions:        Fn Returns
 * 
 * saveRollValue({STRING:Player_id}, {ENUM:DIE_TYPE: #}, {INT: #}) -> Save a roll result to a player
 * getPlayerList({VOID})        -> String[]=    Array of player ID's that are stored in the dice stats database
 * getGlobals({VOID})           -> DS_GLOBALS=  Global Dice Stats Object & Enums 
 * 
 * openGlobalStats({VOID})      -> Open Global Stats UI
 * openCompareStats({VOID})     -> Open Compare Stats UI
 * openPlayerStats({INT} player_id) -> Open the players stats for the player ID selected
 * openExportStats({BOOL} isGM) -> Open Export page if they're the GM
 * 
 */
export class DiceStatsAPI {
    /**
    * @returns {VOID} - Save specific roll value to player stats
    */
    static saveRollValue(/*player-id*/player_id,/*int:enum*/die_type, /*result*/roll_value){

    }

    /**
    * @returns {VOID} - Save roll specific details, Requires building roll specific info
    */
    static saveRollInfo(/*player-id*/player_id, /*roll_info*/roll_info){

    }

    /**
     * @returns {String []} - Array of player id's that are stored in the map
     */
    static getPlayerList(){
        // Return list of player id's saved in map
    }

    /**
     * @returns {DS_GLOBALS} - Globals object for enums & other global vars, Def not the most secure and should
     * be used sparingly.
     */
    static getGlobals(){
        // Retrun pointer to global data struct
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static openGlobalStats(){

    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static openCompareStats(){

    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static openPlayerStats(/*String*/player_id){

    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static openExportStats(/*Bool*/isGM){

    }
}