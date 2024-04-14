
//==========================================================
//===================== FORMS SHIT =========================
//==========================================================
class ExportDataPage extends FormApplication{

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
            height: 700,
            width: 400,
            popOut: true,
            resizable: true,
            id: 'export-data',
            template: DS_GLOBALS.MODULE_TEMPLATES.EXPORTFORM,
            userId: game.userId,
            title: game.i18n.localize('DICE_STATS_TEXT.export_data_form.title'),
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
    }

    //Every Form has this fn. Its returns data object that handlebars template uses
    getData(){
        let dataObject = {
            players: game.users.map(x => x.name),
        };

        return dataObject;
    }

    /**
     * Generates a CSV with statistics for all die types, given a list of player names
     * @param {string[]} playerList - A list of player usernames to be included in the statistics 
     * @returns {string} The CSV contents as a string
     */
    createCsv(playerList) {
        // Write CSV header
        let csvString = "Die Type,";
        for (let i = 1; i <= 100; i++) {
            csvString += i.toString() + (i == 100 ? "" : ",");
        }
        // Get data
        let players = game.users.filter(x => playerList.includes(x.name));
        let rollData = players.map(player => DS_GLOBALS.DS_OBJ_GLOBAL.PLAYER_DATA_MAP.get(player.id));
        let rolls = {};
        for (const data of rollData) {
            if (!data) continue;
            for (const dieType of data.PLAYER_DICE) {
                // Add player's rolls to total
                if (rolls[dieType.MAX] === undefined) {
                    rolls[dieType.MAX] = dieType.ROLLS;
                } else {
                    rolls[dieType.MAX] = rolls[dieType.MAX].map((val, ind) => val + dieType.ROLLS[ind]);
                }
            }
        }
        // Format roll data in CSV
        for (const die in rolls) {
            csvString += `\nD${die},${rolls[die].join(",")}`;
        }
        return csvString;
    }

    downloadCsvFile(contents, fileName) {
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(contents);
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName;
        hiddenElement.click();
    }


    //Handle button events made on the form
    async _handleButtonClick(event){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;

        if(DS_GLOBALS.FORM_EXPORT == null){return;}

        if (!game.user.isGM) return;

        if (action.startsWith("export-csv-player-")) {
            const playerName = action.substr(18);
            this.downloadCsvFile(this.createCsv(playerName),
                `${playerName} dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
        } else if (action === ("export-csv-allplayers")) {
            this.downloadCsvFile(this.createCsv(game.users.map(x => x.name)),
                `total dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
        }

    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }
}
