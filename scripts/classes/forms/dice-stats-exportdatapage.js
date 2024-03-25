
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
        let dataObject = {};

        return dataObject;
    }

    createCsv(dieMax) {
        let csvString = "Username,";
        for (let i = 1; i <= dieMax; i++) {
            csvString += i.toString() + (i == dieMax ? "" : ",");
        }
        for (let player of game.users) {
            let rollData = player.getFlag(DS_GLOBALS.MODULE_ID, DS_GLOBALS.MODULE_FLAGS.ROLLDATAFLAG);
            if (!rollData) continue;
            let playerRolls = rollData.PLAYER_DICE.filter(x => x.MAX == dieMax)[0];
            csvString += "\n" + rollData.USERNAME + "," + playerRolls.ROLLS.join(",");
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

        switch(action) {
            case "export-csv-d100":
                this.downloadCsvFile(this.createCsv(100),
                    `D100 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
            case "export-csv-d20":
                this.downloadCsvFile(this.createCsv(20),
                    `D20 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
            case "export-csv-d12":
                this.downloadCsvFile(this.createCsv(12),
                    `D12 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
            case "export-csv-d10":
                this.downloadCsvFile(this.createCsv(10),
                    `D10 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
            case "export-csv-d8":
                this.downloadCsvFile(this.createCsv(8),
                    `D8 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
            case "export-csv-d6":
                this.downloadCsvFile(this.createCsv(6),
                    `D6 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
            case "export-csv-d4":
                this.downloadCsvFile(this.createCsv(4),
                    `D4 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
            case "export-csv-d3":
                this.downloadCsvFile(this.createCsv(3),
                    `D3 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
            case "export-csv-d2":
                this.downloadCsvFile(this.createCsv(2),
                    `D2 dice-stats-${new Date().toISOString().split(".").shift()}.csv`);
                break;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }
}