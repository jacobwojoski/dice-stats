export class DiceStatsPlayer {

    _userName = '';
    _userId = 0;
    _isGm = false;
    _diceInfo

    // ====== Getters & Setters ======
    getUsername(){return this._userName}
    getUserID(){return this._userId}
    getIsGm(){return this.isGm}

    setUsername(in_user_name){this._userName = in_user_name}
    setUserID(in_user_id){this._userId = in_user_id}
    setIsGm(in_is_gm){this.isGm = in_is_gm}



}

export class DiceStatsDataModel {
    static PLAYER_DATA = []



    static build() {
        /* These objects are Data & Display Data Objects */
        for (player in game.players) {

        }
        playerDataObject = {
            genericData: {},
            systemData: {},
        }
    }
}