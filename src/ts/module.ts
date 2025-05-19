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


  // module = (game as Game).modules.get(moduleId) as MyModule;
  // module.dogBrowser = new DogBrowser();
  });

Hooks.once('ready', () => {
  console.log('Scene Ready, We can load player data now!')
  DiceStatsDataModel.getInstance().loadPlayers()
});

// Hooks.on("renderActorDirectory", (_: Application, html: JQuery) => {
//   const button = $(
//     `<button class="cc-sidebar-button" type="button">🐶</button>`
//   );
//   button.on("click", () => {
//     module.dogBrowser.render(true);
//   });
//   html.find(".directory-header .action-buttons").append(button);
// });

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