
//==========================================================
//===================== HOOKS SHIT =========================
//==========================================================

//This hook adds buttons to the player list section of the screen if the setting is enabled to do so
Hooks.on('renderPlayerList', (playerList, html) => {

    if(game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.ENABLE_OTHER_ACCESS_BUTTONS) == true){return;}

    const btn = html.find(`[data-user-id="${game.userId}"]`)
    btn.append(
        `<button type="button" title='Global Stats' class="open-player-stats-button flex0" id="globalStatsBtn"><i class="fa-solid fa-earth-americas"></i></button>`
    )

    html.on('click', `#globalStatsBtn`, (event) => {
        DS_GLOBALS.FORM_GL_STATS = new GlobalStatusPage().render(true);
    })

    //New Players might get added throught the game so update map on playerlist render. Didnt work in the Constructor.
    DS_GLOBALS.DS_OBJ_GLOBAL.updateMap();

    // This add icon to ALL players on the player list
    const tooltip = game.i18n.localize('DICE_STATS_TEXT.player-stats-button-title')
    for (let user of game.users) {

        //add user ID to associated button
        const buttonPlacement = html.find(`[data-user-id="${user.id}"]`)
        buttonPlacement.append(
            `<button type="button" title='${tooltip}' class="open-player-stats-button flex0" id="${user.id}"><i class="fas fa-dice-d20"></i></button>`
        )

        //Create button with eacu user id 
        html.on('click', `#${user.id}`, (event) => {
            let canSeeGM = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.PLAYERS_SEE_GM);
            let amIGM = game.users.get(game.userId)?.isGM;
            if(canSeeGM === false && user.isGM && !amIGM){
                //do nothing, Dont allow ability to see gm data if setting is off
                ui.notifications.warn("No Accesss to GM Data, Ask GM For Permission");
            }else{

                if( game.system.id == 'pf2e' )
                {
                    DS_GLOBALS.FORM_PLAYER_STATS = new CustomTabFormClass(user.id).render(true);
                }else{
                    DS_GLOBALS.FORM_PLAYER_STATS = new PlayerStatusPage(user.id).render(true);
                }
            }
        })
    } 
})

//This hook is used to change how we deal with some midiqol settings 
function midiQolSupport(){
    /*Add Hook for Midi-QoL */
    Hooks.on("midi-qol.RollComplete", (workflow) => {
        //Deal with Attack Rolls
        if(workflow.attackRollCount > 0){
            let dieType = DS_GLOBALS.MAX_TO_DIE.get(workflow.attackRoll.terms[0].faces);
            let isBlind = false;

            if( workflow.attackRoll.options.defaultRollMode != 'publicroll'){
                isBlind = true;
            }

            let rolls = [];
            for (let i = 0; i < workflow.attackRoll.terms[0].results.length; i++) {
                rolls.push(workflow.attackRoll.terms[0].results[i].result);
            }

            //Get Associated Player
            let myId = game.userId;
            let owners = Object.keys(workflow.actor.ownership);
            let owner = owners[owners.length-1];
            //If no owner found first pos should be GM ID
            if(owner === undefined){
                owner = owners[1];
            }
                
            DS_GLOBALS.DS_OBJ_GLOBAL.addRoll(dieType, rolls, owner, isBlind)
        }
            
        //Deal with dmg rolls
        if(workflow.damageRollCount > 0){
            let dieType = DS_GLOBALS.MAX_TO_DIE.get(workflow.damageRoll.terms[0].faces);
            let isBlind = false;

            if( workflow.damageRoll.options.defaultRollMode != 'publicroll'){
                isBlind = true;
            }

            let rolls = []
            for (let i = 0; i < workflow.damageRoll.terms[0].results.length; i++) {
                rolls.push(workflow.damageRoll.terms[0].results[i].result);
            }

            //Get Associated Player
            let owners = Object.keys(workflow.actor.ownership);
            let owner = owners[owners.length-1];
            //If no owner found first pos should be GM ID
            if(owner === undefined){
                owner = owners[1];
            }
                
            DS_GLOBALS.DS_OBJ_GLOBAL.addRoll(dieType, rolls, owner, isBlind)
        }
    })
}

//Parse chat message when one gets displayed
Hooks.on('createChatMessage', (chatMessage) => {
    if (chatMessage.isRoll) {
        DS_GLOBALS.DS_OBJ_GLOBAL.parseMessage(chatMessage)
    }
});

// Initialize dialog and settings on foundry boot up
Hooks.once('init', () => {
    CLASSOBJ = new DiceStatsTracker();
    DB_INTERACTION.createDB();

    //Updates for Other system support. 
    //Needs to be after init hook to see active system and modules
    /*MIDI-QOL SUPPORT */
    if(game.modules.get("midi-qol")?.active){
        midiQolSupport();
    }
})

// Hook to interact when scenecontrols get created Method used to have a better location to access player data
Hooks.on("getSceneControlButtons", controls => {
  
    // Have Scenecontrol as global obj so its not made everytime scenecontrols gets rerendered (this happens alot)
    // Create new button on scene control
    if(DS_GLOBALS.SCENE_CONTROL_BTNS == null){

        // Register a new layer for our button
        CONFIG.Canvas.layers.diceStats = { layerClass: InteractionLayer, group: 'interface' }

        let playersAsTools = [];

        playersAsTools.push(new CustomSceneControlToolGlobal());
        playersAsTools.push(new CustomSceneControlToolCompare());

        let string = game.settings.get(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_SETTINGS.OTHER_ACCESS_BUTTON_ICONS);
        let icons = string.split(',');
        let i=0;
        let defaultIcon = 'fas fa-dice-d20'
        
        //Create sub button for each player
        //Add players custom icons
        for(let user of game.users){
            if(!user){return;}

            if(icons.length > 0 && icons[i])
            {
                icon = icons[i];
            }else{
                icon = defaultIcon;
            }

            playersAsTools.push(new CustomSceneControlToolPlayer(user.name, user.id, icon));
            i++;
        }
        
        //GLOBALSCENECONTROLSOBJ = new CustomSceneControl(playersAsTools);
        //This doesnt work anymore and dont know why. Need to set it as an object 
        // first, hence the temp var and obj.assign
        DS_GLOBALS.SCENE_CONTROL_BTNS = new Object();
        var temp = new CustomSceneControl(playersAsTools);
        Object.assign(DS_GLOBALS.SCENE_CONTROL_BTNS, temp);
    }

    if(DS_GLOBALS.SCENE_CONTROL_BTNS!=null && !controls.includes(DS_GLOBALS.SCENE_CONTROL_BTNS))
    {
        controls.push(DS_GLOBALS.SCENE_CONTROL_BTNS);
    }
    
});

//Autoload DB info on connection if setting is checked
Hooks.once('ready', () => {
    //New Players might get added throught the game so update map on playerlist render. Didnt work in the Constructor.
    CLASSOBJ.updateMap();

    //Comparison form needs player list which needs to wait for game to be in ready state.
    CLASSOBJ.updateComparisonFormCheckboxes() 

    if(game.settings.get(MODULE_ID_DS,SETTINGS.ENABLE_AUTO_DB)) 
    {
        CLASSOBJ.loadAllPlayerData();
    }
});

// Do something when another user connects to the game 
Hooks.on('userConnected', (userid, isConnecting) => {
    //Unused for now
});
