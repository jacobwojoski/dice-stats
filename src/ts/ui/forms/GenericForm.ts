// declare class ApplicationV2 {
//     element:any
// }

/**
 * Migrating to app V2:
 * https://foundryvtt.wiki/en/development/api/applicationv2
 * https://foundryvtt.wiki/en/development/guides/converting-to-appv2
 */

const { ApplicationV2, DocumentSheetV2, HandlebarsApplicationMixin } = foundry.applications.api

export class MyGenericApplication extends ApplicationV2 {
    static override DEFAULT_OPTIONS:any = {
        id: "ds-generic-form-1",
        form: {
          handler: MyGenericApplication.#onSubmit,
          closeOnSubmit: true,
        },
        position: {
          width: 640,
          height: "auto",
        },
        tag: "form", // The default is "div"
        actions: {
            refresh: MyGenericApplication.refresh
        },
        window: {
            icon: "fas fa-gear", // You can now add an icon to the header
            title: "Test Title",
            contentClasses: ["standard-form"]
        }
    }

    override get title() {
        return `My Module: Dice Stats Module`;
    }

    static PARTS = {
        form: {
          template: "./modules/dice-stats/templates/genericTemplate.hbs"
        }
    }

    // getData(options) replacement
    override async _prepareContext(options:any) {
        const context:any = {};

        // Be mindful of mutating other objects in memory when you enrich
        context.customHeading = "WOJO's Custom Heading"

        return context;
    }

    override _onRender(context:any, options:any): any {
        this.element.querySelector("input[name=GenBtn]")?.addEventListener("click", MyGenericApplication.refresh);
    }

    static async refresh(){
        await console.log("Dice Stats GenericApp On Refresh")
    }

    static async #onSubmit(event:any, form:any, formData:any) {
        // const settings = foundry.utils.expandObject(formData.object);
        // await Promise.all(
        //     Object.entries(settings)
        //         .map(([key, value]) => (game as Game).settings.set("foo", key, value))
        // );
        console.log("Dice Stats GenericApp On Submit!")
    }
}