# Dice Stats (In Development) Settings Dont Work Yet
A foundry vtt module to view dice stats of every player including the gm.  
Currently stats are stored by parsing chat. If the user joins the game late  
they will only get data from that point on. Original Idea was from ![Catan Online](https://colonist.io/)  
end of game dice stats screen. Used ![Roll Tracker Module](https://foundryvtt.com/packages/roll-tracker)
as insperation. Wanted the ability to track multiple dice types and basically took a full rewrite as I didn't  
like how data was stored.
  
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

## Editing Dice Types
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
- PLAYERS_SEE_SELF          //If players are allowed to view their stats                [Def: True]     (Global)
- PLAYERS_SEE_PLAYERS       //if players cant see self they cant see others either      [Def: True]     (Global)
- PLAYERS_SEE_GM            //If Players can see GM dice roll stats                     [Def: False]    (Global)
- PLAYERS_SEE_GLOBAL        //If Players Can  Global Dice Stats                         [Def: True]     (Global)
- PLAYERS_SEE_GM_IN_GLOBAL  //If GM roll stats get added into global stats              [Def: False]    (Global)
- ENABLE_BLIND_STREAK_MSGS  //Allow strk from a blind roll to be prnt to chat           [Def: false]    (Global)    
- ENABLE_CRIT_MSGS          //Choose what dice print crit msgs                          [Def: d20]      (Local)
- TYPES_OF_CRIT_MSGS        //Choose Type of crits to print                             [Def: Both]     (Local)
- ENABLE_STREAK_MSGS        //Choose what dice to display streak msgs for               [Def : d20]     (Local)  

## Install  
[Downlaod Zip]() and add to module folder in  
```bash
$/Path_to_foundry_Data/Sources/Modules
```  
### Usage  
- View Each Players info by selecting icon next to the player in the bottom left    
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
  
## Planned Features
- ~~Add Charts~~ (Done)
- ~~Make Settings have their own tab instead of being under "undefined"~~ (Done)
- ~~Fix Streaks, Streaks are off by 1 rn. 1 extra value at the end. They Start correctly though~~ (Done)
- ~~Global Stats~~ (Done)
- Add Refresh button on dice stats page
- Streaks in Both Direction  
- Setting to choose which dice Stats are displayed (checkboxes w/ grayed out checks if no dice of that type are rolled)
- Add Most Max val and Most min values rolls Adjusted for % of total rolls
- Incorperate Lang page
- Comparison Tool, Show a few players info size by side
- Output to Chat how many Nat1 & 20's have been rolled by that player when one gets rolled  
- Output to chat Lows and Highs for some other die types. Maybe just milestone numbers? EX Multiple of 5's on a d4 or d6 (10th 1, 15th 5)?  
- Deal w/ Multiple of same values (Streak or same length streak | Multiple with max number of rolls)
- Support more die types
- Make sure it works for other systems

- Settings
    - ~~PLAYERS_SEE_GM~~            (Done)   
    - ~~PLAYERS_SEE_GLOBAL~~        (Done) 
    - PLAYERS_SEE_SELF          
    - PLAYERS_SEE_PLAYERS           
    - PLAYERS_SEE_GM_IN_GLOBAL  
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




