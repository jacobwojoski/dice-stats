class CustomTabFormClass extends FormApplication
{
    SEL_PLAYER = 0;

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        return defaults;
    }

    //dataObject<PLAYER> = pointerToPlayerData type class PLAYER, Data objec
    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options) 
        this.SEL_PLAYER = userId;
    }

    getData(){
        if(CLASSOBJ.ALLPLAYERDATA.has(this.SEL_PLAYER)){
            let playerObj = CLASSOBJ.ALLPLAYERDATA.get(this.SEL_PLAYER);
            var dataObject = DATA_PACKAGER.packageTabedPlayerData(playerObj);
            dataObject.IS_DIE_DISPLAYED = [...CLASSOBJ.PLAYER_DICE_CHECKBOXES];
            return dataObject;
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

const template_file = "templates/tab_player_base.html";
loadTemplates(["templates/partial/tab_player_stats.html"]);
loadTemplates(["templates/partial/tab_player_stats_d20.html"]);

const template_data = { 
                        header: "template header",
                        tabs: [
                            { 
                                label: "player-stats",
                                title: "All Dice Stats",
                                content: "{{{templates/parital/tab_player_stats.hbs}}}"
                            },
                            { 
                                label: "player-stats-d20",
                                title: "D-20 Stats",
                                content: "{{{templates/partial/tab_player_stats_d20.hbs}}}"
                            }
                        ],
                        footer: "template footer"
                    };

var options_data = { 
        template: template_file,
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

const my_form = new CustomTabFormClass(template_data, options_data); // data, options
const res = await my_form.render(true); 