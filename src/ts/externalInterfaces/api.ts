import { DIE_TYPE } from "../constants";
import { DiceStatsDataModel } from "../dataModel/dataModel";
/**
 * This class is the API for dice stats. Used to allow other modules & macros easily access the data.
 * 
 * Different Functions:        Fn Returns
 * 
 * openGlobalStats({VOID})          -> Open Global Stats UI
 * openCompareStats({VOID})         -> Open Compare Stats UI
 * openPlayerStats({INT} player_id) -> Open the players stats for the player ID selected
 * openExportStats({BOOL} isGM)     -> Open Export page if they're the GM
 * changePauseDiceStats({VOID})     -> Pause or unpause Saving of Dice Stats
 * 
 * saveRollValue({STRING:Player_id}, {ENUM:DIE_TYPE: #}, {INT: #}) -> Save a generic roll result to a player
 * 
 * getDataModel({VOID})        -> String[]=    Array of player ID's that are stored in the dice stats database
 * getGlobals({VOID})           -> DS_GLOBALS=  Global Dice Stats Object & Enums 
 * 
 * 
 */

/* --- Examples on how to use API
    // if I need to do something as soon as the cool-module is ready
    Hooks.on('diceStatsReady', (api) => {
    // do what I need with their api
    });

    // alternatively if I know that the API should be populated when I need it,
    // I can defensively use the api on game.modules
    game.modules.get('diceStatsReady')?.api?.diceStatsApiStaticMethod(someInput)
*/
export class DiceStatsAPI {
    /**
    * @returns {VOID} - Save specific roll value to player stats
    */
    static saveRollValue(/*player-id*/player_id:string,/*int:enum*/die_type:DIE_TYPE, /*result*/roll_value: number){

        // Save to Dice Stats data storage
        DiceStatsDataModel.getInstance().saveRollValue(player_id,die_type,roll_value);
    }

    static changePauseState(){
        DiceStatsDataModel.getInstance().changePauseState()
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static async openGlobalStats(){
        DiceStatsDataModel.getInstance().openGlobalForm()
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static async openCompareStats(){
        DiceStatsDataModel.getInstance().openCompareForm()
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static openPlayerStats(player_id:string){
        DiceStatsDataModel.getInstance().openPlayerForm(player_id)
    }

    /**
     * @returns {VOID} - Renders UI Component
     */
    static openDiceStatsSettings(isGM:boolean){
        DiceStatsDataModel.getInstance().openSettingsForm(isGM);
    }
}