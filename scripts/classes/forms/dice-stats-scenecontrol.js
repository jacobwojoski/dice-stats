// Global Scene Control Icon 
class CustomSceneControlToolGlobal 
{
    name = 'Global';
    title = game.i18n.localize('DICE_STATS_TEXT.global_data_form.button');
    icon = 'fa-solid fa-earth-americas';

    visible= true;
    toggle= false;
    active= false;
    button= true; 

    async onClick(){
        //Make sure Compare Is Closed B4 Opening
        await DS_GLOBALS.FORM_GL_COMPARE?.close();

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
    title = game.i18n.localize('DICE_STATS_TEXT.compare_data_form.button');
    icon = 'fa-solid fa-users-line';

    visible= true;
    toggle= false;
    active= false;
    button= true; 

    async onClick(){
        let canSeePlayerData = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS);
        if(canSeePlayerData === false && game.user.isGM === false){
            //Do nothing, Dont allow players to view player data if setting is set
            ui.notifications.warn("No Accesss to Player Data, Ask GM For Permission");
        }else if(DS_GLOBALS.FORM_GL_COMPARE){
            // Close Global Stats page if opening Compare popup
            await DS_GLOBALS?.FORM_GL_STATS?.close(false);

            DS_GLOBALS.FORM_GL_COMPARE.render(true);
        }else{
            // Close Global Stats page if opening Compare popup
            await DS_GLOBALS?.FORM_GL_STATS?.close(false);

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
        let canSeeGM = game.settings.get(DS_GLOBALS.MODULE_ID,DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM);
        let canSeePlayerData = game.settings.get(DS_GLOBALS.MODULE_ID,DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_PLAYERS);
        let amIGM = game.users.get(game.userId)?.isGM;
        let isThisGMrolls = game.users.get(this.associatedPlayerId)?.isGM;
        if(canSeeGM === false && isThisGMrolls && !amIGM){
            //do nothing, Dont allow ability to see gm data if setting is off
            ui.notifications.warn("No Accesss to GM Data, Ask GM For Permission");
        }else if(canSeePlayerData === false && game.user.isGM === false){
            //Do nothing, Dont allow players to view player data if setting is set
            ui.notifications.warn("No Accesss to Player Data, Ask GM For Permission");
        }else{
            
            //Delete OLD OBJ before making new one (Other objects are singletons so delete is not needed)
            if(DS_GLOBALS.FORM_PLAYER_STATS)
            {
                DS_GLOBALS.FORM_PLAYER_STATS.render(false);
                delete DS_GLOBALS.FORM_PLAYER_STATS
            }
    
            // Always render the Tabbed Version, Were removing the normal Player status page
            DS_GLOBALS.FORM_PLAYER_STATS = new CustomTabFormClass(this.associatedPlayerId).render(true);

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

// Compare Scene Control Icon
class CustomSceneControlToolExport
{
    name = 'Export';
    title = game.i18n.localize('DICE_STATS_TEXT.export_data_form.button');
    icon = 'fa-solid fa-file-export';

    visible= true;
    toggle= false;
    active= false;
    button= true;

    async onClick(){
        if (game.user.isGM) {
            DS_GLOBALS.FORM_EXPORT = new ExportDataPage().render(true);
        }
    }

    constructor(){}
}

// Scene Controller outer button to view player buttons
class CustomSceneControl
{
    activeTool = '';
    name = 'dstats';
    title = game.i18n.localize('DICE_STATS_TEXT.title');
    layer = 'diceStats';
    icon = 'fas fa-dice-d20';
    visible = true;
    tools = [];

    constructor(customTools)
    {
        this.tools = [...customTools];
    }
}
