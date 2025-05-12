import { GenericSystemData } from "./systemData/genericSystemData";

export class DieChartData 
{
    isDisplayed = false;

    dieTitle = '';
    chartData = [];

    totalRolls = 0;
    mean = 0;
    median = 0;
    mode = 0;

    streak = '';

    constructor(
        title_in:string, chart_data_in:[], total_rolls_in:number,
        mean_in:number, median_in:number, mode_in:number,
        streak_in: string, is_displayed_in: boolean
    ){
        this.dieTitle = title_in;
        this.chartData = [...chart_data_in];
        this.totalRolls = total_rolls_in;
        this.mean = mean_in;
        this.median = median_in;
        this.mode = mode_in;
        this.streak = streak_in;
        this.isDisplayed = is_displayed_in;
    }
}

export class DiceStatsDisplayData {
    // tabs : [Generic Dice Stats, System Charts, System Details]
    diceChartData: DieChartData[] = [];
    systemChartData: any;
    systemRollData: any;
}