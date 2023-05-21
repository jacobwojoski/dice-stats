// Global Scene Control Icon 
class CustomSceneControlToolGlobal 
{
    name = 'Global';
    title = 'Global Dice Stats';
    icon = 'fa-solid fa-earth-americas';

    visible= true;
    toggle= false;
    active= false;
    button= true; 

    onClick(){
        if(GLOBALFORMOBJ){
            GLOBALFORMOBJ.render(true);
        }else{
            GLOBALFORMOBJ = new GlobalStatusPage().render(true);
        } 
    }

    constructor(){}
}

// Compare Scene Control Icon
class CustomSceneControlToolCompare
{
    name = 'Compare';
    title = 'Compare Players';
    icon = 'fa-solid fa-users-line';

    visible= true;
    toggle= false;
    active= false;
    button= true; 

    onClick(){
        ui.notifications.warn("Comparison Tool Work In Progress");
    }

    constructor(){}
}

// Player Scene Control Icons (Icon can be customized in settings)
class CustomSceneControlToolPlayer
{
    name = '';
    title = '';
    icon = '';

    visible = true;
    toggle = false;
    active = false;
    button = true;
    associatedPlayerId = null;

    onClick(){
        let canSeeGM = game.settings.get(MODULE_ID_DS,SETTINGS.PLAYERS_SEE_GM);
        let amIGM = game.users.get(game.userId)?.isGM;
        if(canSeeGM === false && game.user.isGM && !amIGM){
            //do nothing, Dont allow ability to see gm data if setting is off
            ui.notifications.warn("No Accesss to GM Data, Ask GM For Permission");
        }else{
            PLAYERFORMOBJ = new PlayerStatusPage(this.associatedPlayerId).render(true);
        }
    }

    constructor(player_name, player_id, player_icon)
    {
        this.name = player_name+'_name';
        this.title = player_name;
        this.associatedPlayerId = player_id;
        this.icon = player_icon;
    }
}

// Scene Controller outer button to view player buttons
class CustomSceneControl
{
    name = 'dstats';
    title = 'diceStatsButton';
    layer = 'controls';
    icon = 'fas fa-dice-d20';
    visible = true;
    tools = [];

    constructor(customTools)
    {
        this.tools = [...customTools];
    }
}