import { DS_GLOBALS } from "../dice-stats-globals.js";
import { GlobalStatusPage } from "./dice-stats-globalstatuspage.js";
import { ComparePlayerStatusPage } from "./dice-stats-compareplayerspage.js";
import { ExportDataPage } from "./dice-stats-exportdatapage.js";
import { CustomTabFormClass } from "./dice-stats-tabedplayerstatspage.js";

/**
 * These classes use the foundry SceneControll Classes to add a new set of buttons. The buttons are used to view players
 * dice stats. 
 * 
 * Button layout it as follows
 *  OPEN_DICE_STATS_BUTTONS
 *  - GLOBAL STATS BUTTON
 *  - COMPARE STATS BUTTON
 *  - EXPORT FORM BUTTON
 *  - PLAYER STATS BUTTON
 */

// Global Scene Control Icon 
export class CustomSceneControlToolGlobal
{
    active= false;
    button= true;

    icon = 'fa-solid fa-earth-americas';
    name = 'Global';
    order= 0;
    title = game.i18n.localize('DICE_STATS_TEXT.global_data_form.button');

    toggle= false;
    visible= true;

    async onChange(event, active){
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
export class CustomSceneControlToolCompare
{
    active= false;
    button= true;

    icon = 'fa-solid fa-users-line';
    name = 'Compare';
    order= 0;
    title = game.i18n.localize('DICE_STATS_TEXT.compare_data_form.button');

    toggle= false;
    visible= true;

    async onChange(event, active){
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
    associatedPlayerId = null;

    onChange(event, active){
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

// Export Scene Control Icon
export class CustomSceneControlToolExport
{
    name = 'Export';
    title = game.i18n.localize('DICE_STATS_TEXT.export_data_form.button');
    icon = 'fa-solid fa-file-export';
    order= 0;

    visible= true;
    toggle= false;
    active= false;
    button= true;

    async onChange(event, active){
        if (game.user.isGM) {
            DS_GLOBALS.FORM_EXPORT = new ExportDataPage().render(true);
        }
    }

    constructor(){}
}

// Scene Controller outer button to view player buttons
export class CustomSceneControl
{
    activeTool = '';
    icon = 'fas fa-dice-d20';
    name = 'dice-stats';
    title = game.i18n.localize('DICE_STATS_TEXT.title');
    layer = 'diceStats';
    visible = true;
    tools = {};
    order=69;

    constructor(customTools)
    {
        let tool_cnt = 1;
        for (let tool of customTools){
            tool.order = tool_cnt;
            tool_cnt++;
            this.tools[tool.name] = tool
        }
    }

    async onChange(event, active){

    }
}
