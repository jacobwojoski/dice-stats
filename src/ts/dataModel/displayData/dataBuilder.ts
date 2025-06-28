import { DIE_TYPE } from "../../constants";
import { DiceStatsDataModel } from "../dataModel";
import { IntChartData } from "./chartData";

export class GenericChartDisplayData {
    d2:     IntChartData|undefined;
    d3:     IntChartData|undefined;
    d4:     IntChartData|undefined;
    d6:     IntChartData|undefined; 
    d8:     IntChartData|undefined;
    d10:    IntChartData|undefined;
    d12:    IntChartData|undefined;
    d20:    IntChartData|undefined;
    d50:    IntChartData|undefined;
    d100:   IntChartData|undefined;

    constructor(player_id_in:string){
        this.d2 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D2).getChartData();
        this.d3 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D3).getChartData();
        this.d4 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D4).getChartData();
        this.d6 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D6).getChartData();
        this.d8 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D8).getChartData();
        this.d10 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D10).getChartData();
        this.d12 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D12).getChartData();
        this.d20 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D20).getChartData();
        this.d50 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D50).getChartData();
        this.d100 = DiceStatsDataModel.getInstance().getPlayerInfo(player_id_in)?.getDieInfo(DIE_TYPE.D100).getChartData();
    }
}

class PlayerDisplayData {
    playerName: string   ='';
    playerId:   string   ='';

    singleDiceDisplayData:  GenericChartDisplayData;
    twoDiceDisplayData:     any;
    dicePoolDisplayData:    any;

    systemDisplayData:      any;

    constructor(player_id_in:string){
        this.singleDiceDisplayData = new GenericChartDisplayData(player_id_in)
        this.twoDiceDisplayData = {};
        this.dicePoolDisplayData = {};
        this.systemDisplayData = {};
    }
}

class GlobalDisplayData {

}

class CompareisonDisplayData {

}

class ExportDisplayData {

}


class DisplayDataBuilder {
    public static build_player_data(player_id_in:string){
        return new PlayerDisplayData(player_id_in)
    }

    public static build_global_data(){

    }

    public static build_comparison_data(){

    }

    public static build_export_data(){

    }
}