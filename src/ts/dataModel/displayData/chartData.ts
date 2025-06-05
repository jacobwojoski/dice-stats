/**
 * Generic display data for a chart with all data values being integers
 */

/**
* Generic Chart Display Info
*/
export class ChartData
{
    isDisplayed = false;

    chartTitle = '';    //
    chartId = '';       // 
    chartData:any = {};     // Chart.js Data object

    constructor(
        is_displayed_in: boolean, title_in:string, id_in:string,
        chart_data_in:any 
    ){
        this.isDisplayed = is_displayed_in;
        this.chartTitle = title_in;
        this.chartId = id_in;
        this.chartData = chart_data_in;
    }
}

export class IntChartData extends ChartData
{
    totalRolls = 0;
    mean = 0.0;
    expMean = 0.0;
    median = 0;
    mode = 0;
    streak = '';

    constructor(
        is_displayed_in: boolean, title_in:string, id_in:string,
        chart_data_in:any, total_rolls_in:number,
        mean_in:number,  exp_mean_in:number, median_in:number, mode_in:number,
        streak_in: string, 
    ){
        super(is_displayed_in, title_in, id_in, chart_data_in)
        
        this.totalRolls = total_rolls_in;
        this.mean = mean_in;
        this.expMean = exp_mean_in;
        this.median = median_in;
        this.mode = mode_in;
        this.streak = streak_in;
    }
}
        
