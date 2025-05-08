import { DiceStatsDataModel } from "../../dataModel/dataModel";

// Global Scene Control Icon 
export class CustomSceneControlToolGlobal implements SceneControlToolNoToggle
{
    active= false;
    button= true;

    icon = 'fa-solid fa-earth-americas';
    name = (game as Game).i18n.localize('');
    order= 0;
    title = (game as Game).i18n.localize('');

    // toggle= false;
    visible= true;

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openGlobalForm()
    }
    constructor(){}
}

// Compare Scene Control Icon
export class CustomSceneControlToolCompare
{
    active= false;
    button= true;

    icon = 'fa-solid fa-users-line';
    name = (game as Game).i18n.localize('');
    order= 0;
    title = (game as Game).i18n.localize('');

    toggle= false;
    visible= true;

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openCompareForm()
    }

    constructor(){}
}

// Player Scene Control Icons (Icon can be customized in settings)
export class CustomSceneControlToolPlayer
{
    name = '';
    title = '';
    icon = '';
    order= 0;

    visible = true;
    toggle = false;
    active = false;
    button = true;
    associatedPlayerId = "";

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openPlayerForm(this.associatedPlayerId)
    }

    constructor(player_name:string, player_id:string, player_icon:string){
        this.name = player_name+'_name';
        this.title = player_name;
        this.associatedPlayerId = player_id;
        if(player_icon){
            this.icon = player_icon;
        }else{
            this.icon = 'fas fa-dice-d20'
        }
    }
}

// Export Scene Control Icon
export class CustomSceneControlToolExport
{
    name = (game as Game).i18n.localize('');
    title = (game as Game).i18n.localize('');
    icon = 'fa-solid fa-file-export';
    order= 0;

    visible= true;
    toggle= false;
    active= false;
    button= true;

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openImportExportForm(true)
    }

    constructor(){}
}

export class CustomSceneControlToolPause
{
    name = (game as Game).i18n.localize('');
    title = (game as Game).i18n.localize('');
    icon = 'fa-solid fa-pause';
    order= 0;

    visible= true;
    toggle= false;
    active= false;
    button= true;

    async onChange(event:any, active:any){
        var isPaused:boolean = DiceStatsDataModel.getInstance().changePauseState()
        if (isPaused){
            this.active = true;
            this.icon = 'fa-solid fa-pause';
        }else{
            this.active = false;
            this.icon = 'fa-solid fa-play'
        }
    }

    constructor(){
        var isPaused = DiceStatsDataModel.getInstance().getIsPaused()
        if (isPaused){
            this.title = (game as Game).i18n.localize('');
            this.active = true;
            this.icon = 'fa-solid fa-pause';
        }else{
            this.title = (game as Game).i18n.localize('');
            this.active = false;
            this.icon = 'fa-solid fa-play'
        }
    }
}

export class CustomSceneControlToolSettings
{
    name = (game as Game).i18n.localize('');
    title = (game as Game).i18n.localize('');
    icon = 'fa-solid fa-file-export';
    order= 0;

    visible= true;
    toggle= false;
    active= false;
    button= true;

    async onChange(event:any, active:any){
        DiceStatsDataModel.getInstance().openSettingsForm(true)
    }

    constructor(){}
}