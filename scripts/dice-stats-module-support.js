//Class used to allow integration with other modules
class ModuleSupport {
    constructor(){
        //Midi-QoL "Merge to One Chat card support"
        if(/*MIDI is Installed */){
            /*Remove Hook from Normal Dice rolling so we dont record rolls twice*/
            Hooks.on('createChatMessage', handleChatMsgHook(chatMessage));
            
            /*Add Hook for Midi-QoL */
            Hooks.on("midi-qol.RollComplete", (workflow) => {
                system.log(workflow);
            })
        }
    }
}