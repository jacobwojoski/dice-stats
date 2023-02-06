# Dice Stats (In Development)
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
- Bar Graph to display Dice Results (In Progress)  
- Output to Chat how many Nat1 & 20's have been rolled by that player when one gets rolled  
- Output to chat Lows and Highs for some other die types. Maybe just milestone numbers? EX Multiple of 5's on a d4 or d6 (10th 1, 15th 5)?  
- Streaks in Both Direction  
- Implement Google charts better (Add as Lib instead?)  
- Export data to be saved (Prolly Export as JSON)  
- Import Data to reload old values?  
- Player Loads history if they join game late
- Setting to choose which dice are tracked


