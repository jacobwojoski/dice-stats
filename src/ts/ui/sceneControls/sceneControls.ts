/**
 * These classes use the foundry SceneControll Classes to add a new set of buttons. The buttons are used to view players
 * dice stats. 
 * 
 * Button layout it as follows
 *  OPEN_DICE_STATS_BUTTONS
 *  - PAUSE STATS BUTTON
 *  - GLOBAL STATS BUTTON
 *  - COMPARE STATS BUTTON
 *  - EXPORT FORM BUTTON
 *  - PLAYER STATS BUTTON
 */

import { CustomSceneControlToolSettings, CustomSceneControlToolGlobal, CustomSceneControlToolCompare, CustomSceneControlToolPlayer } from "./sceneControlTools";

// Scene Controller outer button to view player buttons
export class CustomSceneControl extends SceneControls
{
    //activeTool = '';
    icon = 'fas fa-dice-d20';
    name = 'dice-stats';
    //title = (game as Game).i18n?.localize('DiceStats.SceneControls.DiceStatsSceneControl.Title') ?? 'Dice Stats';
    layer = 'diceStats';
    visible = true;
    tools:any = {};
    order=69;

    // UUID of players
    constructor(player_ids: [string, string][])
    {
        super()
        var toolCount = 0

        var settingsTool = new CustomSceneControlToolSettings()
        settingsTool.order = ++toolCount
        this.tools[settingsTool.name] = settingsTool


        var globalTool = new CustomSceneControlToolGlobal()
        globalTool.order = ++toolCount
        this.tools[globalTool.name] = globalTool

        var compareTool = new CustomSceneControlToolCompare()
        compareTool.order = ++toolCount
        this.tools[compareTool.name] = compareTool

        

        for (var [id,name] of player_ids){
            var playerTool = new CustomSceneControlToolPlayer(name,id, "fas fa-dice-d20")
            playerTool.order = ++toolCount;

            this.tools[playerTool.name] = playerTool
        }
    }

    async onChange(event:any, active:any){

    }

    override get title() {
        return (game as Game).i18n?.localize('DiceStats.SceneControls.DiceStatsSceneControl.Title') ?? 'Dice Stats'
    }

    override get activeTool() {
        return ""
    }

    
}