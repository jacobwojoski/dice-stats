import { GenericSystemData } from "./genericSystemData";

export class SystemDataFactory {
    public static createSystemData(system_id: string) {
        switch (system_id) {
            case 'pf2e':
                return new GenericSystemData()
        
            default:
                return new GenericSystemData()
        }
    }
}