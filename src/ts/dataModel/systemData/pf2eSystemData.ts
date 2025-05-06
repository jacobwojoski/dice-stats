import { GenericSystemData } from "./genericSystemData";

export class Pf2eSystemData extends GenericSystemData{
    override DEGREE_SUCCESS = { 
        UNKNOWN: 0,
        CRIT_FAIL: 1,
        FAIL: 2,
        SUCCESS: 3,
        CRIT_SUCCESS: 4 
    };
}