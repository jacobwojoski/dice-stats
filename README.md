# FoundryVTT Dice Stats Module

## Table of Contents
- [Overview]()
- [UI Design]()
- [Module Settings]()
- [Dependencies]()
- [Incompatabilities]()
- [Thanks]()
- [Development/Contribution Guides]()
- [Images]()
- [Changelog]()

## OVERVIEW
This module is designed to record per session dice data. Also some system specific roll information to display to players. 
Each system needs to be added manually so create a bug report if you want me to add details for a specific system thats not currently supported.

Original Idea was from [Catan Online](https://colonist.io/) end-of-game dice stats screen and wanted something similar to let players look at during or the end of a session.
Always fun to see when the dice were as bad as you thought this session. And when that pesky friend rolled 5 crits while you got none. 

This module can be used to track data over multiple sessions or an entire campaign but that will always lead to the average expected results. 
Because of this the main pupose of the module is to track session specific information and clear it at the start of every session. As specific session info can 
vary drastically compared to the average result after a long campaign. 

## UI Design
#### Use one of the following to open the different applications (forms)
- Use Scene Control buttons to open the apps
- Use Chat Icon to open apps
- Use Macro to open apps
  
#### Different Application Types
- Settings: Quick access to some module settings without going to the module-settings window [Settings Form Options Link](#gm-interaction-settings)
- Pause: Quick enable or disable the recording of Dice-Stats
- IO: Import or Export Dice-Stats to CSV or JSON
- Global Stats: Info of all players combined possibly includidng or excluding the GM
- Compare Stats: Directly compare each players rolls on one chart
- Player Stats: View an individuals dice roll info

## Module Settings
#### Module Settings info
- Players See GM Rolls?         Def: True    // Allow non GM's to see the the GM app
- Players See Other Players?    Def: True    // Allow players to view other players app
- Players See Self?             Def: True    // Allow players to see their own app
- Players See Settings Form?    Def: True    // Allow players to open the settings app

- Players See Blind Rolls?      Def: True    // Hide any Blind Rolls from being added to the charts until GM Adds them using setting app
- Track GM In Global Stats?     Def: False   // Inlcude or keep out GM's stats from the Global stats application

- Disable System Tabs?          Def: False   // Disable system specific tabs

- Scene Control Button Icons:   Def: ''      // Comma seperated list for custom button icons for each player
  
- Hide Scene Control Buttons?   Def: False   // Disable the Scene Control Buttons from appearing on the UI
- Hide Btns From Players?       Def: False   // Disable the Scene Control Buttons for the players
- Hide Chat Window Button?      Def: True    // Disable the Button By the chat window to open forms
- Disable Dice Stats API?       Def: False   // Disable the Use of the Dice Stats API


- Pause Saving Rolls?           Def: False   
- Push Blind Rolls?             Button       

#### GM Interaction Settings
- Pause Saving Rolls?           Def: False   // Done save any rolls to data while enabled
- Push Blind Rolls              Button       // Add any non visible rolls to become visisble to players
- Export Data (File, json or yaml?)          // Export All Data from data model into requested format
- Import Data (File, json or yaml?)          // Import Data From Expected fromat
- Set Player Icons (Dropdown for each player)  // Update Players Scene Controls Icons
- Open Applications (Global, Compare, Player)  // Open each Application Not Using the Scene Control Buttons

## DEPENDENCIES 
- [Charts.js](https://www.chartjs.org)
  
## INCOMPATABILITIES (Add an Issue for any System Requests)
- Any system that doesn't print rolls to chat
- Any system that doesn't set the message.isRoll to true on roll chat messages (Many smaller systems do this and required contacting the system dev)

- **Midi-Qol** if **Merge Rolls to 1 Card** is enabled but have a partial fix. 
    - Midi-qol.rollComplete hook Doesnt have a way to trace back to the Player that rolled. Only the actor
    - Use actor.owner to track to player but if there are multiple owners it may not track to the correct person.

## Thanks
#### External Help
- [Foundry][1] For making an awesome VTT
- Used Google Charts originally and now Charts.js (Both MIT License)
- Used [Roll Tracker Module][2] (MIT License) as a starting point
- [socketlib][3] For making foundry sockets less annoying
- [BringingFire Typescript Blog][4] For an easily digestable way to get typesript working for Foundry Modules
- [BringingFire Typescipt Template][5]  The Typescipt starting point
- [League-of-Foundry-Developers][6] For typescript types
- Foundry VTT Discord for many questions

#### Module Help!
Thanks to all Contributors and to anyone who made pull requests or bug reports to get the module to where it is now.
- Jacobwojo: Lead Developer
- Juan Ferrer: Fix for canvas buttons
- RadicalEd: German translation + Remove some hardcoded items
- Willumz: Added CSV, export by player options
- joonhohw: Allow GM access when canSeePlayerData is false
- ThiefMaster: Fix Depricated warning from V12 Updates
- cuyima: API Fix

## Development Guide 
#### Building the Typescript Code 
- [ ] Install [Node][7], nvm, and yarn from the nodejs website. (I've used v22.15.1) on a linux mint machine. I was also able to get it to work on windows using minggw.
- [ ] Install Charting lib `npm install chart.js` for fancy UI charts
- [ ] Install Foundry VTT Types: Check [League-of-Foundry-Developers][6] to download whatever version of the types you need. Getting the latest looks to use `yarn add --dev fvtt-types@github:League-of-Foundry-Developers/foundry-vtt-types#main` currently
- [ ] Download needed yarn stuff `yarn add -D typescript vite rollup-plugin-copy`
- [ ] run `yarn build` and the output should be in the `dist` folder. These files are whats needed to be placed in the `dice-stats` module directory
- [ ] If on linux you can create a link to the dist folder using `ln -sfn <DEV FOLDER>/dice-stats/dist <FOUNDRY DATA DIR>/modules/dice-stats` otherwise you need to copy the dist directory to `<FOUNDRY DATA DIR>/modules/` and rename it as `dice-stats`

#### Adding A System Implementation
When adding a system you will need to edit the following:
- [ ] Update system data factory to include system id
- [ ] Create new system data class
- [ ] Create new system Form Builder
- [ ] Create new system template
- [ ] Add Localization to language template (plz)
- [ ] Update Player form to use new System Display Info

#### Hooks
- **Init**: Initializing the Module with other foundry's other inits
  - Call the constructor for the Dice-Stats data model. 
  - Load the API Settings
  - Creates an empty map that player info will be stored into later once we get list of players
- **Canvas Init**: Canvas is getting created:
  - Add dice stats layer to canvas for the module specific scene controlls
- **getSceneControlButtons**: Scene control buttons are getting loaded
  - When scene controll buttons are getting made add the dice stats buttons
- **Ready**: System Is Now ready
  - Get system ID 
  - List of players is now avaialble. 
  - Update Data Model Map. 
    - Add a Player Object to the Map for each player defined in the game
    - Each Player Object Includes *System-Agnostic Dice-Info* and *System-Specific Dice-Info (If System is Supported)*
    - Update the System Specific Templates to be a *System Not Supported* or *System Charts & System Details* Template if dice-stats supports or does not support the system
- **ChatMessageCreated**: A chat message has been created
  - If the message is a roll parse the message, Otherwise ignore the message
    1. Parse Generic Data
    2. Parse System Data if supported
    3. Get Player Data Related Message from Data Model
    4. Save Data to associated player Data Model
- **midi-qol.RollComplete**: A Midi QOL Message was finishied
  - Multiple people use midi-qol for DnD5e.
  - Midi Qol Messes with how rolls are normally output to chat.
  - If Midi QoL is used, Parse Messages from Their chat hool as well as the normal chat ouput.
  - This allows us to store automated rolls from Midi QoL and hand rolled items like an Item having `[[/r 2d20hk1]]` In the description or a user typing `/r 2d6r1` in chat

#### What Opening A UI/Application Does internally
- An Application can be opened in the following ways: (These Elements can be anabled or disabled in the settings)
  - The Scene Control Buttons
  - The Dice-Stats Button by the chat message area
  -  Or through a Macro calling the Dice-Stats API. 
- When an application gets opened the application render asks *Display Packager* to parse the data model and convert the data into the format needed for the application template. Any UI interactions Update the *Data Model* accordingly and a re-render gets called.

#### Parsing Messages Code Guide
1. When a message is received, check what system we are & get associated player
2. Call System-Data-factory to get a system-data-object if one has been made for the system
3. Call the system parser passing in the message object returning a filled in system object
4. Call the generic data parser passing im the message object returning a filled in message object
5. Get the associated player object from the data model
5. Add both the parsed system-data-object and generic-data-object to the associated player

## Images

[1]: https://foundryvtt.com/
[2]: https://foundryvtt.com/packages/roll-tracker
[3]: https://github.com/manuelVo/foundryvtt-socketlib
[4]: https://bringingfire.com/blog/intro-to-foundry-module-development
[5]: https://github.com/BringingFire/foundry-module-ts-template
[6]: https://github.com/League-of-Foundry-Developers/foundry-vtt-types
[7]: https://nodejs.org/en/download
