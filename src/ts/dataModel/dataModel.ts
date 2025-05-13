import { DIE_TYPE } from "../constants";
import { DiceStatsPlayer } from "./player";
import { MyGenericApplication } from "../ui/forms/GenericForm";
import { SystemDataFactory } from "./systemData/systemDataFactory";
import { DieInfo } from "./genericData/dice";
import { GenericSystemData } from "./systemData/genericSystemData";
import { GenericDataParser } from "./genericData/genericDataParser";
import { PlayerDataForm } from "../ui/forms/playerDataForm";

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
        //let id:core = 'dice-stats'
        DiceStatsModuleSettings.registerSettings();

        // TODO: Create Form Objects
        this._settingsForm = new MyGenericApplication();
        this._globalForm = new MyGenericApplication();
        this._compareForm = new MyGenericApplication();

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

    // Update Player form to hold system templates
    public setSystemTemplates(system_chart_tempalte:string, system_data_template:string){
        PlayerDataForm.templates.systemChartTab = system_chart_tempalte;
        PlayerDataForm.templates.systemDetailsTab = system_data_template;
    }

    /* ========================================================= */
    static id:any = 'dice-stats';
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

        /* ================================================== */
        // Get author of message
        let authorId = message.author.id;

        // Get the player that the roll is associated with
        let playerInfo:DiceStatsPlayer|undefined = this.diceStatsPlayerMap.get(authorId);

        // Get the specific system parser to parse msg
        let systemParser = SystemDataFactory.createSystemData((game as Game).system.id);
        let systemInfo = systemParser.parseRollMessage(message);

        let genericInfoAry:DieInfo[] = GenericDataParser.parseMessageData(message);
        
        if (playerInfo){
            playerInfo.addGenericInfo(genericInfoAry);
            playerInfo.addSystemInfo(systemInfo);
        }

        this.saveDataToDB();
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

    public saveDataToDB(){

    }
}

export class DiceStatsModuleSettings {
    static settingsRegisterd = false;

    static registerSettings(){
        // Only register settings once
        if (this.settingsRegisterd == true){
            return;
        }
        this.settingsRegisterd = true;

        // ---- Possible Settings ----
        //      Setting                 Scope: World(Global) | Client       Default Value
        // Plyr See Settings                    Global                          True
        // Plyr See Global                      Global                          True
        // Plyr See Compare                     Global                          True
        // Plyr See GM                          Global                          True
        // Plyr See Other Players               Global                          True
        // Plyr See Self                        Global                          True
        // Plyr Hide Blind Rolls                Global                          False

        // Include GM In Global                 Global                          True
        // Clear All On Login Popup             Global                          False

        // 
        var players_see_gm:any = 'players_see_gm';
        (game as Game).settings.register(DiceStatsDataModel.id, players_see_gm, {
            name: `DiceStats.Settings.${players_see_gm}.Name`,
            default: false,
            type: Boolean,
            scope: 'world',
            config: true,
            hint: `DiceStats.Settings.${players_see_gm}.Hint`
            //restricted: true    // Restric item to gamemaster only 
            //Only used for non world lvl items. All World items are already gm only
        })

    }
}