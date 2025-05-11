import { DIE_TYPE } from "../constants";
import { DiceStatsPlayer } from "./player";
import { MyGenericApplication } from "../ui/forms/GenericForm";

/* Create a singleton DataModel Class */
export class DiceStatsDataModel {
    private static _instance: DiceStatsDataModel;

    static getInstance(): DiceStatsDataModel {
        if (!DiceStatsDataModel._instance || DiceStatsDataModel._instance == undefined) {
            DiceStatsDataModel._instance = new DiceStatsDataModel();
        }
        return DiceStatsDataModel._instance;
    }

    private constructor() {
        // Private to prevent direct instantiation

        // TODO: Create Form Objects
        this._settingsForm = new MyGenericApplication();
        this._globalForm = new MyGenericApplication();
        this._compareForm = new MyGenericApplication()

        // Create Player Map
    }

    public loadPlayers(){
        let UsersAry = (game as Game)?.users
        let systemId = (game as Game).system.id
        if (UsersAry) {
            for (var user of UsersAry){
                let playerObj = new DiceStatsPlayer(user._id, user.name, user.isGM, systemId);

                this.diceStatsPlayerMap.set(user.name, playerObj);
                this.diceStatsPlayerMap.set(user._id, playerObj);
            }
        }
    }

    /* ========================================================= */
    private _isPaused = false;
    private _settingsForm;
    private _globalForm;
    private _compareForm;
    /*private _playerForms[]; Player forms are saved in the player specifc objects */
    
    /* Map: [PlayerName | UserID] => [DiceStatsPlayer Info] */
    diceStatsPlayerMap: Map< string|number, DiceStatsPlayer> = new Map< string|number, DiceStatsPlayer>();
    /* ========================================================= */

    // Parse Foundry Message Object
    public parseRollMessage(message: any){
        // Are we paused saving data? or Is msg is not a roll?
        if (this._isPaused || !message.isRoll){
            return }
        
        // Get Player Associated With msg
        // Player -> Parse System Data
        // Player -> Parse Generic Data
    }

    /* ================= API FN's ==================== */
    public openSettingsForm(isGM: boolean = false){
        this._settingsForm?.render(true)
    }

    public openGlobalForm(isGM: boolean = false){
        this._globalForm?.render(true)
    }

    public openCompareForm(isGM: boolean = false){
        this._compareForm?.render(true)
    }

    public openPlayerForm(player_id:string="", player_name="", isGM: boolean = false){
        if(player_id){
            this.diceStatsPlayerMap.get(player_id)?.openPlayerForm()
        }else if(player_name){
            this.diceStatsPlayerMap.get(player_name)?.openPlayerForm()
        }
    }

    public changePauseState(isGM: boolean = false){
        this._isPaused = !this._isPaused;
        return this._isPaused;
    }
    
    public getIsPaused(){
        return this._isPaused;
    }

    public saveRollValue(player_id:string, die_type:DIE_TYPE, die_value:number){
        if (this._isPaused){
            return}

        var playerObj = this.diceStatsPlayerMap.get(player_id);
        playerObj?.addRollData(die_value, die_type)
    }

}