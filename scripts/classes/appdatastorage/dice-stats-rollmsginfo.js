    /* DIE_TYPE, ROLL_TYPE, ROLL_VALUE, IS_BLIND, DEG_SUCCESS*/
    /* Any Negative value is invalid */
    /* Storage of any info related to the DICE that in the message (Trim out all the useless bits)*/
    class DS_DIE_ROLL_INFO {
        DieType=    -1; //{DIE_TYPE}
        RollType=   -1; //{ROLL_TYPE}
        RollValue=  -1; //{INT}
        IsBlind=    -1; //{BOOLEAN}

        constructor()
        {
            this.DieType=    -1; //{DIE_TYPE}
            this.RollType=   -1; //{ROLL_TYPE}
            this.RollValue=  -1; //{INT}
            this.IsBlind=    -1; //{BOOLEAN}
        }
    }

    /**
     * Roll Info Object. 
     * When a message is made in chat it can include multiple rolls, and multiple dice of each type
     * EX: "/r 2d20 + 1d10 + 2d4kh" is a valid roll inside the message. There could even be multiple rolls.
     * Storage Holds Roll Info and an array of Dice Info, Also helps if Hit and Miss's Require multiple dice
     * Trim out all the useless bits from the MSG.ROLL obj
     */
    class DS_ROLL_INFO {
        DiceInfo = []; //{DS_DIE_ROLL_INFO}
        DegSuccess= -1; //{DEG_SUCCESS} HIT OR MISS VALUE
        CheckDiff = null; //{INT} Integer Hit Or Missed By
        MissFromAdv = false; //{BOOLEAN}
        HitFromAdv  = false; //{BOOLEAN}
        RollType=   -1; //{ROLL_TYPE} Type of roll that was made; Save, attack etc

        constructor(){
            this.DiceInfo = [];
            this.DegSuccess = null;
            this.CheckDiff = null;
            this.MissFromAdv = null;
            this.HitFromAdv = null;
        }
    }