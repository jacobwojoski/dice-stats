# Dice Stats (In Development) Settings Dont Work Yet
A foundry vtt module to view dice stats of every player including the gm.  
Currently stats are stored by parsing chat. If the user joins the game late  
they will only get data from that point on  
  
## Stats Tracked (Each Player)  
- Number of each roll (Plans to make roll data as a bar chart)  
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

### Editing Dice Types
The user can <b>hand</b> edit the dice types saved by editing the following (planned feature to become a setting)
 * main/NUM_DIE_TYPES 
 * main/DIE_TYPE
 * main/DIE_MAX
 * main/MAX_TO_DIE
 * datapack/PLAYER_HANDL_INFO/DICE_ROLL_DATA
 * datapack/GLOBAL_HANDL_INFO/DICE_ROLL_DATA
 * dice-stats-player //Lots of changes would need to be made here as I dont know good way to implement loops in handlebars 
    * (Could prolly make a fn that returns an HTML string or some shit tho)
  
## Module Settings options  
- PLAYERS_SEE_SELF:       Allow Player to see their own data  
- PLAYERS_SEE_PLAYERS:    Allow players to see other players data  
- PLAYERS_SEE_GM:         Allow players to see GM stats  
- PLAYERS_SEE_GLOBAL:     Allow player to see global values  
- DISABLE_STREAKS:        Disable displaying of streaks in chat. Still Stored in data  
- SEE_BLIND_STREAK:       Allow player to view blind streaks (If a die rolled in the streak was blind dont display value)  

## Install  
[Downlaod Zip]() and add to module folder in  
```bash
$/Path_to_foundry_Data/Sources/Modules
```  
## Usage  
View Each Players info by selecting icon next to the player in the bottom left  
![Access Roll Tracker]()  
  
### Player Info Form  
![Player]()  
  
### Access Global Stats by slecting this icon by player list  
![Global]()  
  
### Streak Info 
Streaks are included in both plater and global data displays  
![Streaks]()  
  
## Planned Features  
- ~~Add Charts~~ (Done)
- Global Stats
- Output to Chat how many Nat1 & 20's have been rolled by that player when one gets rolled  
- Output to chat Lows and Highs for some other die types. Maybe just milestone numbers? EX Multiple of 5's on a d4 or d6 (10th 1, 15th 5)?  
- Streaks in Both Direction  
- Add Refresh button on dice stats page
- Support more die types
- Implement Settings
    - PLAYERS_SEE_SELF
    - PLAYERS_SEE_PLAYERS 
    - ~~PLAYERS_SEE_GM~~ (Done)
    - PLAYERS_SEE_GLOBAL  
    - DISABLE_STREAKS    
    - SEE_BLIND_STREAK
- ~~Make Settings have their own tab instead of being under "undefined"~~ (Done)
- Fix Streaks, Streaks are off by 1 rn. 1 extra value at the end. They Start correctly though

## Longterm Goals
- Better UI design
    - Change Button Positions
    - Implement Google charts better, potentally move to different charting sw (Add as Lib instead?) 
    - Better format for stats, Tabs? 
- Export data to be saved (Prolly Export and import as JSON)  
- Import Data to reload old values? (use JSON format)
    - Import just global data? User data, Ability to choose?
- Player Loads history if they join game late
- Setting to choose which dice are tracked (checkboxes w/ grayed out checks if no dice of that type are rolled)
- Make sure it works for other systems
- Comparison Tool, Show a few players info size by side


