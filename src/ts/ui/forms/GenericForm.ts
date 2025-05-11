// declare class ApplicationV2 {
//     element:any
// }

/**
 * Migrating to app V2:
 * https://foundryvtt.wiki/en/development/api/applicationv2
 * https://foundryvtt.wiki/en/development/guides/converting-to-appv2
 */

const { ApplicationV2, DocumentSheetV2, HandlebarsApplicationMixin } = foundry.applications.api

export class MyGenericApplication extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}){
        super(options)
    }

    static override DEFAULT_OPTIONS:any = {
        tag: "form",
        form: {
            handler: MyGenericApplication.#onSubmit,
            submitOnChange: false,
            closeOnSubmit: false
        },
        position: { 
            width: 600 ,
            height: 400
        }
    }

    override get title() {
        return `My Module: Dice Stats Module`;
    }

    static override PARTS = {
        form: {
          template: 'modules/dice-stats/templates/genericTemplate.hbs'
        }
    }

    // getData(options) replacement
    override async _prepareContext(options:any) {
        const context:any = {};

        // Be mindful of mutating other objects in memory when you enrich
        context.customHeading = "WOJO's Custom Heading";

        return context;
    }

    override _onRender(context:any, options:any): any {
        this.element.querySelector("input[name=GenBtn]")?.addEventListener("click", MyGenericApplication.refresh);
    }

    static async refresh(){
        await console.log("Dice Stats GenericApp On Refresh");
    }

    static async #onSubmit(event:any, form:any, formData:any) {
        // const settings = foundry.utils.expandObject(formData.object);
        // await Promise.all(
        //     Object.entries(settings)
        //         .map(([key, value]) => (game as Game).settings.set("foo", key, value))
        // );
        console.log("Dice Stats GenericApp On Submit!");
    }

    // override _renderHTML(context:any, options:any): any{
    //     super._renderHTML(context, options);
    // }

    // override _replaceHTML(result:any, context:any, options:any): any{
    //     super._replaceHTML(result, context, options);
    // }
}