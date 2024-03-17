/**
 * Class to hold any info we want to track that applies 
 * to the roll as a whole rather than specific dice. 
 */
class ROLL_INFO {

    // Stora roll outcome degree success info; length=DEGREE_SUCCESS.size 
    ATK_OUTCOME_TRACKER = [];       // Degree success for every attack
    SAVE_OUTCOME_TRACKER = [];      // Degree success for Saves
    CHECKS_OUTCOME_TRACKER = [];    // Degree success for All Other Checks

    // attack info
    NUM_UNTARGETED_ATKS = null; // {INT}
    TOTAL_ATTACKS = null; // {INT}

    // save info
    NUM_UNTARGETED_SAVES = null;
    TOTAL_SAVES = null;

    // sadvantage & disadvantage info
    NUM_ROLL_WITH_ADVANTAGE = null; // {INT}
    MISS_FROM_ADV = null;   //{INT}
    HIT_FROM_ADV = null;    //{INT}
    ADV_MISS_BOTH = null;   //{INT}
    ADV_HIT_BOTH = null;    //{INT}

}