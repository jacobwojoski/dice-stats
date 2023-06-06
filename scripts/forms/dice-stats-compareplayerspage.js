
//==========================================================
//===================== FORMS SHIT =========================
//==========================================================
class ComparePlayerStatusPage extends FormApplication{

    //[{name,id,isChecked}]
    // ComparePlayerObjUtil []
    COMPARE_PLAYERS_LIST = []; //List of players that are being compared
    DIE_DISPLAYED = [];

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
            height: 'auto',
            id: 'compare-data',
            template: TEMPLATES.COMPAREFORM,
            userId: game.userId,
            title: 'Compare Player Stats',
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    swapPlayersChecked(userid)
    {
        for(let plyr of this.COMPARE_PLAYERS_LIST)
        {
            if(plyr.id == userid)
            {
                plyr.id = !plyr.id;
                return;
            }
        }
    }

    constructor()
    {
        super();
        this.COMPARE_PLAYERS_LIST.length = 0;
        this.DIE_DISPLAYED = new Array(9);
        this.DIE_DISPLAYED.fill(true);

        for(let user of game.users)
        {
            let temp = new ComparePlayerObjUtil(user);
            this.COMPARE_PLAYERS_LIST.push(temp);
        }
    }


    getData(){
        var includeGM = game.settings.get(MODULE_ID_DS,SETTINGS.PLAYERS_SEE_GM_IN_GLOBAL);

        //Convert Map of PLayers to Array
        let playersAry = [];
        CLASSOBJ.ALLPLAYERDATA.forEach(value => {
            playersAry.push(value);
        })

        let dataObject = DATA_PACKAGER.packageComparePlayerData(this.COMPARE_PLAYERS_LIST, playersAry, includeGM);
        dataObject.IS_DIE_DISPLAYED = [...this.DIE_DISPLAYED]

        //dataObject.IS_DIE_DISPLAYED = [...CLASSOBJ.GLOBAL_DICE_CHECKBOXES];
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
            case 'd2checkbox':
                this.DIE_DISPLAYED[0] = !this.DIE_DISPLAYED[0];
                GLOBALFORMOBJ.render();
                break;
            case 'd3checkbox':
                this.DIE_DISPLAYED[1] = !this.DIE_DISPLAYED[1];
                GLOBALFORMOBJ.render();
                break;
            case 'd4checkbox':
                this.DIE_DISPLAYED[2] = !this.DIE_DISPLAYED[2];
                GLOBALFORMOBJ.render();
                break;
            case 'd6checkbox':
                this.DIE_DISPLAYED[3] = !this.DIE_DISPLAYED[3];
                GLOBALFORMOBJ.render();
                break;
            case 'd8checkbox':
                this.DIE_DISPLAYED[4] = !this.DIE_DISPLAYED[4];
                GLOBALFORMOBJ.render();
                break;
            case 'd10checkbox':
                this.DIE_DISPLAYED[5] = !this.DIE_DISPLAYED[5];
                GLOBALFORMOBJ.render();
                break;
            case 'd12checkbox':
                this.DIE_DISPLAYED[6] = !this.DIE_DISPLAYED[6];
                GLOBALFORMOBJ.render();
                break;
            case 'd20checkbox':
                this.DIE_DISPLAYED[7] = !this.DIE_DISPLAYED[7];
                GLOBALFORMOBJ.render();
                break;
            case 'd100checkbox':
                this.DIE_DISPLAYED[8] = !this.DIE_DISPLAYED[8];
                GLOBALFORMOBJ.render();
                break;
            default:
                //Check if button was from checking players to compare
                if(ALLPLAYERDATA.has(action))
                {
                    swapPlayersChecked(action);
                }
                return;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick);
    }
}
