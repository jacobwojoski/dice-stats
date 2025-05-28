import { DIE_TYPE } from "../../constants";
import { DieInfo } from "../genericData/dice";
import { DiceStatsPlayer } from "../player";
import { IntChartData } from "./chartData";

export class PlayerDisplayData {
    playerName:string = '';
    playerId:string='';

    genericData:IntChartData[]|undefined;           // Data that will be loaded 
    systemChartData:IntChartData[]|undefined;       // System Info that will get charted
    systemDetailsData:any;                          // System info that doesn't get charted but gets displayed
    
    // Convert Player data to player display object. This info all gets saved to context object in applications and is used in application templates
    constructor(player_in:DiceStatsPlayer){
        for(let die of player_in._diceInfo){
            this.genericData?.push(die.getChartData())
        }
    }

}