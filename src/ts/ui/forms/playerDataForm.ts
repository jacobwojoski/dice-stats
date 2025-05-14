// declare class ApplicationV2 {
//     element:any
// }

import { template } from "handlebars";

/**
 * Migrating to app V2:
 * https://foundryvtt.wiki/en/development/api/applicationv2
 * https://foundryvtt.wiki/en/development/guides/converting-to-appv2
 */

const { ApplicationV2, DocumentSheetV2, HandlebarsApplicationMixin } = foundry.applications.api

export class PlayerDataForm extends HandlebarsApplicationMixin(ApplicationV2) {
    associatedPlayerId = '';
    // Default Template Locations. System templates should be overwritten when a system gets loaded
    static templates = {
        genericDataTab: 'modules/dice-stats/templates/player-data/tabs/generic-dice-data-tab.hbs',
        systemChartTab: 'modules/dice-stats/templates/player-data/tabs/systemForms/unknown/unknown-system-chart-form.hbs',
        systemDetailsTab: 'modules/dice-stats/templates/player-data/tabs/systemForms/unknown/unknown-system-data-form.hbs'
    }

    constructor(playerId:string = '', options = {}){
        super(options)
        this.associatedPlayerId = playerId;
    }

    static override DEFAULT_OPTIONS:any = {
        tag: "form",
        form: {
            handler: PlayerDataForm.#onSubmit,
            submitOnChange: false,
            closeOnSubmit: false
        },
        position: { 
            width: 600 ,
            height: 400
        },
    }

    override get title() {
        return `My Module: Dice Stats Module`;
    }

    static override PARTS = {
        tabs: {
            template: 'modules/dice-stats/templates/player-data/player-data-nav-form.hbs',
        },
        genericData: {
            template: PlayerDataForm.templates.genericDataTab,
            scrollable: ['']
        },
        systemCharts: {
            template: PlayerDataForm.templates.systemChartTab,
            scrollable: [''],
        },
        systemDetails: {
            template: PlayerDataForm.templates.systemDetailsTab,
            scrollable: [''],
        }
    }

    // getData(options) replacement
    override async _prepareContext(options:any) {
        let context:any = {
            tabGroups:{
                primary: ''
            }
        };

        // Set Generic Data as default selected 
        if (context.tabGroups.primary == '') {
            context.tabGroups.primary == 'genericData';
        }

        // Get Display Data from data model
        let myGenericDiceData = {};
        let mySystemChartData = {};
        let mySystemDetailsData = {};

        context.tabs = {
            genericData: {
                cssClass: context.tabGroups.primary === 'genericData' ? 'active' : '',
                group: 'primary',
                id: 'genericData',
                icon: 'fa-solid fa-dice-d20',
                label: 'Dice Data - Label',
                title: 'Dice Data',
                genericData: true
            },
            systemCharts: {
                cssClass: context.tabGroups.primary === 'systemCharts' ? 'active' : '',
                group: 'primary',
                id: 'systemCharts',
                icon: 'fa-solid fa-hands-holding-circle',
                label: 'System Chart Data - Label',
                systemCharts: true
            },
            systemDetails: {
                cssClass: context.tabGroups.primary === 'systemDetails' ? 'active' : '',
                group: 'primary',
                id: 'systemDetails',
                icon: 'fa-solid fa-pen-to-square',
                label: 'System Details Data - Label',
                systemDetails: true
            }
        }

        // Be mindful of mutating other objects in memory when you enrich
        return context;
    }

    protected override _configureRenderOptions(options: any): void {
        super._configureRenderOptions(options);

        // TODO: disable specific tabs here Depending on settings?
        options.parts = ['tabs', 'genericData', 'systemCharts', 'systemDetails']
    }

    override _onRender(context:any, options:any): any {
        this.element.querySelector("input[name=gen-btn]")?.addEventListener("click", PlayerDataForm.refresh);
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