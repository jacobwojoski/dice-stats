import { id } from "../module.json";

export const moduleId = id;

export const NUM_DIE_TYPES = 11;
export enum DIE_TYPE {
    UNKNOWN = 0,
    D2,
    D3,
    D4,
    D6,
    D8,
    D10,
    D12,
    D20,
    D50,
    D100
}

export enum STREAK_DIRECTION {
    UNKNOWN = 0,
    DESCENDING = 1,
    ASCENDING = 2
}

export class Utils {
    public static getDieMax(die_type:DIE_TYPE) :number {
        switch (die_type) {
            case DIE_TYPE.D2:
                return 2;
            case DIE_TYPE.D3:
                return 3;
            case DIE_TYPE.D4:
                return 4;
            case DIE_TYPE.D6:
                return 6;
            case DIE_TYPE.D8:
                return 8;
            case DIE_TYPE.D10:
                return 10;
            case DIE_TYPE.D12:
                return 12;
            case DIE_TYPE.D20:
                return 20;
            case DIE_TYPE.D50:
                return 50;
            case DIE_TYPE.D100:
                return 100;
        
            default:
                return 0
        }
    }

    public static getDieAverage(die_type: DIE_TYPE): number{
        switch(die_type){
            case DIE_TYPE.D2:
                return 1.5;
            case DIE_TYPE.D3:
                return 2;
            case DIE_TYPE.D4:
                return 2.5;
            case DIE_TYPE.D6:
                return 3.5;
            case DIE_TYPE.D8:
                return 4.5;
            case DIE_TYPE.D10:
                return 5.5;
            case DIE_TYPE.D12:
                return 6.5;
            case DIE_TYPE.D20:
                return 10.5;
            case DIE_TYPE.D50:
                return 25.5
            case DIE_TYPE.D100:
                return 50.5;
            default:
                return 0;
        }
    }
}