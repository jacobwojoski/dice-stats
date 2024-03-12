    /* DIE_TYPE, ROLL_TYPE, ROLL_VALUE, IS_BLIND, DEG_SUCCESS*/
    /* Any Negative value is invalid */
    class DS_ROLL_INFO {
        DieType=    -1; //{DIE_TYPE}
        RollType=   -1; //{ROLL_TYPE}
        RollValue=  -1; //{INT}
        IsBlind=    -1; //{BOOLEAN}
        DegSuccess= -1; //{DEG_SUCCESS} HIT OR MISS VALUE
        CheckDiff = null; //{INT} Integer Hit Or Missed By
        MissFromAdv = false; //{BOOLEAN}
        HitFromAdv  = false; //{BOOLEAN}

        constructor()
        {
            DieType=    -1; //{DIE_TYPE}
            RollType=   -1; //{ROLL_TYPE}
            RollValue=  -1; //{INT}
            IsBlind=    -1; //{BOOLEAN}
            DegSuccess= -1; //{DEG_SUCCESS}
            MissBy=     -1; //{INT}
            HitBy=      -1; //{INT}
            MissFromAdv = false; //{BOOLEAN}
            HitFromAdv  = false; //{BOOLEAN}
        }
    }