import { DieInfo } from "./genericData/dice.js";
import { GenericSystemData } from "./systemData/genericSystemData.js";
import { SystemDataFactory } from "./systemData/systemDataFactory.js";
import { DIE_TYPE } from "../constants.js";

/**
 * DESC: 
 *  Class that defines a player. Players are all connected people to server including gm
 *  Players hold system agnostic info (DiceInfo) and System Specific info (SystemInfo)
 */
export class DiceStatsPlayer {

    _userId:string = '';            // {string} - Unique player id
    _userName:string = '';          // {string} - Readable Name
    _isGm:boolean = false;          // {bool} - Is the player a GM

    _playerForm = 0;                // {Tabbed Dice Stats Player Form Obj}

    _diceInfo:DieInfo[];            // {DieInfo[]}
    _systemInfo:GenericSystemData;     // System Specific Data (Different class onject depending on the system were in)

    /**
     * Create Player Object
     * @param {string} in_user_id - The unique user id
     * @param {string} in_user_name - the Readable username
     * @param {boolean} in_is_gm - Is the player a GM
     * @param {string} system_id - System specific id ex: dnd5e or pf2e
     */
    constructor(in_user_id:string, in_user_name:string, in_is_gm:boolean, system_id:string){
        this._userId = in_user_id;
        this._userName = in_user_name;
        this._isGm = in_is_gm;
        
        this._diceInfo = DieInfo.createDieInfoAry()
        this._systemInfo = SystemDataFactory.createSystemData(system_id)
    }

    // ====== Getters & Setters ======
    getUsername(){return this._userName}
    getUserID(){return this._userId}
    getIsGm(){return this._isGm}

    /**
     * @param {string} in_user_name 
     */
    setUsername(in_user_name:string){this._userName = in_user_name}
    /**
     * @param {string} in_user_id 
     */
    setUserID(in_user_id:string){this._userId = in_user_id}
    /**
     * @param {boolean} in_is_gm 
     */
    setIsGm(in_is_gm:boolean){this._isGm = in_is_gm}

    // ====== Public Funtions ======

    // ---- Clear all dice, Roll, and system Data ----
    clearAllData(){
        this.clearAllDiceData()
        this._systemInfo.clear()
        
    }

    // ---- System Funtions ----
    clearSystemData(){
        this._systemInfo.clear()
    }
    addSystemData(system_info:GenericSystemData){
        this._systemInfo.addSystemData(system_info)
    }

    // ---- Dice Functions ---- 
    clearAllDiceData(){
        for (let die of this._diceInfo){
            die.clear()
        }
    }
    clearDieData(die_type:DIE_TYPE){
        this._diceInfo[die_type]?.clear()
    }
    addDieData(die_info:DieInfo){
        this._diceInfo[die_info.type].addDieInfo(die_info)
    }
    addRollData(roll_value:number, die_type:DIE_TYPE){
        this._diceInfo[die_type].addNewRoll(roll_value)
    }

    // ---- Player Form Functions ----
    openPlayerForm(){
        //this._playerForm.render(true)
    }

}