import * as myUtils from    "dice-stats-utils.js";

TEMPLATES = {
    GLOBALDATA:     'modules/dice-stats/templates/dice-stats-global.hbs',
    PLAYERDATA:     'modules/dice-stats/templates/dice-stats-player.hbs',
    STREAKCHATMSG:  'modules/dice-stats/templates/dice-stats-global.hbs',
    ROLLCHATMSG:    'modules/dice-stats/templates/dice-stats-global.hbs',
}

class GlobalStatsPage extends FormApplication {
    //Can only open Global stats if GM
    
    //Global Stats               
        //D2 info
            //Graph of Each Number And Rolled Amount
            //Mean, Median, Mode
            //Plyer with Most Low Rolls & Number
            //Player with Most highest Roll & Number
            //Longest Streak Number & Player

        //D3 info
            //Graph of Each Number And Rolled Amount
            //Mean, Median, Mode
            //Plyer with Most Low Rolls & Number
            //Player with Most highest Roll & Number
            //Longest Streak Number & Player
}

class PlayerStatusPage extends FormApplication {
    //Player Data * x         
        //D2 Info
            //Graph of number of each rolls
            //Mean, Median, Mode
            //Longest Streak
        //D3 Info
            //Graph of number of each rolls
            //Mean, Median, Mode
            //Longest Streak
}