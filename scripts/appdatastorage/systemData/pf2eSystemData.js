import { DS_GLOBALS } from "../../dice-stats-globals";

export class Pf2eSystemData {
    static DIE_TYPE = DS_GLOBALS.DIE_TYPE.D20;
    static DIE_MAX = 20;

    static NUM_DEG_SUCCESS = 5;
    static DEGREE_SUCCESS = {
        UNKNOWN: 0,
        CRIT_FAIL: 1,
        FAIL: 2,
        SUCCESS: 3,
        CRIT_SUCCESS: 4,
    }

    static NUM_SYS_ROLL_TYPES = 8;
    static SYS_ROLL_TYPES = {
        UNKNOWN: 0,
        ATK_ROLL: 1,
        DMG_ROLL: 2,
        PLAYER_SAVE: 3,
        NPC_SAVE: 4,
        SKILL: 5,
        ABILITY: 6,
        INITIATIVE: 7
    }

    /* All system arrays are 2d: [D20_RESULT][DEGREE_SUCCESS] = num_of_degree_success_rolls*/
    atk_rolls = [];
    player_saves = [];
    npc_saves = [];
    skills = [];
    ability = [];
    initiative = [];
    /* Its very unlinkly to have an unknown attack with a degree success */
    unknown = [];

    /* Total rolls for each roll type Array(SYS_ROLL_TYPE) */
    totals = [];

    /* Misc Info */
    hero_points_used = 0;

    degree_success_with_advantage = [];
    degree_success_with_disadvantage = [];

    advantage_helped = 0;
    advantage_did_nothing = 0;
    advantage_unknown = 0;
    advantage_total = 0;

    disadvantage_hurt = 0;
    disadvantage_did_nothing = 0;
    disadvantage_unknown = 0;
    disadvantage_total = 0;

    /* Dmg values just from dice */
    total_mod_damage_done = 0;
    total_damage_done_from_dice = 0;
    total_damage_done_with_mods = 0;
    expected_damage_done_from_dice = 0;
    expected_damage_done_with_mods = 0;
    max_damage_done_from_dice = 0;
    max_damage_done_with_mods = 0;

    // dmg_rolls = []; /* Have some fancy charts for damage dice later: int[DIE_TYPE][NUM_DICE] = Dmg Done? */

    /* Dmg values including modifiers to rolls Ex: 6d4+10 */
    total_damage_taken_to_player = 0;    


    constructor(){
        /* INIT 2d arrays */
        for(let i=0; i<this.DIE_MAX; i++){
            this.atk_rolls[i] = new Array(this.NUM_DEG_SUCCESS);
            this.dmg_rolls[i] = new Array(this.NUM_DEG_SUCCESS);
            this.player_saves[i] = new Array(this.NUM_DEG_SUCCESS);
            this.npc_saves[i] = new Array(this.NUM_DEG_SUCCESS);
            this.skills[i] = new Array(this.NUM_DEG_SUCCESS);
            this.ability[i] = new Array(this.NUM_DEG_SUCCESS);
            this.initiative[i] = new Array(this.NUM_DEG_SUCCESS);

            /* Its very unlinkly to have an unknown attack with a degree success */
            this.unknown[i] = new Array(this.NUM_DEG_SUCCESS);
        }

        this.totals = new Array(this.NUM_SYS_ROLL_TYPES);
        this.degree_success_with_advantage = new Array(this.NUM_DEG_SUCCESS);
        this.degree_success_with_disadvantage = new Array(this.NUM_DEG_SUCCESS);

        this.clear_data();
    }

    clear_data(){
        /* Fill all arays with 0 */
        for(let i=0; i<this.DIE_MAX; i++){
            this.atk_rolls[i].fill(0);
            this.dmg_rolls[i].fill(0);
            this.player_saves[i].fill(0);
            this.npc_saves[i].fill(0);
            this.skills[i].fill(0);
            this.ability[i].fill(0);
            this.initiative[i].fill(0);
            this.unknown[i].fill(0);
        }/* for die_max */

        this.totals.fill(0);
        this.hero_points_used = 0; 

        /* Degree success for D20 rolls with advantage(Xd20kh1) or disadvantage(Xd20kl1) */
        this.degree_success_with_advantage.fill(0);
        this.degree_success_with_disadvantage.fill(0);

        this.advantage_changed_result = 0;
        this.advantage_did_nothing = 0;
        this.disadvantage_changed_result = 0;
        this.disadvantage_did_nothing = 0;

        this.damage_done = 0;
        this.damage_max = 0;
        this.damage_min = 0;
        this.damage_expected = 0;
        this.damage_done_with_mods = 0;
        this.damage_expected_with_mods = 0;
        this.damage_taken_to_player = 0;
    }

    /**
     * Add temp_data into this data
     * @param {Pf2eSystemData} temp_data 
     */
    add(temp_data){
        for(let i=0; i<this.DIE_MAX; i++){
            for(let j=0; j<this.NUM_DEG_SUCCESS; j++){
                this.atk_rolls[i][j]        += temp_data.atk_rolls[i][j];
                this.dmg_rolls[i][j]        += temp_data.dmg_rolls[i][j];
                this.player_saves[i][j]     += temp_data.player_saves[i][j];
                this.npc_saves[i][j]        += temp_data.npc_saves[i][j];
                this.skills[i][j]           += temp_data.skills[i][j];
                this.ability[i][j]          += temp_data.ability[i][j];
                this.initiative[i][j]       += temp_data.initiative[i][j];
                this.unknown[i][j]          += temp_data.unknown[i][j];
            }
        }/* for die_max */

        this.hero_points_used += temp_data.hero_points_used; 

        for(let i=0; i<NUM_DEG_SUCCESS; i++){
            this.degree_success_with_advantage[i]       += temp_data.degree_success_with_advantage[i];
            this.degree_success_with_disadvantage[i]    += temp_data.degree_success_with_disadvantage[i];
        }

        this.advantage_changed_result       += temp_data.advantage_changed_result;
        this.advantage_did_nothing          += temp_data.advantage_did_nothing;

        this.disadvantage_changed_result    += temp_data.disadvantage_changed_result;
        this.disadvantage_did_nothing       += temp_data.advantage_did_nothing;

        this.damage_done                += temp_data.damage_done;
        this.damage_max                 += temp_data.damage_max;
        this.damage_min                 += temp_data.damage_min;
        this.damage_expected            += temp_data.damage_expected;
        this.damage_done_with_mods      += temp_data.damage_done_with_mods;
        this.damage_expected_with_mods  += temp_data.damage_expected_with_mods; 
        this.damage_taken_to_player     += temp_data.damage_taken_to_player;  
    }

    /**
     * Store a degree success value
     * @param {Pf2eSystemData.SYS_ROLL_TYPES} roll_type - type of d20 roll
     * @param {int} roll_value - value from 1-20 on d20
     * @param {Pf2eSystemData.DEGREE_SUCCESS} deg_success - degree success on the roll
     */
    add_deg_success_roll(roll_type, roll_value, deg_success){

    }

    /**
     * Store a damage value
     * @param {DS_GLOBALS.DIE_TYPE} die_type - type of die that was rolled for damage (d6?, d4?, etc)
     * @param {int} num_dice - number of damage dice rolled
     * @param {int} dice_dmg - damage values from dice
     * @param {int} dmg_mods - damage values from modiefiers
     */
    add_damage_roll(die_type, num_dice, dice_dmg, dmg_mods){

    }
}