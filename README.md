# Dice Stats
A foundry vtt module to view dice stats (Number of each roll in a Chart! See Below)  
Currently stats are stored by parsing chat. If the user joins the game late after rolls were made  
they will only get data from that point on. Original Idea was from [Catan Online](https://colonist.io/)  
end-of-game dice stats screen and wanted something similar to let players look at during or the end of a session.   

Used Google Charts as a charting library. (MIT License)
Used [Roll Tracker Module](https://foundryvtt.com/packages/roll-tracker) as a starting point but (MIT License)  
wanted the ability to track multiple dice types. This Basically lead to a full rewrite as I wanted a more OOP appreach for data storage.

## MISC Design Settings
- GM's Rolls for player will count as GM Rolls (Unless Midi Qol is active)
- Blind rolls get tracked but do not get added to results screen unless GM Presses "PUSH BLIND ROLLS" button on Global Stats Display
- GM Data Does not get added to global stats by default so Players cant use it to cheat and see any of the GM's rolls

## DESIGN PHILOSOPHY
The original design philosophy was a way to view SESSION stats. Rolls will always avg out over long periods of time so personaly I only wanted to look at per session data. Because of this the implementation resets stats when leaving in joining. Im currently Looking into adding a DB like feature where persistant stats can be saved if the user would like it as well as allowing resetting the DB for session only stats [View Issue #19](https://github.com/jacobwojoski/dice-stats/issues/19)

## DEPENDENCIES
[socketlib](https://github.com/manuelVo/foundryvtt-socketlib)
Socketlib needs to be active allow GM to tell other users to push blind rolls.

## INCOMPATABILITIES (Add an Issue for any System Requests)
- Any system that doesnt print rolls to chat
- Systems that change how they print rolls in that (Looking at you SWADE and your exploding die -__-)
- **Midi-Qol** if **Merge Rolls to 1 Card** is enabled partial fix. 
    - Midi-qol.rollComplete hook Doesnt have a way to trace back to the Player that rolled. Only the actor
    - I Used actor.owner property to find out who to associate the roll with but that makes the following issues
        - If an actor has >1 owner it will not track the roll to the right player. 
        - If the GM rolls for a player is will count as the players roll Not the GM's

# Features 

## Form Info and Features (Individual)  
- Checkboxes to limit which dice types are displayed 
- Refresh Button To update stats if a new roll is made while screen if open
- Number of each roll 
- Total Number of rolls
- Mean  
- Median (true-Middle for Odd or left-middle for Even number of rolls)
- Mode  
- Streaks (Incrementing die rolls in a row) 4,5,6,7 ect  
  
## Form Info and Features (Global)
- Checkboxes to limit which dice types are displayed 
- Refresh Button To update stats if a new roll is made while screen if open 
- Total Number of each roll
- Globa Mean
- Global Median (true-Middle for Odd or left-middle for Even number of rolls)
- Global Mode
- Global Longest Streaks (Player Name and Streak Value)
- Most Min and Most Max values Rolled (Player Name and Number)

## Dice Types Supported  
Tracks multiple dice types. Currently supporting types are:  
- D2, D3, D4, D6, D8, D10, D12, D20, D100

## Hand Editing Dice Types (DONT RECCOMEND, MAKE ISSUE INSTEAD)
The user can **hand edit** the dice types saved by editing the following
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
<b> Planned Feature to add more dice types </b>
  
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
## Usage  
- View Each Players info by selecting icon next to the player in the bottom left
  - Press D20 For Player Stats
  - Press Globe for Global Stats (Should only have 1 globe by clients username)  
![Player List Buttons](https://i.imgur.com/QhwLQOX.png)

- PLAYERS_SEE_GM = False  (Warning displayed if trying to view GM values)
![PLAYERS_SEE_GM = False](https://i.imgur.com/sGELoCJ.png)  
  
## FORM PHOTOS
### Player D20  
![PL D20](https://i.imgur.com/Sszy3bk.png)   

### Player D20 BLIND
![PL D20 B](https://i.imgur.com/EOYY6y6.png) 

### GLOBAL D20 BLIND
![GLB D20 B](https://i.imgur.com/mLXWWjm.png) 

### CHECKBOXES
![CHK](https://i.imgur.com/pVFw0QE.png)


## Ongoing Issues
- Support Other Systems  

## Planned Features
- Get player history when joining [Req History From GM]
- Streaks in Both Direction  
- Add Most Max val and Most min values rolls Adjusted for % of total rolls  
- Comparison Tool, Show a few players info size by side  
- Deal w/ Multiple of same values (Streak or same length streak | Multiple with max number of rolls)  
- Actually Incorperate Lang page instead of hard coded strings 
- Output to Chat how many Nat1 & 20's have been rolled by that player when one gets rolled  
- Output to chat Lows and Highs for some other die types. Maybe just milestone numbers? EX Multiple of 5's on a d4 or d6 (10th 1, 15th 5)?  
- Support more die types   
- Export and Import Data (Prolly W/ JSON Formatting)

## Planed Code Refactoring
- Update Refresh Button to use "this" modifier instead of a global
- Change Code to be properly formated in libs
- Potentally Different charting lib
- UI Changes
    - Is There A Better Way to format data?
    - Should Tabs be added?
    - Make D100 Chart not look like shit?
    - Change chart size
    - Make Forms Resizeable
    - Format Text in tables better

## Settings (Running List)
- ~~PLAYERS_SEE_GM~~                (Implemented)   
- ~~PLAYERS_SEE_GLOBAL~~            (Implemented) 
- ~~PLAYERS_SEE_GM_IN_GLOBAL~~      (Implemented)
- ~~SHOW_BLIND_ROLLS_IMMEDIATE~~    (Implemented)
- PLAYERS_SEE_SELF          
- PLAYERS_SEE_PLAYERS           
- ENABLE_BLIND_STREAK_MSGS    
- ENABLE_CRIT_MSGS         
- TYPES_OF_CRIT_MSGS       
- ENABLE_STREAK_MSGS     
