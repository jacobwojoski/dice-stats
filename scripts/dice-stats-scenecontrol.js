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
            GLOBALFORMOBJ.render();
        }else{
            GLOBALFORMOBJ = new GlobalStatusPage().render(true);
        }
    }
}

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
        let canSeeGM = game.settings.get(MODULE_ID,SETTINGS.PLAYERS_SEE_GM);
        let amIGM = game.users.get(game.userId)?.isGM;
        if(canSeeGM === false && user.isGM && !amIGM){
            //do nothing, Dont allow ability to see gm data if setting is off
            ui.notifications.warn("No Accesss to GM Data, Ask GM For Permission");
        }else{
            PLAYERFORMOBJ = new PlayerStatusPage(user.id).render(true);
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