import { Pf2eSystemData } from "../pf2eSystemData";

export class Pf2eSystemAndDisplayData extends Pf2eSystemData {
    /* ========================================================================================================== */
    /* ==================== Convert Class data into data to be used for HTML/HBS Displays ======================= */
    system_display_data = {
        num_charts: 0,
        chart_data: [],         /* {Pf2eChartData}[] */

        hero_points_used: 0,
        
        advantage_data: {},
        damage_data: {}
    }; /* data that will be passed to HBS for display */

    /**
     * Convert 2d array data into a data struct for stacked bar charts.
     * @param {int[DIE_MAX][NUM_DEG_SUCCESS]} roll_type - Roll Data
     * @param {int} total_rolls - Total Rolls in the array
     * @returns {google_charts_chart_data[][]} - Roll data converted into frmat for google charts
     */
    create_array(twoD_data_ary, total_rolls){
        let expected_roll_count = Math.round(total_rolls*0.05);
       return [
        ['Die Result', 'Unknown', 'Crit Fail', 'Fail', 'Success', 'Crit Success', 'Expected Distribution'],
        ['1', twoD_data_ary[0][0], twoD_data_ary[0][1], twoD_data_ary[0][2], twoD_data_ary[0][3],twoD_data_ary[0][4], expected_roll_count],
        ['2', twoD_data_ary[1][0], twoD_data_ary[1][1], twoD_data_ary[1][2], twoD_data_ary[1][3],twoD_data_ary[1][4], expected_roll_count],
        ['3', twoD_data_ary[2][0], twoD_data_ary[2][1], twoD_data_ary[2][2], twoD_data_ary[2][3],twoD_data_ary[2][4], expected_roll_count],
        ['4', twoD_data_ary[3][0], twoD_data_ary[3][1], twoD_data_ary[3][2], twoD_data_ary[3][3],twoD_data_ary[3][4], expected_roll_count],
        ['5', twoD_data_ary[4][0], twoD_data_ary[4][1], twoD_data_ary[4][2], twoD_data_ary[4][3],twoD_data_ary[4][4], expected_roll_count],
        ['6', twoD_data_ary[5][0], twoD_data_ary[5][1], twoD_data_ary[5][2], twoD_data_ary[5][3],twoD_data_ary[5][4], expected_roll_count],
        ['7', twoD_data_ary[6][0], twoD_data_ary[6][1], twoD_data_ary[6][2], twoD_data_ary[6][3],twoD_data_ary[6][4], expected_roll_count],
        ['8', twoD_data_ary[7][0], twoD_data_ary[7][1], twoD_data_ary[7][2], twoD_data_ary[7][3],twoD_data_ary[7][4], expected_roll_count],
        ['9', twoD_data_ary[8][0], twoD_data_ary[8][1], twoD_data_ary[8][2], twoD_data_ary[8][3],twoD_data_ary[8][4], expected_roll_count],
        ['10', twoD_data_ary[9][0], twoD_data_ary[9][1], twoD_data_ary[9][2], twoD_data_ary[9][3],twoD_data_ary[9][4], expected_roll_count],
        ['11', twoD_data_ary[10][0], twoD_data_ary[10][1], twoD_data_ary[10][2], twoD_data_ary[10][3],twoD_data_ary[10][4], expected_roll_count],
        ['12', twoD_data_ary[11][0], twoD_data_ary[11][1], twoD_data_ary[11][2], twoD_data_ary[11][3],twoD_data_ary[11][4], expected_roll_count],
        ['13', twoD_data_ary[12][0], twoD_data_ary[12][1], twoD_data_ary[12][2], twoD_data_ary[12][3],twoD_data_ary[12][4], expected_roll_count],
        ['14', twoD_data_ary[13][0], twoD_data_ary[13][1], twoD_data_ary[13][2], twoD_data_ary[13][3],twoD_data_ary[13][4], expected_roll_count],
        ['15', twoD_data_ary[14][0], twoD_data_ary[14][1], twoD_data_ary[14][2], twoD_data_ary[14][3],twoD_data_ary[14][4], expected_roll_count],
        ['16', twoD_data_ary[15][0], twoD_data_ary[15][1], twoD_data_ary[15][2], twoD_data_ary[15][3],twoD_data_ary[15][4], expected_roll_count],
        ['17', twoD_data_ary[16][0], twoD_data_ary[16][1], twoD_data_ary[16][2], twoD_data_ary[16][3],twoD_data_ary[16][4], expected_roll_count],
        ['18', twoD_data_ary[17][0], twoD_data_ary[17][1], twoD_data_ary[17][2], twoD_data_ary[17][3],twoD_data_ary[17][4], expected_roll_count],
        ['19', twoD_data_ary[18][0], twoD_data_ary[18][1], twoD_data_ary[18][2], twoD_data_ary[18][3],twoD_data_ary[18][4], expected_roll_count],
        ['20', twoD_data_ary[19][0], twoD_data_ary[19][1], twoD_data_ary[19][2], twoD_data_ary[19][3],twoD_data_ary[19][4], expected_roll_count]
       ]; /* END Google Charts Data Struct */
    }
}

class Pf2eChartData {
    data = []; /* Google Chart Data structure that will be used to be displayed */
    chart_opts = {
        title: '',
        width: '',
        height: '',
        hAxis: { title: 'Die Result' },
        vAxis: { title: 'Num Result Rolls' },
        isStacked: true,        // Enables stacked bars
        seriesType: 'bars',     // Default type for all series
        series: {
            5: { type: 'line', color: 'orange', lineWidth: 3, pointSize: 5 } // Line chart for the 5th column (Expected Distribution)
        }
    }
}


/* Example for later to make a multi dim array
        var data = google.visualization.arrayToDataTable([
          ['Die Res', 'Fail', 'Mixed', 'Success', 'Expected Distribution'],
          ['1', 2, 5, 12, 30],
          ['2', 7, 7, 15, 30],
          ['3', 8, 8, 16, 30],
          ['4', 10, 12, 18, 30],
          ['5', 13, 15, 25, 30]
        ]);

        var options = {
          title: 'Stacked Bar Chart with Overlay Line',
		  width: 1700,
		  height: 500,
          hAxis: { title: 'Die Res' },
          vAxis: { title: 'Value' },
          isStacked: true,  // Enables stacked bars
          seriesType: 'bars',  // Default type for all series
          series: {
            3: { type: 'line', color: 'red', lineWidth: 3, pointSize: 5 } // 3rd data row for line chart
		  },		   
		};

        // Instantiate and draw our CHART 1, passing in some options.
        var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
        chart.draw(data, options);
*/