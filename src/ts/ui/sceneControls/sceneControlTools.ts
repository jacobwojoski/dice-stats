import { DiceStatsDataModel } from "../../dataModel/dataModel";
import { MyGenericApplication } from "../forms/GenericForm";

export class CustomSceneControlToolSettings implements SceneControls.ToolNoToggle
{
    name = (game as Game).i18n?.localize('DiceStats.SceneControls.Settings.Name') ?? '';
    title = (game as Game).i18n?.localize('DiceStats.SceneControls.Settings.Title') ?? '';
    icon = 'fa-solid fa-file-export';
    order= 0;

    visible= true;
    active= false;
    button= true;

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openSettingsForm(true)
        new MyGenericApplication().render()
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

    name = (game as Game).i18n?.localize('DiceStats.SceneControls.GlobalStats.Name') ?? '';
    title = (game as Game).i18n?.localize('DiceStats.SceneControls.GlobalStats.Title') ?? '';
    icon = 'fa-solid fa-users-line';
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

    name = (game as Game).i18n?.localize('DiceStats.SceneControls.CompareStats.Name') ?? '';
    title = (game as Game).i18n?.localize('DiceStats.SceneControls.CompareStats.Title') ?? '';
    icon = 'fa-solid fa-users-line';
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
    active = false;
    button = true;
    icon = '';
    name = '';
    order = 0;
    title = '';
    visible = true;
    associatedPlayerId = "";

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openPlayerForm(this.associatedPlayerId)
        new MyGenericApplication().render()
    }

    constructor(player_name:string, player_id:string, player_icon:string){
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
