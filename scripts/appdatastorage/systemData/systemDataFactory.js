

/**
 * Class that creates system data. 
 * System data will fill in all roll info thats system specific. 
 * EX: Hit, miss, degree success, roll types, advantage, Dice pools etc...
 */
export class SystemDataFactory {
    static create_system_data(system_id){
        switch(system_id)
        {
            case "pf1":
            case "pf2e" :
            case "dnd5e" :
            case "dragonbane" :
            case "CoC7" :
            case "daggerheart" :
            case "mcdmrpg" : 
            default :
                return new GenericSystemData;
        }
    }
}

/**
 * Generic System data storage
 */
export class GenericSystemData {
    DEGREE_SUCCESS = {
        UNKNOWN: 0,
        CRIT_FAIL: 1,
        FAIL: 2,
        MIXED: 3,
        SUCCESS: 4,
        CRIT_SUCCESS: 5,
    }

    roll_data = []; /* roll_data[DIE_TYPE][DEGREE_SUCCESS] */
    constructor(){
        
    }
}