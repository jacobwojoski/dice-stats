loadTemplates(["modules/dice-stats/templates/partial/tab_player_base.hbs"]);
loadTemplates(["modules/dice-stats/templates/partial/tab_player_stats_all_dice.hbs"]);
loadTemplates(["modules/dice-stats/templates/partial/tab_player_stats_d20.hbs"]);

class CustomTabFormClass extends FormApplication
{
    SEL_PLAYER = 0;

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const player_stats_template_file = "modules/dice-stats/templates/partial/tab_player_base.hbs";

        var player_stats_options_data = { 
            template: player_stats_template_file,
            height: 'auto',
            popOut: true,
            resizeable: true,
            id: 'player-tabbed-dice-stats',
            userId: game.userId,
            title: 'Player Dice Stats',
            tabs: [
                {   navSelector: ".tabs", 
                    contentSelector: ".content", 
                    initial: "player-stats"
                }
            ]
        }

        const mergedOptions = foundry.utils.mergeObject(defaults, player_stats_options_data);

        return mergedOptions;
    }

    formDataObject;

    //dataObject<PLAYER> = pointerToPlayerData type class PLAYER
    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
        this.SEL_PLAYER = userId;
        this.formDataObject = dataObject;
        //this.PLAYERDATA = dataObject;
    }

    getData(){

        loadTemplates(["modules/dice-stats/templates/partial/tab_player_base.hbs"]);
        loadTemplates(["modules/dice-stats/templates/partial/tab_player_stats_all_dice.hbs"]);
        loadTemplates(["modules/dice-stats/templates/partial/tab_player_stats_d20.hbs"]);
        //Object needed to specify tabs
        var baseDataObject = { 
            header: "<h1>HEADER</h1>",
            tabs: [
                { 
                    label: "player-stats",
                    title: "All Dice Stats",
                    content: "<em>Fancy tab1 content.</em>"
                },
                { 
                    label: "player-stats-d20",
                    title: "D-20 Stats",
                    content: "<em>Fancy tab2 content.</em>",
                    d20: true
                }
            ],
            footer: "<h1>FOOTER</h1>"
        };

        if(CLASSOBJ.ALLPLAYERDATA.has(this.SEL_PLAYER)){
            let playerObj = CLASSOBJ.ALLPLAYERDATA.get(this.SEL_PLAYER);
            //var playerDataObject = DATA_PACKAGER.packageTabedPlayerData(playerObj);
            var playerDataObject = DATA_PACKAGER.packagePlayerData(playerObj);
            playerDataObject.IS_DIE_DISPLAYED = [...CLASSOBJ.PLAYER_DICE_CHECKBOXES];

            var mergedDataObj = foundry.utils.mergeObject(baseDataObject, playerDataObject)
            return mergedDataObj;
            //return baseDataObject;
        }
        return DATA_PACKAGER.PLAYER_HNDL_INFO;
    }


    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;

        let title_txt;
        let context_txt;

        //Handle button events made on the form
        switch(action){
            case 'refresh':
                PLAYERFORMOBJ.render();
                break;
            case 'save':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.save_to_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.save_to_db.context');
                const saveConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (saveConfirmation) {
                    ui.notifications.warn("Your Data Saved");
                    CLASSOBJ.saveMyPlayerData();
                }
                break;
            case 'loadAllFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_all_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_all_db.context');
                const loadConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadConfirmation) {
                    ui.notifications.warn("All Data Loaded");
                    CLASSOBJ.loadAllPlayerData();
                }
                break;
            case 'loadYoursFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_your_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_your_db.context');
                const loadYoursConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadYoursConfirmation) {
                    ui.notifications.warn("Your Data Loaded");
                    CLASSOBJ.loadYourPlayerData();
                }
                break;
            case 'loadOthersFromDB':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_others_db.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.load_others_db.context');
                const loadOthersConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (loadOthersConfirmation) {
                    CLASSOBJ.loadOthersPlayerData();
                }
                break;
            case 'clearAllLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_all_local.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_all_local.context');
                const clearAllLocalConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (clearAllLocalConfirmation) {
                    ui.notifications.warn("All Local Data Cleared");
                    CLASSOBJ.clearAllRollData();
                    if(PLAYERFORMOBJ){
                        PLAYERFORMOBJ.render();
                    }
                    if(GLOBALFORMOBJ){
                        GLOBALFORMOBJ.render();
                    } 
                }
                break;
            case 'clearYourLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_local.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_local.context');
                const clearYourLocalConfirmation = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (clearYourLocalConfirmation) {
                    ui.notifications.warn("Your Local Data Cleared");
                    CLASSOBJ.clearUsersRollData(game.user.id);
                    if(PLAYERFORMOBJ){
                        PLAYERFORMOBJ.render();
                    }
                    if(GLOBALFORMOBJ){
                        GLOBALFORMOBJ.render();
                    } 
                }
                break;
            case 'clearYourDBrollData':
                    title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_db.title');
                    context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_your_db.context');
                    const dbcon = await Dialog.confirm({
                        title: title_txt,
                        content: context_txt,
                        yes: () => {return true},
                        no: () => {return false},
                        defaultYes: false
                        });
    
                    if (dbcon) {
                        ui.notifications.warn("All Your DB Data Cleared");
                        DB_INTERACTION.clearPlayer(game.user);
                        if(PLAYERFORMOBJ){
                            PLAYERFORMOBJ.render();
                        }
                    }
                    break;
            case 'clearAllPlayerData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_both.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.player_dialogs.clear_both.context');
                const dbcon2 = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (dbcon2) {
                    ui.notifications.warn("All Your Data Cleared");
                    CLASSOBJ.clearUsersRollData(game.user.id);
                    DB_INTERACTION.clearPlayer(game.user);
                    if(PLAYERFORMOBJ){
                        PLAYERFORMOBJ.render();
                    }
                }
                break;
            case 'd2checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[0] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[0];
                PLAYERFORMOBJ.render();
                break;
            case 'd3checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[1] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[1];
                PLAYERFORMOBJ.render();
                break;
            case 'd4checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[2] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[2];
                PLAYERFORMOBJ.render();
                break;
            case 'd6checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[3] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[3];
                PLAYERFORMOBJ.render();
                break;
            case 'd8checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[4] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[4];
                PLAYERFORMOBJ.render();
                break;
            case 'd10checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[5] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[5];
                PLAYERFORMOBJ.render();
                break;
            case 'd12checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[6] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[6];
                PLAYERFORMOBJ.render();
                break;
            case 'd20checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[7] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[7];
                PLAYERFORMOBJ.render();
                break;
            case 'd100checkbox':
                CLASSOBJ.PLAYER_DICE_CHECKBOXES[8] = !CLASSOBJ.PLAYER_DICE_CHECKBOXES[8];
                PLAYERFORMOBJ.render();
                break;
            default:
                return;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick);
    }

    async _updateObject(event, formData) {
        return;
    }
    
}