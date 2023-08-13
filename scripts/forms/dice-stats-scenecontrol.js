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
        if(DS_GLOBALS.FORM_GL_STATS){
            DS_GLOBALS.FORM_GL_STATS.render(true);
        }else{
            DS_GLOBALS.FORM_GL_STATS = new GlobalStatusPage().render(true);
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
        let canSeePlayerData = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS);
        if(canSeePlayerData){
            //Do nothing, Dont allow players to view player data if setting is set
            ui.notifications.warn("No Accesss to Player Data, Ask GM For Permission");
        }else if(DS_GLOBALS.FORM_GL_COMPARE){
            DS_GLOBALS.FORM_GL_COMPARE.render(true);
        }else{
            DS_GLOBALS.FORM_GL_COMPARE = new ComparePlayerStatusPage().render(true);
        } 
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
        let canSeeGM = game.settings.get(DS_GLOBALS.MODULE_ID,DS_GLOBALS.SETTINGS.PLAYERS_SEE_GM);
        let canSeePlayerData = game.settings.get(DS_GLOBALS.MODULE_ID,DS_GLOBALS.SETTINGS.PLAYERS_SEE_PLAYERS);
        let amIGM = game.users.get(game.userId)?.isGM;
        let isThisGMrolls = game.users.get(this.associatedPlayerId)?.isGM;
        if(canSeeGM === false && isThisGMrolls && !amIGM){
            //do nothing, Dont allow ability to see gm data if setting is off
            ui.notifications.warn("No Accesss to GM Data, Ask GM For Permission");
        }else if(canSeePlayerData){
            //Do nothing, Dont allow players to view player data if setting is set
            ui.notifications.warn("No Accesss to Player Data, Ask GM For Permission");
        }else{
            
            //Delete OLD OBJ before making new one (Other objects are singletons so delete is not needed)
            if(DS_GLOBALS.FORM_PLAYER_STATS)
            {
                DS_GLOBALS.FORM_PLAYER_STATS.render(false);
                delete DS_GLOBALS.FORM_PLAYER_STATS
            }
    
            if( game.system.id == 'pf2e' )
            {
                DS_GLOBALS.FORM_PLAYER_STATS = new CustomTabFormClass(this.associatedPlayerId).render(true);
            }else{
                DS_GLOBALS.FORM_PLAYER_STATS = new PlayerStatusPage(this.associatedPlayerId).render(true);
            }
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
    activeTool = '';
    name = 'dstats';
    title = 'Dice Stats';
    layer = 'diceStats';
    icon = 'fas fa-dice-d20';
    visible = true;
    tools = [];

    constructor(customTools)
    {
        this.tools = [...customTools];
    }
}