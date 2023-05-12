
//Class that defines a player. Players are all connected people to server including gm
//Player has Die Info for each die type they roll & some other misc data
class PLAYER {
    PLAYER_DICE = new Array(NUM_DIE_TYPES); //Aray of type<DIE_INFO>
    USERNAME = '';
    USERID = 0;
    GM = false;

    constructor(userid){
        if(userid)
        {
            this.USERID = userid;
            this.USERNAME = game.users.get(userid)?.name;
            this.GM = game.users.get(userid)?.isGM;
        }
        else
        {
            this.USERID = -1;
            this.USERNAME = 'NA';
            this.GM = false;
        }

        for (let i = 0; i < this.PLAYER_DICE.length; i++) {
            this.PLAYER_DICE[i] = new DIE_INFO(DIE_MAX[i]);
        }
    }

    getStreakString(dieType){
        let len = this.PLAYER_DICE[dieType].LONGEST_STREAK
        let initNum = this.PLAYER_DICE[dieType].LONGEST_STREAK_INIT
        let nextNum = 0;
        if(len === -1){
            return "NO DICE ROLLED"
        }else if(len === 1){
            return "No Strings Made"
        }else{
            // this value is index 0, loop starts at 1
            // User can have a streak of 1 
            let tempStr = initNum.toString(); 
            for(let i=1; i<len; i++){
                nextNum = initNum+i;
                tempStr = tempStr+','+nextNum.toString();
            }
            return tempStr;
        }
    }

    getRolls(dieType){
        return this.PLAYER_DICE[dieType].ROLLS;
    }

    getDieInfo(dieType){
        return this.PLAYER_DICE[dieType];
    }

    saveRoll(isBlind, rollVal, dieType){
        this.PLAYER_DICE[dieType].addRoll(rollVal,isBlind)
    }

    pushBlindRolls(){
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].pushBlindRolls();
        }
    }

    getBlindRollsCount(){
        let tempRollCount = 0;
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            tempRollCount += this.PLAYER_DICE[i].getBlindRollsCount();
        }
        return tempRollCount;
    }

    clearAllRollData(){
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].clearData();
        }
    }

    clearDieData(DiceType){
        this.PLAYER_DICE[DiceType].clearData();
    }

    //Clear all dice roll data
    clearDiceData(){
        for(let i=0; i<this.PLAYER_DICE.length; i++){
            this.PLAYER_DICE[i].clearData();
        }
    }

    //clear a specific die's roll data
    clearDieData(DiceType){
        this.PLAYER_DICE[DiceType].clearData();
    }
}