# Dice Stats
A foundry vtt module to view dice stats (Number of each roll in a Chart! See Below)  
Currently stats are stored by parsing chat. If the user joins the game late after rolls were made  
they will only get data from that point on. Original Idea was from [Catan Online](https://colonist.io/)  
end-of-game dice stats screen and wanted something similar to let players look at during or the end of a session.   

Used Google Charts as a charting library. (MIT License)
Used [Roll Tracker Module](https://foundryvtt.com/packages/roll-tracker) as a starting point but (MIT License)  
wanted the ability to track multiple dice types. This Basically lead to a full rewrite as I wanted a more OOP appreach for data storage.

## DEPENDENCIES
[socketlib](https://github.com/manuelVo/foundryvtt-socketlib)
Socketlib needs to be active to be able to push users blind rolls

## INCOMPATABILITIES (Add an Issue for any System Requests)
- Any system that doesnt print rolls to chat
- **Midi-Qol** if **Merge Rolls to 1 Card** is enabled partial fix. 
    - Midi-qol.rollComplete hook Doesnt have a way to trace back to the Player that rolled. Only the actor
    - I Used actor.owner property to find out who to associate the roll with but that makes the following issues
        - If an actor has >1 owner it will not track the roll to the right player. 
        - If the GM rolls for a player is will count as the players roll Not the GM's

## Stats Tracked (Each Player)  
- Number of each roll (Plans to make roll data as a bar chart)  
- Total Number of rolls
- Mean  
- Median  
- Mode  
- Streaks (Incrementing die rolls in a row) 4,5,6,7 ect  
  
## Stats Tracked (Global)  
Module also allows to view dice stats of the full game (Global stats) 
- Total Number of each roll
- Globa Mean
- Global Median
- Global Mode
- Global Longest Streaks (Player Name and Streak Value)
- Most Min and Most Max values Rolled (Player Name and Number)

## Dice Types Supported  
Tracks multiple dice types. Currently supporting types are:  
- D2, D3, D4, D6, D8, D10, D12, D20, D100

## Editing Dice Types (Reccomended: Submit Issue Req to add Die Type Instead)
The user can <b>hand edit</b> the dice types saved by editing the following
 * main/NUM_DIE_TYPES 
 * main/DIE_TYPE
 * main/DIE_MAX
 * main/MAX_TO_DIE
 * datapack/PLAYER_HANDL_INFO/DICE_ROLL_DATA
 * datapack/GLOBAL_HANDL_INFO/DICE_ROLL_DATA
 * dice-stats-player //Lots of changes would need to be made here as I dont know good way to implement loops in handlebars 
    * (Could prolly make a fn that returns an HTML string or some shit tho)
 * dice-stats-global //Same as Player
<b> Its Alot of work if adding a die between current die options as all UI's Would need to be updated by hand </b>
<b> Planned Feature to add more types </b>
  
## Module Settings options  
Def = Default | (Global) & (Local) = setting scope 
Global Settings are restricted to gm only my default
- PLAYERS_SEE_SELF -------------- If players are allowed to view their stats -----------[Def: True]     (Global)
- PLAYERS_SEE_PLAYERS --------- If players cant see self they cant see others either -[Def: True]     (Global)
- PLAYERS_SEE_GM -------------- If Players can see GM dice roll stats ----------------[Def: False]    (Global)
- PLAYERS_SEE_GLOBAL --------  If Players Can  Global Dice Stats --------------------[Def: True]     (Global)
- PLAYERS_SEE_GM_IN_GLOBAL - If GM roll stats get added into global stats ---------[Def: False]    (Global)
- ENABLE_BLIND_STREAK_MSGS - Allow strk from a blind roll to be prnt to chat ------[Def: false]    (Global) 
- SHOW_BLIND_ROLLS_IMMEDIATE -- let Blind Rolls be added to player stats immediately ---[Def: false] (Global)
- ENABLE_CRIT_MSGS ------------  Choose what dice print crit msgs ---------------------[Def: d20]      (Local)
- TYPES_OF_CRIT_MSGS ---------- Choose Type of crits to print ------------------------[Def: Both]     (Local)
- ENABLE_STREAK_MSGS -------- Choose what dice to display streak msgs for ----------[Def : d20]     (Local)  

## Install  
If prerelease version is desired the user can add to module folder by hand by placing it in   
```bash
$/PATH_TO_FOUNDRY_DATA(Prolly AppData foulder on windows)/Sources/Modules
```  
### Usage  
- View Each Players info by selecting icon next to the player in the bottom left
  - Press D20 For Player Stats
  - Press Globe for Global Stats (Should only have 1 globe by clients username)  
![Player List Buttons](https://i.imgur.com/QhwLQOX.png)

- PLAYERS_SEE_GM = False  
![PLAYERS_SEE_GM = False](https://i.imgur.com/sGELoCJ.png)  
  
### Player Info Form
- Player D4 Info  
![Player D4 Info](https://i.imgur.com/MAnKo9g.png)   

- Player D20 Info  
![Player D20 Info](https://i.imgur.com/3R4r9XF.png)
  
### Access Global Stats by slecting this icon by player list 
- Global D4 Info  
![Global D4 info](https://i.imgur.com/upUhLaT.png)

- Global D20 Info  
![Global D20 info](https://i.imgur.com/R7LmFus.png) 

## Ongoing Issues
- Support Other Systems  

## Planned Features
- ~~Add Charts~~ (Done)
- ~~Make Settings have their own tab instead of being under "undefined"~~ (Done)
- ~~Fix Streaks, Streaks are off by 1 rn. 1 extra value at the end. They Start correctly though~~ (Done)
- ~~Global Stats~~ (Done)
- ~~Add Refresh button on dice stats page~~ (Done)
- ~~Setting to choose which dice Stats are displayed (checkboxes w/ grayed out checks if no dice of that type are rolled)~~ (Done)
- ~~Add feature to hide blind rolls~~
- Streaks in Both Direction  
- Add Most Max val and Most min values rolls Adjusted for % of total rolls  
- Comparison Tool, Show a few players info size by side  
- Deal w/ Multiple of same values (Streak or same length streak | Multiple with max number of rolls)  
- Incorperate Lang page  
- Output to Chat how many Nat1 & 20's have been rolled by that player when one gets rolled  
- Output to chat Lows and Highs for some other die types. Maybe just milestone numbers? EX Multiple of 5's on a d4 or d6 (10th 1, 15th 5)?  
- Support more die types    
- Update Refresh Button to use "this" modifier instead of a global

- Settings
    - ~~PLAYERS_SEE_GM~~            (Done v1.0.0)   
    - ~~PLAYERS_SEE_GLOBAL~~        (Done v1.0.0) 
    - ~~PLAYERS_SEE_GM_IN_GLOBAL~~ 
    - ~~SHOW_BLIND_ROLLS_IMMEDIATE~~
    - PLAYERS_SEE_SELF          
    - PLAYERS_SEE_PLAYERS           
    - ENABLE_BLIND_STREAK_MSGS    
    - ENABLE_CRIT_MSGS         
    - TYPES_OF_CRIT_MSGS       
    - ENABLE_STREAK_MSGS     

## Longterm Goals
- Player Loads history if they join game late
- Better UI design
    - Change Button Positions
    - Implement Google charts better, potentally move to different charting sw (Add as Lib instead?) 
    - Better format for stats, Tabs? 
- Export data to be saved (Use JSON format)  
- Import Data to reload old values? (use JSON format)
    - Import just global data? User data, Ability to choose?
