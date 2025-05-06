# FoundryVTT Dice Stats Module
## OVERVIEW
This module is designed to record per session dice data. As well as System specific roll information to display to players.
Each system needs to be added manually so create a bug report if you want me to add details for a specific system thats not currently supported 

Original Idea was from [Catan Online](https://colonist.io/) end-of-game dice stats screen and wanted something similar to let players look at during or the end of a session.  

This module can be used to track data over multiple sessions or an entire campaign but that will always lead to the average expected results. Hence the main pupose 
being to track session specific information

## SETTINGS
- Players See GM Rolls?         Def: True
- Players See Other Players?    Def: True
- Players See Self?             Def: True

- Pause Saving Rolls?           Def: False
- Track GM In Global Stats?     Def: False

- Disable System Charts Tab?    Def: False
- Disable System Stats Tab?     Def: False

## DEPENDENCIES 
[socketlib][3] | [socketlib Foundry Page](https://foundryvtt.com/packages/socketlib)
Socketlib needs to be active to allow GM to tell other users to push blind rolls.
[Google Charts](http://google.com) 

## INCOMPATABILITIES (Add an Issue for any System Requests)
- Any system that doesn't print rolls to chat
- Any system that doesn't set the message.isRoll to true on roll chat messages (Many smaller systems do this)

- **Midi-Qol** if **Merge Rolls to 1 Card** is enabled but have a partial fix. 
    - Midi-qol.rollComplete hook Doesnt have a way to trace back to the Player that rolled. Only the actor
    - Use actor.owner to track to player but if there are multiple owners it may not track to the correct person.

### Thanks
[Foundry][1] For making an awesome VTT
Used Google Charts as a charting library. (MIT License)
Used [Roll Tracker Module][2] (MIT License) as a starting point
[socketlib][3] For making foundry sockets less annoying
[BringingFire Typescript Blog][4] For an easily digestable way to get typesript working for Foundry Modules
[BringingFire Typescipt Template][5]  The Typescipt starting point
[League-of-Foundry-Developers][6] For typescript types

#### Special Thanks to all Contributors and to anyone who made pull requests or bug reports to get the module to where it is now
- Jacobwojo: Lead Developer
- Juan Ferrer: Fix for canvas buttons
- RadicalEd: German translation + Remove some hardcoded items
- Willumz: Added CSV, export by player options
- joonhohw: Allow GM access when canSeePlayerData is false
- ThiefMaster: Fix Depricated warning from V12 Updates
- cuyima: API Fix

## DEVELOPMENT - Building typescript 
[ ] Install [Node][7] nvm and yarn from the nodejs website.
[ ] Install Foundry VTT Types: Check [League-of-Foundry-Developers][6] to download whatever version of the types you need. Getting the latest looks to use `yarn add --dev fvtt-types@github:League-of-Foundry-Developers/foundry-vtt-types#mai`
[ ] run `yarn build` and the output should be in the `dist` folder. These files are whats needed to be placed in the `dice-stats` module directory

### DEV - Adding A System Impl
When adding a system you will need to edit the following:
- Update system data factory to include system id
- Create new system data class
- Create new system Form Builder
- Create new system template
- Add Localization to template (plz)
- Update Player form to use new System Display Info

[1]: https://foundryvtt.com/
[2]: https://foundryvtt.com/packages/roll-tracker
[3]: https://github.com/manuelVo/foundryvtt-socketlib
[4]: https://bringingfire.com/blog/intro-to-foundry-module-development
[5]: https://github.com/BringingFire/foundry-module-ts-template
[6]: https://github.com/League-of-Foundry-Developers/foundry-vtt-types
[7]: https://nodejs.org/en/download
