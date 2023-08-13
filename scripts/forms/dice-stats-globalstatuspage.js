
//==========================================================
//===================== FORMS SHIT =========================
//==========================================================


class GlobalStatusPage extends FormApplication{

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
          height: 'auto',
          popOut: true,
          resizeable: true,
          id: 'global-data',
          template: DS_GLOBALS.TEMPLATES.GLOBALDATAFORM,
          userId: game.userId,
          title: 'Global Dice Stats',
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }


    getData(){
        var includeGM = game.settings.get(MODULE_ID_DS,SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL);

        //Convert Map of PLayers to Array
        let playersAry = [];
        CLASSOBJ.ALLPLAYERDATA.forEach(value => {
            playersAry.push(value);
        })

        let dataObject = DATA_PACKAGER.packageGlobalData(playersAry, includeGM);
        dataObject.IS_DIE_DISPLAYED = [...CLASSOBJ.GLOBAL_DICE_CHECKBOXES];
        return dataObject;
    }

    //Handle button events made on the form
    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;
        
        let title_txt;
        let context_txt;
        let dbconfirmation;

        switch(action){
            case 'refresh':
                GLOBALFORMOBJ.render();
                break;
            case 'pushBlindRolls':
                socket.executeForEveryone("push_sock", game.userId);
                GLOBALFORMOBJ.render();
                break;
            case 'clearAllRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_data.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_data.context');
                const allClear = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });
                if(allClear){
                    ui.notifications.warn("All Player Data Cleared");
                    socket.executeForEveryone("clear_sock", {});
                    DB_INTERACTION.clearDB();
                }
                break;
            case 'clearAllLocalRollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_local_data.title');
                context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_local_data.context');
                const localClear = await Dialog.confirm({
                    title: title_txt,
                    content: context_txt,
                    yes: () => {return true},
                    no: () => {return false},
                    defaultYes: false
                    });

                if (localClear) {
                    ui.notifications.warn("All Local Data Cleared");
                    socket.executeForEveryone("clear_sock", {});
                }
                break;
            case 'clearAllDBrollData':
                title_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_db_data.title');
                    context_txt = game.i18n.localize('DICE_STATS_TEXT.global_dialogs.clear_all_db_data.context');
                    const dbClear = await Dialog.confirm({
                        title: title_txt,
                        content: context_txt,
                        yes: () => {return true},
                        no: () => {return false},
                        defaultYes: false
                        });
    
                    if (dbClear) {
                        ui.notifications.warn("All DB Data Cleared");
                        CLASSOBJ.clear_database();
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
            case 'd2checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[0] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[0];
                GLOBALFORMOBJ.render();
                break;
            case 'd3checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[1] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[1];
                GLOBALFORMOBJ.render();
                break;
            case 'd4checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[2] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[2];
                GLOBALFORMOBJ.render();
                break;
            case 'd6checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[3] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[3];
                GLOBALFORMOBJ.render();
                break;
            case 'd8checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[4] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[4];
                GLOBALFORMOBJ.render();
                break;
            case 'd10checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[5] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[5];
                GLOBALFORMOBJ.render();
                break;
            case 'd12checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[6] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[6];
                GLOBALFORMOBJ.render();
                break;
            case 'd20checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[7] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[7];
                GLOBALFORMOBJ.render();
                break;
            case 'd100checkbox':
                CLASSOBJ.GLOBAL_DICE_CHECKBOXES[8] = !CLASSOBJ.GLOBAL_DICE_CHECKBOXES[8];
                GLOBALFORMOBJ.render();
                break;
            default:
                return;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick);
    }
}
