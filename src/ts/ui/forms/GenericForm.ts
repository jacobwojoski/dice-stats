const GENERIC_TEMPLATE = `<form><h1>GENERIC TEST FORM</h1></form>`;

type DocumentSheetV2 = {

}

/**
 * Migrating to app V2:
 * https://foundryvtt.wiki/en/development/api/applicationv2
 * https://foundryvtt.wiki/en/development/guides/converting-to-appv2
 */

class MyApplication implements DocumentSheetV2 {
    static DEFAULT_OPTIONS = {
      tag: "form",
      form: {
        handler: MyApplication.myFormHandler,
        submitOnChange: false,
        closeOnSubmit: false
      }
    }
  
    /**
     * Process form submission for the sheet
     * @this {MyApplication}                      The handler is called with the application as its bound scope
     * @param {SubmitEvent} event                   The originating form submission event
     * @param {HTMLFormElement} form                The form element that was submitted
     * @param {FormDataExtended} formData           Processed data for the submitted form
     * @returns {Promise<void>}
     */
    static async myFormHandler(event, form, formData) {
      // Do things with the returned FormData
    }
  }

class CustomGenericSheet extends DocumentSheet {
    static override get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Generic Popup",
            template: "modules/my-module/templates/my-popup.html",
            width: 400,
            height: "auto",
            resizable: true
        });
    }

    override async getData(): Promise<object> {
        return { message: "Hello, this is a popup!" };
    }
}


User.registerSheet("my-module", MyPopup, {
    label: "My Custom Popup",
    makeDefault: false
});

// Open the popup
new MyPopup().render(true);


export class CustomGenericForm extends DocumentSheet {

    static override defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
            height: 700,
            width: 1000,
            popOut: true,
            resizable: true,
            id: 'Generic-Test-Form',
            template: GENERIC_TEMPLATE,
            userId: '',
            title: 'Generic Form',
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    constructor(options:any={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        options['userId'] = (game as Game).userId;
        super(options)
    }

    //Every Form has this fn. Its returns data object that handlebars template uses
    override getData(){
        var dataObject:any = {}
        dataObject['playerName'] = 'Generic Player Name';

        return dataObject;
    }

    protected override _updateObject(event: Event, formData?: object): Promise<unknown> {
        return Promise.resolve(formData)
    }

    //Handle button events made on the form
    async _handleButtonClick(event:any){
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;

        if(DS_GLOBALS.FORM_GL_COMPARE == null){return;}

        switch(action){
            default:
                console.log("GENERIC FORM: HANDLE BUTTON CLICK");
                return;
        }
    }

    override activateListeners(html:any) {
        super.activateListeners(html);
        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }
}