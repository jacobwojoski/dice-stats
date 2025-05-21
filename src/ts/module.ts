// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";
// import DogBrowser from "./apps/dogBrowser";
import { moduleId } from "./constants";
import { DiceStatsDataModel } from "./dataModel/dataModel";
import { CustomSceneControl } from "./ui/sceneControls/sceneControls";
// import { MyModule } from "./types/types";

//let module: MyModule;

Hooks.once('init', () => {
  console.log(`Initializing ${moduleId}`);
  DiceStatsDataModel.getInstance();
  }
);

Hooks.once('ready', () => {
  console.log('Scene Ready, We can load player data now!')
  DiceStatsDataModel.getInstance().loadPlayers()
  }
);

// TODO: This def doesn't work but should be updated and tested to work!
class DiceStatsCanvasLayer extends CanvasLayer {
    static get layerOptions() {
        return {
            zIndex: 1000, // Define stacking order
            name: "myCustomLayer",
            group: canvas.groups.overlay // Assign to OverlayCanvasGroup
        };
    }

    draw() {
        super.draw();
        console.log("My custom layer is now part of OverlayCanvasGroup!");
    }
}

Hooks.on("canvasInit", () => {
    CONFIG.Canvas.layers.diceStatsCanvasLayer = DiceStatsCanvasLayer;
});


// Hook to interact when scenecontrols get created Method used to have a better location to access player data
Hooks.on("getSceneControlButtons", (controls: { [key: string]: any }) => {
  let playerIds = []
  let playerKeys:[string,string] = ['',''];
  
  let users = (game as Game).users
  if (users){
    for (let user of users){
      playerKeys[0] = user._id;
      playerKeys[1] = user.name;
      playerIds.push(playerKeys)
    }
  }

  var customSceneCtrl = new CustomSceneControl(playerIds);

  let key:string = 'dice-stats';

  let layers: any = CONFIG.Canvas.layers;
  layers['diceStats'] = { layerClass: InteractionLayer, group: 'interface' }

  controls[key] = customSceneCtrl
  
});
