/**
 * Generic display data for a chart with all data values being integers
 */
export class IntChartData 
{
    isDisplayed = false;

    chartTitle = '';    //
    chartId = '';       // 
    chartData = {};     // Chart.js Data object

    totalRolls = 0;
    mean = 0;
    median = 0;
    mode = 0;

    streak = '';

    constructor(
        title_in:string, chart_data_in:any, total_rolls_in:number,
        mean_in:number, median_in:number, mode_in:number,
        streak_in: string, is_displayed_in: boolean
    ){
        this.isDisplayed = is_displayed_in;
        this.chartTitle = title_in;
        this.chartData = chart_data_in;
        this.totalRolls = total_rolls_in;
        this.mean = mean_in;
        this.median = median_in;
        this.mode = mode_in;
        this.streak = streak_in;
    }
}