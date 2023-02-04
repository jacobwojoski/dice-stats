/*
class GlobalStatsPage extends FormApplication {

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
          height: 'auto',
          id: 'todo-list',
          template: TEMPLATES.GLOBALDATA,
          title: 'To Do List',
          userId: game.userId,
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }
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

    PLAYERDATA = new PLAYER;

    static get defaultOptions() {
        const defaults = super.defaultOptions;
      
        const overrides = {
          height: 'auto',
          id: 'player-data',
          template: TEMPLATES.PLAYERDATA,
          title: 'Player Roll Data',
          userId: game.userId,
        };
      
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }

    //dataObject<PLAYER> = pointerToPlayerData type class PLAYER
    constructor(userId, options={}, dataObject = null) {  
        // the first argument is the object, the second are the options
        super(userId, options)
        this.PLAYERDATA = dataObject;
        
    }

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
*/