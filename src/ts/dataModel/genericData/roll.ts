export class RollInfo {
    targetRollCount: number = 0;
    untargetRollCount: number = 0;

    constructor(){
    }

    public clear(){
        this.targetRollCount = 0;
        this.untargetRollCount = 0;
    }
}