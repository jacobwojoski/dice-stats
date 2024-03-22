/**
 * Data object that can be interated over in hbs for Die info
 */
class HBS_DICE_DATA  {
    Is_displ= false;
    Total_Rolls= 0;
    Mean= 0;
    Median= 0;
    Mode= 0;
    StreakIsBlind= false;
    StreakString= "";
    chartClassId= "";
    DiceHeading= "";
}

class HBS_ALLDICE_DATA {
    TOTAL_ROLLS= [];
    IS_DISP= [];
    D2_INFO= [];
    D3_INFO= [];
    D4_INFO= [];
    D6_INFO= [];
    D8_INFO= [];
    D10_INFO= [];
    D12_INFO= [];
    D20_INFO= [];
    D100_INFO= [];

    HBS_DIE_INFO= []; /*{HBS_DICE_DATA[]}*/
}

class HBS_D20_DATA {

}

class HBS_2DX_DATA {

}

/**
 * Data info for His Miss class that can be easily iterated over as its sys agnostic
 *  */
class HBS_HIT_MISS_DATA {
    // Used to make arrays of info for each roll type
    //      Can store data like ["Untracked Rolls Count", 13] ["Total Rolls Count", 3]
    ROLL_INFO_TITLE = "";
    ROLL_TYPE_INFO = {
        TEXT_STRING: "",
        VALUE: 0
    }

    DEG_SUCCESS_TITLE = "";
    DEG_SUCCESS_DATA = {
        // Use handlebars helper to convert enum to degree success string
        DEG_SUCCESS_ENUM: 0,

        // Numbor of times we rolled the above degree of success
        NUM_OF_ROLLS: 0,
    }

    ROLL_TYPE_INFO_ARY = [];
    HIT_DATA_ARY = [];
}