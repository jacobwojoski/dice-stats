class ALLDICE_HBS_DATA {

}

class D20_HBS_DATA {

}

class HIT_MISS_HBS_DATA {
    // Used to make arrays of info for each roll type
    //      Can store data like ["Untracked Rolls Count", 13] ["Total Rolls Count", 3]
    ROLL_TYPE_INFO = {
        TEXT_STRING: "",
        VALUE: 0
    }

    DEG_SUCCESS_DATA = {
        // Use handlebars helper to convert enum to degree success string
        DEG_SUCCESS_ENUM: 0,

        // Numbor of times we rolled the above degree of success
        NUM_OF_ROLLS: 0,
    }

    ROLL_TYPE_INFO_ARY = [];
    HIT_DATA_ARY = [];
}