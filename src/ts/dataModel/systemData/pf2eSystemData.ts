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
    override getDisplayData(){
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

    savesSelf: number[][] = [];
    savesTarget: number[][] = [];

    savesSelfRef: number[][] = [];
    savesTargetRef: number[][] = [];
    savesSelfFort: number[][] = [];
    savesTargetFort: number[][] = [];
    savesSelfWill: number[][] = [];
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