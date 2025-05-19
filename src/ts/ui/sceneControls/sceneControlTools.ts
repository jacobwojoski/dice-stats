import { DiceStatsDataModel } from "../../dataModel/dataModel";
import { MyGenericApplication } from "../forms/GenericForm";
import { PlayerDataForm } from "../forms/playerDataForm";

export class CustomSceneControlToolUnused implements SceneControls.ToolNoToggle
{
    name:string = (game as Game).i18n?.localize('DiceStats.SceneControls.Unused.Name') ?? 'Unused';
    title = (game as Game).i18n?.localize('DiceStats.SceneControls.Unused.Title') ?? '';
    icon = 'fa-solid fa-power-off';
    layer = 'diceStats';
    order= 0;

    visible= true;
    active= true;
    button= true;

    async onChange(event:any, active:any){
        console.log("Unused scene control button")
    }

    constructor(){}
}

export class CustomSceneControlToolSettings implements SceneControls.ToolNoToggle 
{
    name:string = (game as Game).i18n?.localize('DiceStats.SceneControls.Settings.Name') ?? '';
    title = (game as Game).i18n?.localize('DiceStats.SceneControls.Settings.Title') ?? '';
    icon = 'fa-solid fa-gears';
    layer = 'diceStats';
    order= 0;

    visible= true;
    active= false;
    button= true;

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openSettingsForm()
    }
    constructor(){}
    // TODO: Add pause and export functionalities to settings form
    // Give desc of other settings info (Change icon setting here?)
}

// Global Scene Control Icon 
export class CustomSceneControlToolGlobal implements SceneControls.ToolNoToggle
{
    active= false;
    button= true;

    name:string = (game as Game).i18n?.localize('DiceStats.SceneControls.GlobalStats.Name') ?? '';
    title = (game as Game).i18n?.localize('DiceStats.SceneControls.GlobalStats.Title') ?? '';
    icon = 'fa-solid fa-earth-americas';
    layer = 'diceStats';
    order= 0;

    visible= true;

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openGlobalForm()
    }
    constructor(){}
}

// Compare Scene Control Icon
export class CustomSceneControlToolCompare implements SceneControls.ToolNoToggle
{
    active= false;
    button= true;

    name:string = (game as Game).i18n?.localize('DiceStats.SceneControls.CompareStats.Name') ?? '';
    title = (game as Game).i18n?.localize('DiceStats.SceneControls.CompareStats.Title') ?? '';
    icon = 'fa-solid fa-users-line';
    layer = 'diceStats';
    order= 0;

    visible= true;

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openCompareForm()
    }

    constructor(){}
}

// Player Scene Control Icons (Icon can be customized in settings)
export class CustomSceneControlToolPlayer implements SceneControls.ToolNoToggle
{
    static app: MyGenericApplication| PlayerDataForm | undefined = undefined
    active = false;
    button = true;
    icon = '';
    name:string = '';
    layer = 'diceStats';
    order = 0;
    title = '';
    visible = true;
    associatedPlayerId = "";

    async onChange(event:any, active:any){
        // DiceStatsDataModel.getInstance().openPlayerForm(this.associatedPlayerId);

        if (CustomSceneControlToolPlayer.app == undefined){
            CustomSceneControlToolPlayer.app = new PlayerDataForm()
        }
        CustomSceneControlToolPlayer.app.render(true)
        // CustomSceneControlToolPlayer.app.bringToFront()
        // CustomSceneControlToolPlayer.app.maximize()
    }

    constructor(player_name:string, player_id:string, player_icon:string='fas fa-dice-d20'){
        var isGM = (game as Game)?.users?.get(player_id)?.isGM ?? false;

        this.name = player_name+'_name';
        this.title = player_name;
        this.associatedPlayerId = player_id;
        if (isGM){
            this.icon = 'fa-solid fa-book-open-reader'
        }else if(player_icon){
            this.icon = player_icon;
        }else{
            this.icon = 'fas fa-dice-d20'
        }
    }
}
