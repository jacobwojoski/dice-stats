import { GenericSystemData } from "./genericSystemData";

export class Pf2eSystemData extends GenericSystemData{
    override DEGREE_SUCCESS = { 
        UNKNOWN: 0,
        CRIT_FAIL: 1,
        FAIL: 2,
        SUCCESS: 3,
        CRIT_SUCCESS: 4,
        LENGTH: 5
    };

    override system_id:string = 'pf2e';

    /* Reformat local data info something handlebars can handle. Handlebars doesn't work well with 2d info 
        TODO: Should the form just handle this conversion? */
    override getChartDisplayData(): IntChartData[]|undefined {
        return undefined
    }

    override getDetailsDisplayData(): Pf2eDetailsDisplayData|undefined{
        return undefined
    }

    override addSystemData(system_info:GenericSystemData|undefined){
        let inSysInfo = system_info as Pf2eSystemData;
    }

    override parseRollMessage(message_obj:any): GenericSystemData|undefined {
        return undefined
    }

    override clear(){
        
    }

    /* SYSTEM SPECIFIC INFO (NOTE 21 lenth for 0-20 possible result and not require position adjustment */ 
    attacks: number[][] = Array.from({ length: 21 }, () => Array(this.DEGREE_SUCCESS.LENGTH).fill(0));
    attacksWeps: number[][] = [];
    attacksSpells: number[][] = [];

    skills: number[][] = [];
    // TODO: Add all skill info? Or Common skills? Athletics, Intimidation, Stealth, Acrobatics?
    // Or split into trinaed, expert, master, legendary skill rolls?

    savesSelf: number[][] = [];        // Saves that you made
    savesTarget: number[][] = [];      // Saves made against your DC

    savesSelfRef: number[][] = [];     // Your Saves
    savesSelfFort: number[][] = [];
    savesSelfWill: number[][] = [];
    
    savesTargetRef: number[][] = [];    // Saves against your DC
    savesTargetFort: number[][] = [];
    savesTargetWill: number[][] = [];

    // Result of roll with advantage or disadvantage
    advantage: number[][] = [];
    disadvantage: number[][] = [];

    // TODO: Might need to use special token hook for this? don't know if its even possible?
    //totalDamageTaken: number = 0; 
    // Any roll with damage tag (Dice Values Only)
    totalDamageDone: number = 0;
    // Expected avg damage (Dice Values Only)
    avgDamageDone: number = 0;
}

/**
* PlayerInfoApplication.context.systemDetailsData
* Format for the system information that handleabrs uses to load the template
*/
export class Pf2eDetailsDisplayData {

}
