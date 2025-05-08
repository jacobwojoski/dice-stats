import { DIE_TYPE } from "../constants";
import { DiceStatsPlayer } from "./player";

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
        this._globalForm = {}
        this._compareForm = {}
        this._importExportForm = {}
        this._settingsForm = {}
        // Create Player Map
    }

    private _isPaused = false;
    private _globalForm;
    private _compareForm;
    private _importExportForm;
    private _settingsForm;

    /* Player forms are saved in the player specifc objects */
    /* Map: [PlayerName | UserID] => [DiceStatsPlayer Info] */
    diceStatsPlayerMap: Map< string|number, DiceStatsPlayer> = new Map< string|number, DiceStatsPlayer>();

    // Parse Foundry Message Object
    public parseRollMessage(message: any){
        // Is msg roll?
        // Get Player Associated With msg
        // Parse System Data
        // Parse Generic Data
    }

    /* ================= API FN's ==================== */
    public saveRollValue(player_id:string, die_type:DIE_TYPE, die_value:number){
        if (this._isPaused){
            return
        }

        var playerObj = this.diceStatsPlayerMap.get(player_id);
        playerObj?.addRollData(die_value, die_type)
    }

    public openGlobalForm(isGM: boolean = false){
        //this._globalForm?.render(true)
    }

    public openCompareForm(isGM: boolean = false){
        //this._compareForm?.render(true)
    }

    public openImportExportForm(isGM: boolean = false){
        //this._importExportForm.render(true)
    }

    public openSettingsForm(isGM: boolean = false){
        var loc_game: Game = game as Game
        loc_game.user?.isGM
        loc_game.i18n.localize("")
        //this._settingsForm.render(true)
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

}